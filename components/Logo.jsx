export function LogoMark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e2c88a" />
          <stop offset="1" stopColor="#9a6a38" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18.5" stroke="url(#lg)" strokeWidth="1.5" />
      <path d="M8 23c3.5-3 6.5-3 10 0s6.500 3 10.500 0" stroke="url(#lg)" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M11 28c3-2.500 5.500-2.500 9 0s5.500 2.500 9 0"
        stroke="url(#lg)"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path d="M20 7v5M20 12l4 5" stroke="url(#lg)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="flex items-center gap-3">
      <LogoMark />
      <span className="leading-none">
        <span className="block font-display text-[1.65rem] font-medium tracking-wide">Bosphorus</span>
        <span className="mt-0.5 block text-[0.68rem] tracking-[0.42em] text-gold">Horology</span>
      </span>
    </span>
  );
}
