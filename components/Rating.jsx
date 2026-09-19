import { Star } from "lucide-react";

export default function Rating({ value, count }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-mist" aria-label={`Rated ${value} out of 5`}>
      <Star size={14} className="fill-gold text-gold" aria-hidden />
      <span className="font-medium text-ivory">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-steel">({count})</span>}
    </span>
  );
}
