import Link from "next/link";

export default function ProductCard({ product }) {
  const image = product.images?.main;

  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square bg-[#F7F6E9]">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              Image Not Found
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-[#55532B]">
            {product.name}
          </h3>

          <p>
            ৳{product.pricing?.salePrice || product.pricing?.regularPrice}
          </p>
        </div>
      </Link>
    </div>
  );
}