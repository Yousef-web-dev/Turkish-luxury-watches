"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/context/StoreProvider";
import { cn } from "@/lib/format";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

function Badge({ count }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[0.68rem] font-bold text-ink"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount, wishlistCount } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled ? "glass border-x-0 border-t-0 bg-midnight/70" : "border-b border-transparent",
        )}
      >
        <nav className="container-x flex h-20 items-center justify-between gap-6" aria-label="Main">
          <Link href="/" aria-label="Bosphorus Horology, home">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors",
                    isActive(l.href) ? "text-gold-soft" : "text-mist hover:text-ivory",
                  )}
                >
                  {isActive(l.href) && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-gold/30 bg-gold/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} items`}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 text-ivory transition-colors hover:border-gold/60 hover:text-gold-soft"
            >
              <Heart size={19} />
              <Badge count={wishlistCount} />
            </Link>
            <Link
              href="/cart"
              aria-label={`Shopping bag, ${cartCount} items`}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 text-ivory transition-colors hover:border-gold/60 hover:text-gold-soft"
            >
              <ShoppingBag size={19} />
              <Badge count={cartCount} />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm"
            />
            <motion.aside
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="glass glass-gold fixed inset-y-0 right-0 z-[56] flex w-[min(24rem,90vw)] flex-col bg-midnight/90 p-6"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10"
                >
                  <X size={20} />
                </button>
              </div>

              <ul className="mt-10 flex flex-col">
                {links.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={l.href}
                      className={cn(
                        "flex items-center justify-between border-b border-white/8 py-4 font-display text-3xl",
                        isActive(l.href) ? "text-gold-soft" : "text-ivory",
                      )}
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <Link href="/wishlist" className="btn btn-ghost">
                  <Heart size={16} /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
                <Link href="/cart" className="btn btn-gold">
                  <ShoppingBag size={16} /> Bag {cartCount > 0 && `(${cartCount})`}
                </Link>
              </div>

              <p className="mt-auto text-sm text-steel">
                Boutique in Nişantaşı, İstanbul.
                <br />
                Open Monday to Saturday, 10:00 to 20:00.
              </p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
