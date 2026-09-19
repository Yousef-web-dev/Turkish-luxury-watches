"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { polar } from "@/lib/color";

const CX = 300;

/** A large dial that reads the current time in Istanbul. */
export default function HeroDial({ className }) {
  const hourRef = useRef(null);
  const minRef = useRef(null);
  const secRef = useRef(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Istanbul",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    let raf = 0;
    let lastSecond = -1;

    const tick = () => {
      const now = new Date();
      const parts = fmt.formatToParts(now);
      const get = (t) => Number(parts.find((p) => p.type === t)?.value ?? 0);
      const h = get("hour") % 12;
      const m = get("minute");
      const s = get("second") + now.getMilliseconds() / 1000;
      const min = m + s / 60;
      const hr = h + min / 60;
      hourRef.current?.setAttribute("transform", `rotate(${hr * 30} ${CX} ${CX})`);
      minRef.current?.setAttribute("transform", `rotate(${min * 6} ${CX} ${CX})`);
      secRef.current?.setAttribute("transform", `rotate(${s * 6} ${CX} ${CX})`);
      const whole = Math.floor(s);
      if (whole !== lastSecond) {
        lastSecond = whole;
        setLabel(fmt.format(now));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const ring = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => {
        const a = i * 3;
        const major = i % 10 === 0;
        const five = i % 2 === 0;
        const [x1, y1] = polar(CX, CX, 286, a);
        const [x2, y2] = polar(CX, CX, major ? 262 : five ? 272 : 278, a);
        return { a, x1, y1, x2, y2, major, five };
      }),
    [],
  );

  const numerals = useMemo(
    () =>
      [
        { n: "12", a: 0 },
        { n: "3", a: 90 },
        { n: "6", a: 180 },
        { n: "9", a: 270 },
      ].map(({ n, a }) => {
        const [x, y] = polar(CX, CX, 222, a);
        return { n, x, y };
      }),
    [],
  );

  const batons = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => i * 30)
        .filter((a) => a % 90 !== 0)
        .map((a) => {
          const [x1, y1] = polar(CX, CX, 236, a);
          const [x2, y2] = polar(CX, CX, 206, a);
          return { a, x1, y1, x2, y2 };
        }),
    [],
  );

  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      role="img"
      aria-label={
        label ? `Analogue dial showing the time in Istanbul, ${label}` : "Analogue dial showing Istanbul time"
      }
    >
      <defs>
        <radialGradient id="hd-face" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#1a2542" />
          <stop offset="0.6" stopColor="#0d1428" />
          <stop offset="1" stopColor="#080c18" />
        </radialGradient>
        <linearGradient id="hd-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1dda6" />
          <stop offset="0.5" stopColor="#c9a45c" />
          <stop offset="1" stopColor="#8a5d2b" />
        </linearGradient>
        <radialGradient id="hd-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.7" stopColor="#c9a45c" stopOpacity="0" />
          <stop offset="1" stopColor="#c9a45c" stopOpacity="0.18" />
        </radialGradient>
        <filter id="hd-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.6" />
        </filter>
      </defs>

      <circle cx={CX} cy={CX} r="298" fill="url(#hd-glow)" />
      <circle cx={CX} cy={CX} r="292" fill="url(#hd-face)" stroke="url(#hd-gold)" strokeWidth="2" />
      <circle cx={CX} cy={CX} r="196" fill="none" stroke="rgb(201 164 92 / 0.22)" strokeWidth="1" />
      <circle cx={CX} cy={CX} r="150" fill="none" stroke="rgb(201 164 92 / 0.12)" strokeWidth="1" />

      {/* minute ring: rotated by GSAP as the page scrolls */}
      <g data-ring>
        {ring.map((t) => (
          <line
            key={t.a}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.major ? "#e2c88a" : "#c9a45c"}
            strokeOpacity={t.major ? 1 : t.five ? 0.6 : 0.3}
            strokeWidth={t.major ? 3 : 1.4}
            strokeLinecap="round"
          />
        ))}
      </g>

      {batons.map((b) => (
        <line
          key={b.a}
          x1={b.x1}
          y1={b.y1}
          x2={b.x2}
          y2={b.y2}
          stroke="url(#hd-gold)"
          strokeWidth="6"
          strokeLinecap="round"
        />
      ))}
      {numerals.map((n) => (
        <text
          key={n.n}
          x={n.x}
          y={n.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="54"
          fill="url(#hd-gold)"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 500 }}
        >
          {n.n}
        </text>
      ))}

      {/* Istanbul label */}
      <text
        x={CX}
        y={378}
        textAnchor="middle"
        fontSize="30"
        fontStyle="italic"
        fill="#e2c88a"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        İstanbul
      </text>
      <text
        x={CX}
        y={410}
        textAnchor="middle"
        fontSize="17"
        letterSpacing="2"
        fill="#8f97a8"
        style={{ fontFamily: "var(--font-manrope), system-ui, sans-serif", fontVariantNumeric: "tabular-nums" }}
      >
        {label || "00:00:00"}
      </text>

      {/* hands */}
      <g filter="url(#hd-shadow)">
        <g ref={hourRef}>
          <path
            d={`M${CX - 8} ${CX + 24} L${CX - 5} ${CX - 128} L${CX} ${CX - 152} L${CX + 5} ${CX - 128} L${CX + 8} ${CX + 24} Z`}
            fill="url(#hd-gold)"
          />
        </g>
        <g ref={minRef}>
          <path
            d={`M${CX - 6} ${CX + 28} L${CX - 3.5} ${CX - 208} L${CX} ${CX - 236} L${CX + 3.5} ${CX - 208} L${CX + 6} ${CX + 28} Z`}
            fill="#f2efe6"
          />
        </g>
        <g ref={secRef}>
          <rect x={CX - 1.2} y={CX - 262} width="2.400" height="320" fill="#e5786d" />
          <circle cx={CX} cy={CX - 196} r="7" fill="none" stroke="#e5786d" strokeWidth="2" />
        </g>
      </g>
      <circle cx={CX} cy={CX} r="11" fill="url(#hd-gold)" />
      <circle cx={CX} cy={CX} r="4" fill="#0a0f1d" />
    </svg>
  );
}
