/** Lighten (amt > 0) or darken (amt < 0) a 6-digit hex colour. amt is -1..1 */
export function shade(hex, amt) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const target = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  const f = (c) => Math.round((target - c) * p + c);
  return `#${[f(r), f(g), f(b)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/** Point on a circle, angle measured clockwise from 12 o'clock */
export function polar(cx, cy, r, deg) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
