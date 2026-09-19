"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { categories, movements, priceBounds, products } from "@/lib/products";
import { cn, formatPrice } from "@/lib/format";
import ProductCard from "./ProductCard";

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "rating", label: "Highest rated" },
];

function toggle(list, v) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export default function ProductsClient() {
  const params = useSearchParams();
  const initialCat = params.get("category");

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [cats, setCats] = useState(initialCat && categories.includes(initialCat) ? [initialCat] : []);
  const [movs, setMovs] = useState([]);
  const [[minP, maxP], setRange] = useState([priceBounds.min, priceBounds.max]);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("featured");
  const [panel, setPanel] = useState(false);

  const filtersActive =
    cats.length > 0 ||
    movs.length > 0 ||
    inStock ||
    minP > priceBounds.min ||
    maxP < priceBounds.max ||
    query.trim() !== "";

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      if (cats.length && !cats.includes(p.category)) return false;
      if (movs.length && !movs.includes(p.movement)) return false;
      if (p.price < minP || p.price > maxP) return false;
      if (inStock && p.stock === "out-of-stock") return false;
      if (q) {
        const hay = `${p.title} ${p.tagline} ${p.category} ${p.movement} ${p.description} ${p.look.dial}`.toLowerCase();
        return q.split(/\s+/).every((word) => hay.includes(word));
      }
      return true;
    });
    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      case "newest":
        sorted.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew) || b.order - a.order);
        break;
      default:
        sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || a.order - b.order);
    }
    return sorted;
  }, [query, cats, movs, minP, maxP, inStock, sort]);

  const count = (fn) => products.filter(fn).length;

  function reset() {
    setQuery("");
    setCats([]);
    setMovs([]);
    setRange([priceBounds.min, priceBounds.max]);
    setInStock(false);
  }

  const span = priceBounds.max - priceBounds.min;
  const left = ((minP - priceBounds.min) / span) * 100;
  const right = 100 - ((maxP - priceBounds.min) / span) * 100;

  const filters = (
    <div className="space-y-8">
      <fieldset>
        <legend className="font-display text-xl text-gold-soft">Category</legend>
        <div className="mt-3 space-y-2.5">
          {categories.map((c) => (
            <label
              key={c}
              className="flex cursor-pointer items-center justify-between gap-3 text-mist hover:text-ivory"
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={cats.includes(c)}
                  onChange={() => setCats((v) => toggle(v, c))}
                  className="h-4 w-4 accent-gold"
                />
                {c}
              </span>
              <span className="text-sm text-steel">{count((p) => p.category === c)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-xl text-gold-soft">Movement</legend>
        <div className="mt-3 space-y-2.5">
          {movements.map((m) => (
            <label
              key={m}
              className="flex cursor-pointer items-center justify-between gap-3 text-mist hover:text-ivory"
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={movs.includes(m)}
                  onChange={() => setMovs((v) => toggle(v, m))}
                  className="h-4 w-4 accent-gold"
                />
                {m}
              </span>
              <span className="text-sm text-steel">{count((p) => p.movement === m)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-xl text-gold-soft">Price</legend>
        <div className="mt-5 px-1">
          <div className="dual-range">
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/12" />
            <div
              className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-gold"
              style={{ left: `${left}%`, right: `${right}%` }}
            />
            <input
              type="range"
              aria-label="Minimum price"
              min={priceBounds.min}
              max={priceBounds.max}
              step={50}
              value={minP}
              onChange={(e) => setRange([Math.min(Number(e.target.value), maxP - 200), maxP])}
            />
            <input
              type="range"
              aria-label="Maximum price"
              min={priceBounds.min}
              max={priceBounds.max}
              step={50}
              value={maxP}
              onChange={(e) => setRange([minP, Math.max(Number(e.target.value), minP + 200)])}
            />
          </div>
          <div className="mt-4 flex justify-between text-sm text-mist">
            <span>{formatPrice(minP)}</span>
            <span>{formatPrice(maxP)}</span>
          </div>
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-3 text-mist hover:text-ivory">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
          className="h-4 w-4 accent-gold"
        />
        Hide sold-out watches
      </label>

      {filtersActive && (
        <button type="button" onClick={reset} className="link-gold text-sm">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container-x pb-8 pt-32 sm:pt-40">
      <header className="max-w-2xl">
        <h1 className="font-display text-5xl sm:text-6xl">The collection</h1>
        <p className="mt-4 text-lg text-mist">
          {products.length} watches across five families, from hand-wound dress pieces to 600 m divers.
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-steel"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, dial, movement or style"
            aria-label="Search watches"
            className="field !pl-11"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-steel hover:text-ivory"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <label className="sr-only" htmlFor="sort">
            Sort by
          </label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="field sm:w-56">
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setPanel((v) => !v)}
            aria-expanded={panel}
            className="btn btn-ghost lg:hidden"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[17rem_1fr]">
        {/* mobile panel */}
        <AnimatePresence initial={false}>
          {panel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden lg:hidden"
            >
              <div className="glass rounded-2xl p-6">{filters}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <aside className="hidden lg:block" aria-label="Filters">
          <div className="glass sticky top-28 rounded-2xl p-6">{filters}</div>
        </aside>

        <div>
          <p className="mb-5 text-sm text-mist" role="status" aria-live="polite">
            Showing {results.length} of {products.length} watches
          </p>

          {results.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <h2 className="font-display text-3xl">No watches match those filters</h2>
              <p className="mx-auto mt-3 max-w-md text-mist">
                Try a shorter search, widen the price range, or remove a category.
              </p>
              <button type="button" onClick={reset} className="btn btn-gold mt-6">
                Clear all filters
              </button>
            </div>
          ) : (
            <motion.div layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {results.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className={cn("h-full")}
                  >
                    <ProductCard product={p} priority={i < 3} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
