"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/format";

const items = [
  {
    quote:
      "I bought the Galata for my fortieth and it has not left my wrist since. The finishing sits comfortably next to watches at three times the price.",
    name: "Mert Aksoy",
    place: "İstanbul",
    watch: "Galata Chronograph",
  },
  {
    quote:
      "The engraving service was a delight. They sent a proof of the caseback before cutting anything, and the packaging alone made my father cry.",
    name: "Claire Dubois",
    place: "Lyon",
    watch: "Kapalıçarşı 1957",
  },
  {
    quote:
      "I dive with the Kız Kulesi 300 and wear it to dinner the same evening. The bracelet is superb and the lume is the best I have owned.",
    name: "Omar Haddad",
    place: "Dubai",
    watch: "Kız Kulesi Diver 300",
  },
  {
    quote:
      "Visiting the Nişantaşı boutique felt like being invited into a workshop. They sized the strap on the spot and served tea while I waited.",
    name: "Elif Kaya",
    place: "Berlin",
    watch: "Yıldız Royal",
  },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [paused]);

  const go = (d) => setI((v) => (v + d + items.length) % items.length);
  const t = items[i];

  return (
    <section
      className="container-x mt-32"
      aria-labelledby="testimonials-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <h2 id="testimonials-title" className="font-display text-4xl sm:text-5xl">
        Worn, and written about
      </h2>

      <div className="glass glass-gold relative mt-10 overflow-hidden rounded-3xl p-8 sm:p-14">
        <Quote size={56} className="absolute right-8 top-8 text-gold/15" aria-hidden />
        <div className="min-h-[15rem] sm:min-h-[12rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="max-w-3xl font-display text-2xl leading-snug sm:text-4xl">{t.quote}</blockquote>
              <figcaption className="mt-8 text-mist">
                <span className="font-semibold text-ivory">{t.name}</span>, {t.place}. Wears the {t.watch}.
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <div className="flex gap-2" role="tablist" aria-label="Choose a testimonial">
            {items.map((x, idx) => (
              <button
                key={x.name}
                type="button"
                role="tab"
                aria-selected={idx === i}
                aria-label={`Testimonial from ${x.name}`}
                onClick={() => setI(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  idx === i ? "w-10 bg-gold" : "w-4 bg-white/20 hover:bg-white/40",
                )}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 hover:border-gold/60"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 hover:border-gold/60"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
