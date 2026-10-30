
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPinned,
  UserRound,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";

const categories = [
  { name: "Home", href: "/" },
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
  const [search, setSearch] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(search)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#55532B] text-[#FFFEF7] shadow-md">

      {/* Top Navbar */}
      <div className="mx-auto flex max-w-[1800px] items-center gap-5 px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex min-w-fit items-center gap-2"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFFEF7] text-[#55532B]">
            <span className="text-3xl">🌿</span>
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#FFFEF7] sm:text-2xl">
              SHREYOSHI
              <span className="text-[#E8DCA9]"> FOODS</span>
            </h1>

            <p className="text-[9px] font-semibold tracking-[3px] text-[#F7F6E9] sm:text-[10px]">
              PURE NATURE · PURE TASTE
            </p>
          </div>
        </Link>

        {/* Search Bar */}
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

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-3 sm:gap-5 lg:ml-0 lg:gap-7">

          {/* Order Track */}
          <Link
            href="/track-order"
            className="flex flex-col items-center gap-1 transition hover:text-[#E8DCA9]"
          >
            <MapPinned size={23} />
            <span className="hidden text-xs font-medium sm:block">
              Order Track
            </span>
          </Link>

          {/* Sign In */}
          <Link
            href="/auth/login"
            className="flex flex-col items-center gap-1 transition hover:text-[#E8DCA9]"
          >
            <UserRound size={24} />
            <span className="hidden text-xs font-medium sm:block">
              Sign In
            </span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex flex-col items-center gap-1 transition hover:text-[#E8DCA9]"
          >
            <ShoppingCart size={25} />

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#E8DCA9] text-[11px] font-bold text-[#55532B]">
              0
            </span>

            <span className="hidden text-xs font-medium sm:block">
              Cart
            </span>
          </Link>

          {/* More */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            aria-label="More menu"
            aria-expanded={moreOpen}
            className="relative flex flex-col items-center gap-1 transition hover:text-[#E8DCA9]"
          >
            {moreOpen ? <X size={25} /> : <Menu size={25} />}

            <span className="hidden text-xs font-medium sm:block">
              More
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="bg-[#55532B] px-4 pb-3 lg:hidden">
        <form
          onSubmit={handleSearch}
          className="flex h-11 items-center overflow-hidden rounded-lg bg-[#FFFEF7] p-1"
        >
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search in Shreyoshi Foods..."
            className="h-full flex-1 bg-transparent px-3 text-sm text-[#55532B] outline-none placeholder:text-[#8B896B]"
          />

          <button
            type="submit"
            aria-label="Search"
            className="flex h-full w-11 items-center justify-center rounded-md bg-[#55532B] text-[#FFFEF7]"
          >
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* Category Navigation */}
      <div className="border-t border-[#E8DCA9]/30 bg-[#F7F6E9]">
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

      {/* More Dropdown */}
      {moreOpen && (
        <div className="absolute right-4 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[#E8DCA9] bg-[#FFFEF7] py-2 text-[#55532B] shadow-xl">

          {[
            { name: "About Us", href: "/about" },
            { name: "Our Process", href: "/process" },
            { name: "Contact Us", href: "/contact" },
            { name: "My Account", href: "/login" },
            { name: "My Orders", href: "/orders" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMoreOpen(false)}
              className="block px-5 py-3 text-sm font-medium transition hover:bg-[#F7F6E9] hover:text-[#8A7738]"
            >
              {item.name}
            </Link>
          ))}

        </div>
      )}
    </header>
  );
}
