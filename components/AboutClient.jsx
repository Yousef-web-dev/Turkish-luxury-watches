"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import IstanbulPhoto from "./IstanbulPhoto";
import Skyline from "./Skyline";

const milestones = [
  {
    year: "1957",
    title: "One bench in the Grand Bazaar",
    text: "Our founder, Selim Aras, opens a repair bench a few lanes from Kapalıçarşı and begins restoring the pocket watches that arrive from across the empire's old trade routes.",
  },
  {
    year: "1974",
    title: "The first hand-wound caliber",
    text: "After years of rebuilding other makers' movements, the workshop designs its own manual-wind caliber, and the Kapalıçarşı model is born.",
  },
  {
    year: "1996",
    title: "Apprenticeships in the Swiss Jura",
    text: "The workshop begins sending its finishers to train alongside independent watchmakers in the Swiss Jura, bringing back the tolerances we still hold ourselves to.",
  },
  {
    year: "2008",
    title: "The Nişantaşı boutique opens",
    text: "A small boutique on Abdi İpekçi Caddesi gives collectors a place to try, size and talk about watches with the people who make them.",
  },
  {
    year: "2019",
    title: "Caliber BH-A21",
    text: "Our first in-house automatic movement is regulated in six positions and finished with a tulip-cut rotor.",
  },
  {
    year: "2025",
    title: "The diver collection",
    text: "From the Kız Kulesi 300 to the Marmara Deep 600, the divers prove that a Bosphorus watch is as at home in the sea as at dinner.",
  },
];

const pillars = [
  {
    title: "Turkish hands",
    text: "Case bevelling, dial finishing and strap stitching are done by artisans from families who have worked metal and leather in İstanbul for generations.",
  },
  {
    title: "Swiss discipline",
    text: "Every movement is timed in six positions and every case is pressure-tested. Nothing ships until it meets a standard we would be proud to put a name on.",
  },
  {
    title: "İstanbul light",
    text: "Our dials are designed around the way light moves across the Bosphorus, from the pale silver of dawn to the deep blue of the evening ferry.",
  },
];

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
    alt: "The Galata Tower rising above İstanbul rooftops",
    caption: "Galata, where the Galata Chronograph gets its name",
  },
  {
    src: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1200&q=80",
    alt: "The İstanbul skyline at sunset across the water",
    caption: "The Bosphorus at dusk",
  },
  {
    src: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80",
    alt: "The domes of a historic İstanbul mosque",
    caption: "Domes and minarets of the old city",
  },
];

export default function AboutClient() {
  const root = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.to("[data-skyline]", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: "[data-about-hero]", start: "top top", end: "bottom top", scrub: true },
        });

        gsap.fromTo(
          "[data-line]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: { trigger: "[data-timeline]", start: "top 65%", end: "bottom 65%", scrub: 0.4 },
          },
        );

        gsap.utils.toArray("[data-milestone]").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0.25 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 80%", end: "top 55%", scrub: true },
            },
          );
        });
      },
      root,
    );
    return () => mm.revert();
  }, []);

  return (
    <div ref={root}>
      <section data-about-hero className="relative isolate overflow-hidden pb-40 pt-36 sm:pt-44">
        <div data-skyline className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[22rem] text-midnight">
          <Skyline className="h-full w-full" />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60rem_30rem_at_70%_30%,rgb(20_32_66/0.9),transparent_70%)]" />
        <div className="container-x">
          <h1 className="max-w-4xl font-display text-[clamp(3rem,7vw,6rem)] font-light leading-[0.98]">
            Turkish craft, held to a Swiss tolerance.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-mist">
            Bosphorus Horology grew out of a single bench beside the Grand Bazaar. Almost seventy years later, the work
            is still done within walking distance of it.
          </p>
        </div>
      </section>

      <section className="container-x grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 className="font-display text-4xl sm:text-5xl">Where two watchmaking cultures meet</h2>
          <div className="mt-6 space-y-5 leading-relaxed text-mist">
            <p>
              İstanbul has always been a city of crossings, between Europe and Asia, between the old markets and the new
              boulevards. Our watches carry that in their design: warm metals and hand-finished surfaces from the
              bazaar, and the precision-first thinking we learned from the Jura.
            </p>
            <p>
              We make fewer watches than we could, because every one passes through the same few pairs of hands. It is
              slower, and it is the point.
            </p>
          </div>
        </div>
        <div className="lg:col-span-6">
          <IstanbulPhoto
            src="https://images.unsplash.com/photo-1636537511494-c3e558e0702b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aXN0YW5idWx8ZW58MHx8MHx8fDA%3D"
            alt="Rooftops and minarets of İstanbul in warm evening light"
            className="aspect-[5/4] rounded-3xl border border-gold/20"
          />
        </div>
      </section>

      <section className="container-x mt-32" aria-labelledby="timeline-title">
        <h2 id="timeline-title" className="font-display text-4xl sm:text-5xl">
          Seventy years at the bench
        </h2>
        <div data-timeline className="relative mt-14">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-white/12 md:left-1/2" aria-hidden="true">
            <div data-line className="h-full w-full origin-top bg-gold" />
          </div>
          <ol className="space-y-14">
            {milestones.map((m, i) => (
              <li
                key={m.year}
                data-milestone
                className={`relative pl-12 md:w-1/2 md:pl-0 ${i % 2 ? "md:ml-auto md:pl-14" : "md:pr-14 md:text-right"}`}
              >
                <span
                  className={`absolute top-2 h-3 w-3 rounded-full bg-gold shadow-glow left-[10px] md:left-auto ${i % 2 ? "md:-left-1.5" : "md:-right-1.5"}`}
                  aria-hidden="true"
                />
                <p className="font-display text-5xl text-gold-soft">{m.year}</p>
                <h3 className="mt-2 font-display text-2xl">{m.title}</h3>
                <p className="mt-2 leading-relaxed text-mist">{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-x mt-32 grid gap-6 md:grid-cols-3" aria-label="Our principles">
        {pillars.map((p) => (
          <div key={p.title} className="glass glass-gold rounded-2xl p-8">
            <h3 className="font-display text-3xl text-gold-soft">{p.title}</h3>
            <p className="mt-4 leading-relaxed text-mist">{p.text}</p>
          </div>
        ))}
      </section>

      <section className="container-x mt-32" aria-labelledby="city-title">
        <h2 id="city-title" className="font-display text-4xl sm:text-5xl">
          The city that names our watches
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {gallery.map((g, i) => (
            <figure key={g.src} className={i === 1 ? "md:mt-12" : ""}>
              <IstanbulPhoto src={g.src} alt={g.alt} className="aspect-[3/4] rounded-2xl border border-white/10" />
              <figcaption className="mt-3 text-sm text-mist">{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="container-x mt-32">
        <div className="glass glass-gold flex flex-col items-start justify-between gap-6 rounded-3xl p-8 sm:p-14 lg:flex-row lg:items-center">
          <h2 className="max-w-xl font-display text-4xl sm:text-5xl">Meet the workshop</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-gold">
              Visit the boutique
            </Link>
            <Link href="/products" className="btn btn-ghost">
              Browse the collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
