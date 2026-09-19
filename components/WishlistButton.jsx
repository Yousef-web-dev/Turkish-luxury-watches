"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/context/StoreProvider";
import { cn } from "@/lib/format";

export default function WishlistButton({ id, title, className }) {
  const { isWished, toggleWish } = useStore();
  const active = isWished(id);
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={() => toggleWish(id)}
      aria-pressed={active}
      aria-label={active ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition-colors",
        active
          ? "border-gold/70 bg-gold/20 text-gold-soft"
          : "border-white/15 bg-black/30 text-ivory hover:border-gold/60 hover:text-gold-soft",
        className,
      )}
    >
      <Heart size={18} className={active ? "fill-gold text-gold" : ""} />
    </motion.button>
  );
}
