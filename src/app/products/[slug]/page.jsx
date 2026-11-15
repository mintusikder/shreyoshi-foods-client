
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getProducts,
} from "@/lib/api/products";

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

  // Get related products from the same category
  let relatedProducts = [];

  try {
    const allProducts = await getProducts();

    relatedProducts = allProducts
      .filter((item) => {
        const sameCategory =
          String(item.category || "").trim().toLowerCase() ===
          String(product.category || "").trim().toLowerCase();

        const differentProduct =
          String(item._id) !== String(product._id);

        const available =
          item.stockStatus !== "out_of_stock";

        return sameCategory && differentProduct && available;
      })
      .slice(0, 4);
  } catch (error) {
    console.error("Related Products Error:", error);
  }

  return (
    <ProductDetails
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
