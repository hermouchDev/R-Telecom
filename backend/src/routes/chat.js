import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { supabase } from '../lib/supabase.js';

dotenv.config();

const router = express.Router();

const geminiKey = process.env.GEMINI_API_KEY;
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

const AGENCY_EMAIL = process.env.AGENCY_EMAIL || 'contact@rplus.ma';
const AGENCY_PHONE = process.env.AGENCY_PHONE || '+212 600 000 000';

const containsArabic = (text = '') => /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
const containsFrenchHint = (text = '') =>
  /(bonjour|offre|prix|debit|fibre|mobile|fondation|agent|contact|merci)/i.test(text);

const detectLanguage = (text = '') => {
  if (containsArabic(text)) return 'ar';
  if (containsFrenchHint(text)) return 'fr';
  return 'en';
};

const normalize = (value = '') => String(value).toLowerCase();

const formatOffer = (offer) => ({
  id: offer.id,
  category: offer.category,
  name: offer.name,
  speed: offer.speed || '',
  price: Number(offer.price) || 0,
  fondationPrice: Number(offer.fondation_price) || Number(offer.price) * 0.75,
  serviceFee: Number(offer.service_fee) || 0,
  routerFee: Number(offer.router_fee) || 0,
  features: Array.isArray(offer.features) ? offer.features : [],
});

const pickCategoryFromText = (text = '') => {
  const t = normalize(text);
  if (t.includes('fibre') || t.includes('fiber')) return 'fibre';
  if (t.includes('5g')) return '5g';
  if (t.includes('adsl')) return 'adsl';
  if (t.includes('mobile')) return 'mobile';
  if (t.includes('4g')) return '4g';
  return null;
};

const extractBudget = (text = '') => {
  const match = String(text).match(/(\d{2,5})/);
  return match ? Number(match[1]) : null;
};

const t = (lang, key) => {
  const dict = {
    noOffers: {
      fr: "Je n'ai pas pu récupérer les offres en base de données pour le moment.",
      en: "I couldn't load offers from the database right now.",
      ar: 'تعذر علي تحميل العروض من قاعدة البيانات حاليا.',
    },
    contact: {
      fr: `Vous pouvez contacter un conseiller au ${AGENCY_PHONE} ou par email: ${AGENCY_EMAIL}`,
      en: `You can contact an agent at ${AGENCY_PHONE} or by email: ${AGENCY_EMAIL}`,
      ar: `يمكنك التواصل مع مستشار عبر ${AGENCY_PHONE} أو البريد: ${AGENCY_EMAIL}`,
    },
    cheapest: {
      fr: 'Offre la moins chère:',
      en: 'Cheapest offer:',
      ar: 'أرخص عرض:',
    },
    fastest: {
      fr: 'Offre la plus performante (selon le prix):',
      en: 'Top high-tier offer (by price):',
      ar: 'أفضل عرض عالي الفئة (حسب السعر):',
    },
    budget: {
      fr: 'Meilleure offre selon votre budget:',
      en: 'Best offer within your budget:',
      ar: 'أفضل عرض حسب ميزانيتك:',
    },
    budgetNoMatch: {
      fr: "Aucune offre n'entre dans ce budget. Voici l'offre la moins chère:",
      en: 'No offer matches that budget. Here is the cheapest offer:',
      ar: 'لا يوجد عرض ضمن هذه الميزانية. هذا أرخص عرض:',
    },
    noMatch: {
      fr: "Je n'ai pas trouvé d'offre exacte pour cette catégorie. Voici les offres disponibles:",
      en: "I couldn't find an exact offer for that category. Available offers:",
      ar: 'لم أجد عرضا مطابقا لهذه الفئة. هذه العروض المتاحة:',
    },
    intro: {
      fr: 'Voici les offres disponibles actuellement:',
      en: 'Here are the currently available offers:',
      ar: 'هذه هي العروض المتاحة حاليا:',
    },
    monthly: {
      fr: 'par mois',
      en: 'per month',
      ar: 'شهريا',
    },
    fallback: {
      fr: "Je peux vous aider sur les offres R+ (prix, débit, fondation, frais, comparaison).",
      en: 'I can help with R+ offers (prices, speed, foundation pricing, fees, comparisons).',
      ar: 'يمكنني مساعدتك بخصوص عروض R+ (الأسعار، السرعة، أسعار المؤسسات، الرسوم، المقارنة).',
    },
  };

  return dict[key][lang] || dict[key].fr;
};

const summarizeOffers = (offers, lang, max = 8) => {
  return offers.slice(0, max).map((o) => {
    const line = `- [${o.category.toUpperCase()}] ${o.name}: ${o.price} DH/${t(lang, 'monthly')} | Fondation: ${o.fondationPrice} DH | Service: ${o.serviceFee} DH | Routeur: ${o.routerFee} DH`;
    return line;
  }).join('\n');
};

const buildRuleBasedReply = (message, offers, lang) => {
  const txt = normalize(message);
  const category = pickCategoryFromText(message);
  const budget = extractBudget(message);

  if (/(agent|human|conseiller|contact|phone|email|واتساب|هاتف|تواصل)/i.test(message)) {
    return t(lang, 'contact');
  }

  if (offers.length === 0) {
    return t(lang, 'noOffers');
  }

  if (/(cheapest|moins cher|اقل|أرخص|least price|budget)/i.test(message)) {
    const cheapest = [...offers].sort((a, b) => a.price - b.price)[0];
    return `${t(lang, 'cheapest')}\n${summarizeOffers([cheapest], lang, 1)}`;
  }

  if (
    budget &&
    /(budget|ميزانية|budget de|prix max|max|اقل من|أقل من|dans .*budget|under)/i.test(message)
  ) {
    const inBudget = offers
      .filter((o) => o.price <= budget)
      .sort((a, b) => b.price - a.price);

    if (inBudget.length > 0) {
      return `${t(lang, 'budget')}\n${summarizeOffers([inBudget[0]], lang, 1)}`;
    }

    const cheapest = [...offers].sort((a, b) => a.price - b.price)[0];
    return `${t(lang, 'budgetNoMatch')}\n${summarizeOffers([cheapest], lang, 1)}`;
  }

  if (/(fastest|meilleur|best|أسرع|performance|gbps|mbps)/i.test(message)) {
    const top = [...offers].sort((a, b) => b.price - a.price)[0];
    return `${t(lang, 'fastest')}\n${summarizeOffers([top], lang, 1)}`;
  }

  if (category) {
    const byCategory = offers.filter((o) => normalize(o.category) === category);
    if (byCategory.length > 0) {
      return summarizeOffers(byCategory, lang, 10);
    }
    return `${t(lang, 'noMatch')}\n${summarizeOffers(offers, lang, 8)}`;
  }

  if (/(prix|price|tarif|offre|offer|عرض|عروض|fondation|مؤسسة|fees|frais)/i.test(message)) {
    return `${t(lang, 'intro')}\n${summarizeOffers(offers, lang, 8)}`;
  }

  return `${t(lang, 'fallback')}\n${t(lang, 'intro')}\n${summarizeOffers(offers, lang, 6)}`;
};

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body || {};
    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lang = detectLanguage(message);

    const { data: rawOffers, error } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .order('category')
      .order('price');

    const offers = (!error && Array.isArray(rawOffers))
      ? rawOffers.map(formatOffer)
      : [];

    const ruleReply = buildRuleBasedReply(message, offers, lang);

    // If Gemini is unavailable, always return deterministic DB-grounded response.
    if (!genAI) {
      return res.json({ reply: ruleReply, response: ruleReply, source: 'rule-based' });
    }

    // Gemini enhancement, still strictly grounded to DB payload.
    const offerContext = JSON.stringify(offers, null, 2);
    const systemPrompt = [
      'You are ASSISTANT R+ for R+ TELECOM.',
      'Answer in the user language (Arabic/French/English).',
      'Use ONLY the provided OFFERS_DB data.',
      'If user asks outside telecom offers, politely redirect and provide contact.',
      `Contact email: ${AGENCY_EMAIL}, phone: ${AGENCY_PHONE}`,
      'Do not invent offers, prices, speeds, fees or categories.',
      'Be concise, clear, and practical.',
      'OFFERS_DB:',
      offerContext
    ].join('\n');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const geminiHistory = (history || [])
      .slice(-12)
      .map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: String(msg.text || '') }]
      }));

    geminiHistory.unshift(
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood. I will answer only from OFFERS_DB.' }] }
    );

    try {
      const chat = model.startChat({ history: geminiHistory });
      const result = await chat.sendMessage(String(message));
      const aiText = result?.response?.text?.() || '';
      const reply = aiText.trim() || ruleReply;
      return res.json({ reply, response: reply, source: aiText ? 'gemini+db' : 'rule-based' });
    } catch {
      return res.json({ reply: ruleReply, response: ruleReply, source: 'rule-based-fallback' });
    }
  } catch (err) {
    const safeMsg = "I'm sorry, I had a temporary issue. Please try again.";
    return res.status(500).json({ reply: safeMsg, error: err.message });
  }
});

export default router;
