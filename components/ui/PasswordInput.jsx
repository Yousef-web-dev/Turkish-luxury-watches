"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { passwordStrength } from "@/lib/auth";
import { cn } from "@/lib/format";

const barColor = ["", "bg-danger", "bg-gold/70", "bg-gold", "bg-ok"];

/** Password field with a show/hide toggle and an optional strength meter. */
export default function PasswordInput({ value, onChange, autoComplete, invalid, showStrength = false, placeholder }) {
  const [visible, setVisible] = useState(false);
  const { score, label } = passwordStrength(value);

  return (
    <>
      <span className="relative block">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          className="field !pr-12"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-steel transition-colors hover:text-gold-soft"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
      {showStrength && value && (
        <span className="mt-2.5 block" aria-live="polite">
          <span className="flex gap-1.5" aria-hidden="true">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={cn("h-1 flex-1 rounded-full transition-colors duration-300", i <= score ? barColor[score] : "bg-white/10")}
              />
            ))}
          </span>
          <span className="mt-1.5 block text-sm text-steel">Password strength: {label}</span>
        </span>
      )}
    </>
  );
}
