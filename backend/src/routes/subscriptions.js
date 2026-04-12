import express from 'express';
import { supabase } from '../lib/supabase.js';
import { sendWelcomeEmail, sendAdminNotification, sendStatusEmail } from '../services/email.js';
import { verifyAdmin } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// POST /api/subscriptions
router.post('/', async (req, res) => {
  try {
    const { 
      offerId, 
      offerName,
      offerCategory,
      clientName, 
      clientEmail, 
      clientPhone, 
      clientCIN, 
      isFondation, 
      address,
      clientAddress,
      basePrice,
      totalPrice,
      discount,
      serviceFee,
      routerFee,
      status
    } = req.body;

    if (!offerId || !clientName || !clientEmail || !clientPhone || !clientCIN) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([
        { 
          offer_id: offerId,
          offer_name: offerName,
          offer_category: offerCategory,
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          client_cin: clientCIN,
          client_address: clientAddress ?? address ?? null,
          is_fondation: isFondation,
          base_price: basePrice,
          discount: discount,
          service_fee: serviceFee,
          router_fee: routerFee,
          total_price: totalPrice,
          status: status || 'pending'
        }
      ])
      .select();

    if (error) throw error;
    const subscription = data[0];

    // Notifications
    await sendWelcomeEmail({ clientName, clientEmail, offerName, totalPrice, subscriptionId: subscription.id });
    await sendAdminNotification({ adminEmail: process.env.ADMIN_EMAIL, clientName, offerName, totalPrice, subscriptionId: subscription.id });

    res.status(201).json({ success: true, subscriptionId: subscription.id, totalPrice, message: 'Souscription enregistrée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/subscriptions
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    let query = supabase.from('subscriptions').select('*', { count: 'exact' });

    if (status && status !== 'all') query = query.eq('status', status);
    if (category && category !== 'all') query = query.eq('offer_category', category);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to);
    if (error) throw error;

    res.json({ data, count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/subscriptions/:id
router.get('/:id', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase.from('subscriptions').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: 'Souscription non trouvée' });
  }
});

// PATCH /api/subscriptions/:id/status
router.patch('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase.from('subscriptions').update({ status, updated_at: new Date() }).eq('id', req.params.id).select();
    if (error) throw error;
    const updated = data[0];

    await sendStatusEmail({ clientName: updated.client_name, clientEmail: updated.client_email, status: updated.status, subscriptionId: updated.id, offerName: updated.offer_name });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/subscriptions/:id (Full Admin Update)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { 
      offerId, offerName, offerCategory,
      clientName, clientEmail, clientPhone, clientCIN, 
      clientAddress, isFondation, basePrice, totalPrice, 
      discount, serviceFee, routerFee, status 
    } = req.body;

    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        offer_id: offerId,
        offer_name: offerName,
        offer_category: offerCategory,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        client_cin: clientCIN,
        client_address: clientAddress,
        is_fondation: isFondation,
        base_price: basePrice,
        total_price: totalPrice,
        discount: discount,
        service_fee: serviceFee,
        router_fee: routerFee,
        status,
        updated_at: new Date()
      })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/subscriptions/:id
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { error } = await supabase.from('subscriptions').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Souscription supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
