import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

const offers = [
  { id: 'f-100', name: 'Fibre 100 Mbps', category: 'Fibre', price: 400 },
  { id: 'f-200', name: 'Fibre 200 Mbps', category: 'Fibre', price: 500 },
  { id: 'f-1000', name: 'Fibre 1 Gbps', category: 'Fibre', price: 1000 },
  { id: '5g-manzil', name: '5G Box El Manzil', category: '5G', price: 400, serviceFee: 200, routerFee: 350 },
  { id: 'm-99', name: 'Forfait Mobile 99 DH', category: 'Mobile', price: 99 },
  { id: 'm-199', name: 'Forfait Mobile 199 DH', category: 'Mobile', price: 199 },
  { id: 'm-349', name: 'Forfait Mobile 349 DH', category: 'Mobile', price: 349 },
  { id: '4g-plus', name: '4G+ El Manzil', category: '4G+', price: 300 }
];

const names = ['Karim Alami', 'Sara Benjelloun', 'Mehdi Tazi', 'Laila Mansouri', 'Youssef Filali', 'Fatima Zohra', 'Omar Berrada', 'Ibrahim Chraibi', 'Salma Jabri', 'Ahmed Naciri'];
const statuses = ['pending', 'approved', 'approved', 'approved', 'rejected', 'pending'];

async function seed() {
  console.log('🌱 Seeding database with realistic data...');
  
  // Clean existing (optional, but good for fresh start)
  // await prisma.subscription.deleteMany();

  const now = new Date();
  
  for (let i = 0; i < 25; i++) {
    const offer = offers[Math.floor(Math.random() * offers.length)];
    const isFondation = Math.random() < 0.3;
    const basePrice = offer.price;
    const discount = isFondation ? basePrice * 0.25 : 0;
    const serviceFee = isFondation ? 0 : (offer.serviceFee || 0);
    const routerFee = offer.routerFee || 0;
    const totalPrice = (basePrice - discount) + serviceFee + routerFee;
    
    // Create random date in the last 30 days
    const createdAt = new Date(now);
    createdAt.setDate(now.getDate() - Math.floor(Math.random() * 30));
    createdAt.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

    await prisma.subscription.create({
      data: {
        offerId: offer.id,
        offerName: offer.name,
        offerCategory: offer.category,
        clientName: names[Math.floor(Math.random() * names.length)],
        clientEmail: `client${i}@example.com`,
        clientPhone: `+212 6${Math.floor(Math.random() * 100000000)}`,
        clientCIN: `AB${Math.floor(Math.random() * 900000) + 100000}`,
        clientAddress: 'Casablanca, Maroc',
        isFondation,
        basePrice,
        discount,
        serviceFee,
        routerFee,
        totalPrice,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt
      }
    });
  }

  console.log('✅ Successfully seeded 25 subscriptions!');
  await prisma.$disconnect();
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
