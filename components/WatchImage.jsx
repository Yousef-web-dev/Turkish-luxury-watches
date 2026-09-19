"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/format";
import WatchIllustration from "./WatchIllustration";

/** Product photo layered over a matching vector watch. If the photo loads it
 *  fades in; if it fails the illustration simply stays. */
export default function WatchImage({ product, index = 0, className, eager }) {
  const src = product.images[index % product.images.length];
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    const el = ref.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-linear-to-b from-navy to-gunmetal", className)}>
      <WatchIllustration
        look={product.look}
        chrono={product.category === "Automatic Chronograph"}
        className="absolute inset-0 h-full w-full"
      />
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt={`${product.title}, ${product.category.toLowerCase()} watch`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
