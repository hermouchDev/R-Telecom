import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Route imports (to be created)
import offerRoutes from './routes/offers.js';
import subscriptionRoutes from './routes/subscriptions.js';
import uploadRoutes from './routes/uploads.js';
import contractRoutes from './routes/contracts.js';
import chatRoutes from './routes/chat.js';
import qrcodeRoutes from './routes/qrcode.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Basic Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'R+ TELECOM API is running' });
});

// Routes mounting
app.use('/api/offers', offerRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/qrcode', qrcodeRoutes);
app.use('/api/admin', adminRoutes);



app.listen(PORT, () => {
  console.log(`
  🚀 R+ TELECOM Backend running on port ${PORT}
  🔗 URL: http://localhost:${PORT}
  📅 Mode: ${process.env.NODE_ENV || 'development'}
  `);
});
