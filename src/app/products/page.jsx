import { getProducts } from "@/lib/api/products";
import ProductGrid from "@/components/products/ProductGrid";

export default async function ProductsPage() {
  let products = [];

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Products Fetch Error:", error);
  }

  return (
    <main className="min-h-screen bg-[#FFFEF7] px-4 py-12 md:px-8">
      <div className="mx-auto ">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[3px] text-[#77764A]">
            Shreyoshi Foods
          </p>

          <h1 className="text-3xl font-bold text-[#55532B] md:text-4xl">
            Our Products
          </h1>

          <p className="mt-3 text-gray-500">
            Discover our natural and quality food products.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </main>
  );
}