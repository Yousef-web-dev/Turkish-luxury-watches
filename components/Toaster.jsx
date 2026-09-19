"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useStore } from "@/context/StoreProvider";

export default function Toaster() {
  const { toast } = useStore();
  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass glass-gold pointer-events-auto flex items-center gap-3 rounded-full px-5 py-3 text-sm shadow-lift"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gold/20 text-gold-soft">
              <Check size={14} />
            </span>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
