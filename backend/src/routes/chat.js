import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { supabase } from '../lib/supabase.js';

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSy_demo');

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 1. Fetch live DB offers
    const { data: offers, error } = await supabase.from('offers').select('*').eq('is_active', true);
    let offersContext = "";
    
    if (!error && offers && offers.length > 0) {
      offersContext = offers.map(o => 
        `- [${o.category.toUpperCase()}] ${o.name} (${o.speed || 'N/A'}): ${o.price} DH (Fondation: ${o.fondation_price} DH). Frais Service: ${o.service_fee} DH. Routeur: ${o.router_fee} DH. Features: ${(o.features || []).join(', ')}`
      ).join('\n');
    } else {
      offersContext = "Impossible de récupérer les offres en temps réel.";
    }

    const systemPrompt = `Tu es l'assistant IA de R+ TELECOM, fournisseur internet au Maroc.
UTILISE STRICTEMENT la base de données suivante pour répondre aux questions sur les offres (prix, débit, caractéristiques) :
--- OFFRES EN TEMPS RÉEL ---
${offersContext}
----------------------------
Règles :
1. Réponds toujours en français. Sois concis et aimable.
2. Si le client demande de contacter un humain, donne l'email: ${process.env.AGENCY_EMAIL || 'yahyahajar592@gmail.com'} et le téléphone: ${process.env.AGENCY_PHONE || '+212 666 38 76 94'}.
3. Rejette toute demande hors-sujet poliment.`;

    // 2. Format history
    const geminiHistory = (history || [])
      .filter(msg => msg.id !== '1') // Skip the welcome message
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    // Inject system prompt manually by prepending to history to guarantee compatibility
    geminiHistory.unshift(
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Compris. Je suis l'assistant R+ et j'utiliserai ces tarifs en temps réel pour répondre." }] }
    );

    // 3. Query LLM
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message);
    
    res.json({ reply: result.response.text(), response: result.response.text() });

  } catch (err) {
    console.error('Gemini Chat Error:', err);
    res.status(500).json({ 
      reply: "Désolé, j'ai rencontré un problème pour contacter mon cerveau (Gemini). Vérifiez la console serveur.",
      error: err.message 
    });
  }
});

export default router;
