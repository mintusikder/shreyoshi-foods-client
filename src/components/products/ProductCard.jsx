
"use client";

import Link from "next/link";
import { ShoppingCart, Zap } from "lucide-react";

export default function ProductCard({ product }) {
  const image = product.images?.main;

  // Your MongoDB Product Structure
  const regularPrice = Number(product.regularPrice || 0);
  const salePrice = Number(product.salePrice || 0);

  const hasDiscount =
    salePrice > 0 && regularPrice > salePrice;

  const currentPrice = hasDiscount ? salePrice : regularPrice;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((regularPrice - salePrice) / regularPrice) * 100
      )
    : 0;

  const isOutOfStock = product.stockStatus === "out_of_stock";

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    console.log("Add to Cart:", product._id);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    console.log("Buy Now:", product._id);
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-[#E8E5D5] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#F7F6E9]">

          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              Image Not Found
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
              {discountPercentage}% OFF
            </span>
          )}

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <span className="absolute bottom-3 left-3 rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-white">
              Out of Stock
            </span>
          )}
        </div>

        {/* Product Information */}
        <div className="p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#88865A]">
            {product.category}
          </p>

          <h3 className="line-clamp-2 min-h-12 font-semibold text-[#55532B] transition-colors group-hover:text-[#88865A]">
            {product.name}
          </h3>

          {/* Price */}
          <div className=" flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-[#55532B]">
              ৳{currentPrice.toLocaleString("en-BD")}
            </span>

            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                ৳{regularPrice.toLocaleString("en-BD")}
              </span>
            )}
          </div>

          {hasDiscount && (
            <p className="mt-1 text-xs font-medium text-green-700">
              You Save ৳
              {(regularPrice - salePrice).toLocaleString("en-BD")}
            </p>
          )}
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="flex gap-2 px-3 pb-4">

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#55532B] px-2 py-2.5 text-xs font-semibold text-[#55532B] transition hover:bg-[#F7F6E9] disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#55532B] px-2 py-2.5 text-xs font-semibold text-white transition hover:bg-[#414021] disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
        >
          <Zap size={16} />
          Buy Now
        </button>

      </div>
    </div>
  );
}
