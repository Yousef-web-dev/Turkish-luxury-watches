"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Heart, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { maxQtyFor, useStore } from "@/context/StoreProvider";
import { ENGRAVING_MAX_CHARS, GIFT_WRAP_FEE, GLOBAL_FREE_THRESHOLD } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import WatchImage from "./WatchImage";

export default function CartClient() {
  const { ready, lines, subtotal, giftWrapFee, options, setOptions, setQty, removeFromCart, moveToWishlist } =
    useStore();
  const total = subtotal + giftWrapFee;
  const remaining = Math.max(0, GLOBAL_FREE_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / GLOBAL_FREE_THRESHOLD) * 100);

  return (
    <div className="container-x pb-8 pt-32 sm:pt-40">
      <h1 className="font-display text-5xl sm:text-6xl">Your bag</h1>

      {!ready ? (
        <p className="mt-10 text-mist">Loading your bag…</p>
      ) : lines.length === 0 ? (
        <div className="glass glass-gold mt-10 grid place-items-center rounded-3xl px-6 py-20 text-center">
          <ShoppingBag size={44} className="text-gold" />
          <h2 className="mt-5 font-display text-4xl">Your bag is empty</h2>
          <p className="mt-3 max-w-md text-mist">
            Add a watch from the collection, or check the ones you saved earlier.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/products" className="btn btn-gold">
              Browse watches
            </Link>
            <Link href="/wishlist" className="btn btn-ghost">
              View wishlist
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-8">
            <ul className="space-y-4">
              <AnimatePresence initial={false}>
                {lines.map(({ product: p, qty }) => (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35 }}
                    className="glass flex gap-4 rounded-2xl p-4 sm:gap-6 sm:p-5"
                  >
                    <Link href={`/products/${p.id}`} className="w-28 shrink-0 sm:w-36">
                      <WatchImage product={p} className="aspect-[4/5] rounded-xl" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/products/${p.id}`}
                            className="font-display text-2xl leading-tight hover:text-gold-soft"
                          >
                            {p.title}
                          </Link>
                          <p className="mt-1 text-sm text-steel">
                            {p.category}, {p.movement}
                          </p>
                        </div>
                        <p className="font-display text-2xl text-gold-soft">{formatPrice(p.price * qty)}</p>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                        <div
                          className="glass flex items-center rounded-full"
                          role="group"
                          aria-label={`Quantity for ${p.title}`}
                        >
                          <button
                            type="button"
                            onClick={() => (qty > 1 ? setQty(p.id, qty - 1) : removeFromCart(p.id))}
                            aria-label={qty > 1 ? "Decrease quantity" : `Remove ${p.title}`}
                            className="grid h-10 w-10 place-items-center"
                          >
                            <Minus size={15} />
                          </button>
                          <output className="w-7 text-center text-sm font-semibold">{qty}</output>
                          <button
                            type="button"
                            onClick={() => setQty(p.id, qty + 1)}
                            disabled={qty >= maxQtyFor(p)}
                            aria-label="Increase quantity"
                            className="grid h-10 w-10 place-items-center disabled:opacity-40"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <button
                            type="button"
                            onClick={() => moveToWishlist(p.id)}
                            className="flex items-center gap-1.5 text-mist hover:text-gold-soft"
                          >
                            <Heart size={15} /> Save for later
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(p.id)}
                            className="flex items-center gap-1.5 text-mist hover:text-danger"
                          >
                            <Trash2 size={15} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <section className="glass rounded-2xl p-6" aria-labelledby="addons-title">
              <h2 id="addons-title" className="font-display text-2xl">
                Make it a gift
              </h2>
              <label className="mt-4 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={options.giftWrap}
                  onChange={(e) => setOptions({ giftWrap: e.target.checked })}
                  className="mt-1 h-4 w-4 accent-gold"
                />
                <span>
                  <span className="flex items-center gap-2">
                    <Gift size={16} className="text-gold" /> Luxury gift wrapping, {formatPrice(GIFT_WRAP_FEE)}
                  </span>
                  <span className="mt-0.5 block text-sm text-steel">
                    Hand-packed at the boutique.{" "}
                    <Link href="/services" className="link-gold">
                      See packaging options
                    </Link>
                  </span>
                </span>
              </label>
              <label className="mt-5 block">
                <span className="text-sm text-mist">Caseback engraving, complimentary (optional)</span>
                <input
                  value={options.engraving}
                  maxLength={ENGRAVING_MAX_CHARS}
                  onChange={(e) => setOptions({ engraving: e.target.value })}
                  placeholder="A name, a date, a few words"
                  className="field mt-2"
                />
                <span className="mt-1.5 block text-sm text-steel">
                  {options.engraving.length} of {ENGRAVING_MAX_CHARS} characters. Applied to the first watch in your
                  order.
                </span>
              </label>
            </section>
          </div>

          <aside className="lg:col-span-4" aria-label="Order summary">
            <div className="glass glass-gold rounded-2xl p-6 lg:sticky lg:top-28">
              <h2 className="font-display text-3xl">Summary</h2>
              <dl className="mt-5 space-y-3 text-mist">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-ivory">{formatPrice(subtotal)}</dd>
                </div>
                {giftWrapFee > 0 && (
                  <div className="flex justify-between">
                    <dt>Gift wrapping</dt>
                    <dd className="text-ivory">{formatPrice(giftWrapFee)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt>Shipping</dt>
                  <dd className="text-ivory">Set at checkout</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
                  <dt className="text-ivory">Total before shipping</dt>
                  <dd className="font-display text-3xl text-gold-soft">{formatPrice(total)}</dd>
                </div>
              </dl>

              <div className="mt-5">
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gold transition-[width] duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-steel">
                  {remaining > 0
                    ? `Add ${formatPrice(remaining)} more for free worldwide shipping. Shipping within Türkiye is always free.`
                    : "Your order qualifies for free worldwide shipping."}
                </p>
              </div>

              <Link href="/checkout" className="btn btn-gold mt-6 w-full">
                Continue to checkout
              </Link>
              <Link href="/products" className="link-gold mt-4 block text-center text-sm">
                Keep browsing
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
