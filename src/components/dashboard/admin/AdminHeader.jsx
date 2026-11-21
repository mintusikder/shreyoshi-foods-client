"use client";

import { useState } from "react";
import { Bell, CalendarDays, Plus } from "lucide-react";

import AddProductModal from "./AddProductModal";
import { createProduct } from "@/lib/api/products";

export default function AdminHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleAddProduct = async (productData) => {
    const result = await createProduct(productData);

    alert(result.message || "Product added successfully!");

    return result;
  };

  return (
    <>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#55532B]" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#77754E]">
              Admin Panel
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#292817] sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-[#85836D]">
            Welcome back! Here's what's happening with your store today.
          </p>

          <div className="mt-3 flex items-center gap-2 text-xs text-[#77754E]">
            <CalendarDays size={15} />
            <span>{today}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8E5D3] bg-white text-[#55532B]"
          >
            <Bell size={19} />
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#55532B] px-4 text-sm font-semibold text-white transition hover:bg-[#424021]"
          >
            <Plus size={17} />
            Add Product
          </button>
        </div>
      </header>

      <AddProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddProduct}
      />
    </>
  );
}