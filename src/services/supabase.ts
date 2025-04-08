// src/services/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or key is missing in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
  return !!data.session;
};