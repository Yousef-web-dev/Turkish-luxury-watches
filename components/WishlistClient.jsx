"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreProvider";
import ProductCard from "./ProductCard";

export default function WishlistClient() {
  const { ready, wishlist, addToCart } = useStore();
  const available = wishlist.filter((p) => p.stock !== "out-of-stock");

  return (
    <div className="container-x pb-8 pt-32 sm:pt-40">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-5xl sm:text-6xl">Your wishlist</h1>
          {ready && wishlist.length > 0 && (
            <p className="mt-3 text-mist">
              {wishlist.length} saved {wishlist.length === 1 ? "watch" : "watches"}. Select the heart on a card to
              remove it.
            </p>
          )}
        </div>
        {available.length > 0 && (
          <button
            type="button"
            onClick={() => available.forEach((p) => addToCart(p.id, 1))}
            className="btn btn-gold self-start sm:self-auto"
          >
            <ShoppingBag size={16} /> Add all available to bag
          </button>
        )}
      </div>

      {!ready ? (
        <p className="mt-10 text-mist">Loading your wishlist…</p>
      ) : wishlist.length === 0 ? (
        <div className="glass glass-gold mt-10 grid place-items-center rounded-3xl px-6 py-20 text-center">
          <Heart size={44} className="text-gold" />
          <h2 className="mt-5 font-display text-4xl">Nothing saved yet</h2>
          <p className="mt-3 max-w-md text-mist">Select the heart on any watch to keep it here while you decide.</p>
          <Link href="/products" className="btn btn-gold mt-8">
            Browse watches
          </Link>
        </div>
      ) : (
        <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {wishlist.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
