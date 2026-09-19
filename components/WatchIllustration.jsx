import { useId } from "react";
import { polar, shade } from "@/lib/color";

/** A product-specific vector watch. Sits underneath every product photo,
 *  so a slow or failed image never leaves an empty box. */
export default function WatchIllustration({ look, chrono = false, className }) {
  const uid = useId().replace(/:/g, "");
  const cx = 200;
  const cy = 250;
  const dark = parseInt(look.dial.slice(1), 16) < 0x808080;
  const ticks = Array.from({ length: 12 }, (_, i) => i * 30);
  const mins = Array.from({ length: 60 }, (_, i) => i * 6);
  const hourEnd = polar(cx, cy, 52, 305);
  const minEnd = polar(cx, cy, 80, 60);
  const secEnd = polar(cx, cy, 86, 172);
  const secTail = polar(cx, cy, 18, 352);

  return (
    <svg viewBox="0 0 400 500" className={className} role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`c${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={shade(look.case, 0.35)} />
          <stop offset="0.5" stopColor={look.case} />
          <stop offset="1" stopColor={shade(look.case, -0.45)} />
        </linearGradient>
        <radialGradient id={`d${uid}`} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor={shade(look.dial, dark ? 0.22 : 0.35)} />
          <stop offset="1" stopColor={shade(look.dial, -0.3)} />
        </radialGradient>
        <linearGradient id={`s${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={shade(look.strap, -0.3)} />
          <stop offset="0.5" stopColor={shade(look.strap, 0.15)} />
          <stop offset="1" stopColor={shade(look.strap, -0.3)} />
        </linearGradient>
        <radialGradient id={`g${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={look.accent} stopOpacity="0.16" />
          <stop offset="1" stopColor={look.accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="500" fill={`url(#g${uid})`} opacity="0.7" />

      {/* strap */}
      <path d="M148 0 H252 L244 132 H156 Z" fill={`url(#s${uid})`} />
      <path d="M156 368 H244 L254 500 H146 Z" fill={`url(#s${uid})`} />
      <g stroke={shade(look.strap, 0.35)} strokeWidth="1.2" strokeDasharray="5 5" opacity="0.5" fill="none">
        <path d="M162 0 L166 128" />
        <path d="M238 0 L234 128" />
        <path d="M166 372 L162 500" />
        <path d="M234 372 L238 500" />
      </g>

      {/* crown + pushers */}
      <rect x="326" y="238" width="26" height="24" rx="4" fill={`url(#c${uid})`} />
      {chrono && (
        <>
          <rect x="318" y="196" width="18" height="12" rx="3" fill={`url(#c${uid})`} />
          <rect x="318" y="292" width="18" height="12" rx="3" fill={`url(#c${uid})`} />
        </>
      )}

      {/* case */}
      <rect x="150" y="110" width="30" height="46" rx="8" fill={shade(look.case, -0.25)} />
      <rect x="220" y="110" width="30" height="46" rx="8" fill={shade(look.case, -0.25)} />
      <rect x="150" y="344" width="30" height="46" rx="8" fill={shade(look.case, -0.25)} />
      <rect x="220" y="344" width="30" height="46" rx="8" fill={shade(look.case, -0.25)} />
      <circle cx={cx} cy={cy} r="132" fill={`url(#c${uid})`} />
      <circle cx={cx} cy={cy} r="118" fill={shade(look.case, -0.35)} />
      <circle cx={cx} cy={cy} r="112" fill={`url(#c${uid})`} opacity="0.85" />

      {/* dial */}
      <circle cx={cx} cy={cy} r="100" fill={`url(#d${uid})`} />
      <g stroke={look.accent} opacity="0.35" strokeWidth="1">
        {mins.map((a) => {
          const [x1, y1] = polar(cx, cy, 96, a);
          const [x2, y2] = polar(cx, cy, 91, a);
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      <g stroke={look.accent} strokeWidth="4" strokeLinecap="round">
        {ticks.map((a) => {
          const [x1, y1] = polar(cx, cy, 90, a);
          const [x2, y2] = polar(cx, cy, 76, a);
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>

      {chrono && (
        <g fill="none" stroke={look.accent} strokeWidth="1.5" opacity="0.7">
          <circle cx={cx - 38} cy={cy} r="20" />
          <circle cx={cx + 38} cy={cy} r="20" />
          <circle cx={cx} cy={cy + 42} r="20" />
        </g>
      )}

      <text
        x={cx}
        y={cy - 48}
        textAnchor="middle"
        fontSize="9"
        letterSpacing="3"
        fill={look.accent}
        opacity="0.85"
        fontFamily="Georgia, serif"
      >
        BOSPHORUS
      </text>

      {/* hands */}
      <g stroke={look.accent} strokeLinecap="round">
        <line x1={cx} y1={cy} x2={hourEnd[0]} y2={hourEnd[1]} strokeWidth="6" />
        <line x1={cx} y1={cy} x2={minEnd[0]} y2={minEnd[1]} strokeWidth="4" />
        <line x1={secTail[0]} y1={secTail[1]} x2={secEnd[0]} y2={secEnd[1]} strokeWidth="1.4" opacity="0.9" />
      </g>
      <circle cx={cx} cy={cy} r="6" fill={look.accent} />
      <circle cx={cx} cy={cy} r="2.4" fill={shade(look.dial, -0.5)} />

      {/* glass reflection */}
      <path d="M118 210 A100 100 0 0 1 250 160 L200 250 Z" fill="#fff" opacity="0.05" />
    </svg>
  );
}
