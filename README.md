# Bosphorus Horology

A luxury e-commerce storefront for a Turkish watch brand.
Plain JavaScript (JSX). Next.js 15 (App Router), Tailwind CSS v4, Framer Motion, GSAP ScrollTrigger, React Three Fiber.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (39 static pages)
npm run start
```

Requires Node 18.18+ and an internet connection on first run (Google Fonts are fetched by `next/font`).

## Deploy

Push to GitHub and import into Vercel. No environment variables are needed.

## Structure

```
app/                    routes (home, products, products/[id], services, about, contact, cart, wishlist, checkout)
components/             UI: Navbar, Footer, Hero, HeroDial, WatchViewer3D, BrandStory, ProductCard, ...
context/StoreProvider   cart + wishlist reducer, persisted to localStorage, toast notifications
lib/products.ts         the 28-watch mock catalogue (edit here)
lib/pricing.ts          shipping, gift wrap and quantity rules
lib/watchConfig.ts      finishes and dials for the 3D viewer
```

## Things to replace before going live

- **Product photos**: `lib/products.ts` uses Unsplash URLs as placeholders. They are not guaranteed to show the watch
  named on each card. Swap `images` for real photography. Each product also has a built-in vector illustration
  underneath, so a failed image never leaves a blank box.
- **Brand story, founder, dates, testimonials, address, phone, email**: sample copy for the demonstration.
- **Contact form and newsletter**: front-end only. Connect them to an API route or email service.
- **Checkout**: a simulation. No payment is processed. To go live, integrate a provider such as iyzico, Stripe or PayTR.
- **Prices** are in USD. Add currency handling if you want TRY.

## Notes

- The 3D watch is built procedurally (no model files) and only renders while on screen.
- Animations respect `prefers-reduced-motion`.
- Test card for the checkout simulation: 4242 4242 4242 4242, any future expiry, any 3-digit code.
