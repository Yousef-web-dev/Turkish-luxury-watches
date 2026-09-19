export const MAX_PER_ORDER = 3;
export const GIFT_WRAP_FEE = 25;
export const GLOBAL_SHIPPING = 65;
export const GLOBAL_FREE_THRESHOLD = 2500;
export const ENGRAVING_MAX_CHARS = 24;

export function shippingFor(region, subtotal) {
  if (subtotal === 0) return 0;
  if (region === "TR") return 0;
  return subtotal >= GLOBAL_FREE_THRESHOLD ? 0 : GLOBAL_SHIPPING;
}
