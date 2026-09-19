import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories, featuredProducts, products } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  return (
    <section className="container-x mt-32" aria-labelledby="featured-title">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h2 id="featured-title" className="font-display text-4xl sm:text-5xl">
            Featured watches
          </h2>
          <p className="mt-3 max-w-lg text-mist">
            Our most-loved references, chosen by the workshop and by the people who wear them every day.
          </p>
        </div>
        <Link href="/products" className="btn btn-ghost self-start sm:self-auto">
          View all {products.length} watches <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c}
            href={`/products?category=${encodeURIComponent(c)}`}
            className="rounded-full border border-white/12 px-4 py-2 text-sm text-mist transition-colors hover:border-gold/60 hover:text-gold-soft"
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProducts.slice(0, 6).map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 3} />
        ))}
      </div>
    </section>
  );
}
