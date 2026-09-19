"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState } from "react";
import { Move3d } from "lucide-react";
import { DIALS, FINISHES } from "@/lib/watchConfig";
import { cn } from "@/lib/format";
import WatchIllustration from "./WatchIllustration";

const WatchViewer3D = dynamic(() => import("./WatchViewer3D"), {
  ssr: false,
  loading: () => <ViewerPlaceholder label="Preparing the 3D model" />,
});

const fallbackLook = { case: "#d9b25e", dial: "#0f1a33", strap: "#2b1a12", accent: "#e2c88a" };

function ViewerPlaceholder({ label }) {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="text-center">
        <WatchIllustration look={fallbackLook} chrono className="mx-auto h-56 w-44 opacity-60" />
        <p className="mt-2 text-sm text-steel">{label}</p>
      </div>
    </div>
  );
}

/** If WebGL is unavailable, fall back to the illustration rather than crash the page. */
class ViewerBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <ViewerPlaceholder label="3D preview is not supported on this device" />
    ) : (
      this.props.children
    );
  }
}

export default function WatchViewerSection() {
  const [finish, setFinish] = useState("gold");
  const [dial, setDial] = useState("midnight");
  const [active, setActive] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="container-x mt-32 grid items-center gap-10 lg:grid-cols-12" aria-labelledby="viewer-title">
      <div className="lg:col-span-4">
        <h2 id="viewer-title" className="font-display text-4xl leading-tight sm:text-5xl">
          Turn it over in your hands
        </h2>
        <p className="mt-5 max-w-md leading-relaxed text-mist">
          Drag to rotate the watch. The second hand is reading your local time right now, and every finish below is
          available on the collection.
        </p>

        <fieldset className="mt-8">
          <legend className="text-sm text-steel">Case finish</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.keys(FINISHES).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setFinish(k)}
                aria-pressed={finish === k}
                className={cn(
                  "flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm transition-colors",
                  finish === k
                    ? "border-gold bg-gold/10 text-gold-soft"
                    : "border-white/12 text-mist hover:border-white/30",
                )}
              >
                <span
                  className="h-4 w-4 rounded-full ring-1 ring-white/30"
                  style={{ background: FINISHES[k].swatch }}
                />
                {FINISHES[k].label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-sm text-steel">Dial</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.keys(DIALS).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setDial(k)}
                aria-pressed={dial === k}
                className={cn(
                  "flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm transition-colors",
                  dial === k
                    ? "border-gold bg-gold/10 text-gold-soft"
                    : "border-white/12 text-mist hover:border-white/30",
                )}
              >
                <span className="h-4 w-4 rounded-full ring-1 ring-white/30" style={{ background: DIALS[k].swatch }} />
                {DIALS[k].label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="lg:col-span-8">
        <div ref={box} className="glass glass-gold relative aspect-[4/3] overflow-hidden rounded-3xl sm:aspect-[16/11]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgb(201_164_92/0.16),transparent)]" />
          <ViewerBoundary>
            <WatchViewer3D finish={finish} dial={dial} active={active} />
          </ViewerBoundary>
          <p className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-xs text-mist backdrop-blur">
            <Move3d size={14} /> Drag to rotate
          </p>
        </div>
      </div>
    </section>
  );
}
