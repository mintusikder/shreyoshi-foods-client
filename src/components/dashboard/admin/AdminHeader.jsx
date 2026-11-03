
"use client";

import { Bell, CalendarDays, Plus } from "lucide-react";

export default function AdminHeader() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      {/* Page Heading */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#55532B]" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#77754E]">
            Admin Panel
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#292817] sm:text-3xl">
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

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8E5D3] bg-white text-[#55532B] transition hover:bg-[#F7F6E9]"
        >
          <Bell size={19} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
        </button>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/dashboard/products";
          }}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#55532B] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#424021]"
        >
          <Plus size={17} />
          Add Product
        </button>
      </div>
    </header>
  );
}
