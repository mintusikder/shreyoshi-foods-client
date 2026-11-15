
"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function RelatedProducts({ products = [] }) {
  if (!products.length) return null;

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-BD");

  const handleAddToCart = (product) => {
    console.log("Add Related Product to Cart:", product._id);

    // Connect with your existing cart system
  };

  return (
    <section className="mt-6 rounded-xl border border-[#EAE8DF] bg-white p-3 shadow-sm sm:mt-8 sm:p-5">

      {/* Heading */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h2 className="text-lg font-bold text-[#55532B] sm:text-xl">
            Related Products
          </h2>

          <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
            You May Also Like
          </p>
        </div>

        <span className="text-xs font-medium text-gray-400">
          {products.length} Products
        </span>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">

        {products.map((product) => {
          const image = product.images?.main;

          const regularPrice = Number(
            product.regularPrice || 0
          );

          const salePrice = Number(
            product.salePrice || 0
          );

          const hasDiscount =
            salePrice > 0 && salePrice < regularPrice;

          const currentPrice = hasDiscount
            ? salePrice
            : regularPrice;

          const isOutOfStock =
            product.stockStatus === "out_of_stock";

          return (
            <div
              key={product._id}
              className="group flex min-w-0 flex-col overflow-hidden border border-[#E5E5E5] bg-white transition-all duration-300 hover:border-[#F58220] hover:shadow-md"
            >

              {/* Product Image */}
              <Link
                href={`/products/${product.slug}`}
                className="block"
              >
                <div className="relative aspect-square overflow-hidden bg-white">

                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105 sm:p-3"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                      Image Not Found
                    </div>
                  )}

                  {hasDiscount && (
                    <span className="absolute left-2 top-2 rounded-sm bg-[#F58220] px-1.5 py-1 text-[9px] font-bold text-white sm:text-[10px]">
                      {Math.round(
                        ((regularPrice - salePrice) /
                          regularPrice) *
                          100
                      )}
                      % OFF
                    </span>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="flex flex-1 flex-col p-2 sm:p-3">

                <Link href={`/products/${product.slug}`}>
                  <h3 className="line-clamp-2 min-h-[34px] text-xs font-medium leading-4 text-[#333] transition-colors hover:text-[#F58220] sm:min-h-[40px] sm:text-sm sm:leading-5">
                    {product.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="mt-1 flex flex-wrap items-center gap-1.5">

                  <span className="text-sm font-bold text-[#F58220] sm:text-base">
                    ৳{formatPrice(currentPrice)}
                  </span>

                  {hasDiscount && (
                    <span className="text-[10px] text-gray-400 line-through sm:text-xs">
                      ৳{formatPrice(regularPrice)}
                    </span>
                  )}
                </div>

                {/* Add To Cart */}
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  disabled={isOutOfStock}
                  className="mt-auto flex w-full items-center justify-center gap-1 rounded-sm border border-[#F58220] bg-white py-2 text-[10px] font-semibold text-[#F58220] transition hover:bg-[#F58220] hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 sm:mt-2 sm:text-xs"
                >
                  <ShoppingCart size={12} />
                  {isOutOfStock ? "Out of Stock" : "Add To Cart"}
                </button>

              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
