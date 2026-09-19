"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Heart, Minus, Plus, ShieldCheck, ShoppingBag, Truck, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn, formatPrice } from "@/lib/format";
import { maxQtyFor, useStore } from "@/context/StoreProvider";
import WatchImage from "./WatchImage";
import Rating from "./Rating";
import ProductCard from "./ProductCard";

export default function ProductDetail({ product: p, related }) {
  const router = useRouter();
  const { addToCart, isWished, toggleWish } = useStore();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const soldOut = p.stock === "out-of-stock";
  const max = Math.max(1, maxQtyFor(p));
  const wished = isWished(p.id);

  const stockText =
    p.stock === "in-stock"
      ? "In stock, ships within 2 business days"
      : p.stock === "low-stock"
        ? `Only ${p.stockCount} left, ships within 2 business days`
        : "Sold out";
  const stockColor = p.stock === "in-stock" ? "bg-ok" : p.stock === "low-stock" ? "bg-gold" : "bg-danger";

  return (
    <div className="container-x pb-8 pt-28 sm:pt-36">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-steel">
        <Link href="/products" className="hover:text-gold-soft">
          Collection
        </Link>
        <ChevronRight size={14} aria-hidden />
        <Link href={`/products?category=${encodeURIComponent(p.category)}`} className="hover:text-gold-soft">
          {p.category}
        </Link>
        <ChevronRight size={14} aria-hidden />
        <span className="text-mist" aria-current="page">
          {p.title}
        </span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* gallery */}
        <div className="lg:col-span-7">
          <div className="glass glass-gold relative overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <WatchImage product={p} index={active} eager className="aspect-[4/5] sm:aspect-square" />
              </motion.div>
            </AnimatePresence>
            {p.isNew && (
              <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
                New
              </span>
            )}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3" role="tablist" aria-label="Product images">
            {p.images.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={`Show image ${i + 1} of ${p.images.length}`}
                onClick={() => setActive(i)}
                className={cn(
                  "overflow-hidden rounded-xl border transition-all",
                  active === i ? "border-gold shadow-glow" : "border-white/10 opacity-70 hover:opacity-100",
                )}
              >
                <WatchImage product={p} index={i} className="aspect-square" />
              </button>
            ))}
          </div>
        </div>

        {/* buy box */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm text-gold">{p.category}</p>
            <h1 className="mt-2 font-display text-5xl leading-none sm:text-6xl">{p.title}</h1>
            <p className="mt-3 text-lg text-mist">{p.tagline}</p>

            <div className="mt-5 flex items-center gap-4">
              <Rating value={p.rating} count={p.reviews} />
              <span className="text-sm text-steel">{p.movement}</span>
            </div>

            <p className="mt-6 font-display text-5xl text-gold-soft">{formatPrice(p.price)}</p>
            <p className="mt-1 text-sm text-steel">Duties and taxes included for delivery within Türkiye.</p>

            <p className="mt-6 leading-relaxed text-mist">{p.description}</p>

            <p className="mt-6 flex items-center gap-2.5 text-sm">
              <span className={cn("h-2.5 w-2.5 rounded-full", stockColor)} aria-hidden />
              {stockText}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="glass flex items-center rounded-full" role="group" aria-label="Quantity">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1 || soldOut}
                  aria-label="Decrease quantity"
                  className="grid h-12 w-12 place-items-center disabled:opacity-40"
                >
                  <Minus size={16} />
                </button>
                <output className="w-8 text-center font-semibold" aria-live="polite">
                  {qty}
                </output>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(max, q + 1))}
                  disabled={qty >= max || soldOut}
                  aria-label="Increase quantity"
                  className="grid h-12 w-12 place-items-center disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => addToCart(p.id, qty)}
                disabled={soldOut}
                className="btn btn-gold flex-1 !py-3.5"
              >
                <ShoppingBag size={18} />
                {soldOut ? "Sold out" : "Add to bag"}
              </button>

              <button
                type="button"
                onClick={() => toggleWish(p.id)}
                aria-pressed={wished}
                aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-full border transition-colors",
                  wished ? "border-gold bg-gold/15 text-gold-soft" : "border-white/18 hover:border-gold/60",
                )}
              >
                <Heart size={19} className={wished ? "fill-gold text-gold" : ""} />
              </button>
            </div>

            {!soldOut && (
              <button
                type="button"
                onClick={() => {
                  if (addToCart(p.id, qty)) router.push("/checkout");
                }}
                className="btn btn-ghost mt-3 w-full"
              >
                Buy now
              </button>
            )}
            {soldOut && (
              <p className="mt-4 text-sm text-mist">
                Save it to your wishlist and check back soon, or{" "}
                <Link href="/contact" className="link-gold">
                  ask the boutique
                </Link>{" "}
                about the next batch.
              </p>
            )}

            <ul className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm text-mist">
              <li className="flex gap-3">
                <Truck size={18} className="mt-0.5 shrink-0 text-gold" />
                Insured shipping. Complimentary within Türkiye and on worldwide orders over $2,500.
              </li>
              <li className="flex gap-3">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-gold" />
                Five-year international warranty and a complimentary first service.
              </li>
              <li className="flex gap-3">
                <PenLine size={18} className="mt-0.5 shrink-0 text-gold" />
                Add a free engraving in your bag before checkout.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* specs */}
      <section className="mt-24" aria-labelledby="specs-title">
        <h2 id="specs-title" className="font-display text-4xl">
          Technical specifications
        </h2>
        <dl className="glass mt-8 divide-y divide-white/8 overflow-hidden rounded-2xl">
          {p.specs.map((s) => (
            <div key={s.label} className="grid gap-1 px-6 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
              <dt className="text-steel">{s.label}</dt>
              <dd className="flex items-start gap-2 text-ivory">
                {s.label === "Water resistance" && <Check size={16} className="mt-1 shrink-0 text-gold" />}
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* related */}
      <section className="mt-24" aria-labelledby="related-title">
        <h2 id="related-title" className="font-display text-4xl">
          You may also like
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((r) => (
            <ProductCard key={r.id} product={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
