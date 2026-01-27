# Supabase Authentication Setup - Step by Step

## Step 1: Get Your Supabase Credentials

1. **Go to your Supabase project:** https://supabase.com/dashboard
2. **Select your project** (or create a new one if you haven't)
3. **Go to Project Settings** (gear icon in sidebar)
4. **Click on "API"** in the left menu

You'll see three important values:

### Project URL
- Looks like: `https://xxxxxxxxxxxxx.supabase.co`
- Copy this entire URL

### API Keys
You'll see two keys:
- **anon public** - This is safe to use in the browser
- **service_role** - This is SECRET, never expose to browser

---

## Step 2: Add Credentials to .env.local

Open the file: `d:\Printing sticker\Proper project\totalprinthub\.env.local`

Replace these lines:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

With your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANT:** 
- The anon key and service role key are LONG (200+ characters)
- Make sure to copy the entire key
- No quotes needed around the values
- No spaces before or after the `=`

---

## Step 3: Create Database Schema

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Click "New Query"**
3. **Copy and paste this SQL:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile table
CREATE TABLE IF NOT EXISTS users_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  medusa_customer_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast phone lookup
CREATE INDEX IF NOT EXISTS idx_users_profile_phone ON users_profile(phone);
CREATE INDEX IF NOT EXISTS idx_users_profile_medusa ON users_profile(medusa_customer_id);

-- RLS Policies
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON users_profile;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON users_profile FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users_profile FOR UPDATE
  USING (auth.uid() = id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS update_users_profile_updated_at ON users_profile;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_profile_updated_at
  BEFORE UPDATE ON users_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

4. **Click "Run"** (or press Ctrl+Enter)
5. **You should see:** "Success. No rows returned"

---

## Step 4: Configure Phone Authentication (Optional for now)

For OTP to work, you need an SMS provider. You can skip this for now and test with Google OAuth instead.

**To enable Phone OTP later:**
1. Go to **Authentication** → **Providers**
2. Enable **Phone**
3. Choose SMS provider (Twilio recommended)
4. Add Twilio credentials

---

## Step 5: Enable Google OAuth (Recommended for Testing)

1. Go to **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Toggle **Enable Sign in with Google**
4. You'll need Google OAuth credentials:
   - Go to https://console.cloud.google.com
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
5. Copy Client ID and Client Secret to Supabase

---

## Step 6: Restart Your Dev Server

After adding credentials:

1. **Stop the dev server** (Ctrl+C in terminal)
2. **Restart it:**
   ```bash
   npm run dev
   ```

This ensures the new environment variables are loaded.

---

## Step 7: Test Authentication

1. **Visit:** http://localhost:3000
2. **Click "Get Started"** button (or any login trigger)
3. **You should see the LoginModal**
4. **Try logging in:**
   - **With Phone:** Enter Indian number (10 digits), receive OTP
   - **With Google:** Click Google button, sign in

---

## Verification Checklist

After setup, verify:

- [ ] `.env.local` has all three Supabase values filled
- [ ] Dev server restarted
- [ ] SQL schema executed successfully in Supabase
- [ ] `users_profile` table exists in Supabase (check Table Editor)
- [ ] LoginModal appears when clicking login
- [ ] No console errors about missing Supabase config

---

## Troubleshooting

### "Invalid API key" error
- Check that you copied the ENTIRE key (should be 200+ characters)
- Make sure no extra spaces or quotes

### "Missing Supabase environment variables"
- Restart dev server after adding credentials
- Check `.env.local` file is in the root directory

### OTP not sending
- You need to configure SMS provider in Supabase
- Use Google OAuth for testing instead

### "User not found" after login
- Make sure SQL schema was executed
- Check `users_profile` table exists in Supabase

---

## What Happens After Login?

1. User authenticates with Supabase
2. Session is created and stored
3. User profile is created/updated in `users_profile` table
4. User data is synced with MedusaJS (when configured)
5. User is redirected to homepage (logged in)

---

## Next Steps After Authentication Works

1. ✅ Test login flow
2. ✅ Check user appears in Supabase dashboard
3. ✅ Verify session persists on page refresh
4. ⏳ Set up SMS provider for OTP
5. ⏳ Customize login modal styling
6. ⏳ Add user profile page

---

**Ready to add your credentials? Let me know when you've added them to `.env.local` and I'll help you test!**
