/** Stylised Istanbul silhouette: domes, minarets and the Galata Tower. */
function Dome({ cx, r, base }) {
  return (
    <g>
      <path d={`M${cx - r} ${base} A${r} ${r} 0 0 1 ${cx + r} ${base} Z`} />
      <rect x={cx - 2} y={base - r - 14} width="4" height="14" />
      <circle cx={cx} cy={base - r - 16} r="3.5" />
    </g>
  );
}

function Minaret({ x, base, h }) {
  const top = base - h;
  return (
    <g>
      <rect x={x - 4} y={top + 16} width="8" height={h - 16} />
      <rect x={x - 8} y={top + 34} width="16" height="5" />
      <path d={`M${x - 5} ${top + 16} L${x} ${top - 14} L${x + 5} ${top + 16} Z`} />
    </g>
  );
}

export default function Skyline({ className }) {
  return (
    <svg viewBox="0 0 1200 260" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g fill="currentColor">
        {/* Suleymaniye-style silhouette */}
        <Dome cx={190} r={64} base={200} />
        <Dome cx={118} r={34} base={200} />
        <Dome cx={262} r={34} base={200} />
        <Minaret x={50} base={200} h={150} />
        <Minaret x={330} base={200} h={150} />
        <rect x={60} y={190} width="270" height="20" />

        {/* Galata tower */}
        <rect x={480} y={70} width="34" height="130" />
        <rect x={472} y={64} width="50" height="10" />
        <path d="M478 64 L497 14 L516 64 Z" />

        {/* Hagia Sophia-style silhouette */}
        <Dome cx={700} r={86} base={196} />
        <Dome cx={615} r={44} base={196} />
        <Dome cx={785} r={44} base={196} />
        <Dome cx={660} r={26} base={196} />
        <Dome cx={740} r={26} base={196} />
        <Minaret x={555} base={200} h={170} />
        <Minaret x={845} base={200} h={170} />
        <rect x={570} y={188} width="260" height="22" />

        {/* Ortakoy / lower skyline */}
        <Dome cx={980} r={42} base={200} />
        <Dome cx={1050} r={26} base={200} />
        <Minaret x={920} base={200} h={120} />
        <Minaret x={1110} base={200} h={120} />
        <rect x={930} y={192} width="170" height="18" />

        {/* land + water */}
        <rect x="0" y="206" width="1200" height="54" opacity="0.9" />
      </g>
      <g stroke="rgb(201 164 92)" strokeOpacity="0.28" fill="none" strokeWidth="1">
        {Array.from({ length: 5 }, (_, i) => (
          <path
            key={i}
            d={`M0 ${222 + i * 9} q 30 -6 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0`}
          />
        ))}
      </g>
    </svg>
  );
}
