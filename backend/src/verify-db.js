import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking for subscriptions table...');
  try {
    const count = await prisma.subscription.count();
    console.log(`✅ Success! Found ${count} subscriptions.`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
