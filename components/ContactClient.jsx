"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock, Mail, MapPin, Phone } from "lucide-react";
import Field from "./ui/Field";

const topics = [
  "Book a boutique fitting",
  "Order or shipping",
  "Engraving or gifting",
  "Warranty and service",
  "Press and partnerships",
];

const hours = [
  ["Monday to Friday", "10:00 to 20:00"],
  ["Saturday", "10:00 to 19:00"],
  ["Sunday", "By appointment"],
];

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", topic: topics[0], date: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (k in errors) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  function submit(e) {
    e.preventDefault();
    const er = {};
    if (form.name.trim().length < 2) er.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Enter a valid email address, like name@example.com.";
    if (form.message.trim().length < 10) er.message = "Tell us a little more, at least 10 characters.";
    setErrors(er);
    if (Object.keys(er).length) return;
    setStatus("sending");
    // Demo only: wire this to your API route or email service.
    setTimeout(() => setStatus("sent"), 900);
  }

  return (
    <div className="container-x pb-8 pt-32 sm:pt-40">
      <header className="max-w-3xl">
        <h1 className="font-display text-5xl sm:text-6xl">Talk to the workshop</h1>
        <p className="mt-5 text-lg text-mist">
          Questions about a watch, an order or a fitting? Write to us, or come and see us in Nişantaşı.
        </p>
      </header>

      <div className="mt-12 grid gap-8 lg:grid-cols-12">
        <div className="glass glass-gold rounded-3xl p-6 sm:p-10 lg:col-span-7">
          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid min-h-[26rem] place-content-center text-center"
                role="status"
              >
                <CheckCircle2 size={48} className="mx-auto text-gold" />
                <h2 className="mt-5 font-display text-4xl">Thank you, {form.name.split(" ")[0]}.</h2>
                <p className="mx-auto mt-3 max-w-sm text-mist">
                  We have your message and will reply to {form.email} within one business day.
                </p>
                <button
                  type="button"
                  className="btn btn-ghost mx-auto mt-8"
                  onClick={() => {
                    setForm({ name: "", email: "", topic: topics[0], date: "", message: "" });
                    setStatus("idle");
                  }}
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0 }} className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" error={errors.name}>
                    <input
                      className="field"
                      value={form.name}
                      onChange={set("name")}
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                    />
                  </Field>
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
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Topic">
                    <select className="field" value={form.topic} onChange={set("topic")}>
                      {topics.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Preferred date for a visit (optional)">
                    <input type="date" className="field" value={form.date} onChange={set("date")} />
                  </Field>
                </div>
                <Field label="Message" error={errors.message}>
                  <textarea
                    rows={6}
                    className="field resize-y"
                    value={form.message}
                    onChange={set("message")}
                    aria-invalid={!!errors.message}
                  />
                </Field>
                <button type="submit" disabled={status === "sending"} className="btn btn-gold justify-self-start">
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <aside className="space-y-6 lg:col-span-5" aria-label="Boutique details">
          <div className="glass rounded-3xl p-6 sm:p-8">
            <h2 className="font-display text-3xl text-gold-soft">Nişantaşı boutique</h2>
            <ul className="mt-5 space-y-4 text-mist">
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                <span>
                  Abdi İpekçi Caddesi, Nişantaşı
                  <br />
                  34365 Şişli, İstanbul, Türkiye
                </span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-gold" />
                <a className="hover:text-gold-soft" href="tel:+902120000000">
                  +90 212 000 00 00
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-gold" />
                <a className="hover:text-gold-soft" href="mailto:atelier@bosphorushorology.example">
                  atelier@bosphorushorology.example
                </a>
              </li>
              <li className="flex gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-gold" />
                <dl className="w-full space-y-1">
                  {hours.map(([d, h]) => (
                    <div key={d} className="flex justify-between gap-4">
                      <dt>{d}</dt>
                      <dd className="text-ivory">{h}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            </ul>
          </div>

          <div className="glass overflow-hidden rounded-3xl">
            <iframe
              title="Map of the Nişantaşı boutique in İstanbul"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=28.985%2C41.046%2C29.004%2C41.057&layer=mapnik&marker=41.0517%2C28.9946"
              className="h-72 w-full border-0"
              style={{ filter: "invert(0.92) hue-rotate(180deg) saturate(0.55) brightness(0.9) contrast(0.95)" }}
            />
          </div>
          <p className="text-sm text-steel">
            Address and phone number shown here are sample details for this demonstration storefront.
          </p>
        </aside>
      </div>
    </div>
  );
}
