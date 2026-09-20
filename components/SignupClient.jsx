"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { safeNext, useAuth } from "@/context/AuthProvider";
import { useStore } from "@/context/StoreProvider";
import { passwordIssues, validateEmail } from "@/lib/auth";
import AuthShell from "./AuthShell";
import Field from "./ui/Field";
import PasswordInput from "./ui/PasswordInput";

export default function SignupClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const { user, ready, signUp } = useAuth();
  const { notify } = useStore();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", terms: false });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

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
    if (form.name.trim().length < 2) er.name = "Enter your full name.";
    if (!validateEmail(form.email)) er.email = "Enter a valid email address, like name@example.com.";
    const issues = passwordIssues(form.password);
    if (issues.length) er.password = `Your password needs ${issues.join(", ")}.`;
    if (form.confirm !== form.password) er.confirm = "The two passwords do not match.";
    if (!form.terms) er.terms = "Accept the terms to create your account.";
    setErrors(er);
    if (Object.keys(er).length) return;

    setBusy(true);
    const res = await signUp({ name: form.name, email: form.email, password: form.password });
    setBusy(false);
    if (!res.ok) {
      if (res.field) setErrors({ [res.field]: res.error });
      else setFormError(res.error);
      return;
    }
    notify(`Welcome to Bosphorus Horology, ${res.user.name.split(" ")[0]}`);
    router.replace(next);
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Save watches, follow your orders and check out faster."
      footer={
        <>
          Already have an account?{" "}
          <Link href={next === "/account" ? "/login" : `/login?next=${encodeURIComponent(next)}`} className="link-gold">
            Log in
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

        <Field label="Full name" error={errors.name}>
          <input className="field" value={form.name} onChange={set("name")} autoComplete="name" aria-invalid={!!errors.name} />
        </Field>

        <Field
          label="Email"
          error={
            errors.email && errors.email.includes("already exists") ? (
              <>
                {errors.email}{" "}
                <Link href="/login" className="link-gold">
                  Log in instead
                </Link>
              </>
            ) : (
              errors.email
            )
          }
        >
          <input
            type="email"
            className="field"
            value={form.email}
            onChange={set("email")}
            autoComplete="email"
            aria-invalid={!!errors.email}
          />
        </Field>

        <Field label="Password" error={errors.password} hint="At least 8 characters, with a letter and a number.">
          <PasswordInput
            value={form.password}
            onChange={set("password")}
            autoComplete="new-password"
            invalid={!!errors.password}
            showStrength
          />
        </Field>

        <Field label="Confirm password" error={errors.confirm}>
          <PasswordInput value={form.confirm} onChange={set("confirm")} autoComplete="new-password" invalid={!!errors.confirm} />
        </Field>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-mist">
            <input
              type="checkbox"
              checked={form.terms}
              onChange={(e) => {
                setForm((f) => ({ ...f, terms: e.target.checked }));
                setErrors((er) => ({ ...er, terms: "" }));
              }}
              className="mt-0.5 h-4 w-4 accent-gold"
            />
            <span>I agree to the terms of service and privacy policy.</span>
          </label>
          {errors.terms && (
            <p role="alert" className="mt-1.5 text-sm text-danger">
              {errors.terms}
            </p>
          )}
        </div>

        <button type="submit" disabled={busy} className="btn btn-gold w-full !py-3.5">
          {busy ? "Creating your account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
