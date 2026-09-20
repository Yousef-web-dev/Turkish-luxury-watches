"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, LogOut, Menu, Package, ShoppingBag, User, UserRound, X } from "lucide-react";
import { useStore } from "@/context/StoreProvider";
import { useAuth } from "@/context/AuthProvider";
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

/** Signed-in menu: avatar initial with account shortcuts. */
function AccountMenu({ user, onLogout }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${user.name}`}
        className="grid h-11 w-11 place-items-center rounded-full border border-gold/50 bg-gold/10 font-display text-xl text-gold-soft transition-colors hover:bg-gold/20"
      >
        {user.name.trim().charAt(0).toUpperCase()}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="glass glass-gold absolute right-0 top-14 w-64 overflow-hidden rounded-2xl bg-midnight/90 shadow-lift"
          >
            <div className="border-b border-white/10 px-4 py-3">
              <p className="truncate font-semibold">{user.name}</p>
              <p className="truncate text-sm text-steel">{user.email}</p>
            </div>
            <Link role="menuitem" href="/account" className="flex items-center gap-3 px-4 py-3 text-mist transition-colors hover:bg-white/5 hover:text-gold-soft">
              <User size={16} /> My account
            </Link>
            <Link role="menuitem" href="/account" className="flex items-center gap-3 px-4 py-3 text-mist transition-colors hover:bg-white/5 hover:text-gold-soft">
              <Package size={16} /> My orders
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              className="flex w-full items-center gap-3 border-t border-white/10 px-4 py-3 text-left text-mist transition-colors hover:bg-white/5 hover:text-danger"
            >
              <LogOut size={16} /> Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, wishlistCount, notify } = useStore();
  const { user, ready, logOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  function handleLogout() {
    logOut();
    setOpen(false);
    notify("You have been logged out");
    if (pathname.startsWith("/account")) router.replace("/");
  }

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

            {ready && user && <AccountMenu user={user} onLogout={handleLogout} />}
            {ready && !user && (
              <>
                <Link href="/login" className="btn btn-ghost hidden !px-5 !py-2.5 text-sm lg:inline-flex">
                  Log in
                </Link>
                <Link
                  href="/login"
                  aria-label="Log in or create an account"
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-ivory transition-colors hover:border-gold/60 hover:text-gold-soft lg:hidden"
                >
                  <UserRound size={19} />
                </Link>
              </>
            )}

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
              className="glass glass-gold fixed inset-y-0 right-0 z-[56] flex w-[min(24rem,90vw)] flex-col overflow-y-auto bg-midnight/90 p-6"
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

              <ul className="mt-8 flex flex-col">
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

              {/* account */}
              <div className="mt-6 rounded-2xl border border-white/10 p-4">
                {user ? (
                  <>
                    <p className="truncate font-semibold">{user.name}</p>
                    <p className="truncate text-sm text-steel">{user.email}</p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <Link href="/account" className="btn btn-ghost !px-4 !py-2.5 text-sm">
                        My account
                      </Link>
                      <button type="button" onClick={handleLogout} className="btn btn-ghost !px-4 !py-2.5 text-sm">
                        <LogOut size={15} /> Log out
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-mist">Log in to keep your bag, wishlist and orders.</p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <Link href="/login" className="btn btn-gold !px-4 !py-2.5 text-sm">
                        Log in
                      </Link>
                      <Link href="/signup" className="btn btn-ghost !px-4 !py-2.5 text-sm">
                        Create account
                      </Link>
                    </div>
                  </>
                )}
              </div>

              <p className="mt-auto pt-8 text-sm text-steel">
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
