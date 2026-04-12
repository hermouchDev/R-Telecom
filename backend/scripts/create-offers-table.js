// scripts/create-offers-table.js
// Run with: node scripts/create-offers-table.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

async function createOffersTable() {
  console.log('🚀 Creating offers table and seeding data...');

  // First try to create the table via direct SQL using pg
  const { Pool } = await import('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS public.offers (
      id            TEXT PRIMARY KEY,
      category      TEXT NOT NULL,
      name          TEXT NOT NULL,
      speed         TEXT DEFAULT '',
      price         NUMERIC(10, 2) NOT NULL,
      fondation_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
      service_fee   NUMERIC(10, 2) NOT NULL DEFAULT 0,
      router_fee    NUMERIC(10, 2) NOT NULL DEFAULT 0,
      features      TEXT[] DEFAULT '{}',
      is_active     BOOLEAN NOT NULL DEFAULT TRUE,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  try {
    await pool.query(createTableSQL);
    console.log('✅ Table "offers" created (or already exists)');
  } catch (err) {
    console.error('❌ Error creating table:', err.message);
    await pool.end();
    return;
  }

  // Seed the data using supabase client (upsert)
  const { data, error } = await supabase
    .from('offers')
    .upsert(DEFAULT_OFFERS, { onConflict: 'id' })
    .select();

  if (error) {
    console.error('❌ Error seeding offers:', error.message);
  } else {
    console.log(`✅ Seeded ${data.length} offers into the database!`);
  }

  await pool.end();
  console.log('🎉 Done!');
}

createOffersTable();
