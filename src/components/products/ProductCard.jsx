
"use client";

import Link from "next/link";
import { ShoppingCart, Zap } from "lucide-react";

export default function ProductCard({ product }) {
  const image = product.images?.main;

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

  const isOutOfStock =
    product.stockStatus === "out_of_stock";

  const isNewArrival = product.isNewArrival === true;

  const formatPrice = (price) =>
    price.toLocaleString("en-BD");

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    console.log("Add to Cart:", product._id);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    console.log("Buy Now:", product._id);
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#E5E5E5] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#D8C8A0] hover:shadow-lg">

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
              className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105 sm:p-4"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#F7F6E9] text-sm text-gray-400">
              Image Not Found
            </div>
          )}

          {/* New Arrival Badge */}
          {isNewArrival && (
            <span className="absolute left-3 top-3 rounded-md bg-[#F58220] px-2 py-1 text-[10px] font-semibold text-white shadow-sm sm:text-xs">
              New Arrival
            </span>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute right-3 top-3 rounded-md bg-[#2DBD85] px-2 py-1 text-[10px] font-semibold text-white shadow-sm sm:text-xs">
              Save {discountPercentage}%
            </span>
          )}

          {/* Out of Stock */}
          {isOutOfStock && (
            <span className="absolute bottom-3 left-3 rounded-md bg-gray-800 px-2.5 py-1 text-xs font-semibold text-white">
              Out of Stock
            </span>
          )}
        </div>
      </Link>

      {/* Product Information */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-1 sm:px-3.5">

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className=" min-h-[30px] text-sm font-medium leading-5 text-[#242424] transition-colors group-hover:text-[#F58220]  sm:text-base sm:leading-5">
            {product.name}
          </h3>
        </Link>

        {/* Price - Reduced Gap */}
        <div className="flex  flex-wrap items-center gap-x-2 ">

          <span className="text-base font-bold text-[#F58220] sm:text-lg">
            ৳{formatPrice(currentPrice)}
          </span>

          {hasDiscount && (
            <span className="text-xs font-medium text-gray-400 line-through sm:text-sm">
              ৳{formatPrice(regularPrice)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-col gap-2 pt-3 sm:flex-row sm:gap-2">

          {/* Add To Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex w-full flex-1 items-center justify-center gap-1.5 rounded-md border border-[#F58220] bg-white px-2 py-2.5 text-xs font-semibold text-[#F58220] transition-all duration-300 hover:bg-[#F58220] hover:text-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 sm:text-sm"
          >
            <ShoppingCart size={16} />

            Add To Cart
          </button>

          {/* Buy Now */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="flex w-full flex-1 items-center justify-center gap-1.5 rounded-md bg-[#55532B] px-2 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#414021] disabled:cursor-not-allowed disabled:bg-gray-300 sm:text-sm"
          >
            <Zap size={16} />

            Buy Now
          </button>

        </div>
      </div>
    </div>
  );
}
