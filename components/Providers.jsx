"use client";

import { MotionConfig } from "framer-motion";

import { StoreProvider } from "@/context/StoreProvider";

export default function Providers({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      <StoreProvider>{children}</StoreProvider>
    </MotionConfig>
  );
}
