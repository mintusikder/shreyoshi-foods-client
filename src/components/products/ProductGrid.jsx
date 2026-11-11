
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  if (!products?.length) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold text-[#55532B]">
          No Products Found
        </h2>
        <p className="mt-2 text-gray-500">
          Products will appear here when available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
