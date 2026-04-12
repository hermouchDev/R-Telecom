import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupBucket() {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;

    const exists = buckets.find(b => b.name === 'documents');
    if (!exists) {
      console.log('Bucket "documents" does not exist. Creating...');
      const { data, error } = await supabase.storage.createBucket('documents', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf'],
        fileSizeLimit: 5242880 // 5MB
      });
      if (error) throw error;
      console.log('✅ Bucket "documents" created successfully!');
    } else {
      console.log('✅ Bucket "documents" already exists!');
      // Update its public status just in case
      await supabase.storage.updateBucket('documents', { public: true });
    }
  } catch (err) {
    console.error('❌ Error setting up bucket:', err.message);
  }
}

setupBucket();
