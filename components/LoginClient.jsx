"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { safeNext, useAuth } from "@/context/AuthProvider";
import { useStore } from "@/context/StoreProvider";
import { validateEmail } from "@/lib/auth";
import AuthShell from "./AuthShell";
import Field from "./ui/Field";
import PasswordInput from "./ui/PasswordInput";

export default function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const { user, ready, logIn, logInDemo } = useAuth();
  const { notify } = useStore();

  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  // already signed in? go straight to the destination
  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
    setFormError("");
  };

  async function submit(e) {
    e.preventDefault();
    const er = {};
    if (!validateEmail(form.email)) er.email = "Enter a valid email address, like name@example.com.";
    if (!form.password) er.password = "Enter your password.";
    setErrors(er);
    if (Object.keys(er).length) return;

    setBusy(true);
    const res = await logIn(form);
    setBusy(false);
    if (!res.ok) return setFormError(res.error);
    notify(`Welcome back, ${res.user.name.split(" ")[0]}`);
    router.replace(next);
  }

  async function demo() {
    setBusy(true);
    const res = await logInDemo();
    setBusy(false);
    if (!res.ok) return setFormError(res.error);
    notify(`Welcome, ${res.user.name.split(" ")[0]}`);
    router.replace(next);
  }

  return (
    <AuthShell
      title="Log in"
      subtitle="Welcome back. Log in to see your bag, wishlist and orders."
      footer={
        <>
          New to Bosphorus Horology?{" "}
          <Link href={next === "/account" ? "/signup" : `/signup?next=${encodeURIComponent(next)}`} className="link-gold">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="grid gap-5">
        {formError && (
          <p role="alert" className="flex items-start gap-2.5 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            {formError}
          </p>
        )}

        <Field label="Email" error={errors.email}>
          <input
            type="email"
            className="field"
            value={form.email}
            onChange={set("email")}
            autoComplete="email"
            aria-invalid={!!errors.email}
          />
        </Field>

        <Field label="Password" error={errors.password}>
          <PasswordInput
            value={form.password}
            onChange={set("password")}
            autoComplete="current-password"
            invalid={!!errors.password}
          />
        </Field>

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2.5 text-mist">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(e) => setForm((f) => ({ ...f, remember: e.target.checked }))}
              className="h-4 w-4 accent-gold"
            />
            Keep me logged in
          </label>
          <Link href="/forgot-password" className="link-gold">
            Forgot your password?
          </Link>
        </div>

        <button type="submit" disabled={busy} className="btn btn-gold w-full !py-3.5">
          {busy ? "Logging in…" : "Log in"}
        </button>

        <div className="relative py-1 text-center text-sm text-steel">
          <span className="hairline absolute inset-x-0 top-1/2" aria-hidden="true" />
          <span className="relative bg-[#141a2b] px-3">or</span>
        </div>

        <button type="button" onClick={demo} disabled={busy} className="btn btn-ghost w-full">
          Try the demo account
        </button>
        <p className="text-center text-xs text-steel">
          The demo account is created in this browser only, so you can explore the account pages.
        </p>
      </form>
    </AuthShell>
  );
}
