
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Search,
  MapPinned,
  UserRound,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Home,
  ChevronRight,
  Package,
  Info,
  Phone,
  Leaf,
  LayoutGrid,
  Minus,
  Plus,
} from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";

const categories = [
  { name: "Home", href: "/", icon: Home },
  { name: "Mustard Oil", href: "/shop?category=mustard-oil" },
  { name: "Honey", href: "/shop?category=honey" },
  { name: "Ghee", href: "/shop?category=ghee" },
  { name: "Rice & Pulses", href: "/shop?category=rice-pulses" },
  { name: "Spices", href: "/shop?category=spices" },
  { name: "Dry Fruits", href: "/shop?category=dry-fruits" },
  { name: "Combo", href: "/shop?category=combo" },
  { name: "Organic Foods", href: "/shop?category=organic" },
  { name: "Popular", href: "/shop?category=popular" },
  { name: "All Products", href: "/shop" },
];

export default function Navbar() {
  const router = useRouter();

  const {
    data: session,
    isPending,
    refetch,
  } = useSession();

  const user = session?.user;

  // Cart Context
  const {
    cartItems = [],
    cartCount = 0,
    cartSubtotal = 0,
    updateQuantity,
    removeFromCart,
    checkoutCart,
    hydrated,
  } = useCart();

  // Local States
  const [search, setSearch] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Price Format
  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Open Cart Sidebar
  const handleCartClick = () => {
    setMobileOpen(false);
    setMoreOpen(false);
    setCartOpen(true);
  };

  // Close Cart Sidebar
  const closeCart = () => {
    setCartOpen(false);
  };

  // Continue to Checkout
  const handleContinue = () => {
    if (!hydrated || !cartItems.length) return;

    checkoutCart();
    setCartOpen(false);
    router.push("/checkout");
  };

  // Auth State Change
  useEffect(() => {
    const handleAuthChange = () => refetch?.();

    window.addEventListener("auth-state-changed", handleAuthChange);

    return () => {
      window.removeEventListener("auth-state-changed", handleAuthChange);
    };
  }, [refetch]);

  // Lock Body Scroll
  useEffect(() => {
    document.body.style.overflow =
      mobileOpen || cartOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, cartOpen]);

  // Search
  const handleSearch = (e) => {
    e.preventDefault();

    const searchValue = search.trim();

    if (!searchValue) return;

    router.push(`/shop?search=${encodeURIComponent(searchValue)}`);

    setSearch("");
    setMoreOpen(false);
    setMobileOpen(false);
    setCartOpen(false);
  };

  // Logout
  const handleSignOut = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        console.error("Logout failed:", error.message);
        return;
      }

      setMoreOpen(false);
      setMobileOpen(false);

      window.dispatchEvent(new Event("auth-state-changed"));

      await refetch?.();

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#55532B] text-[#FFFEF7] shadow-md">

      {/* ===================================== */}
      {/* MAIN NAVBAR */}
      {/* ===================================== */}

      <div className="mx-auto flex max-w-[1800px] items-center gap-5 px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex min-w-fit items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFEF7] text-[#55532B] sm:h-12 sm:w-12">
            <span className="text-2xl sm:text-3xl">🌿</span>
          </div>

          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-[#FFFEF7] sm:text-2xl">
              SHREYOSHI
              <span className="text-[#E8DCA9]"> FOODS</span>
            </h1>

            <p className="text-[8px] font-semibold tracking-[2px] text-[#F7F6E9] sm:text-[10px] sm:tracking-[3px]">
              PURE NATURE · PURE TASTE
            </p>
          </div>
        </Link>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="mx-4 hidden h-[55px] flex-1 items-center overflow-hidden rounded-xl bg-[#FFFEF7] p-1 lg:flex"
        >
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search in Shreyoshi Foods..."
            className="h-full flex-1 bg-transparent px-4 text-base text-[#55532B] outline-none placeholder:text-[#8B896B]"
          />

          <button
            type="submit"
            aria-label="Search"
            className="flex h-full w-[55px] items-center justify-center rounded-lg bg-[#55532B] text-[#FFFEF7] transition hover:bg-[#777443]"
          >
            <Search size={23} />
          </button>
        </form>

        {/* Desktop Right Actions */}
        <div className="ml-auto hidden items-center gap-5 lg:flex">

          {/* Order Track */}
          <Link
            href="/track-order"
            className="flex flex-col items-center gap-1 transition hover:text-[#E8DCA9]"
          >
            <MapPinned size={23} />
            <span className="text-xs font-medium">Order Track</span>
          </Link>

          {/* Account */}
          {isPending ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-white/20" />
          ) : user ? (
            <Link
              href="/dashboard"
              className="flex flex-col items-center gap-1 transition hover:text-[#E8DCA9]"
            >
              <UserRound size={24} />
              <span className="text-xs font-semibold">My Account</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="flex flex-col items-center gap-1 transition hover:text-[#E8DCA9]"
            >
              <UserRound size={24} />
              <span className="text-xs font-semibold">Login</span>
            </Link>
          )}

          {/* Desktop Cart Button */}
          <button
            type="button"
            onClick={handleCartClick}
            className="relative flex flex-col items-center gap-1 transition hover:text-[#E8DCA9]"
            aria-label={`Cart with ${cartCount} items`}
          >
            <div className="relative">
              <ShoppingCart size={25} />

              {hydrated && cartCount > 0 && (
                <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E8DCA9] px-1 text-[11px] font-bold text-[#55532B]">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>

            <span className="text-xs font-medium">Cart</span>

            <span className="text-[10px] text-[#E8DCA9]">
              ৳{formatPrice(cartSubtotal)}
            </span>
          </button>

          {/* More Button */}
          <button
            onClick={() => setMoreOpen((prev) => !prev)}
            aria-label="More menu"
            aria-expanded={moreOpen}
            className="flex flex-col items-center gap-1 transition hover:text-[#E8DCA9]"
          >
            {moreOpen ? <X size={25} /> : <Menu size={25} />}
            <span className="text-xs font-medium">More</span>
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8DCA9]/40 text-[#FFFEF7] transition hover:bg-white/10 lg:hidden"
        >
          <Menu size={27} />
        </button>
      </div>

      {/* ===================================== */}
      {/* DESKTOP CATEGORY NAVIGATION */}
      {/* ===================================== */}

      <div className="hidden border-t border-[#E8DCA9]/30 bg-[#F7F6E9] lg:block">
        <nav className="mx-auto flex max-w-[1800px] items-center gap-8 overflow-x-auto px-5 py-4 scrollbar-hide lg:justify-between lg:px-10">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="shrink-0 whitespace-nowrap text-sm font-semibold text-[#55532B] transition hover:text-[#9A8540]"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* ===================================== */}
      {/* DESKTOP MORE DROPDOWN */}
      {/* ===================================== */}

      {moreOpen && (
        <>
          <div
            className="fixed inset-0 z-40 hidden lg:block"
            onClick={() => setMoreOpen(false)}
          />

          <div className="absolute right-4 top-full z-50 mt-2 hidden w-60 overflow-hidden rounded-xl border border-[#E8DCA9] bg-[#FFFEF7] py-2 text-[#55532B] shadow-xl lg:block">
            {[
              { name: "About Us", href: "/about" },
              { name: "Our Process", href: "/process" },
              { name: "Contact Us", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                className="block px-5 py-3 text-sm font-medium transition hover:bg-[#F7F6E9]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </>
      )}

      {/* ===================================== */}
      {/* MOBILE OVERLAY */}
      {/* ===================================== */}

      <div
        onClick={closeMobileMenu}
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* ===================================== */}
      {/* MOBILE DRAWER */}
      {/* ===================================== */}

      <aside
        className={`fixed right-0 top-0 z-[70] flex h-[100dvh] w-[min(88%,380px)] flex-col bg-[#FFFEF7] text-[#55532B] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >

        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#E8E5D5] bg-[#55532B] px-5 py-4 text-white">

          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">🌿</span>

            <div>
              <h2 className="text-lg font-extrabold">
                SHREYOSHI <span className="text-[#E8DCA9]">FOODS</span>
              </h2>

              <p className="text-[8px] tracking-[2px] text-[#F7F6E9]">
                PURE NATURE · PURE TASTE
              </p>
            </div>
          </Link>

          <button
            onClick={closeMobileMenu}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          >
            <X size={23} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">

          {/* User Account */}
          <div className="mb-5 rounded-2xl bg-[#F7F6E9] p-4">
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#55532B] text-white">
                <UserRound size={24} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-bold text-[#55532B]">
                  {isPending
                    ? "Loading account..."
                    : user
                    ? user.name || "My Account"
                    : "Welcome to Shreyoshi Foods"}
                </p>

                <p className="truncate text-xs text-gray-500">
                  {isPending
                    ? "Please wait..."
                    : user
                    ? user.email
                    : "Login to manage your account"}
                </p>
              </div>
            </div>

            {!isPending && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={closeMobileMenu}
                      className="rounded-lg bg-[#55532B] py-2.5 text-center text-sm font-semibold text-white"
                    >
                      My Account
                    </Link>

                    <Link
                      href="/orders"
                      onClick={closeMobileMenu}
                      className="rounded-lg border border-[#55532B] py-2.5 text-center text-sm font-semibold text-[#55532B]"
                    >
                      My Orders
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={closeMobileMenu}
                      className="rounded-lg bg-[#55532B] py-2.5 text-center text-sm font-semibold text-white"
                    >
                      Login
                    </Link>

                    <Link
                      href="/auth/signup"
                      onClick={closeMobileMenu}
                      className="rounded-lg border border-[#55532B] py-2.5 text-center text-sm font-semibold text-[#55532B]"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Search */}
          <form
            onSubmit={handleSearch}
            className="mb-6 flex h-12 items-center overflow-hidden rounded-xl border border-[#E5E2D3] bg-white p-1"
          >
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
            />

            <button
              type="submit"
              aria-label="Search products"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#55532B] text-white"
            >
              <Search size={19} />
            </button>
          </form>

          {/* Quick Links */}
          <div className="mb-6 grid grid-cols-2 gap-3">

            {/* Mobile Cart Button */}
            <button
              type="button"
              onClick={handleCartClick}
              className="flex items-center gap-2 rounded-xl border border-[#E8E5D5] p-3 text-left transition hover:bg-[#F7F6E9]"
            >
              <div className="relative">
                <ShoppingCart size={19} />

                {hydrated && cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F58220] px-1 text-[9px] font-bold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">My Cart</p>
                <p className="text-[10px] text-gray-500">
                  ৳{formatPrice(cartSubtotal)}
                </p>
              </div>
            </button>

            <Link
              href="/track-order"
              onClick={closeMobileMenu}
              className="flex items-center gap-2 rounded-xl border border-[#E8E5D5] p-3 transition hover:bg-[#F7F6E9]"
            >
              <MapPinned size={19} />
              <span className="text-sm font-semibold">Track Order</span>
            </Link>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <LayoutGrid size={17} className="text-[#88865A]" />

              <h3 className="text-xs font-bold uppercase tracking-[2px] text-[#88865A]">
                Shop Categories
              </h3>
            </div>

            <div className="divide-y divide-[#E8E5D5] rounded-xl border border-[#E8E5D5] bg-white px-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between py-3 text-sm font-medium transition hover:text-[#9A8540]"
                >
                  <span className="flex items-center gap-2">
                    {category.name === "Home" && <Home size={16} />}
                    {category.name === "All Products" && <Package size={16} />}
                    {category.name === "Popular" && <Leaf size={16} />}
                    {category.name}
                  </span>

                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Information Links */}
          <div className="mb-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[2px] text-[#88865A]">
              Information
            </h3>

            <div className="space-y-1">
              <Link
                href="/about"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition hover:bg-[#F7F6E9]"
              >
                <Info size={18} />
                About Us
                <ChevronRight size={16} className="ml-auto" />
              </Link>

              <Link
                href="/process"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition hover:bg-[#F7F6E9]"
              >
                <Leaf size={18} />
                Our Process
                <ChevronRight size={16} className="ml-auto" />
              </Link>

              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition hover:bg-[#F7F6E9]"
              >
                <Phone size={18} />
                Contact Us
                <ChevronRight size={16} className="ml-auto" />
              </Link>
            </div>
          </div>

          {/* Logout */}
          {user && (
            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-xl border border-red-100 px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              <LogOut size={18} />
              {loggingOut ? "Signing Out..." : "Logout"}
            </button>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-[#E8E5D5] bg-[#F7F6E9] px-5 py-4 text-center">
          <p className="text-xs font-semibold tracking-wider text-[#55532B]">
            SHREYOSHI FOODS
          </p>

          <p className="mt-1 text-[10px] text-gray-500">
            PURE NATURE · PURE TASTE
          </p>
        </div>
      </aside>

      {/* ===================================== */}
      {/* SHOPPING CART OVERLAY */}
      {/* ===================================== */}

      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[80] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          cartOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* ===================================== */}
      {/* SHOPPING CART SIDEBAR */}
      {/* ===================================== */}

      <aside
        className={`fixed right-0 top-0 z-[90] flex h-[100dvh] w-full max-w-[500px] flex-col bg-white text-[#252525] shadow-2xl transition-transform duration-300 ease-in-out ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!cartOpen}
      >

        {/* Cart Header */}
        <div className="flex h-[65px] shrink-0 items-center justify-between border-b border-gray-200 px-6">
          <h2 className="text-lg font-bold uppercase tracking-wide">
            Shopping Cart
          </h2>

          <button
            onClick={closeCart}
            className="flex items-center gap-2 text-gray-700 transition hover:text-[#F58220]"
          >
            <span className="text-sm">Close</span>
            <X size={21} />
          </button>
        </div>

        {/* Cart Products */}
        <div className="flex-1 overflow-y-auto px-5 py-5">

          {!hydrated ? (
            <div className="py-10 text-center text-gray-500">
              Loading cart...
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingCart size={55} className="mb-4 text-gray-300" />

              <h3 className="text-lg font-bold">
                Your Cart is Empty
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                You haven't added any products yet.
              </p>

              <button
                onClick={() => {
                  closeCart();
                  router.push("/shop");
                }}
                className="mt-5 rounded-lg bg-[#F58220] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#df7117]"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                >

                  {/* Product Image */}
                  <div className="flex h-[75px] w-[75px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <Package size={28} className="text-gray-300" />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="min-w-0 flex-1">

                    <h3 className="truncate text-[15px] font-semibold text-gray-800">
                      {item.name}
                    </h3>

                    {/* Quantity and Price */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">

                      {/* Minus Plus */}
                      <div className="flex h-8 items-center overflow-hidden rounded-full border border-gray-300">

                        <button
                          type="button"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1
                            )
                          }
                          className="flex h-full w-8 items-center justify-center transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>

                        <span className="flex h-full min-w-7 items-center justify-center border-x border-gray-200 px-2 text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                          className="flex h-full w-8 items-center justify-center transition hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span className="text-sm text-gray-700">
                        × ৳{formatPrice(item.price)}
                      </span>
                    </div>

                    {/* Item Total */}
                    <p className="mt-1 text-sm font-bold text-gray-900">
                      ৳{formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Remove Product */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    aria-label={`Remove ${item.name}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <X size={22} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Bottom Section */}
        <div className="shrink-0 border-t border-gray-200 bg-[#F7F7F7] px-5 pb-6 pt-5">

          {/* Total */}
          <div className="mb-6 flex items-center justify-between">
            <span className="text-lg font-semibold">
              Total:
            </span>

            <span className="text-xl font-bold text-gray-900">
              ৳{formatPrice(cartSubtotal)}
            </span>
          </div>

          {/* Continue Checkout */}
          <button
            type="button"
            onClick={handleContinue}
            disabled={!hydrated || !cartItems.length}
            className="flex w-full items-center justify-center rounded-lg bg-[#F58220] py-3.5 text-base font-bold uppercase text-white transition hover:bg-[#df7117] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to Checkout
            <ChevronRight size={20} className="ml-2" />
          </button>

          {/* Continue Shopping */}
          <button
            type="button"
            onClick={() => {
              closeCart();
              router.push("/");
            }}
            className="mt-3 w-full text-center text-sm font-medium text-[#55532B] transition hover:underline"
          >
            Continue Shopping
          </button>
        </div>
      </aside>
    </header>
  );
}
