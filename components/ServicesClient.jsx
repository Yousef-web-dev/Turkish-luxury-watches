"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Gift, PenLine, ShieldCheck, Wrench } from "lucide-react";
import { cn } from "@/lib/format";
import { ENGRAVING_MAX_CHARS, GIFT_WRAP_FEE } from "@/lib/pricing";

/* ------------------------------------------------------------------ */
/* Engraving                                                          */
/* ------------------------------------------------------------------ */
const fonts = [
  {
    id: "serif",
    label: "Classic serif",
    css: "var(--font-cormorant), Georgia, serif",
    style: "normal",
    spacing: 3,
    size: 25,
    upper: true,
  },
  {
    id: "script",
    label: "Italic script",
    css: "var(--font-cormorant), Georgia, serif",
    style: "italic",
    spacing: 1,
    size: 30,
    upper: false,
  },
  {
    id: "sans",
    label: "Clean sans",
    css: "var(--font-manrope), system-ui, sans-serif",
    style: "normal",
    spacing: 4,
    size: 19,
    upper: true,
  },
];

function EngravingPreview() {
  const uid = useId().replace(/:/g, "");
  const [text, setText] = useState("For Ayşe, always on time");
  const [fontId, setFontId] = useState("script");
  const font = fonts.find((f) => f.id === fontId);
  const shown = (text.trim() || "Your words here").slice(0, ENGRAVING_MAX_CHARS);
  const display = font.upper ? shown.toUpperCase() : shown;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <div className="mx-auto w-full max-w-sm">
        <svg
          viewBox="0 0 400 400"
          className="h-auto w-full drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]"
          role="img"
          aria-label={`Caseback preview engraved with: ${shown}`}
        >
          <defs>
            <radialGradient id={`m${uid}`} cx="0.35" cy="0.3" r="0.9">
              <stop offset="0" stopColor="#f1e3bd" />
              <stop offset="0.55" stopColor="#c9a45c" />
              <stop offset="1" stopColor="#7a4f24" />
            </radialGradient>
            <path id={`t${uid}`} d="M 62 200 A 138 138 0 0 1 338 200" fill="none" />
            <path id={`b${uid}`} d="M 50 200 A 150 150 0 0 0 350 200" fill="none" />
          </defs>
          <circle cx="200" cy="200" r="192" fill={`url(#m${uid})`} />
          <circle cx="200" cy="200" r="176" fill="none" stroke="#7a4f24" strokeOpacity="0.5" strokeWidth="2" />
          <circle cx="200" cy="200" r="104" fill="none" stroke="#7a4f24" strokeOpacity="0.4" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="98" fill="#1a1a1f" opacity="0.92" />
          <circle cx="200" cy="200" r="98" fill="none" stroke="#e2c88a" strokeOpacity="0.5" />
          {/* movement hint */}
          <g stroke="#c9a45c" strokeOpacity="0.55" fill="none" strokeWidth="1.5">
            <circle cx="200" cy="200" r="60" />
            <circle cx="200" cy="200" r="30" />
            <path d="M200 140 L200 260 M140 200 L260 200" strokeOpacity="0.3" />
          </g>
          {[0, 1].map((k) => (
            <g key={k} transform={k === 0 ? "translate(0.8 0.8)" : undefined} opacity={k === 0 ? 0.55 : 1}>
              <text
                fill={k === 0 ? "#fff3cf" : "#4a2f12"}
                fontFamily={font.css}
                fontStyle={font.style}
                fontSize={font.size}
                letterSpacing={font.spacing}
              >
                <textPath href={`#t${uid}`} startOffset="50%" textAnchor="middle">
                  {display}
                </textPath>
              </text>
              <text
                fill={k === 0 ? "#fff3cf" : "#4a2f12"}
                fontFamily="var(--font-manrope), system-ui, sans-serif"
                fontSize="13"
                letterSpacing="5"
              >
                <textPath href={`#b${uid}`} startOffset="50%" textAnchor="middle">
                  BOSPHORUS HOROLOGY · İSTANBUL
                </textPath>
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div>
        <h3 className="font-display text-3xl">Preview your engraving</h3>
        <p className="mt-3 text-mist">
          Text engraving is complimentary, up to {ENGRAVING_MAX_CHARS} characters, cut into the caseback with a fine
          diamond point. We send a proof photo before we begin.
        </p>

        <label htmlFor="engrave" className="mt-6 block text-sm text-steel">
          Your message
        </label>
        <input
          id="engrave"
          value={text}
          maxLength={ENGRAVING_MAX_CHARS}
          onChange={(e) => setText(e.target.value)}
          className="field mt-2"
          placeholder="A name, a date, a few words"
        />
        <p className="mt-2 text-sm text-steel">
          {text.length} of {ENGRAVING_MAX_CHARS} characters
        </p>

        <fieldset className="mt-6">
          <legend className="text-sm text-steel">Lettering</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {fonts.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={fontId === f.id}
                onClick={() => setFontId(f.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  fontId === f.id
                    ? "border-gold bg-gold/10 text-gold-soft"
                    : "border-white/12 text-mist hover:border-white/30",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </fieldset>

        <Link href="/cart" className="btn btn-gold mt-8">
          <PenLine size={16} /> Add engraving in your bag
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Gift wrap                                                          */
/* ------------------------------------------------------------------ */
const boxes = [
  {
    id: "walnut",
    name: "Walnut presentation case",
    body: "#5a3a22",
    lid: "#6e4a2c",
    ribbon: "#c9a45c",
    text: "A hinged walnut case with a brass clasp and a suede-lined cushion. It doubles as a watch box for years afterwards.",
  },
  {
    id: "iznik",
    name: "Iznik-blue linen box",
    body: "#1f5f8b",
    lid: "#2a739f",
    ribbon: "#f0ebe1",
    text: "A linen-wrapped keepsake box in Iznik blue, tied with a cream silk ribbon and sealed with a gold wax stamp.",
  },
  {
    id: "midnight",
    name: "Midnight and gold foil",
    body: "#10182b",
    lid: "#1c2542",
    ribbon: "#e2c88a",
    text: "A rigid midnight box stamped in gold foil, with a handwritten card from the boutique tucked under the lid.",
  },
];

function GiftBox({ body, lid, ribbon }) {
  return (
    <svg viewBox="0 0 240 200" className="h-auto w-full" aria-hidden="true">
      <ellipse cx="120" cy="184" rx="88" ry="8" fill="#000" opacity="0.4" />
      <rect x="34" y="92" width="172" height="90" rx="6" fill={body} />
      <rect x="24" y="66" width="192" height="36" rx="6" fill={lid} />
      <rect x="111" y="66" width="18" height="116" fill={ribbon} />
      <rect x="24" y="78" width="192" height="12" fill={ribbon} opacity="0.85" />
      <path d="M120 66 C 92 34, 68 40, 84 60 C 96 72, 112 68, 120 66 Z" fill={ribbon} />
      <path d="M120 66 C 148 34, 172 40, 156 60 C 144 72, 128 68, 120 66 Z" fill={ribbon} />
      <circle cx="120" cy="64" r="7" fill={ribbon} stroke="#000" strokeOpacity="0.2" />
    </svg>
  );
}

function GiftWrap() {
  const [i, setI] = useState(0);
  const b = boxes[i];
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <div className="order-2 lg:order-1">
        <h3 className="font-display text-3xl">Choose how it arrives</h3>
        <p className="mt-3 text-mist">
          Every gift-wrapped order is packed by hand at the boutique for {`$${GIFT_WRAP_FEE}`}. Add it in your bag and
          we will include a note in your own words.
        </p>
        <div className="mt-6 space-y-2" role="tablist" aria-label="Packaging options">
          {boxes.map((x, idx) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={idx === i}
              onClick={() => setI(idx)}
              className={cn(
                "flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left transition-colors",
                idx === i ? "border-gold bg-gold/8" : "border-white/10 hover:border-white/25",
              )}
            >
              <span className="h-5 w-5 rounded-full ring-1 ring-white/30" style={{ background: x.body }} />
              <span className={idx === i ? "text-gold-soft" : "text-ivory"}>{x.name}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={b.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 min-h-16 leading-relaxed text-mist"
          >
            {b.text}
          </motion.p>
        </AnimatePresence>
        <Link href="/cart" className="btn btn-ghost mt-4">
          <Gift size={16} /> Add gift wrap in your bag
        </Link>
      </div>

      <div className="order-1 mx-auto w-full max-w-sm lg:order-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 20, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <GiftBox body={b.body} lid={b.lid} ribbon={b.ribbon} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Warranty                                                           */
/* ------------------------------------------------------------------ */
const faqs = [
  {
    q: "What does the five-year warranty cover?",
    a: "Manufacturing defects in the movement, case, dial and crystal, anywhere in the world. Normal wear to straps, and damage from accidents or unauthorised repairs, are not covered.",
  },
  {
    q: "How often should I have my watch serviced?",
    a: "We recommend a full service every five years for automatic and hand-wound watches. Your first service is complimentary during the warranty period, and quartz watches need only a battery change and seal check.",
  },
  {
    q: "How do I send a watch for service?",
    a: "Write to the workshop or bring it to the Nişantaşı boutique. We send an insured prepaid courier box to addresses outside İstanbul, and give a written estimate before any work begins.",
  },
  {
    q: "Can I resize the strap or bracelet?",
    a: "Yes. Sizing is complimentary at the boutique. Outside İstanbul, we include a sizing guide and spare links with every bracelet order.",
  },
  {
    q: "Can I return a watch?",
    a: "You may return an unworn watch within 14 days of delivery for a full refund. Engraved watches are made to order and cannot be returned unless faulty.",
  },
];

function Warranty() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: "Five-year warranty",
            text: "International cover for every watch, activated the day it is delivered.",
          },
          {
            icon: Wrench,
            title: "Free first service",
            text: "Cleaning, oiling, regulation and a fresh water-resistance test at the workshop.",
          },
          {
            icon: Check,
            title: "Lifetime parts",
            text: "We hold parts for every reference we have ever made, so a watch is never obsolete.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="glass rounded-2xl p-6">
            <Icon size={22} className="text-gold" />
            <h3 className="mt-4 font-display text-2xl">{title}</h3>
            <p className="mt-2 text-mist">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-2xl marker:hidden">
              {f.q}
              <ChevronDown
                size={20}
                className="shrink-0 text-gold transition-transform duration-300 group-open:rotate-180"
              />
            </summary>
            <p className="mt-3 max-w-3xl leading-relaxed text-mist">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
const tabs = [
  { id: "engraving", label: "Engraving", icon: PenLine },
  { id: "gift", label: "Gift wrapping", icon: Gift },
  { id: "warranty", label: "Warranty and care", icon: ShieldCheck },
];

export default function ServicesClient() {
  const [tab, setTab] = useState("engraving");

  return (
    <div className="container-x pb-8 pt-32 sm:pt-40">
      <header className="max-w-3xl">
        <h1 className="font-display text-5xl sm:text-6xl">Services for the watch, and the person</h1>
        <p className="mt-5 text-lg text-mist">
          A watch is often a gift or a milestone. We engrave it, wrap it and look after it for as long as you own it.
        </p>
      </header>

      <div className="mt-12 flex flex-wrap gap-2" role="tablist" aria-label="Services">
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
                layoutId="svc-tab"
                className="absolute inset-0 -z-10 rounded-full bg-gold/10"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      <div className="glass glass-gold mt-8 rounded-3xl p-6 sm:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="tabpanel"
          >
            {tab === "engraving" && <EngravingPreview />}
            {tab === "gift" && <GiftWrap />}
            {tab === "warranty" && <Warranty />}
          </motion.div>
        </AnimatePresence>
      </div>

      <section className="mt-20 grid gap-6 md:grid-cols-3" aria-label="Also available">
        {[
          ["Private fittings", "Book an hour with a watchmaker at the Nişantaşı boutique to try, size and compare."],
          [
            "Strap changes",
            "Swap leather for steel, or steel for rubber. We offer alternative straps for every reference.",
          ],
          ["Watch valuation", "Bring any Bosphorus watch to be appraised for insurance or trade-in towards a new one."],
        ].map(([title, text]) => (
          <div key={title} className="border-t border-gold/40 pt-5">
            <h3 className="font-display text-2xl">{title}</h3>
            <p className="mt-2 text-mist">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
