import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fwkribibpjwkeyeomecd.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3a3JpYmlicGp3a2V5ZW9tZWNkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODk2NjA4NywiZXhwIjoyMDg0NTQyMDg3fQ.z3L68gZOi8aaQtRN9VBfHxy_oJcI2Za5cA9INNxYXBk";

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn("⚠️ Supabase Admin not configured. Missing URL or SERVICE_ROLE_KEY.");
}

// Admin client with Service Role Access - BE CAREFUL
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
