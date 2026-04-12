import express from 'express';
import { generateAgencyQR, generateSubscriptionQR } from '../services/qrcode.js';

const router = express.Router();

// GET /api/qrcode/agency
router.get('/agency', async (req, res) => {
  try {
    const qrData = await generateAgencyQR();
    // Return base64 as image
    const base64Data = qrData.replace(/^data:image\/png;base64,/, "");
    const img = Buffer.from(base64Data, 'base64');

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    res.end(img);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/qrcode/subscription/:id
router.get('/subscription/:id', async (req, res) => {
  try {
    const qrData = await generateSubscriptionQR(req.params.id);
    const base64Data = qrData.replace(/^data:image\/png;base64,/, "");
    const img = Buffer.from(base64Data, 'base64');

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    res.end(img);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
