# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router, Server Actions, Server Components)
Supabase (PostgreSQL, Auth, RLS)
Tailwind CSS / Vanilla CSS for styling

## Users

- **B2C (Private Sellers):** People who want to sell their car quickly, safely, and for cash without dealing with time-wasters.
- **B2B (Car Dealers/Komisy):** Car dealerships looking for high-quality, pre-qualified local leads to buy inventory directly from owners.

## Product Purpose

VroomDealer is a dual-sided marketplace and lead generation platform. For sellers, it's the fastest way to sell a car to verified local buyers. For dealers, it's a closed-loop system for acquiring cars directly from local owners, either globally via vroomdealer.pl or locally via white-labeled tenant landing pages.

## Positioning

Instead of competing in the classifieds (OLX/Otomoto), VroomDealer brings the sellers directly to the dealers through an optimized, multi-step valuation funnel. It guarantees safe transactions with verified buyers in 24 hours.

## Operating Context

- **Sellers** interact with a high-conversion, multi-step glassmorphic/premium form on desktop or mobile.
- **Dealers** operate via a dedicated `/admin` dashboard, email notifications, and live Google Sheets integration for lead tracking.
- The system supports multi-tenancy (custom domains per dealer) and global fallback routing.

## Capabilities and Constraints

- Multi-tenant architecture (determines styling/branding based on hostname).
- Validated car database for brands and models (strict dropdowns).
- Fully responsive web UI.
- Real-time lead routing to local dealers.

## Evidence on Hand

- Multi-step lead capture form (`GlobalB2CForm`).
- Vercel/Cloudflare edge architecture with Supabase backend.
- Working integrations with Google Sheets and Resend (email).
