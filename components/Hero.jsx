"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import HeroDial from "./HeroDial";

const lines = ["Time, kept", "between two", "continents."];
const ease = [0.22, 1, 0.36, 1];

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-ring]", { rotation: 80, svgOrigin: "300 300", ease: "none", scrollTrigger: st });
        gsap.to("[data-dial]", { yPercent: -10, scale: 0.92, ease: "none", scrollTrigger: st });
        gsap.to("[data-hero-copy]", { yPercent: -14, opacity: 0.15, ease: "none", scrollTrigger: st });
      },
      root,
    );
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative isolate overflow-hidden pb-24 pt-32 lg:pb-32 lg:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_78%_40%,rgb(20_32_66/0.85),transparent_70%)]" />

      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <div data-hero-copy className="lg:col-span-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="mb-6 text-sm text-gold"
          >
            Designed and finished in İstanbul
          </motion.p>

          <h1 className="font-display text-[clamp(3.4rem,8.4vw,7.2rem)] font-light leading-[0.95] tracking-tight">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.1em]">
                <motion.span
                  className="block"
                  initial={{ y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2 + i * 0.13, duration: 1.1, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.9, ease }}
            className="mt-8 max-w-md text-lg leading-relaxed text-mist"
          >
            Automatic movements assembled in İstanbul, cases finished by hand in the workshops beside the Grand Bazaar,
            and every watch tested to Swiss tolerances.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link href="/products" className="btn btn-gold">
              Shop the collection <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Book a fitting in Nişantaşı
            </Link>
          </motion.div>
        </div>

        <motion.div
          data-dial
          initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 1.6, ease }}
          className="relative mx-auto w-full max-w-[34rem] lg:col-span-6 lg:max-w-none"
        >
          <HeroDial className="h-auto w-full drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]" />
        </motion.div>
      </div>
    </section>
  );
}
