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
app/                    routes (home, products, products/[id], services, about, contact, cart, wishlist, checkout,
                        login, signup, forgot-password, account)
components/             UI: Navbar, Footer, Hero, HeroDial, WatchViewer3D, BrandStory, ProductCard, ...
context/AuthProvider    current user + login / signup / logout actions
context/StoreProvider   cart + wishlist reducer, saved per account in localStorage, toast notifications
lib/auth.js             DEMO auth layer (accounts, sessions, password hashing, orders). Replace to go live
lib/products.ts         the 28-watch mock catalogue (edit here)
lib/pricing.ts          shipping, gift wrap and quantity rules
lib/watchConfig.ts      finishes and dials for the 3D viewer
```

## Accounts (demo mode)

Login and sign-up work out of the box with no backend:

- Accounts, sessions and orders are stored in the browser's localStorage. Passwords are salted and hashed
  (PBKDF2 via Web Crypto), never stored in plain text.
- The bag and wishlist are saved per account. A guest's bag is merged into the account when they log in or sign up.
- `/account` shows the profile, order history and password change. Orders placed at checkout while logged in appear there.
- "Try the demo account" on the login page creates and signs in `demo@bosphorushorology.example` / `Demo1234`.
- Forgot password is simulated: no email is sent, you set a new password directly.

This is **not secure for production**: anyone with access to the browser can read or edit the stored data.
To go live, replace the functions in `lib/auth.js` (`signUp`, `logIn`, `logOut`, `getCurrentUser`, ...) with calls to
a real backend such as Auth.js, Supabase or Firebase. The pages do not need to change.

## Things to replace before going live

- **Product photos**: `lib/products.ts` uses Unsplash URLs as placeholders. They are not guaranteed to show the watch
  named on each card. Swap `images` for real photography. Each product also has a built-in vector illustration
  underneath, so a failed image never leaves a blank box.
- **Brand story, founder, dates, testimonials, address, phone, email**: sample copy for the demonstration.
- **Contact form and newsletter**: front-end only. Connect them to an API route or email service.
- **Accounts**: demo only, see above.
- **Checkout**: a simulation. No payment is processed. To go live, integrate a provider such as iyzico, Stripe or PayTR.
- **Prices** are in USD. Add currency handling if you want TRY.

## Notes

- The 3D watch is built procedurally (no model files) and only renders while on screen.
- Animations respect `prefers-reduced-motion`.
- Test card for the checkout simulation: 4242 4242 4242 4242, any future expiry, any 3-digit code.
