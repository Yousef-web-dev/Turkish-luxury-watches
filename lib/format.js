const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const formatPrice = (n) => usd.format(n);

export const cn = (...parts) => parts.filter(Boolean).join(" ");
