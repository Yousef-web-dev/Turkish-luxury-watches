"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { formatPrice } from "@/lib/format";
import { useStore } from "@/context/StoreProvider";
import WatchImage from "./WatchImage";
import WishlistButton from "./WishlistButton";
import Rating from "./Rating";

export default function ProductCard({ product: p, priority = false }) {
  const { addToCart } = useStore();
  const soldOut = p.stock === "out-of-stock";

  return (
    <article className="group glass glass-gold relative flex h-full flex-col overflow-hidden rounded-2xl transition-[transform,box-shadow,border-color] duration-500 ease-luxe hover:-translate-y-1 hover:border-gold/50 hover:shadow-glow">
      <div className="relative">
        <Link href={`/products/${p.id}`} aria-label={`View ${p.title}`} className="block">
          <WatchImage
            product={p}
            eager={priority}
            className="aspect-[4/5] transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {p.isNew && <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-ink">New</span>}
          {p.stock === "low-stock" && (
            <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-gold-soft backdrop-blur">
              Only {p.stockCount} left
            </span>
          )}
          {soldOut && (
            <span className="rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-mist backdrop-blur">
              Sold out
            </span>
          )}
        </div>
        <WishlistButton id={p.id} title={p.title} className="absolute right-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs text-steel">
            {p.category}, {p.movement}
          </p>
          <h3 className="mt-1 font-display text-2xl leading-tight">
            <Link href={`/products/${p.id}`} className="hover:text-gold-soft">
              {p.title}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-mist">{p.tagline}</p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <p className="font-display text-2xl text-gold-soft">{formatPrice(p.price)}</p>
            <Rating value={p.rating} count={p.reviews} />
          </div>
          <button
            type="button"
            onClick={() => addToCart(p.id)}
            disabled={soldOut}
            aria-label={soldOut ? `${p.title} is sold out` : `Add ${p.title} to bag`}
            className="btn btn-ghost !px-4 !py-2.5 text-sm"
          >
            <ShoppingBag size={16} />
            {soldOut ? "Sold out" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
