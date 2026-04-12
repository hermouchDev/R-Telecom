import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from '../lib/supabase.js';
import { verifyAdmin } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_min_32_chars';

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check against environment variables
    // In production, bcrypt.compare should be used if hashing is used.
    // For this guide, we'll check directly or use a simple hash approach.
    const validEmail = process.env.ADMIN_EMAIL || 'admin@rplusTelecom.ma';
    const validPassword = process.env.ADMIN_PASSWORD || 'your_secure_password';

    if (email !== validEmail || password !== validPassword) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // 2. Generate JWT
    const token = jwt.sign(
      { email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ success: true, token, admin: { email, role: 'admin' } });

  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});

// GET /api/admin/stats (Protected)
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // 1. Today's Count
    const { count: todayCount } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // 2. Pending Count
    const { count: pendingCount } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // 3. Active Clients (Approved)
    const { count: activeClients } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    // 4. Monthly Revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);

    const { data: revenueData } = await supabase
      .from('subscriptions')
      .select('total_price')
      .eq('status', 'approved')
      .gte('created_at', startOfMonth.toISOString());

    const monthlyRevenue = revenueData?.reduce((acc, curr) => acc + Number(curr.total_price), 0) || 0;

    // 5. Yesterday Count (for trend)
    const { count: yesterdayCount } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', today.toISOString());

    const trend = yesterdayCount === 0 ? 100 : Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100);

    res.json({
      success: true,
      stats: {
        total: todayCount,
        pending: pendingCount,
        active: activeClients,
        monthlyRevenue,
        yesterdayCount,
        trend
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/stats/full (Protected)
router.get('/stats/full', verifyAdmin, async (req, res) => {
  const { range = '30d' } = req.query;
  
  try {
    const now = new Date();
    let startDate = new Date();
    
    if (range === '7d') startDate.setDate(now.getDate() - 7);
    else if (range === '30d') startDate.setDate(now.getDate() - 30);
    else if (range === '90d') startDate.setDate(now.getDate() - 90);
    else if (range === 'all') startDate = new Date(0);

    const { data: allData, error } = await supabase
      .from('subscriptions')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    // Aggregations
    const totalSubscriptions = allData.length;
    const totalRevenue = allData.reduce((acc, s) => s.status === 'approved' ? acc + Number(s.total_price) : acc, 0);
    const approvedCount = allData.filter(s => s.status === 'approved').length;
    const approvalRate = totalSubscriptions === 0 ? 0 : Math.round((approvedCount / totalSubscriptions) * 100);

    // By Category
    const categoryMap = allData.reduce((acc, s) => {
      if (!acc[s.offer_category]) acc[s.offer_category] = { count: 0, revenue: 0, approved: 0, fondation: 0 };
      acc[s.offer_category].count++;
      if (s.status === 'approved') {
        acc[s.offer_category].revenue += Number(s.total_price);
        acc[s.offer_category].approved++;
      }
      if (s.is_fondation) acc[s.offer_category].fondation++;
      return acc;
    }, {});

    const byCategory = Object.keys(categoryMap).map(cat => ({
      category: cat,
      count: categoryMap[cat].count,
      revenue: categoryMap[cat].revenue,
      fondationPct: Math.round((categoryMap[cat].fondation / categoryMap[cat].count) * 100),
      approvalRate: Math.round((categoryMap[cat].approved / categoryMap[cat].count) * 100)
    }));

    // Top Offer
    const offerCounts = allData.reduce((acc, s) => {
      acc[s.offer_name] = (acc[s.offer_name] || 0) + 1;
      return acc;
    }, {});
    const topOfferName = Object.keys(offerCounts).reduce((a, b) => offerCounts[a] > offerCounts[b] ? a : b, 'Aucune');

    // Revenue by Day
    const dayMap = allData.reduce((acc, s) => {
      if (s.status !== 'approved') return acc;
      const d = new Date(s.created_at).toLocaleDateString();
      acc[d] = (acc[d] || 0) + Number(s.total_price);
      return acc;
    }, {});
    const revenueByDay = Object.keys(dayMap).map(d => ({ date: d, amount: dayMap[d] }));

    res.json({
      totalSubscriptions,
      totalRevenue,
      approvalRate,
      topOffer: { name: topOfferName, count: offerCounts[topOfferName] || 0 },
      revenueByDay,
      byCategory,
      publicVsFondation: {
        public: allData.filter(s => !s.is_fondation).length,
        fondation: allData.filter(s => s.is_fondation).length
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/report (Protected - CSV)
router.get('/report', verifyAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    let csv = "ID,Client,Email,Telephone,Offre,Prix,Statut,Date,Type\n";
    data.forEach(s => {
      const type = s.is_fondation ? "Fondation" : "Grand Public";
      const date = new Date(s.created_at).toLocaleDateString();
      csv += `${s.id.substring(0,8)},${s.client_name},${s.client_email},${s.client_phone},${s.offer_name},${s.total_price},${s.status},${date},${type}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="rapport-rplus-${Date.now()}.csv"`);
    res.status(200).send(csv);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/documents (Protected)
router.get('/documents', verifyAdmin, async (req, res) => {
  const { search } = req.query;
  try {
    let query = supabase
      .from('subscriptions')
      .select('id, client_name, offer_name, created_at, cin_url, fondation_card_url, is_fondation');

    if (search) {
      query = query.ilike('client_name', `%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    const formattedData = data.map(s => ({
      subscriptionId: s.id,
      clientName: s.client_name,
      offerName: s.offer_name,
      createdAt: s.created_at,
      cinUrl: s.cin_url,
      fondationCardUrl: s.fondation_card_url,
      isFondation: s.is_fondation,
      documentsComplete: s.is_fondation 
        ? (!!s.cin_url && !!s.fondation_card_url)
        : !!s.cin_url
    }));

    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
