"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Info } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { passwordIssues, validateEmail } from "@/lib/auth";
import AuthShell from "./AuthShell";
import Field from "./ui/Field";
import PasswordInput from "./ui/PasswordInput";

export default function ForgotPasswordClient() {
  const { accountExists, resetPassword } = useAuth();
  const [step, setStep] = useState("email"); // email, reset, done
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function findAccount(e) {
    e.preventDefault();
    if (!validateEmail(email)) return setError("Enter a valid email address, like name@example.com.");
    if (!accountExists(email)) return setError("We can't find an account with that email. Check the spelling or create an account.");
    setError("");
    setStep("reset");
  }

  async function reset(e) {
    e.preventDefault();
    const issues = passwordIssues(password);
    if (issues.length) return setError(`Your new password needs ${issues.join(", ")}.`);
    setBusy(true);
    const res = await resetPassword(email, password);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setError("");
    setStep("done");
  }

  return (
    <AuthShell
      title={step === "done" ? "Password updated" : "Reset your password"}
      subtitle={step === "email" ? "Enter the email you signed up with." : undefined}
      footer={
        <Link href="/login" className="link-gold">
          Back to log in
        </Link>
      }
    >
      {step !== "done" && (
        <p className="mb-6 flex items-start gap-2.5 rounded-xl border border-gold/30 bg-gold/8 px-4 py-3 text-sm text-mist">
          <Info size={17} className="mt-0.5 shrink-0 text-gold" />
          Demo mode: no email is sent. A live store would send you a secure link, and you would set the new password from
          there.
        </p>
      )}

      {step === "email" && (
        <form onSubmit={findAccount} noValidate className="grid gap-5">
          <Field label="Email" error={error}>
            <input
              type="email"
              className="field"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoComplete="email"
              aria-invalid={!!error}
            />
          </Field>
          <button type="submit" className="btn btn-gold w-full !py-3.5">
            Continue
          </button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={reset} noValidate className="grid gap-5">
          <p className="text-mist">
            Choose a new password for <span className="text-ivory">{email}</span>.
          </p>
          <Field label="New password" error={error} hint="At least 8 characters, with a letter and a number.">
            <PasswordInput
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoComplete="new-password"
              invalid={!!error}
              showStrength
            />
          </Field>
          <button type="submit" disabled={busy} className="btn btn-gold w-full !py-3.5">
            {busy ? "Saving…" : "Save new password"}
          </button>
        </form>
      )}

      {step === "done" && (
        <div className="text-center">
          <CheckCircle2 size={48} className="mx-auto text-gold" />
          <p className="mt-4 text-mist">Your password has been changed. You can log in with it now.</p>
          <Link href="/login" className="btn btn-gold mt-6">
            Log in
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
