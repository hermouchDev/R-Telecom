import express from 'express';
import { upload } from '../middleware/upload.js';
import { supabase } from '../lib/supabase.js';
import path from 'path';

const router = express.Router();

// POST /api/uploads/:subscriptionId
router.post('/:subscriptionId', upload.fields([
  { name: 'cin', maxCount: 1 },
  { name: 'fondationCard', maxCount: 1 }
]), async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const files = req.files;
    const uploadResults = {};

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ error: 'Aucun fichier téléchargé' });
    }

    for (const fieldname in files) {
      const file = files[fieldname][0];
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const filePath = `documents/${subscriptionId}/${fieldname}_${timestamp}${ext}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      uploadResults[fieldname] = publicUrl;

      // Update subscriptions table with URL
      const updateField = fieldname === 'cin' ? 'cin_url' : 'fondation_card_url';
      await supabase
        .from('subscriptions')
        .update({ [updateField]: publicUrl })
        .eq('id', subscriptionId);
    }

    res.json({ success: true, urls: uploadResults });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/uploads/:subscriptionId (Admin only)
router.get('/:subscriptionId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('cin_url, fondation_card_url')
      .eq('id', req.params.subscriptionId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: 'Subscription or documents not found' });
  }
});

export default router;
