import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Use valid URL only — prevents white screen crash when URL is misconfigured
const validUrl = supabaseUrl?.startsWith('https://') ? supabaseUrl : 'https://placeholder.supabase.co'
const validKey = supabaseKey || 'placeholder-key'

export const supabase = createClient(validUrl, validKey)
