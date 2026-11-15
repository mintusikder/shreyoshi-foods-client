
import Link from "next/link";
import {
  ImageIcon,
  ArrowUpRight,
} from "lucide-react";

import AdminHeader from "./AdminHeader";
import StatsCards from "./StatsCards";
import RevenueOverview from "./RevenueOverview";
import OrderSummary from "./OrderSummary";
import RecentOrders from "./RecentOrders";
import TopProducts from "./TopProducts";
import LowStockAlert from "./LowStockAlert";

export default function AdminDashboard() {
  return (
    <div className="space-y-7">
      <AdminHeader />

      {/* Homepage Management */}
      <Link
        href="/dashboard/admin/homepage"
        className="group flex flex-col justify-between gap-4 rounded-2xl border border-[#E6DDCE] bg-white p-5 shadow-sm transition hover:border-[#55532B] hover:shadow-md sm:flex-row sm:items-center sm:p-6"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F7F6E9] text-[#55532B] transition group-hover:bg-[#55532B] group-hover:text-white">
            <ImageIcon size={27} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#55532B]">
              Homepage Management
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage homepage slider and right-side banner images.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#55532B]">
          Manage Homepage
          <ArrowUpRight
            size={18}
            className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
          />
        </div>
      </Link>

      <StatsCards />

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {/* <RevenueOverview /> */}
        </div>

        {/* <OrderSummary /> */}
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {/* <RecentOrders /> */}
        </div>

        {/* <TopProducts /> */}
      </div>

      {/* <LowStockAlert /> */}
    </div>
  );
}
