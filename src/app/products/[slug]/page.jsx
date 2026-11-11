
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/api/products";
import ProductDetails from "@/components/products/ProductDetails";

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;

  let product;

  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    console.error("Product Details Error:", error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
