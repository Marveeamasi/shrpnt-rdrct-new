import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SG1;
const supabaseKey = process.env.NEXT_PUBLIC_SG2;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
