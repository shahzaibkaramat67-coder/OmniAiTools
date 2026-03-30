# OmniAITool 🚀

**40+ AI-Powered Tools in One Platform** — Writing, SEO, Social Media, Productivity, Marketing, Advanced & AI Media.

Built with **Next.js 15**, **React 19**, **Tailwind CSS 4**, **MongoDB**, **NextAuth v4**, and **OpenAI GPT-4o-mini**.

---

## ✨ Features

- 40+ purpose-built AI tools across 7 categories
- Credit-based usage system (Free / Starter / Pro plans)
- Google OAuth + Email/Password authentication
- Full generation history with search & filter
- Admin panel — manage users, credits, plans, tools
- Stripe payments — subscriptions + one-time credit packs
- Dark, modern UI with glass morphism design

---

## 🗂 Project Structure

```
omniaitool/
├── app/
│   ├── (auth)/              # Login & Register pages
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/       # Home dashboard
│   │   ├── tools/           # Tools browser + [slug] runner
│   │   ├── history/         # Generation history
│   │   └── settings/        # User settings
│   ├── (admin)/admin/       # Admin panel (role-protected)
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth + register
│   │   ├── generate/        # AI generation endpoint
│   │   ├── history/         # History CRUD
│   │   ├── user/            # Profile + password
│   │   ├── admin/           # Admin user/credit/plan management
│   │   ├── checkout/        # Stripe checkout session
│   │   └── webhooks/stripe/ # Stripe webhook handler
│   ├── pricing/             # Public pricing page
│   └── page.tsx             # Landing page
├── components/
│   ├── landing/             # Navbar, Hero, Features, Pricing, Footer
│   ├── dashboard/           # Sidebar, TopBar, ToolCard
│   ├── ui/                  # Badge, Button, Card, Input, Modal, Tabs, Skeleton
│   └── providers/           # AuthProvider (NextAuth SessionProvider)
├── lib/
│   ├── tools-data.ts        # All 40+ tool definitions
│   ├── db.ts                # MongoDB connection (cached)
│   ├── utils.ts             # cn(), formatDate(), etc.
│   ├── constants.ts         # App-wide constants
│   └── stripe.ts            # Stripe client helper
├── models/
│   ├── User.ts              # Mongoose User model
│   └── History.ts           # Mongoose History model
├── types/
│   └── next-auth.d.ts       # Session type augmentation
├── middleware.ts             # NextAuth route protection
└── .env.local               # Environment variables
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
cd omniaitool
npm install
```

### 2. Configure environment variables
Copy `.env.local` and fill in your keys:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/omniaitool
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=sk-...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | ✅ | Random secret for JWT signing |
| `NEXTAUTH_URL` | ✅ | Your app URL |
| `OPENAI_API_KEY` | ✅ | Powers all text AI tools |
| `GOOGLE_CLIENT_ID` | ⚡ | Google OAuth (optional) |
| `GOOGLE_CLIENT_SECRET` | ⚡ | Google OAuth (optional) |
| `STRIPE_SECRET_KEY` | 💳 | Stripe payments (optional) |
| `STRIPE_WEBHOOK_SECRET` | 💳 | Stripe webhook verification |
| `STRIPE_PRICE_STARTER` | 💳 | Stripe price ID for Starter plan |
| `STRIPE_PRICE_PRO` | 💳 | Stripe price ID for Pro plan |
| `CLOUDINARY_CLOUD_NAME` | 🖼️ | Image uploads (optional) |
| `ELEVENLABS_API_KEY` | 🔊 | Text-to-speech (optional) |

---

## 👤 Making a User an Admin

Connect to MongoDB and run:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

Then visit `/admin` after signing in.

---

## 💳 Stripe Setup

1. Create products in your Stripe dashboard
2. Copy price IDs into `.env.local` (`STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`, etc.)
3. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
4. Add webhook events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Database | MongoDB + Mongoose |
| Auth | NextAuth v4 |
| AI | OpenAI GPT-4o-mini |
| Payments | Stripe |
| Images | Cloudinary |
| Voice | ElevenLabs |
| Hosting | Vercel (recommended) |

---

## 📦 Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Add all environment variables in Vercel dashboard → Settings → Environment Variables.
