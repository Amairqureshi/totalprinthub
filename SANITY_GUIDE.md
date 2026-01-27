# Sanity CMS Setup Complete! 🎉

## ✅ What's Been Configured

- **Project ID:** 8yt7desf
- **Dataset:** production
- **Schemas Created:**
  - ✅ Product (with pricing tiers, SEO fields, images)
  - ✅ Category (for product organization)
  - ✅ Blog Post (with rich content support)

## 🚀 Next Steps

### 1. Start Sanity Studio

Open a **new terminal** and run:

```bash
cd "d:\Printing sticker\Proper project\totalprinthub"
npm run studio
```

This will open Sanity Studio at `http://localhost:3333`

### 2. Log In to Sanity

When the Studio opens, you'll need to log in with:
- Google account
- GitHub account  
- Or email/password

Use the same account you used to create the Sanity project.

### 3. Create Your First Product

Once logged in:

1. Click **"Product"** in the sidebar
2. Click **"Create new Product"**
3. Fill in the fields:

**Required Fields:**
- Title: "Business Cards"
- Slug: Click "Generate" button
- Short Description: "Professional business cards with premium finishes"
- Category: Create a new category first (see below)
- Base Price: 500
- Pricing Tiers: Add tiers (e.g., 1-99 @ ₹10, 100-499 @ ₹8)

**Optional but Recommended:**
- Meta Title: "Custom Business Cards - TotalPrintHub"
- Meta Description: "Get professional business cards printed with premium finishes"
- Featured Image: Upload an image
- Published At: Set to current date/time

4. Click **"Publish"**

### 4. Create a Category First

Before creating products:

1. Click **"Category"** in sidebar
2. Create categories like:
   - business-cards
   - stickers
   - banners
   - flyers

### 5. Test the Integration

After creating a product:

1. Visit: `http://localhost:3000/products/business-cards/your-product-slug`
2. The product should load with all your data!
3. The ProductConfigurator will use your pricing tiers

## 📝 Product Schema Fields Explained

### Pricing Tiers
Add multiple tiers for quantity-based pricing:
- **Min Qty:** 1, **Max Qty:** 99, **Price:** ₹10
- **Min Qty:** 100, **Max Qty:** 499, **Price:** ₹8
- **Min Qty:** 500, **Max Qty:** 999, **Price:** ₹6

The ProductConfigurator will automatically use these tiers!

### SEO Fields
- **Meta Title:** Shows in Google search results
- **Meta Description:** Shows below title in search
- **Keywords:** Help with SEO
- **Canonical URL:** Prevents duplicate content issues

### Schema JSON
For rich snippets in Google, add Product schema:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Business Cards",
  "description": "Professional business cards",
  "offers": {
    "@type": "Offer",
    "price": "500",
    "priceCurrency": "INR"
  }
}
```

## 🔧 Troubleshooting

### "Cannot find module 'sanity'"
Run: `npm install` again

### Studio won't start
Make sure you're in the correct directory:
```bash
cd "d:\Printing sticker\Proper project\totalprinthub"
```

### Can't log in to Studio
You need to authenticate with the same account that owns project `8yt7desf`

## 🎯 What Happens Next

Once you create products in Sanity:
1. They'll automatically appear on your Next.js site
2. The ProductConfigurator will use your pricing tiers
3. SEO metadata will be applied
4. Images will be optimized via Sanity CDN

## 📚 Sanity Studio Commands

```bash
# Start Studio (port 3333)
npm run studio

# Deploy Studio to Sanity hosting
npx sanity deploy

# Manage datasets
npx sanity dataset list
```

---

**Current Status:**
- ✅ Sanity configured with project 8yt7desf
- ✅ Schemas created and ready
- ✅ Next.js integration complete
- ⏳ Waiting for you to create content in Studio

**Run `npm run studio` to get started!**
