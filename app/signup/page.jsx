import { Suspense } from "react";
import SignupClient from "@/components/SignupClient";

export const metadata = { title: "Create your account" };

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="container-x pt-40 text-mist">Loading…</div>}>
      <SignupClient />
    </Suspense>
  );
}
