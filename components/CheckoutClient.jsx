"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, CheckCircle2, CreditCard, Lock } from "lucide-react";
import { useStore } from "@/context/StoreProvider";
import { GIFT_WRAP_FEE, shippingFor } from "@/lib/pricing";
import { cn, formatPrice } from "@/lib/format";
import Field from "./ui/Field";
import WatchImage from "./WatchImage";

const provinces = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Konya",
  "Gaziantep",
  "Kayseri",
  "Mersin",
  "Eskişehir",
  "Muğla",
  "Trabzon",
  "Edirne",
  "Çanakkale",
];
const countries = [
  "United Kingdom",
  "Germany",
  "France",
  "Netherlands",
  "Italy",
  "Spain",
  "Switzerland",
  "United Arab Emirates",
  "Saudi Arabia",
  "Egypt",
  "Qatar",
  "United States",
  "Canada",
  "Australia",
  "Japan",
  "Singapore",
];
const steps = ["Shipping", "Payment", "Review"];

const emptyShipping = {
  region: "TR",
  fullName: "",
  email: "",
  phone: "",
  country: "",
  province: "",
  district: "",
  city: "",
  address: "",
  postal: "",
};
const emptyPayment = { name: "", number: "", expiry: "", cvc: "" };

function luhn(num) {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function cardBrand(n) {
  const d = n.replace(/\s/g, "");
  if (/^4/.test(d)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "Mastercard";
  if (/^3[47]/.test(d)) return "Amex";
  if (/^9792/.test(d)) return "Troy";
  return "Card";
}

function validateShipping(s) {
  const e = {};
  if (s.fullName.trim().length < 2) e.fullName = "Enter your full name.";
  if (!/^\S+@\S+\.\S+$/.test(s.email)) e.email = "Enter a valid email address, like name@example.com.";
  if (s.phone.replace(/\D/g, "").length < 7) e.phone = "Enter a phone number with at least 7 digits.";
  if (s.address.trim().length < 6) e.address = "Enter your street address.";
  if (s.region === "TR") {
    if (!s.province) e.province = "Choose a province.";
    if (s.district.trim().length < 2) e.district = "Enter your district.";
    if (!/^\d{5}$/.test(s.postal)) e.postal = "Turkish postal codes have 5 digits.";
  } else {
    if (!s.country) e.country = "Choose a country.";
    if (s.city.trim().length < 2) e.city = "Enter your city.";
    if (s.postal.trim().length < 3) e.postal = "Enter your postal code.";
  }
  return e;
}

function validatePayment(p) {
  const e = {};
  const digits = p.number.replace(/\s/g, "");
  if (p.name.trim().length < 2) e.name = "Enter the name on the card.";
  if (digits.length < 13 || digits.length > 19 || !luhn(digits))
    e.number = "Enter a valid card number. Use the test card below to try the flow.";
  const m = /^(\d{2})\/(\d{2})$/.exec(p.expiry);
  const now = new Date();
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) e.expiry = "Use the format MM/YY.";
  else if (
    2000 + Number(m[2]) < now.getFullYear() ||
    (2000 + Number(m[2]) === now.getFullYear() && Number(m[1]) < now.getMonth() + 1)
  )
    e.expiry = "This card has expired.";
  if (!/^\d{3,4}$/.test(p.cvc)) e.cvc = "Enter the 3 or 4 digit security code.";
  return e;
}

function Summary({ lines, subtotal, giftWrapFee, shipping, engraving }) {
  const total = subtotal + giftWrapFee + shipping;
  return (
    <div className="glass glass-gold rounded-2xl p-6 lg:sticky lg:top-28">
      <h2 className="font-display text-3xl">Order summary</h2>
      <ul className="mt-5 space-y-4">
        {lines.map(({ product: p, qty }) => (
          <li key={p.id} className="flex items-center gap-4">
            <WatchImage product={p} className="h-20 w-16 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg leading-tight">{p.title}</p>
              <p className="text-sm text-steel">Quantity {qty}</p>
            </div>
            <p className="text-ivory">{formatPrice(p.price * qty)}</p>
          </li>
        ))}
      </ul>
      {engraving && <p className="mt-4 text-sm text-mist">Engraving: “{engraving}”</p>}
      <dl className="mt-5 space-y-2.5 border-t border-white/10 pt-5 text-mist">
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
          <dd className="text-ivory">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
          <dt className="text-ivory">Total</dt>
          <dd className="font-display text-3xl text-gold-soft">{formatPrice(total)}</dd>
        </div>
      </dl>
    </div>
  );
}

export default function CheckoutClient() {
  const { ready, lines, subtotal, giftWrapFee, options, clearCart } = useStore();
  const [step, setStep] = useState(0);
  const [ship, setShip] = useState(emptyShipping);
  const [pay, setPay] = useState(emptyPayment);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [placed, setPlaced] = useState(null);

  const shippingCost = shippingFor(ship.region, subtotal);
  const total = subtotal + giftWrapFee + shippingCost;

  const setS = (k) => (e) => {
    setShip((s) => ({ ...s, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };
  const setP = (k, v) => {
    setPay((p) => ({ ...p, [k]: v }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };

  function next() {
    const e = step === 0 ? validateShipping(ship) : validatePayment(pay);
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function placeOrder() {
    setProcessing(true);
    // Simulation only: no payment is taken and nothing is sent to a server.
    setTimeout(() => {
      setPlaced({
        order: `BH-${Date.now().toString(36).toUpperCase().slice(-6)}`,
        email: ship.email,
        region: ship.region,
        lines,
        total,
      });
      clearCart();
      setProcessing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1400);
  }

  if (!ready) return <div className="container-x pt-40 text-mist">Loading checkout…</div>;

  /* ---------------- confirmation ---------------- */
  if (placed) {
    return (
      <div className="container-x pb-8 pt-32 sm:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass glass-gold mx-auto max-w-2xl rounded-3xl p-8 text-center sm:p-14"
        >
          <CheckCircle2 size={56} className="mx-auto text-gold" />
          <h1 className="mt-6 font-display text-5xl">Thank you for your order</h1>
          <p className="mt-4 text-mist">
            Order <span className="font-semibold text-ivory">{placed.order}</span> is confirmed. A confirmation will be
            sent to <span className="text-ivory">{placed.email}</span>.
          </p>
          <p className="mt-2 text-mist">
            {placed.region === "TR"
              ? "Expected delivery: 1 to 2 business days."
              : "Expected delivery: 3 to 5 business days by insured courier."}
          </p>
          <ul className="mt-8 divide-y divide-white/10 border-y border-white/10 text-left">
            {placed.lines.map(({ product: p, qty }) => (
              <li key={p.id} className="flex justify-between gap-4 py-3">
                <span>
                  {p.title} <span className="text-steel">× {qty}</span>
                </span>
                <span>{formatPrice(p.price * qty)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-4 py-3 font-semibold">
              <span>Total charged</span>
              <span className="text-gold-soft">{formatPrice(placed.total)}</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-steel">This is a demonstration checkout. No payment was taken.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/products" className="btn btn-gold">
              Continue browsing
            </Link>
            <Link href="/" className="btn btn-ghost">
              Back home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-x grid min-h-[70vh] place-content-center gap-5 pt-32 text-center">
        <h1 className="font-display text-5xl">Your bag is empty</h1>
        <p className="text-mist">Add a watch to your bag before checking out.</p>
        <Link href="/products" className="btn btn-gold mx-auto">
          Browse watches
        </Link>
      </div>
    );
  }

  const isTR = ship.region === "TR";

  return (
    <div className="container-x pb-8 pt-32 sm:pt-40">
      <h1 className="font-display text-5xl sm:text-6xl">Checkout</h1>

      {/* stepper (a true sequence, so numbering is meaningful) */}
      <ol className="mt-8 flex items-center gap-3" aria-label="Checkout progress">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-3" aria-current={i === step ? "step" : undefined}>
            <span
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-semibold transition-colors",
                i < step
                  ? "border-gold bg-gold text-ink"
                  : i === step
                    ? "border-gold text-gold-soft"
                    : "border-white/20 text-steel",
              )}
            >
              {i < step ? <Check size={16} /> : i + 1}
            </span>
            <span className={cn("hidden text-sm sm:block", i <= step ? "text-ivory" : "text-steel")}>{s}</span>
            {i < steps.length - 1 && (
              <span className="h-px flex-1 bg-white/12">
                <span
                  className="block h-full bg-gold transition-[width] duration-700"
                  style={{ width: i < step ? "100%" : "0%" }}
                />
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="glass rounded-3xl p-6 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 && (
                  <div className="grid gap-5">
                    <h2 className="font-display text-3xl">Where should we send it?</h2>
                    <div
                      className="grid grid-cols-2 gap-2 rounded-full border border-white/12 p-1"
                      role="radiogroup"
                      aria-label="Delivery region"
                    >
                      {[
                        ["TR", "Türkiye"],
                        ["GLOBAL", "Worldwide"],
                      ].map(([v, label]) => (
                        <button
                          key={v}
                          type="button"
                          role="radio"
                          aria-checked={ship.region === v}
                          onClick={() => {
                            setShip((s) => ({ ...s, region: v, postal: "" }));
                            setErrors({});
                          }}
                          className={cn(
                            "rounded-full py-2.5 text-sm transition-colors",
                            ship.region === v ? "bg-gold text-ink" : "text-mist hover:text-ivory",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Full name" error={errors.fullName}>
                        <input
                          className="field"
                          value={ship.fullName}
                          onChange={setS("fullName")}
                          autoComplete="name"
                          aria-invalid={!!errors.fullName}
                        />
                      </Field>
                      <Field label="Phone" error={errors.phone}>
                        <input
                          type="tel"
                          className="field"
                          value={ship.phone}
                          onChange={setS("phone")}
                          autoComplete="tel"
                          placeholder={isTR ? "+90 5xx xxx xx xx" : "+44 20 0000 0000"}
                          aria-invalid={!!errors.phone}
                        />
                      </Field>
                    </div>
                    <Field label="Email" error={errors.email}>
                      <input
                        type="email"
                        className="field"
                        value={ship.email}
                        onChange={setS("email")}
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                      />
                    </Field>
                    <Field
                      label="Street address"
                      error={errors.address}
                      hint={isTR ? "Neighbourhood (mahalle), street and building number" : undefined}
                    >
                      <input
                        className="field"
                        value={ship.address}
                        onChange={setS("address")}
                        autoComplete="street-address"
                        aria-invalid={!!errors.address}
                      />
                    </Field>
                    {isTR ? (
                      <div className="grid gap-5 sm:grid-cols-3">
                        <Field label="Province (il)" error={errors.province}>
                          <select
                            className="field"
                            value={ship.province}
                            onChange={setS("province")}
                            aria-invalid={!!errors.province}
                          >
                            <option value="">Choose</option>
                            {provinces.map((p) => (
                              <option key={p}>{p}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="District (ilçe)" error={errors.district}>
                          <input
                            className="field"
                            value={ship.district}
                            onChange={setS("district")}
                            aria-invalid={!!errors.district}
                          />
                        </Field>
                        <Field label="Postal code" error={errors.postal}>
                          <input
                            className="field"
                            inputMode="numeric"
                            maxLength={5}
                            value={ship.postal}
                            onChange={setS("postal")}
                            autoComplete="postal-code"
                            aria-invalid={!!errors.postal}
                          />
                        </Field>
                      </div>
                    ) : (
                      <div className="grid gap-5 sm:grid-cols-3">
                        <Field label="Country" error={errors.country}>
                          <select
                            className="field"
                            value={ship.country}
                            onChange={setS("country")}
                            aria-invalid={!!errors.country}
                          >
                            <option value="">Choose</option>
                            {countries.map((c) => (
                              <option key={c}>{c}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="City" error={errors.city}>
                          <input
                            className="field"
                            value={ship.city}
                            onChange={setS("city")}
                            autoComplete="address-level2"
                            aria-invalid={!!errors.city}
                          />
                        </Field>
                        <Field label="Postal code" error={errors.postal}>
                          <input
                            className="field"
                            value={ship.postal}
                            onChange={setS("postal")}
                            autoComplete="postal-code"
                            aria-invalid={!!errors.postal}
                          />
                        </Field>
                      </div>
                    )}
                    <p className="text-sm text-steel">
                      {isTR
                        ? "Shipping within Türkiye is free, with insured next-business-day courier."
                        : `Insured worldwide courier: free over ${formatPrice(2500)}, otherwise ${formatPrice(65)}.`}
                    </p>
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-5">
                    <h2 className="font-display text-3xl">Payment</h2>
                    <p className="rounded-xl border border-gold/30 bg-gold/8 px-4 py-3 text-sm text-mist">
                      This is a payment simulation. Do not enter a real card number; nothing is charged or stored.
                    </p>
                    <Field label="Name on card" error={errors.name}>
                      <input
                        className="field"
                        value={pay.name}
                        onChange={(e) => setP("name", e.target.value)}
                        autoComplete="cc-name"
                        aria-invalid={!!errors.name}
                      />
                    </Field>
                    <Field label={`Card number (${cardBrand(pay.number)})`} error={errors.number}>
                      <div className="relative">
                        <CreditCard
                          size={18}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-steel"
                        />
                        <input
                          className="field !pl-11 tabular-nums"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          placeholder="0000 0000 0000 0000"
                          value={pay.number}
                          onChange={(e) =>
                            setP(
                              "number",
                              e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 19)
                                .replace(/(.{4})/g, "$1 ")
                                .trim(),
                            )
                          }
                          aria-invalid={!!errors.number}
                        />
                      </div>
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Expiry" error={errors.expiry}>
                        <input
                          className="field tabular-nums"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          placeholder="MM/YY"
                          value={pay.expiry}
                          onChange={(e) => {
                            const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                            setP("expiry", d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                          }}
                          aria-invalid={!!errors.expiry}
                        />
                      </Field>
                      <Field label="Security code" error={errors.cvc}>
                        <input
                          className="field tabular-nums"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          maxLength={4}
                          value={pay.cvc}
                          onChange={(e) => setP("cvc", e.target.value.replace(/\D/g, ""))}
                          aria-invalid={!!errors.cvc}
                        />
                      </Field>
                    </div>
                    <button
                      type="button"
                      className="link-gold justify-self-start text-sm"
                      onClick={() => {
                        setPay({
                          name: ship.fullName || "Test Customer",
                          number: "4242 4242 4242 4242",
                          expiry: "12/30",
                          cvc: "123",
                        });
                        setErrors({});
                      }}
                    >
                      Fill in the test card
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-6">
                    <h2 className="font-display text-3xl">Review your order</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-white/10 p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-xl text-gold-soft">Delivery</h3>
                          <button type="button" onClick={() => setStep(0)} className="link-gold text-sm">
                            Edit
                          </button>
                        </div>
                        <p className="mt-2 text-mist">
                          {ship.fullName}
                          <br />
                          {ship.address}
                          <br />
                          {isTR
                            ? `${ship.district}, ${ship.province} ${ship.postal}`
                            : `${ship.city} ${ship.postal}, ${ship.country}`}
                          <br />
                          {ship.phone}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-xl text-gold-soft">Payment</h3>
                          <button type="button" onClick={() => setStep(1)} className="link-gold text-sm">
                            Edit
                          </button>
                        </div>
                        <p className="mt-2 text-mist">
                          {cardBrand(pay.number)} ending in {pay.number.replace(/\s/g, "").slice(-4)}
                          <br />
                          {pay.name}
                          <br />
                          Expires {pay.expiry}
                        </p>
                      </div>
                    </div>
                    {options.giftWrap && (
                      <p className="text-mist">Gift wrapping included ({formatPrice(GIFT_WRAP_FEE)}).</p>
                    )}
                    <p className="flex items-center gap-2 text-sm text-steel">
                      <Lock size={14} /> Demonstration checkout. No payment will be taken.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="btn btn-ghost"
                  disabled={processing}
                >
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <Link href="/cart" className="btn btn-ghost">
                  <ArrowLeft size={16} /> Back to bag
                </Link>
              )}
              {step < 2 ? (
                <button type="button" onClick={next} className="btn btn-gold">
                  {step === 0 ? "Continue to payment" : "Review order"}
                </button>
              ) : (
                <button type="button" onClick={placeOrder} disabled={processing} className="btn btn-gold">
                  {processing ? "Placing order…" : `Place order, ${formatPrice(total)}`}
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5" aria-label="Order summary">
          <Summary
            lines={lines}
            subtotal={subtotal}
            giftWrapFee={giftWrapFee}
            shipping={shippingCost}
            engraving={options.engraving}
          />
        </aside>
      </div>
    </div>
  );
}
