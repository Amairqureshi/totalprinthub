# Quick Start - Add Supabase Credentials

The app is now running but **authentication won't work** until you add Supabase credentials.

## Option 1: Run Without Authentication (For Testing)

The app will work without Supabase - you can:
- ✅ View the homepage
- ✅ Use the product configurator
- ✅ See dynamic pricing
- ❌ Cannot login (authentication disabled)

## Option 2: Add Supabase Credentials (5 Minutes)

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Click "Start your project"
3. Create new project (choose Mumbai/Singapore region)
4. Wait 2 minutes for setup

### Step 2: Get Your Credentials
1. Go to **Project Settings** → **API**
2. Copy these two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbG...` (long string starting with eyJ)

### Step 3: Update .env.local
Open `d:\Printing sticker\Proper project\totalprinthub\.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Restart Dev Server
1. Stop the server (Ctrl+C in terminal)
2. Run `npm run dev` again
3. Authentication will now work!

### Step 5: Set Up Database (Optional - for OTP)
1. In Supabase dashboard, go to **SQL Editor**
2. Copy the SQL from `SUPABASE_SETUP.md`
3. Run it to create the `users_profile` table

---

## Current Status

✅ App is running at http://localhost:3000
⚠️ Authentication disabled (needs Supabase credentials)
✅ Product configurator fully functional
✅ Dynamic pricing working

**Test the configurator now:**
Visit: http://localhost:3000/products/business-cards/sample
