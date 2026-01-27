# TotalPrintHub - Premium Custom Printing Platform

A modern, full-stack e-commerce platform for custom printing services built with Next.js 14, Supabase, and Sanity CMS.

## 🚀 Features

### Core Functionality
- ✅ **Product Catalog** - Dynamic product listing with Sanity CMS
- ✅ **Advanced Filtering** - Category, price range, and material filters
- ✅ **Product Configurator** - Real-time pricing with file uploads
- ✅ **Shopping Cart** - Full cart management with edit functionality
- ✅ **Checkout Flow** - Secure checkout with order management
- ✅ **User Authentication** - Email/password and Google OAuth
- ✅ **Search** - Live product search with keyboard shortcuts

### UI/UX
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Advanced Header** - Three-tier design with search
- ✅ **SEO Optimized** - Meta tags, Open Graph, sitemap
- ✅ **Error Handling** - Custom 404 and error pages
- ✅ **Loading States** - Skeleton UI for better UX

### Admin Features
- ✅ **Order Management** - View and manage customer orders
- ✅ **Product Management** - Via Sanity Studio
- ✅ **Customer Management** - User profiles and history

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Shadcn UI
- **Database:** Supabase (PostgreSQL)
- **CMS:** Sanity.io
- **Auth:** Supabase Auth
- **File Upload:** Cloudinary
- **Email:** Resend
- **Language:** TypeScript

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Sanity.io account
- Cloudinary account
- Resend account (for emails)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd totalprinthub
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Database Setup**

Run the Supabase schema:
```bash
# Copy schema from supabase-schema.sql to Supabase SQL Editor
```

5. **Sanity Setup**
```bash
cd sanity
npm install
npm run dev
```

6. **Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
totalprinthub/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── (auth)/         # Auth pages
│   │   ├── admin/          # Admin dashboard
│   │   ├── products/       # Product pages
│   │   ├── api/            # API routes
│   │   └── ...
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── cart/          # Shopping cart
│   │   ├── layout/        # Layout components
│   │   ├── product/       # Product components
│   │   └── ui/            # Shadcn UI components
│   ├── lib/               # Utilities and helpers
│   │   ├── sanity/        # Sanity queries
│   │   ├── supabase/      # Supabase client
│   │   └── ...
│   └── hooks/             # Custom React hooks
├── sanity/                # Sanity CMS configuration
└── public/               # Static assets
```

## 🎨 Key Features

### Cart Edit Flow
- Click "Edit" on any cart item
- Form pre-populates with existing configuration
- Update quantities, options, and files
- Changes save without creating duplicates

### Product Configurator
- Real-time pricing calculation
- Multiple file upload (front/back/mask)
- External link support (WeTransfer, Google Drive)
- Conditional logic (lamination, spot UV)

### Search Functionality
- Press "/" to focus search
- Live results as you type
- Arrow key navigation
- Product images in results

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Configuration

**Production URLs:**
- Update `NEXT_PUBLIC_APP_URL`
- Add production domain to Sanity CORS
- Configure Supabase redirect URLs

## 📝 Configuration

### Sanity CORS
Add allowed origins in Sanity dashboard:
- `http://localhost:3000` (development)
- `https://yourdomain.com` (production)

### Supabase Auth
Configure redirect URLs:
- `http://localhost:3000/auth/callback`
- `https://yourdomain.com/auth/callback`

## 🧪 Testing

### Mobile Testing
```bash
# Test at 375px width (iPhone SE)
# Check: Header, Search, Filters, Cart, Forms
```

### SEO Verification
- Check `/sitemap.xml`
- Check `/robots.txt`
- Verify Open Graph tags
- Run Lighthouse audit

## 📊 Performance

- **Lighthouse Score:** 90+ (target)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s

## 🐛 Known Issues

1. **CORS Error (Development)** - Add localhost to Sanity CORS
2. **Search 404s** - Verify product slugs match routes
3. **Mobile Banner** - Text slightly cramped on very small screens

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn for the beautiful UI components
- Supabase for the backend infrastructure
- Sanity.io for the CMS

## 📞 Support

For support, email support@totalpinthub.com or join our Slack channel.

---

**Built with ❤️ by TotalPrintHub Team**
