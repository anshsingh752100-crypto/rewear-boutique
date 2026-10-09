# ReWear — Luxury Occasion & Wedding Wear Rentals

A full-stack, luxury-grade fashion rental boutique built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Zustand**, and **SQLite (via Prisma ORM)**.

---

## ✨ Brand & Experience Overview

- **Brand Name**: **ReWear**
- **Domain & Purpose**: Ultra-premium boutique for renting designer clothing and ethnic couture for special occasions & weddings (Bridal Lehengas, Royal Groom Sherwanis, Cocktail & Reception Gowns, Sangeet & Mehendi Ensembles, Tuxedos & Bandhgalas, and Wedding Jewellery).
- **Currency & Pricing**: Full Indian Rupees (`₹` / INR) formatting (`en-IN`) with rental prices strictly between **₹500 and ₹20,000** alongside retail market values (saving clients up to 90% compared to buying).
- **Luxury Aesthetic**: Deep obsidian ink (`#0B0B0C`), champagne & rose gold metallic accents (`#C9A24B`, `#DFBF73`), ivory contrast panels (`#F8F6F2`), hairline borders, and serif typography (*Playfair Display* & *Cormorant Garamond*).
- **Zero External Dependencies**: Standalone SQLite database with 32 seeded designer rental products, simulated UPI/Card payment, Cash on Delivery, and full Admin atelier control center.

---

## 🚀 Quick Start (Single Command)

### 1. Install & Seed
```bash
npm install
npx prisma generate
npx prisma db push
npm run seed
```

### 2. Start the Application
```bash
npm run dev
# or for production server:
npm start -- -H 0.0.0.0 -p 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts

Pre-seeded accounts are available immediately for testing:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin Atelier** | `admin@rewear.com` | `admin123` | Full access to `/admin` dashboard, inventory CRUD, orders, customers, coupons, reviews, content CMS, settings |
| **Client Patron** | `user@rewear.com` | `user123` | Storefront browsing, rental bag, trousseau wishlist, event booking, saved addresses, order history |

*(Quick demo buttons are also embedded directly into the login screen for 1-click access)*

---

## 🎟️ Promotional & Privilege Codes

Test these discount vouchers during checkout or in the rental bag:

- `REWEAR10`: 10% off wedding rentals
- `WEDDING15`: 15% off orders above ₹5,000
- `ROYAL500`: ₹500 flat privilege discount
- `SAVE10`: 10% promotional privilege

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 14 App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with custom luxury tokens & Google Fonts (`Playfair Display`, `Cormorant Garamond`, `Inter`)
- **State Management**: Zustand with persistent storage (`cartStore`, `wishlistStore`, `authStore`)
- **Database & ORM**: SQLite (`prisma/dev.db`) managed via Prisma ORM
- **Authentication**: Email/password authentication, `bcryptjs` password hashing, signed JWT session cookies (`httpOnly`)
- **Simulated Payment**: Choice between "Simulated UPI / Card" (instant mock authorization) & "Cash on Delivery"

---

## 🏛️ Comprehensive Pages & Features

1. **Storefront (`/`)**: Hero rotating wedding banners, "How ReWear Works" 4-step rental guide, Occasion categories, Trousseau concierge banner, testimonials.
2. **Catalog (`/catalog`)**: 32 seeded pieces across 6 wedding categories, dual price range slider (₹500 - ₹20,000), occasion filters, live search, sort options.
3. **Product Detail (`/product/[slug]`)**: High-res gallery, rental duration selector (3 / 7 / 10 days), retail value comparison, size variants, custom alteration & hygiene guarantees, reviews.
4. **Rental Bag (`/cart`)**: Item management, rental duration subtotal, promo code input, deposit transparency, GST breakdown.
5. **Event Booking & Checkout (`/checkout`)**: Event / Wedding date calendar picker, ceremony type selector, Indian PIN/address format, simulated UPI/Card & COD options.
6. **Reservation Confirmation (`/order-confirmation/[orderId]`)**: Printable certificate of reservation, courier schedule (delivered 48h before event), return instructions.
7. **Client Portal (`/account`)**: Profile coordinates, rental booking history, saved addresses, trousseau wishlist.
8. **Admin Atelier Command Center (`/admin`)**: Overview metrics, inventory management (add/edit outfits in ₹), order status tracker, client directory, coupons, reviews moderation, homepage CMS, store settings.
