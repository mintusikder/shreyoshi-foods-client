
"use client";

import { useState } from "react";
import {
  Trophy,
  ArrowUpRight,
  Package,
  ChevronRight,
} from "lucide-react";

const topProducts = [
  {
    id: 1,
    name: "Premium Mustard Oil",
    category: "Mustard Oil",
    price: 450,
    sold: 245,
    revenue: 110250,
    stock: 35,
    image: "/images/products/mustard-oil.png",
  },
  {
    id: 2,
    name: "Pure Ghee",
    category: "Dairy Products",
    price: 850,
    sold: 186,
    revenue: 158100,
    stock: 22,
    image: "/images/products/ghee.png",
  },
  {
    id: 3,
    name: "Organic Honey",
    category: "Natural Foods",
    price: 550,
    sold: 158,
    revenue: 86900,
    stock: 48,
    image: "/images/products/honey.png",
  },
  {
    id: 4,
    name: "Premium Turmeric Powder",
    category: "Spices",
    price: 180,
    sold: 132,
    revenue: 23760,
    stock: 12,
    image: "/images/products/turmeric.png",
  },
];

const formatCurrency = (amount) =>
  `৳${amount.toLocaleString("en-IN")}`;

export default function TopProducts() {
  const [products] = useState(topProducts);

  const maxSold = Math.max(...products.map((product) => product.sold));

  return (
    <section className="h-full rounded-2xl border border-[#EAE8D9] bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDEEDC] text-[#55532B]">
              <Trophy size={19} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#292817]">
                Top Products
              </h2>
              <p className="mt-0.5 text-xs text-[#999781]">
                Best selling products
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/dashboard/products";
          }}
          className="flex items-center gap-1 text-xs font-semibold text-[#55532B] transition hover:underline"
        >
          View All
          <ArrowUpRight size={15} />
        </button>
      </div>

      {/* Product List */}
      <div className="mt-6 space-y-5">
        {products.map((product, index) => (
          <div key={product.id} className="group">
            <div className="flex items-center gap-3">
              {/* Product Image */}
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#EAE8D9] bg-[#FFFEF7]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling.style.display = "flex";
                  }}
                />

                <div className="absolute inset-0 hidden items-center justify-center text-[#AAA895]">
                  <Package size={23} />
                </div>

                <span className="absolute -left-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-br-lg bg-[#55532B] text-[10px] font-bold text-white">
                  {index + 1}
                </span>
              </div>

              {/* Product Information */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-[#292817]">
                  {product.name}
                </h3>

                <p className="mt-1 text-xs text-[#999781]">
                  {product.category}
                </p>

                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-xs font-bold text-[#55532B]">
                    {formatCurrency(product.price)}
                  </span>

                  <span className="text-[11px] text-[#AAA895]">
                    • {product.sold} sold
                  </span>
                </div>
              </div>

              {/* Revenue */}
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-[#292817]">
                  {formatCurrency(product.revenue)}
                </p>

                <p className="mt-1 text-[10px] text-[#999781]">
                  Revenue
                </p>
              </div>
            </div>

            {/* Sales Progress */}
            <div className="mt-3 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F1F0E7]">
                <div
                  className="h-full rounded-full bg-[#77754E] transition-all duration-500"
                  style={{
                    width: `${(product.sold / maxSold) * 100}%`,
                  }}
                />
              </div>

              <span className="w-12 text-right text-[10px] font-medium text-[#999781]">
                {Math.round((product.sold / maxSold) * 100)}%
              </span>
            </div>

            {/* Stock Warning */}
            {product.stock <= 15 && (
              <p className="mt-1.5 text-[10px] font-medium text-orange-600">
                Only {product.stock} items left in stock
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 border-t border-[#F0EEE3] pt-4">
        <button
          type="button"
          onClick={() => {
            window.location.href = "/dashboard/products";
          }}
          className="flex w-full items-center justify-between text-sm font-semibold text-[#55532B] transition hover:text-[#292817]"
        >
          Manage Products
          <ChevronRight size={17} />
        </button>
      </div>
    </section>
  );
}
