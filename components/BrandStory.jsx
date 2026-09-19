"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { polar } from "@/lib/color";

const chapters = [
  {
    title: "The bench beside the Grand Bazaar",
    body: "Every Bosphorus watch begins as a drawing on a workbench a few lanes from Kapalıçarşı, where jewellers and watchmakers have traded side by side for generations. Cases are cut from 316L steel, then bevelled and brushed by hand.",
  },
  {
    title: "A movement built to cross continents",
    body: "Our calibers are designed in İstanbul and regulated in six positions over five days before they leave the bench. Each is adjusted until it runs within a few seconds a day, whichever side of the Bosphorus you wear it on.",
  },
  {
    title: "Finished to be handed down",
    body: "Dials are sunburst-brushed, gold is plated five microns thick, and straps are stitched and edge-painted one at a time. Every caseback is numbered and engraved with a tulip, the flower İstanbul plants by the million each spring.",
  },
];

const ticks = Array.from({ length: 72 }, (_, i) => i * 5);

export default function BrandStory() {
  const root = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const items = gsap.utils.toArray("[data-chapter]", root.current);
        const n = items.length;

        gsap.set(items, { autoAlpha: 0, y: 40 });
        gsap.set(items[0], { autoAlpha: 1, y: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * n * 0.85}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to("[data-story-ring]", { rotation: 360, svgOrigin: "200 200", duration: n }, 0);
        tl.to("[data-story-hand]", { rotation: 720, svgOrigin: "200 200", duration: n }, 0);
        tl.fromTo("[data-progress]", { scaleY: 0 }, { scaleY: 1, transformOrigin: "top", duration: n }, 0);

        for (let i = 1; i < n; i++) {
          tl.to(items[i - 1], { autoAlpha: 0, y: -40, duration: 0.3, ease: "power2.in" }, i - 0.3);
          tl.to(items[i], { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, i - 0.05);
        }

        // pinning measures the page; re-measure once the route transition settles
        const t = setTimeout(() => ScrollTrigger.refresh(), 700);
        return () => clearTimeout(t);
      },
      root,
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative mt-32 flex min-h-screen items-center overflow-hidden py-20"
      aria-labelledby="story-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50rem_30rem_at_20%_50%,rgb(16_24_43/0.9),transparent_70%)]" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <svg viewBox="0 0 400 400" className="mx-auto h-auto w-full max-w-md" aria-hidden="true">
            <circle cx="200" cy="200" r="190" fill="none" stroke="rgb(201 164 92 / 0.35)" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="120" fill="none" stroke="rgb(201 164 92 / 0.15)" />
            <g data-story-ring>
              {ticks.map((a) => {
                const [x1, y1] = polar(200, 200, 184, a);
                const [x2, y2] = polar(200, 200, a % 30 === 0 ? 160 : 172, a);
                return (
                  <line
                    key={a}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#c9a45c"
                    strokeOpacity={a % 30 === 0 ? 1 : 0.45}
                    strokeWidth={a % 30 === 0 ? 3 : 1.2}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
            <g data-story-hand>
              <line x1="200" y1="216" x2="200" y2="52" stroke="#e2c88a" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <circle cx="200" cy="200" r="7" fill="#c9a45c" />
          </svg>
        </div>

        <div className="lg:col-span-7">
          <h2 id="story-title" className="font-display text-4xl leading-tight sm:text-5xl">
            How a Bosphorus watch is made
          </h2>

          <div className="relative mt-10 flex gap-8">
            <div className="relative hidden w-px shrink-0 bg-white/12 motion-safe:block" aria-hidden="true">
              <div data-progress className="absolute inset-x-0 top-0 h-full origin-top bg-gold" />
            </div>

            <div className="relative w-full motion-safe:min-h-[19rem] sm:motion-safe:min-h-[16rem]">
              {chapters.map((c, i) => (
                <article
                  key={c.title}
                  data-chapter
                  className="mb-10 motion-safe:absolute motion-safe:inset-x-0 motion-safe:top-0 motion-safe:mb-0"
                >
                  <p className="text-sm text-gold">
                    Step {i + 1} of {chapters.length}
                  </p>
                  <h3 className="mt-2 font-display text-3xl sm:text-4xl">{c.title}</h3>
                  <p className="mt-4 max-w-xl leading-relaxed text-mist">{c.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
