"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/format";
import Skyline from "./Skyline";

/** Istanbul photograph with a drawn skyline behind it as a graceful fallback. */
export default function IstanbulPhoto({ src, alt, className, tint = "from-midnight via-navy to-gunmetal" }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <div className={cn("relative overflow-hidden bg-linear-to-b", tint, className)}>
      <Skyline className="absolute inset-x-0 bottom-0 h-1/2 w-full text-black/45" />
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
            loaded ? "opacity-90" : "opacity-0",
          )}
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-midnight/80 via-transparent to-midnight/30" />
    </div>
  );
}
