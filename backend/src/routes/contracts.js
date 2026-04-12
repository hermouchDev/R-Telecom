import express from 'express';
import { supabase } from '../lib/supabase.js';
import { generateContractPDF } from '../services/pdf.js';

const router = express.Router();

// GET /api/contracts/:subscriptionId/download
router.get('/:subscriptionId/download', async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    // 1. Fetch subscription data
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (error || !subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // 2. Generate PDF
    const pdfBuffer = await generateContractPDF(subscription);

    // 3. Set headers and send
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Contrat_RPlus_${subscriptionId.substring(0, 8)}.pdf`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
