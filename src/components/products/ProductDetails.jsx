
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Zap,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  Package,
  CheckCircle,
} from "lucide-react";

export default function ProductDetails({ product }) {
  const gallery = [
    product.images?.main,
    ...(product.images?.gallery || []),
  ].filter(Boolean);

  const [selectedImage, setSelectedImage] = useState(
    gallery[0] || ""
  );
  const [quantity, setQuantity] = useState(1);

  const regularPrice = Number(product.regularPrice || 0);
  const salePrice = Number(product.salePrice || 0);

  const hasDiscount =
    salePrice > 0 && salePrice < regularPrice;

  const currentPrice = hasDiscount ? salePrice : regularPrice;

  const discount = hasDiscount
    ? Math.round(
        ((regularPrice - salePrice) / regularPrice) * 100
      )
    : 0;

  const stockQuantity = Number(product.stockQuantity || 0);

  const isOutOfStock =
    product.stockStatus === "out_of_stock" ||
    stockQuantity <= 0;

  const isLowStock =
    !isOutOfStock &&
    product.stockStatus === "low_stock";

  const isFreeShipping =
    product.freeShipping === true ||
    product.freeShipping === "true";

  const deliveryCharge = Number(product.deliveryCharge || 0);

  const handleQuantity = (type) => {
    if (type === "increase" && quantity < stockQuantity) {
      setQuantity((prev) => prev + 1);
    }

    if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    // TODO: Connect with your Cart System
    console.log("Add to Cart:", {
      productId: product._id,
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    // TODO: Connect with your Checkout System
    console.log("Buy Now:", {
      productId: product._id,
      quantity,
    });
  };

  return (
    <main className="min-h-screen bg-[#FFFEF7] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#55532B]">
            Home
          </Link>

          <span>/</span>

          <Link href="/products" className="hover:text-[#55532B]">
            Products
          </Link>

          <span>/</span>

          <span className="font-medium text-[#55532B]">
            {product.name}
          </span>
        </div>

        {/* Product Main Section */}
        <div className="grid gap-10 lg:grid-cols-2">

          {/* Product Images */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#E8E5D5] bg-[#F7F6E9]">

              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  Image Not Available
                </div>
              )}

              {hasDiscount && (
                <span className="absolute left-4 top-4 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Gallery */}
            {gallery.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                      selectedImage === image
                        ? "border-[#55532B]"
                        : "border-[#E8E5D5]"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[2px] text-[#88865A]">
              {product.category}
            </p>

            <h1 className="text-3xl font-bold leading-tight text-[#55532B] md:text-4xl">
              {product.name}
            </h1>

            {product.brand && (
              <p className="mt-3 text-sm text-gray-500">
                Brand: <span className="font-medium text-[#55532B]">{product.brand}</span>
              </p>
            )}

            {product.shortDescription && (
              <p className="mt-5 leading-7 text-gray-600">
                {product.shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="mt-6 rounded-xl border border-[#E8E5D5] bg-white p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold text-[#55532B]">
                  ৳{currentPrice.toLocaleString("en-BD")}
                </span>

                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ৳{regularPrice.toLocaleString("en-BD")}
                    </span>

                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>

              {hasDiscount && (
                <p className="mt-2 text-sm font-medium text-green-700">
                  You save ৳{(regularPrice - salePrice).toLocaleString("en-BD")}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-5">
              {isOutOfStock ? (
                <p className="flex items-center gap-2 text-sm font-semibold text-red-600">
                  <Package size={18} />
                  Out of Stock
                </p>
              ) : isLowStock ? (
                <p className="text-sm font-semibold text-orange-600">
                  Only {stockQuantity} items available
                </p>
              ) : (
                <p className="flex items-center gap-2 text-sm font-semibold text-green-700">
                  <CheckCircle size={18} />
                  In Stock
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-[#55532B]">
                Quantity
              </p>

              <div className="flex w-fit items-center overflow-hidden rounded-lg border border-[#E5E2D3] bg-white">
                <button
                  type="button"
                  onClick={() => handleQuantity("decrease")}
                  disabled={quantity <= 1}
                  className="p-3 text-[#55532B] hover:bg-[#F7F6E9] disabled:opacity-40"
                >
                  <Minus size={16} />
                </button>

                <span className="min-w-12 text-center font-semibold text-[#55532B]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => handleQuantity("increase")}
                  disabled={isOutOfStock || quantity >= stockQuantity}
                  className="p-3 text-[#55532B] hover:bg-[#F7F6E9] disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#55532B] px-5 py-4 font-semibold text-[#55532B] transition hover:bg-[#F7F6E9] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart size={19} />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#55532B] px-5 py-4 font-semibold text-white transition hover:bg-[#414021] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Zap size={19} />
                Buy Now
              </button>
            </div>

            {/* Shipping Information */}
            <div className="mt-7 space-y-4 rounded-xl border border-[#E8E5D5] bg-white p-5">
              <div className="flex items-center gap-3">
                <Truck className="text-[#77764A]" size={22} />
                <div>
                  <p className="text-sm font-semibold text-[#55532B]">
                    Delivery Information
                  </p>
                  <p className="text-sm text-gray-500">
                    {isFreeShipping
                      ? "Free Shipping"
                      : `Delivery Charge: ৳${deliveryCharge.toLocaleString("en-BD")}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#77764A]" size={22} />
                <div>
                  <p className="text-sm font-semibold text-[#55532B]">
                    Quality Products
                  </p>
                  <p className="text-sm text-gray-500">
                    Carefully selected for your needs.
                  </p>
                </div>
              </div>
            </div>

            {product.sku && (
              <p className="mt-5 text-xs text-gray-400">
                SKU: {product.sku}
              </p>
            )}
          </div>
        </div>

        {/* Product Description */}
        <section className="mt-16 rounded-2xl border border-[#E8E5D5] bg-white p-6 md:p-8">
          <h2 className="mb-5 text-2xl font-bold text-[#55532B]">
            Product Description
          </h2>

          <p className="whitespace-pre-line leading-8 text-gray-600">
            {product.description || product.shortDescription || "No description available."}
          </p>
        </section>

        {/* Additional Details */}
        <section className="mt-8 rounded-2xl border border-[#E8E5D5] bg-white p-6 md:p-8">
          <h2 className="mb-6 text-2xl font-bold text-[#55532B]">
            Product Information
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Category", product.category],
              ["Brand", product.brand],
              ["Weight / Volume", product.weightVolume],
              ["Packaging Type", product.packagingType],
              ["Ingredients", product.ingredients],
              ["Benefits", product.benefits],
              ["Product Weight", product.productWeight],
              ["Expiry Date", product.expiryDate],
              ["Storage Instructions", product.storageInstructions],
            ]
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl bg-[#F7F6E9] p-4"
                >
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#88865A]">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-[#55532B]">
                    {value}
                  </p>
                </div>
              ))}
          </div>
        </section>

      </div>
    </main>
  );
}
