import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const { Client } = pg;

async function run() {
  const connectionString = process.env.DATABASE_URL;
  console.log('🔗 Connecting to:', connectionString.split('@')[1]); // Log host only for safety

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase Postgres!');

    const sqlPath = path.join(__dirname, '../supabase/schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('🚀 Executing schema.sql...');
    await client.query(sql);
    
    console.log('🎉 Database tables created successfully!');
  } catch (err) {
    console.error('❌ Failed to initialize database:', err.message);
  } finally {
    await client.end();
  }
}

run();
