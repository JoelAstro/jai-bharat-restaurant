# Jai Bharat Family Restaurant — Full-Stack Ordering & Management System

> **Professional Package — ₹45,000 Implementation**  
> Complete, production-oriented Indian restaurant ordering website, real-time live order tracking, and administrative business management platform built from scratch.

---

## 🍽️ Executive Summary

**Jai Bharat Family Restaurant** is an end-to-end full-stack web application tailored for the Indian food service market. It empowers customers to discover authentic dishes, configure portions and add-ons, apply promotional coupons, place orders via **Razorpay** or **Cash on Delivery (COD)**, and track food preparation progress. Concurrently, it grants restaurant owners and staff a dedicated, role-guarded management portal to control incoming orders, menu items, prices, dietary classifications, customers, discount offers, and sales reports.

---

## 🏗️ Architecture & Technology Stack

The project is structured with a decoupled, high-performance architecture:

```
Jai Bharat Family Restaurant/
├── client/                      # Frontend Application (React + Vite + TypeScript)
│   ├── public/
│   │   ├── favicon.svg          # Typographic vector branding
│   │   ├── images/              # Poster fallback image (restaurant-hero-poster.webp)
│   │   └── videos/              # Cooking hero video (restaurant-hero.mp4)
│   └── src/
│       ├── components/
│       │   ├── cart/            # CartDrawer slide-over & quantity manager
│       │   ├── common/          # Modals, loading indicators
│       │   ├── home/            # Cinematic video hero, featured dishes, offers
│       │   ├── layout/          # Customer Navbar, Footer, Admin Layout
│       │   └── menu/            # FoodCard, VegBadge, ItemCustomizerModal
│       ├── context/             # AuthContext, CartContext, RestaurantContext
│       ├── pages/
│       │   ├── admin/           # Dashboard, Orders, Menu, Customers, Coupons, Reports, Settings
│       │   └── customer/        # Home, Menu, Offers, Checkout, Tracking, Orders, Favorites, Profile, Auth
│       ├── services/            # API client with JWT header injection
│       └── types/               # Strict TypeScript interfaces
├── server/                      # Backend API (Node.js + Express + TypeScript + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma        # Prisma schema (SQLite dev / PostgreSQL prod ready)
│   │   ├── schema.postgresql.prisma # Dedicated PostgreSQL production schema
│   │   └── seed.ts              # Idempotent seed script (admin, sample items, coupons)
│   ├── src/
│   │   ├── config/              # Env variables & Prisma client singleton
│   │   ├── controllers/         # Auth, Menu, Order, Coupon, Payment, Report, Settings
│   │   ├── middlewares/         # JWT requireAuth, requireAdmin, rate-limiting, Zod validation
│   │   ├── routes/              # Modular Express routing
│   │   ├── schemas/             # Zod input validation schemas
│   │   ├── services/            # Business logic, monetary math in integer paise, transactions
│   │   └── utils/               # JWT token utilities, uniform response helpers
│   └── tests/                   # Jest + Supertest integration test suite (21 passing tests)
├── .env.example                 # Root configuration blueprint
└── DEPLOYMENT.md                # Production deployment, PostgreSQL, and backup guide
```

### Core Technologies
- **Frontend**: React 18, Vite 5, TypeScript 5, Tailwind CSS 3, Lucide React icons.
- **Backend**: Node.js 24, Express 4, TypeScript 5, Prisma ORM 5.
- **Database**: PostgreSQL (Production) / SQLite (Zero-friction local dev & instant testing).
- **Authentication**: Salted Bcrypt password hashing + signed JSON Web Tokens (JWT).
- **Payment Processing**: Official Razorpay SDK integration with server-side HMAC-SHA256 signature verification + safe simulated test mode.
- **Financial Arithmetic**: Integer representation in **paise** (`₹1.00 = 100 paise`), preventing floating-point rounding bugs.

---

## 🚀 Quick Start Guide (Local Development)

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v24 tested)
- **npm**: v9.0.0 or later (v11 tested)

### 2. Installation
Install dependencies for both backend and frontend:

```powershell
# In server directory:
cd server
npm.cmd install

# In client directory:
cd ../client
npm.cmd install --legacy-peer-deps
```

### 3. Environment Setup
The server reads configuration from `server/.env`. A development `.env` has already been pre-configured with secure local test defaults:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=jai_bharat_dev_super_secret_jwt_key_2026_min_32_chars
JWT_EXPIRES_IN=7d
DATABASE_URL="file:./dev.db"
ADMIN_EMAIL=admin@jaibharatrestaurant.com
ADMIN_PASSWORD=JaiBharatAdmin2026!
ADMIN_NAME="Jai Bharat Administrator"
ADMIN_PHONE="9876543210"
RAZORPAY_KEY_ID=mock_test_key_id
RAZORPAY_KEY_SECRET=mock_test_key_secret
RAZORPAY_WEBHOOK_SECRET=mock_test_webhook_secret
```

### 4. Database Setup & Seeding
Generate the Prisma Client and initialize the database:

```powershell
cd server
npx.cmd prisma generate
npx.cmd prisma db push
npm.cmd run db:seed
```

The database will be initialized with:
- Initial Administrator (`admin@jaibharatrestaurant.com` / `JaiBharatAdmin2026!`)
- Demo Customer (`customer@example.com` / `Customer123!`)
- 5 Sample Food Categories
- 9 Sample Dishes with portions (Half/Full) and add-ons (Extra Gravy, Raita, Butter)
- 2 Promotional Coupons (`WELCOME50`, `JAI10`)
- Configurable Restaurant Settings

### 5. Running the Application

Open two terminal windows:

**Terminal 1 — Backend API Server (Port 5000):**
```powershell
cd server
npm.cmd run dev
```

**Terminal 2 — Frontend Customer & Admin UI (Port 5173):**
```powershell
cd client
npm.cmd run dev
```

Visit **http://localhost:5173** in your browser.

---

## 🔒 Security & Authentication Architecture

1. **Role-Based Access Control (RBAC)**: All administrative endpoints (`/api/orders/admin/*`, `/api/menu/*`, `/api/coupons/admin/*`, `/api/settings/admin/*`, `/api/customers/*`, `/api/reports/*`) strictly enforce both `requireAuth` and `requireAdmin` middlewares. Ordinary customer tokens attempting to access admin APIs receive an immediate `403 Forbidden`.
2. **Password Security**: Plaintext passwords are never stored. Passwords undergo 10 rounds of cryptographic salting with `bcryptjs`.
3. **Sensitive Route Rate Limiting**: `express-rate-limit` throttles brute-force attempts on `/api/auth/login` and `/api/auth/register` (max 50 attempts per 15 minutes per IP).
4. **Backend Price Enforcement**: The frontend cart calculates an estimated total for UX display, but the server **never trusts client-supplied totals**. The backend recalculates item base prices, portion variations, add-ons, active coupon validity, tax rates, and delivery thresholds directly against database records before generating an order.
5. **No Credential Leakage**: Database URLs, JWT secrets, and payment keys are strictly confined to server-side environment variables. Vite client builds contain zero sensitive keys.

---

## 🎥 Cinematic Cooking Hero Video & Poster Asset Guide

Per project specifications, the hero background features moving cooking footage with high-contrast text overlays and graceful fallbacks.

### Asset Locations:
- **Video File**: `client/public/videos/restaurant-hero.mp4`
- **Poster Fallback Image**: `client/public/images/restaurant-hero-poster.webp`

### Video Specifications:
- **Format**: MP4 (H.264 video codec)
- **Target Resolution**: 1920x1080 (Full HD) or 1280x720 (HD)
- **Frame Rate**: 24 fps or 30 fps
- **Recommended File Size**: < 15 MB for rapid mobile loading
- **Audio**: Muted (autoplay compliant on Chrome, Safari, iOS, and Android)
- **Content Direction**: Sizzling tawa, chef preparing Indian dishes, spices added to hot pan, simmering curry, biryani handi opening, fresh food plating.

### Graceful Fallback Behavior:
If the video is missing, fails to download, or if the user's OS has `prefers-reduced-motion` enabled, the website seamlessly displays the high-resolution poster image `restaurant-hero-poster.webp` without layout shifts or broken media icons.

---

## 💳 Razorpay Payment Integration

The platform includes full server-side Razorpay payment handling:

1. **Order Creation**: Calls Razorpay API (`razorpay.orders.create`) using server credentials to generate a secure order ID.
2. **Signature Verification**: Validates payment authenticity using HMAC-SHA256:
   $$\text{HMAC-SHA256}(\text{order\_id} + "|" + \text{payment\_id}, \text{secret}) = \text{signature}$$
3. **Webhook Processing**: Verifies incoming webhooks to catch asynchronous captures and failures.
4. **Development Testing Simulator**: If the owner has not yet supplied live Razorpay credentials, the system automatically runs in **Safe Simulated Mode**, enabling end-to-end checkout testing without failing transactions.

### Setting Up Live Razorpay Credentials:
1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Navigate to **Settings** > **API Keys**.
3. Generate **Key ID** and **Key Secret**.
4. In `server/.env`, set:
   ```env
   RAZORPAY_KEY_ID=rzp_live_your_actual_key_id
   RAZORPAY_KEY_SECRET=your_actual_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_actual_webhook_secret
   ```
5. Restart the server.

---

## 📋 Restaurant Owner Configuration Checklist

The following details must be supplied and entered by the owner before opening public operations:

| Required Item | Location to Update | Status |
|---|---|---|
| **Official Phone Number** | Admin Portal > Restaurant Settings (`phone`) | ⏳ Awaiting Owner |
| **Official Contact Email** | Admin Portal > Restaurant Settings (`email`) | ⏳ Awaiting Owner |
| **Physical Restaurant Address** | Admin Portal > Restaurant Settings (`address`) | ⏳ Awaiting Owner |
| **Operating Hours** | Admin Portal > Restaurant Settings (`operating_hours`) | Configured (11:00 AM - 11:00 PM) |
| **Production Razorpay Keys** | `server/.env` (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`) | ⏳ Awaiting Owner Account |
| **Official Menu & Dishes** | Admin Portal > Menu & Dishes | Seeded with Sample Items |
| **Custom Hero Video Clip** | `client/public/videos/restaurant-hero.mp4` | Documented in `public/videos/README.txt` |
| **Initial Admin Password** | Change upon first login in Settings or `.env` | Initial Seeded Password |

---

## 🧪 Automated Testing & Validation

The system includes a 21-test integration suite covering customer flows, admin capabilities, calculation accuracy, and security barriers:

```powershell
cd server
npm.cmd test
```

### Verified Test Results:
- ✅ `GET /api/health` — Healthy status verification
- ✅ `GET /api/menu/categories` — Category enumeration
- ✅ `GET /api/menu/items` — Live query search
- ✅ `GET /api/settings/public` — Public settings retrieval
- ✅ `GET /api/coupons/public` — Active promotional coupons listing
- ✅ `POST /api/orders/calculate` — Backend price calculations
- ✅ `POST /api/coupons/validate` — Valid coupon application (₹50 OFF)
- ✅ `POST /api/coupons/validate` — Non-existent coupon rejection
- ✅ `POST /api/auth/addresses` — Customer address storage
- ✅ `POST /api/orders` — Complete order placement with COD
- ✅ `GET /api/orders/customer` — Customer order history isolation
- ✅ `GET /api/orders/:id` — Customer retrieving own order details
- ✅ `POST /api/favorites/toggle` — Bookmarking dishes
- ✅ `Security: RBAC Guard` — Regular customers blocked from admin routes (403)
- ✅ `Security: Auth Guard` — Unauthenticated requests rejected (401)
- ✅ `Security: Data Privacy` — Customer cannot access other customers' orders (404/403)
- ✅ `Admin: Order Management` — Administrator viewing orders list
- ✅ `Admin: Status Lifecycle` — Advancing order from PENDING to CONFIRMED
- ✅ `Admin: Customer Directory` — Admin inspecting customer accounts & lifetime spend
- ✅ `Admin: Reports Overview` — Real database-derived revenue aggregation
- ✅ `Admin: Settings Checklist` — Admin viewing missing owner details

---

## 📦 Production Build & Deployment

To compile production-optimized bundles:

```powershell
# 1. Compile backend TypeScript into dist/
cd server
npm.cmd run build

# 2. Compile frontend assets into dist/
cd ../client
npm.cmd run build
```

See [DEPLOYMENT.md](file:///c:/PROJECTS/Jai%20Bharat%20Family%20Restaurant/DEPLOYMENT.md) for detailed instructions on deploying with PostgreSQL on Supabase, Railway, Render, or a VPS with Nginx and SSL.
