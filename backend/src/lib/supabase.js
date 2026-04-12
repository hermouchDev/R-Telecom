import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for backend bypass RLS

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase URL or Service Role Key missing in .env');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
