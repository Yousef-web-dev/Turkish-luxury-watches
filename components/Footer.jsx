"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");

  function subscribe(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState("error");
    setState("done");
    setEmail("");
  }

  return (
    <footer className="relative mt-32 border-t border-white/8 bg-midnight/60">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-6 max-w-sm text-mist">
            Watches designed and finished in Istanbul, built to Swiss tolerances and meant to be worn for decades.
          </p>
          <form onSubmit={subscribe} className="mt-8 max-w-sm" noValidate>
            <label htmlFor="newsletter" className="text-sm text-mist">
              New releases and workshop notes, once a month
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="newsletter"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setState("idle");
                }}
                placeholder="you@example.com"
                aria-invalid={state === "error"}
                className="field"
              />
              <button type="submit" className="btn btn-gold !px-5">
                Subscribe
              </button>
            </div>
            <p className="mt-2 min-h-5 text-sm" role="status">
              {state === "error" && <span className="text-danger">Enter a valid email address.</span>}
              {state === "done" && <span className="text-ok">Subscribed. Welcome to the workshop.</span>}
            </p>
          </form>
        </div>

        <nav className="md:col-span-3" aria-label="Footer">
          <h2 className="font-display text-xl text-gold-soft">Explore</h2>
          <ul className="mt-4 space-y-3 text-mist">
            {[
              ["/products", "All watches"],
              ["/products?category=Automatic%20Chronograph", "Chronographs"],
              ["/products?category=Gold-Plated", "Gold editions"],
              ["/services", "Engraving and gift wrap"],
              ["/about", "Our heritage"],
              ["/wishlist", "Wishlist"],
              ["/account", "My account"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-gold-soft">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="font-display text-xl text-gold-soft">Nişantaşı boutique</h2>
          <ul className="mt-4 space-y-4 text-mist">
            <li className="flex gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
              <span>
                Abdi İpekçi Caddesi, Nişantaşı
                <br />
                34365 Şişli, İstanbul, Türkiye
              </span>
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="mt-0.5 shrink-0 text-gold" />
              <a href="tel:+902120000000" className="hover:text-gold-soft">
                +90 212 000 00 00
              </a>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-gold" />
              <a href="mailto:atelier@bosphorushorology.example" className="hover:text-gold-soft">
                atelier@bosphorushorology.example
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="container-x flex flex-col justify-between gap-3 py-6 text-sm text-steel sm:flex-row">
          <p>© {new Date().getFullYear()} Bosphorus Horology. A demonstration storefront.</p>
          <p>Prices in US dollars. Complimentary shipping within Türkiye.</p>
        </div>
      </div>
    </footer>
  );
}
