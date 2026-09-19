import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { getProduct, products, relatedProducts } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) return { title: "Watch not found" };
  return { title: p.title, description: p.description };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  return <ProductDetail product={product} related={relatedProducts(product, 4)} />;
}
