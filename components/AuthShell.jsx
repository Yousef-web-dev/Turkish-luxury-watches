import { Heart, PackageCheck, Zap } from "lucide-react";
import Skyline from "./Skyline";

const perks = [
  { icon: Heart, text: "Keep your wishlist and bag with your account" },
  { icon: Zap, text: "Check out faster with your details filled in" },
  { icon: PackageCheck, text: "See every order and its status in one place" },
];

/** Two-column layout shared by the login, sign-up and password pages. */
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="container-x pb-8 pt-28 sm:pt-36">
      <div className="glass glass-gold mx-auto grid max-w-5xl overflow-hidden rounded-3xl lg:grid-cols-[1fr_1.1fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-midnight/60 p-10 lg:flex">
          <div>
            <p className="font-display text-4xl leading-tight">Your watches, kept in one place.</p>
            <ul className="mt-8 space-y-5">
              {perks.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-mist">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/30 text-gold">
                    <Icon size={15} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <Skyline className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full text-black/40" />
        </aside>

        <section className="p-6 sm:p-10">
          <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-3 text-mist">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <p className="mt-8 text-center text-sm text-mist">{footer}</p>}
        </section>
      </div>
    </div>
  );
}
