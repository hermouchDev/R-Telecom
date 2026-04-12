import express from 'express';
import { supabase } from '../lib/supabase.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Default offers to seed if table is empty
const DEFAULT_OFFERS = [
  { id: "fibre-100", category: "fibre", name: "Fibre 100 Mbps", speed: "100 Mbps", price: 400, fondation_price: 300, service_fee: 0, router_fee: 0, features: ["Connexion symétrique", "Sans engagement", "Installation gratuite"], is_active: true },
  { id: "fibre-200", category: "fibre", name: "Fibre 200 Mbps", speed: "200 Mbps", price: 500, fondation_price: 375, service_fee: 0, router_fee: 0, features: ["Idéal streaming 4K", "WiFi 6 inclus", "Installation gratuite"], is_active: true },
  { id: "fibre-1000", category: "fibre", name: "Fibre 1 Gbps", speed: "1 Gbps", price: 1000, fondation_price: 750, service_fee: 0, router_fee: 0, features: ["Ultra-haute performance", "Gaming & Pro", "Support VIP 24/7"], is_active: true },
  { id: "5g-box", category: "5g", name: "5G Box El Manzil", speed: "100 Mbps", price: 400, fondation_price: 300, service_fee: 200, router_fee: 350, features: ["Ultra rapide", "Plug & Play", "Gaming ready", "Sans engagement"], is_active: true },
  { id: "adsl-20", category: "adsl", name: "ADSL 20 Mbps", speed: "20 Mbps", price: 250, fondation_price: 187.5, service_fee: 0, router_fee: 0, features: ["Connexion stable", "Illimité", "Installation rapide"], is_active: true },
  { id: "adsl-fixe", category: "adsl", name: "ADSL + Ligne Fixe", speed: "20 Mbps", price: 300, fondation_price: 225, service_fee: 0, router_fee: 0, features: ["Internet + Téléphone", "Appels vers fixe inclus", "Réseau national"], is_active: true },
  { id: "mobile-99", category: "mobile", name: "Forfait 20Go+1H", speed: "4G+", price: 99, fondation_price: 74.25, service_fee: 0, router_fee: 0, features: ["20Go Internet", "1H Appels", "SMS illimités"], is_active: true },
  { id: "mobile-119-15", category: "mobile", name: "Forfait 15Go+5H", speed: "4G+", price: 119, fondation_price: 89.25, service_fee: 0, router_fee: 0, features: ["15Go Internet", "5H Appels", "Réseaux sociaux"], is_active: true },
  { id: "mobile-119-22", category: "mobile", name: "Forfait 22Go+2H", speed: "4G+", price: 119, fondation_price: 89.25, service_fee: 0, router_fee: 0, features: ["22Go Internet", "2H Appels", "WiFi Inclus"], is_active: true },
  { id: "mobile-165-140", category: "mobile", name: "Forfait 140Go+14H", speed: "4G+", price: 165, fondation_price: 123.75, service_fee: 0, router_fee: 0, features: ["140Go Internet", "14H Appels", "Illimité de nuit"], is_active: true },
  { id: "mobile-165-30", category: "mobile", name: "Forfait 30Go+3H", speed: "4G+", price: 165, fondation_price: 123.75, service_fee: 0, router_fee: 0, features: ["30Go Internet", "3H Appels", "Roaming Inclus"], is_active: true },
  { id: "mobile-220-120", category: "mobile", name: "Forfait 120Go+22H", speed: "5G Ready", price: 220, fondation_price: 165, service_fee: 0, router_fee: 0, features: ["120Go Internet", "22H Appels", "Support VIP"], is_active: true },
  { id: "mobile-249-250", category: "mobile", name: "Forfait 250Go+20H", speed: "5G Ready", price: 249, fondation_price: 186.75, service_fee: 0, router_fee: 0, features: ["250Go Internet", "20H Appels", "Sans engagement"], is_active: true },
  { id: "mobile-249-450", category: "mobile", name: "Forfait 450Go+5H", speed: "5G Ready", price: 249, fondation_price: 186.75, service_fee: 0, router_fee: 0, features: ["450Go Internet", "5H Appels international", "Multi-SIM"], is_active: true },
  { id: "mobile-349-550", category: "mobile", name: "Forfait 550Go+15H", speed: "5G", price: 349, fondation_price: 261.75, service_fee: 0, router_fee: 0, features: ["550Go Internet", "15H Appels international", "World Pass"], is_active: true },
  { id: "4g-199", category: "4g", name: "4G+ 40Go+1H", speed: "4G+", price: 199, fondation_price: 149.25, service_fee: 0, router_fee: 0, features: ["40Go Internet", "1H Appels", "Box offerte"], is_active: true },
  { id: "4g-350", category: "4g", name: "4G+ 70Go+2H", speed: "4G+", price: 350, fondation_price: 262.5, service_fee: 0, router_fee: 0, features: ["70Go Internet", "2H Appels", "Débit prioritaire"], is_active: true },
  { id: "4g-450", category: "4g", name: "4G+ 90Go+3H", speed: "4G+", price: 450, fondation_price: 337.5, service_fee: 0, router_fee: 0, features: ["90Go Internet", "3H Appels", "Installation Pro"], is_active: true },
];

// Helper to map DB row → frontend-compatible shape
const mapOffer = (row) => ({
  id: row.id,
  category: row.category,
  name: row.name,
  speed: row.speed,
  price: row.price,
  fondationPrice: row.fondation_price,
  serviceFee: row.service_fee,
  routerFee: row.router_fee,
  features: row.features || [],
  isActive: row.is_active,
  createdAt: row.created_at,
});

// GET /api/offers — public, returns all active offers
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .order('category')
      .order('price');

    if (error) throw error;

    // Seed if table is empty
    if (!data || data.length === 0) {
      const { data: seeded, error: seedError } = await supabase
        .from('offers')
        .insert(DEFAULT_OFFERS)
        .select();
      if (seedError) throw seedError;
      return res.json(seeded.map(mapOffer));
    }

    res.json(data.map(mapOffer));
  } catch (err) {
    console.error('Error fetching offers:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/offers/all — admin only, returns all including inactive
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('category')
      .order('price');

    if (error) throw error;
    res.json(data.map(mapOffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/offers/:category — public filter by category
router.get('/:category', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('category', req.params.category)
      .eq('is_active', true)
      .order('price');

    if (error) throw error;
    res.json(data.map(mapOffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/offers — admin create new offer
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { id, category, name, speed, price, fondationPrice, serviceFee, routerFee, features, isActive } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Champs requis manquants (name, category, price)' });
    }

    const { data, error } = await supabase
      .from('offers')
      .insert([{
        id: id || `${category}-${Date.now()}`,
        category,
        name,
        speed: speed || '',
        price: Number(price),
        fondation_price: fondationPrice ? Number(fondationPrice) : Number(price) * 0.75,
        service_fee: Number(serviceFee) || 0,
        router_fee: Number(routerFee) || 0,
        features: Array.isArray(features) ? features : [],
        is_active: isActive !== undefined ? Boolean(isActive) : true,
      }])
      .select();

    if (error) throw error;
    res.status(201).json(mapOffer(data[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/offers/:id — admin update offer
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { category, name, speed, price, fondationPrice, serviceFee, routerFee, features, isActive } = req.body;

    const { data, error } = await supabase
      .from('offers')
      .update({
        category,
        name,
        speed,
        price: Number(price),
        fondation_price: Number(fondationPrice),
        service_fee: Number(serviceFee) || 0,
        router_fee: Number(routerFee) || 0,
        features: Array.isArray(features) ? features : [],
        is_active: isActive !== undefined ? isActive : true,
        updated_at: new Date(),
      })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Offre non trouvée' });
    res.json(mapOffer(data[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/offers/:id — admin delete (soft delete = set is_active = false, or hard delete)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Offre supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
