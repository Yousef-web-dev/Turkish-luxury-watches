import { Suspense } from "react";
import ProductsClient from "@/components/ProductsClient";

export const metadata = {
  title: "The collection",
  description:
    "Browse chronographs, minimalist steel, vintage leather, gold-plated and diver watches from Bosphorus Horology.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-x pt-40 text-mist">Loading the collection…</div>}>
      <ProductsClient />
    </Suspense>
  );
}
