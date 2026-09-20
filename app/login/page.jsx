import { Suspense } from "react";
import LoginClient from "@/components/LoginClient";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-x pt-40 text-mist">Loading…</div>}>
      <LoginClient />
    </Suspense>
  );
}
