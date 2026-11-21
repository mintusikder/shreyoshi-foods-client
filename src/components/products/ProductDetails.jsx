
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ShoppingCart,
  Zap,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  Package,
  CheckCircle,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useSession } from "@/lib/auth-client";
import RelatedProducts from "./RelatedProducts";

export default function ProductDetails({
  product,
  relatedProducts = [],
}) {
  const router = useRouter();

  const { addToCart, buyNow } = useCart();

  // Authentication
  const {
    data: session,
    isPending,
  } = useSession();

  const user = session?.user;

  // Only normal users can purchase
  const canPurchase =
    !isPending && user?.role === "user";

  // Product Gallery
  const gallery = [
    product.images?.main,
    ...(product.images?.gallery || []),
  ].filter(Boolean);

  const [selectedImage, setSelectedImage] = useState(
    gallery[0] || ""
  );

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Product Price
  const regularPrice = Number(product.regularPrice || 0);
  const salePrice = Number(product.salePrice || 0);

  const hasDiscount =
    salePrice > 0 && salePrice < regularPrice;

  const currentPrice = hasDiscount
    ? salePrice
    : regularPrice;

  const discount = hasDiscount
    ? Math.round(
        ((regularPrice - salePrice) / regularPrice) * 100
      )
    : 0;

  // Stock Management
  const hasStockQuantity =
    product.stockQuantity !== undefined &&
    product.stockQuantity !== null &&
    product.stockQuantity !== "";

  const stockQuantity = hasStockQuantity
    ? Number(product.stockQuantity)
    : null;

  const isOutOfStock =
    ["out_of_stock", "out of stock"].includes(
      String(product.stockStatus || "").toLowerCase()
    ) ||
    (hasStockQuantity && stockQuantity <= 0);

  const isLowStock =
    !isOutOfStock &&
    product.stockStatus === "low_stock";

  // Delivery Information
  const isFreeShipping =
    product.freeShipping === true ||
    product.freeShipping === "true";

  const deliveryCharge = Number(
    product.deliveryCharge || 0
  );

  // Price Formatter
  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-BD");

  // Contact Information
  const whatsappNumber = String(
    product.whatsappNumber || ""
  ).replace(/\D/g, "");

  const phoneNumber = String(
    product.phone || ""
  ).replace(/\D/g, "");

  // Quantity Handler
  const handleQuantity = (type) => {
    if (type === "increase") {
      if (
        stockQuantity === null ||
        quantity < stockQuantity
      ) {
        setQuantity((prev) => prev + 1);
      }
    }

    if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Add To Cart - Only User
  const handleAddToCart = () => {
    if (!canPurchase || isOutOfStock) return;

    addToCart(product, quantity);
  };

  // Buy Now - Only User
  const handleBuyNow = () => {
    if (!canPurchase || isOutOfStock) return;

    buyNow(product, quantity);

    router.push("/checkout");
  };

  // Gallery Image Change
  const changeImage = (direction) => {
    if (gallery.length <= 1) return;

    const currentIndex = gallery.indexOf(selectedImage);

    const nextIndex =
      direction === "next"
        ? (currentIndex + 1) % gallery.length
        : (currentIndex - 1 + gallery.length) % gallery.length;

    setSelectedImage(gallery[nextIndex]);
  };

  // Additional Product Details
  const additionalDetails = [
    ["Category", product.category],
    ["Brand", product.brand],
    ["SKU", product.sku],
    ["Weight / Volume", product.weightVolume],
    ["Packaging Type", product.packagingType],
    ["Ingredients", product.ingredients],
    ["Benefits", product.benefits],
    ["Product Weight", product.productWeight],
    ["Expiry Date", product.expiryDate],
    ["Storage Instructions", product.storageInstructions],
  ].filter(([, value]) => value);

  return (
    <main className="min-h-screen bg-[#FAFAF7] px-3 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-3">

      <div className="mx-auto max-w-[1450px]">

        {/* Breadcrumb */}
        <nav className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:mb-4">

          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#F58220]"
          >
            <Home size={14} />
            Home
          </Link>

          <ChevronRight size={13} />

          <Link
            href="/products"
            className="hover:text-[#F58220]"
          >
            Products
          </Link>

          <ChevronRight size={13} />

          <span className="max-w-[200px] truncate font-medium text-[#55532B]">
            {product.name}
          </span>
        </nav>

        {/* Main Product Section */}
        <section className="grid gap-4 rounded-xl border border-[#EAE8DF] bg-white p-3 shadow-sm sm:p-4 lg:grid-cols-2 lg:gap-5 lg:p-4">

          {/* Product Gallery */}
          <div className="min-w-0">

            <div className="flex flex-col-reverse gap-2.5 lg:flex-row">

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="flex shrink-0 gap-2 overflow-x-auto pb-1 lg:w-[72px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">

                  {gallery.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      aria-label={`View image ${index + 1}`}
                      className={`relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-md border bg-white transition sm:h-[68px] sm:w-[68px] lg:h-[72px] lg:w-full ${
                        selectedImage === image
                          ? "border-[#F58220] ring-1 ring-[#F58220]"
                          : "border-gray-200 hover:border-[#F58220]"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-contain p-1"
                      />

                      {selectedImage === image && (
                        <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F58220] text-white">
                          <CheckCircle size={11} />
                        </span>
                      )}
                    </button>
                  ))}

                </div>
              )}

              {/* Main Image */}
              <div className="group relative aspect-square min-w-0 flex-1 overflow-hidden rounded-lg border border-[#E5E5E5] bg-white sm:aspect-auto sm:h-[min(58vh,420px)] lg:h-[min(65vh,490px)]">

                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="h-full w-full object-contain p-2 sm:p-3"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    Image Not Available
                  </div>
                )}

                {/* Discount Badge */}
                {hasDiscount && (
                  <span className="absolute left-3 top-3 rounded-md bg-[#F58220] px-3 py-1 text-xs font-bold text-white">
                    {discount}% OFF
                  </span>
                )}

                {/* Gallery Navigation */}
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => changeImage("prev")}
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-[#F58220] hover:text-white"
                    >
                      <ChevronLeft size={19} />
                    </button>

                    <button
                      type="button"
                      onClick={() => changeImage("next")}
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-[#F58220] hover:text-white"
                    >
                      <ChevronRight size={19} />
                    </button>
                  </>
                )}

              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="flex min-w-0 flex-col">

            {/* Category */}
            {product.category && (
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#88865A]">
                {product.category}
              </p>
            )}

            {/* Product Name */}
            <h1 className="text-xl font-semibold leading-tight text-[#17201D] sm:text-2xl lg:text-[26px]">
              {product.name}
            </h1>

            {/* Brand */}
            {product.brand && (
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Brand:{" "}
                <span className="font-semibold text-[#55532B]">
                  {product.brand}
                </span>
              </p>
            )}

            {/* Price */}
            <div className="mt-2 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2.5">

              <span className="text-2xl font-bold text-[#F58220] sm:text-3xl">
                ৳{formatPrice(currentPrice)}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ৳{formatPrice(regularPrice)}
                  </span>

                  <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-bold text-[#F58220]">
                    Save {discount}%
                  </span>
                </>
              )}

            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="mt-2 text-sm leading-5 text-gray-600">
                {product.shortDescription}
              </p>
            )}

            {/* Stock Status */}
            <div className="mt-2">

              {isOutOfStock ? (
                <p className="flex items-center gap-2 text-sm font-semibold text-red-600">
                  <Package size={16} />
                  Out of Stock
                </p>
              ) : isLowStock ? (
                <p className="flex items-center gap-2 text-sm font-semibold text-orange-600">
                  <Package size={16} />
                  {stockQuantity !== null
                    ? `Only ${stockQuantity} items available`
                    : "Limited Stock"}
                </p>
              ) : (
                <p className="flex items-center gap-2 text-sm font-semibold text-green-700">
                  <CheckCircle size={16} />
                  In Stock
                </p>
              )}

            </div>

            {/* Quantity Selector */}
            <div className="mt-3 flex items-center gap-4">

              <span className="text-sm font-medium text-[#333]">
                Quantity:
              </span>

              <div className="flex h-9 items-center overflow-hidden rounded-md border border-gray-300 bg-white">

                <button
                  type="button"
                  onClick={() => handleQuantity("decrease")}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex h-full w-9 items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                >
                  <Minus size={15} />
                </button>

                <span className="min-w-9 text-center text-sm font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => handleQuantity("increase")}
                  disabled={
                    isOutOfStock ||
                    (stockQuantity !== null &&
                      quantity >= stockQuantity)
                  }
                  aria-label="Increase quantity"
                  className="flex h-full w-9 items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                >
                  <Plus size={15} />
                </button>

              </div>
            </div>

            {/* Action Buttons - Role Validation */}
            <div className="mt-3">

              {isPending ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="h-11 animate-pulse rounded-lg bg-gray-200" />
                  <div className="h-11 animate-pulse rounded-lg bg-gray-200" />
                </div>
              ) : canPurchase ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

                  {/* Add To Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#F58220] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#E87512] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingCart size={18} />
                    Add To Cart
                  </button>

                  {/* Buy Now */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#062421] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#0C3934] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Zap size={17} />
                    Buy Now
                  </button>

                </div>
              ) : (
                <div className="rounded-lg border border-[#EAE8DF] bg-[#FAFAF7] p-3 text-center">

                  {!user ? (
                    <>
                      <p className="text-sm font-medium text-gray-600">
                        Please login with a customer account to purchase this product.
                      </p>

                      <Link
                        href="/auth/login"
                        className="mt-2 inline-flex items-center justify-center rounded-lg bg-[#55532B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#777443]"
                      >
                        Login to Purchase
                      </Link>
                    </>
                  ) : (
                    <p className="text-sm font-medium text-gray-600">
                      Your account does not have permission to purchase products.
                    </p>
                  )}

                </div>
              )}

            </div>

            {/* Contact Buttons */}
            {(whatsappNumber || phoneNumber) && (
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">

                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `Hello, I want to order ${product.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[42px] items-center justify-center gap-2 rounded-lg bg-[#19A968] px-3 py-2 text-sm font-semibold text-white hover:bg-[#148C55]"
                  >
                    <MessageCircle size={17} />
                    Order On WhatsApp
                  </a>
                )}

                {phoneNumber && (
                  <a
                    href={`tel:${phoneNumber}`}
                    className="flex min-h-[42px] items-center justify-center gap-2 rounded-lg bg-[#24418C] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1D3472]"
                  >
                    <Phone size={17} />
                    Call For Order
                  </a>
                )}

              </div>
            )}

            {/* Delivery Information */}
            <div className="mt-3 grid gap-2 rounded-lg border border-[#EAE8DF] bg-[#FAFAF7] p-3">

              <div className="flex items-center gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#55532B]">
                  <Truck size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#333]">
                    Delivery Information
                  </p>

                  <p className="text-xs text-gray-500">
                    {isFreeShipping
                      ? "Free Shipping"
                      : `Delivery Charge: ৳${formatPrice(deliveryCharge)}`}
                  </p>
                </div>

              </div>

              <div className="h-px bg-[#EAE8DF]" />

              <div className="flex items-center gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#55532B]">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#333]">
                    Quality Products
                  </p>

                  <p className="text-xs text-gray-500">
                    Carefully selected for your needs.
                  </p>
                </div>

              </div>
            </div>

            {/* SKU */}
            {product.sku && (
              <p className="mt-2 text-xs text-gray-400">
                SKU: {product.sku}
              </p>
            )}

          </div>
        </section>

        {/* Product Description */}
        <section className="mt-4 rounded-xl border border-[#EAE8DF] bg-white p-4 shadow-sm sm:mt-5 sm:p-5">

          <h2 className="mb-3 border-b border-gray-100 pb-2 text-lg font-bold text-[#55532B]">
            Product Description
          </h2>

          <p className="whitespace-pre-line text-sm leading-6 text-gray-600">
            {product.description ||
              product.shortDescription ||
              "No description available."}
          </p>

        </section>

        {/* Product Information */}
        {additionalDetails.length > 0 && (
          <section className="mt-4 rounded-xl border border-[#EAE8DF] bg-white p-4 shadow-sm sm:p-5">

            <h2 className="mb-3 border-b border-gray-100 pb-2 text-lg font-bold text-[#55532B]">
              Product Information
            </h2>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">

              {additionalDetails.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-[#EEECE3] bg-[#FAFAF7] p-3"
                >
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#88865A]">
                    {label}
                  </p>

                  <p className="break-words text-sm font-semibold text-[#333]">
                    {value}
                  </p>
                </div>
              ))}

            </div>
          </section>
        )}

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />

      </div>
    </main>
  );
}
