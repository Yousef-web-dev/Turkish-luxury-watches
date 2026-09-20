"use client";

import { MotionConfig } from "framer-motion";
import { AuthProvider } from "@/context/AuthProvider";
import { StoreProvider } from "@/context/StoreProvider";

export default function Providers({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <StoreProvider>{children}</StoreProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
