
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gogerocrlrlmzgutijow.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvZ2Vyb2NybHJsbXpndXRpam93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2Nzk4MzIsImV4cCI6MjA1NzI1NTgzMn0.fs4bAqfAg305Z-tXlpZNGTzQTMDmgvNVWChxPeXXv6o";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
