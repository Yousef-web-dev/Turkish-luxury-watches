"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, LogOut, Package, ShieldCheck, User } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useStore } from "@/context/StoreProvider";
import { passwordIssues } from "@/lib/auth";
import { cn, formatPrice } from "@/lib/format";
import Field from "./ui/Field";
import PasswordInput from "./ui/PasswordInput";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "security", label: "Password", icon: ShieldCheck },
];

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

/* ------------------------------ profile tab ------------------------------ */
function ProfileTab() {
  const { user, updateProfile } = useAuth();
  const { notify } = useStore();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const dirty = form.name !== user.name || form.phone !== (user.phone || "");

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    const res = await updateProfile(form);
    setBusy(false);
    if (!res.ok) return setErrors({ [res.field || "form"]: res.error });
    setErrors({});
    notify("Profile saved");
  }

  return (
    <form onSubmit={save} noValidate className="grid max-w-xl gap-5">
      <Field label="Full name" error={errors.name}>
        <input
          className="field"
          value={form.name}
          onChange={(e) => {
            setForm((f) => ({ ...f, name: e.target.value }));
            setErrors({});
          }}
          autoComplete="name"
          aria-invalid={!!errors.name}
        />
      </Field>
      <Field label="Email" hint="Your email is your login, so it can't be changed here.">
        <input className="field opacity-70" value={user.email} readOnly />
      </Field>
      <Field label="Phone (optional)" error={errors.phone}>
        <input
          type="tel"
          className="field"
          value={form.phone}
          onChange={(e) => {
            setForm((f) => ({ ...f, phone: e.target.value }));
            setErrors({});
          }}
          autoComplete="tel"
          aria-invalid={!!errors.phone}
        />
      </Field>
      {errors.form && (
        <p role="alert" className="text-sm text-danger">
          {errors.form}
        </p>
      )}
      <button type="submit" disabled={!dirty || busy} className="btn btn-gold justify-self-start">
        {busy ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

/* ------------------------------- orders tab ------------------------------ */
function OrdersTab() {
  const { getOrders } = useAuth();
  const orders = useMemo(() => getOrders(), [getOrders]);

  if (orders.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
        <Package size={40} className="text-gold" />
        <h3 className="mt-4 font-display text-3xl">No orders yet</h3>
        <p className="mt-2 max-w-sm text-mist">When you place an order while logged in, it will appear here.</p>
        <Link href="/products" className="btn btn-gold mt-6">
          Browse watches
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-5">
      {orders.map((o) => (
        <li key={o.id} className="rounded-2xl border border-white/10 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-2xl">Order {o.id}</p>
              <p className="text-sm text-steel">Placed on {dateFmt.format(new Date(o.date))}</p>
            </div>
            <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-sm text-gold-soft">{o.status}</span>
          </div>
          <ul className="mt-4 divide-y divide-white/8 border-t border-white/10">
            {o.items.map((it) => (
              <li key={it.id} className="flex justify-between gap-4 py-3 text-mist">
                <Link href={`/products/${it.id}`} className="hover:text-gold-soft">
                  {it.title} <span className="text-steel">× {it.qty}</span>
                </Link>
                <span className="text-ivory">{formatPrice(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-end justify-between gap-3 border-t border-white/10 pt-4">
            <p className="text-sm text-steel">Delivering to {o.shipTo}</p>
            <p className="font-display text-2xl text-gold-soft">{formatPrice(o.total)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------ password tab ----------------------------- */
function SecurityTab() {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
    setDone(false);
  };

  async function submit(e) {
    e.preventDefault();
    const er = {};
    if (!form.current) er.current = "Enter your current password.";
    const issues = passwordIssues(form.next);
    if (issues.length) er.next = `Your new password needs ${issues.join(", ")}.`;
    if (form.confirm !== form.next) er.confirm = "The two passwords do not match.";
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    const res = await changePassword(form.current, form.next);
    setBusy(false);
    if (!res.ok) return setErrors({ [res.field || "current"]: res.error });
    setForm({ current: "", next: "", confirm: "" });
    setDone(true);
  }

  return (
    <form onSubmit={submit} noValidate className="grid max-w-xl gap-5">
      <Field label="Current password" error={errors.current}>
        <PasswordInput value={form.current} onChange={set("current")} autoComplete="current-password" invalid={!!errors.current} />
      </Field>
      <Field label="New password" error={errors.next} hint="At least 8 characters, with a letter and a number.">
        <PasswordInput value={form.next} onChange={set("next")} autoComplete="new-password" invalid={!!errors.next} showStrength />
      </Field>
      <Field label="Confirm new password" error={errors.confirm}>
        <PasswordInput value={form.confirm} onChange={set("confirm")} autoComplete="new-password" invalid={!!errors.confirm} />
      </Field>
      {done && (
        <p role="status" className="flex items-center gap-2 text-sm text-ok">
          <CheckCircle2 size={17} /> Your password has been updated.
        </p>
      )}
      <button type="submit" disabled={busy} className="btn btn-gold justify-self-start">
        {busy ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}

/* ---------------------------------- page --------------------------------- */
export default function AccountClient() {
  const router = useRouter();
  const { user, ready, logOut } = useAuth();
  const { wishlistCount, cartCount, notify } = useStore();
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    if (ready && !user) router.replace("/login?next=/account");
  }, [ready, user, router]);

  if (!ready || !user) {
    return <div className="container-x pt-40 text-mist">Loading your account…</div>;
  }

  const first = user.name.split(" ")[0];

  return (
    <div className="container-x pb-8 pt-32 sm:pt-40">
      <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-5xl sm:text-6xl">Hello, {first}</h1>
          <p className="mt-3 text-mist">
            {user.email}. Member since {dateFmt.format(new Date(user.createdAt))}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            logOut();
            notify("You have been logged out");
            router.replace("/");
          }}
          className="btn btn-ghost self-start sm:self-auto"
        >
          <LogOut size={16} /> Log out
        </button>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/wishlist" className="glass rounded-2xl p-5 transition-colors hover:border-gold/50">
          <p className="font-display text-4xl text-gold-soft">{wishlistCount}</p>
          <p className="mt-1 text-mist">{wishlistCount === 1 ? "watch" : "watches"} in your wishlist</p>
        </Link>
        <Link href="/cart" className="glass rounded-2xl p-5 transition-colors hover:border-gold/50">
          <p className="font-display text-4xl text-gold-soft">{cartCount}</p>
          <p className="mt-1 text-mist">{cartCount === 1 ? "item" : "items"} in your bag</p>
        </Link>
      </div>

      <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Account sections">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "relative flex items-center gap-2 rounded-full border px-5 py-3 text-sm transition-colors",
              tab === id ? "border-gold/60 text-gold-soft" : "border-white/12 text-mist hover:border-white/30",
            )}
          >
            {tab === id && (
              <motion.span
                layoutId="acct-tab"
                className="absolute inset-0 -z-10 rounded-full bg-gold/10"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      <div className="glass glass-gold mt-6 rounded-3xl p-6 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            role="tabpanel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === "profile" && <ProfileTab />}
            {tab === "orders" && <OrdersTab />}
            {tab === "security" && <SecurityTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
