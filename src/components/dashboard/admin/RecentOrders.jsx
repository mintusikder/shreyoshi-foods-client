
"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  ShoppingBag,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Eye,
} from "lucide-react";

const orders = [
  {
    id: "#ORD-1025",
    customer: "Rahim Ahmed",
    email: "rahim@gmail.com",
    initials: "RA",
    date: "Nov 03, 2026",
    amount: 2500,
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "#ORD-1024",
    customer: "Nusrat Jahan",
    email: "nusrat@gmail.com",
    initials: "NJ",
    date: "Nov 03, 2026",
    amount: 1850,
    payment: "Paid",
    status: "Processing",
  },
  {
    id: "#ORD-1023",
    customer: "Sakib Hasan",
    email: "sakib@gmail.com",
    initials: "SH",
    date: "Nov 02, 2026",
    amount: 3200,
    payment: "Pending",
    status: "Pending",
  },
  {
    id: "#ORD-1022",
    customer: "Mim Akter",
    email: "mim@gmail.com",
    initials: "MA",
    date: "Nov 02, 2026",
    amount: 1450,
    payment: "Paid",
    status: "Shipped",
  },
  {
    id: "#ORD-1021",
    customer: "Tanvir Hossain",
    email: "tanvir@gmail.com",
    initials: "TH",
    date: "Nov 01, 2026",
    amount: 4100,
    payment: "Failed",
    status: "Cancelled",
  },
];

const statusStyles = {
  Delivered: "bg-green-50 text-green-700",
  Processing: "bg-blue-50 text-blue-700",
  Pending: "bg-amber-50 text-amber-700",
  Shipped: "bg-purple-50 text-purple-700",
  Cancelled: "bg-red-50 text-red-700",
};

const paymentStyles = {
  Paid: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-700",
  Failed: "bg-red-50 text-red-700",
};

export default function RecentOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount) =>
    `৳${amount.toLocaleString("en-IN")}`;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#EAE8D9] bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDEEDC] text-[#55532B]">
              <ShoppingBag size={19} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#292817]">
                Recent Orders
              </h2>
              <p className="mt-0.5 text-xs text-[#999781]">
                Latest customer orders from your store
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/dashboard/orders";
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#55532B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#424021]"
        >
          View All Orders
          <ArrowUpRight size={16} />
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 border-y border-[#F0EEE3] bg-[#FFFEF7] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999781]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders or customers..."
            className="h-10 w-full rounded-xl border border-[#EAE8D9] bg-white pl-10 pr-4 text-sm text-[#292817] outline-none placeholder:text-[#AAA895] focus:border-[#55532B]"
          />
        </div>

        <div className="relative">
          <SlidersHorizontal
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#77754E]"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 w-full appearance-none rounded-xl border border-[#EAE8D9] bg-white pl-9 pr-9 text-sm font-medium text-[#55532B] outline-none focus:border-[#55532B] sm:w-44"
          >
            <option value="All">All Status</option>
            <option value="Delivered">Delivered</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#77754E]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left">
          <thead>
            <tr className="border-b border-[#F0EEE3] bg-white">
              {[
                "Order ID",
                "Customer",
                "Date",
                "Amount",
                "Payment",
                "Status",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#999781]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F4F2E9]">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="transition hover:bg-[#FFFEF7]"
              >
                {/* Order ID */}
                <td className="whitespace-nowrap px-5 py-4">
                  <span className="text-sm font-bold text-[#55532B]">
                    {order.id}
                  </span>
                </td>

                {/* Customer */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDEEDC] text-xs font-bold text-[#55532B]">
                      {order.initials}
                    </div>

                    <div>
                      <p className="whitespace-nowrap text-sm font-semibold text-[#292817]">
                        {order.customer}
                      </p>
                      <p className="mt-1 text-xs text-[#999781]">
                        {order.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Date */}
                <td className="whitespace-nowrap px-5 py-4 text-sm text-[#77754E]">
                  {order.date}
                </td>

                {/* Amount */}
                <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-[#292817]">
                  {formatCurrency(order.amount)}
                </td>

                {/* Payment */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${paymentStyles[order.payment]}`}
                  >
                    {order.payment}
                  </span>
                </td>

                {/* Order Status */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>

                {/* Action */}
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = `/dashboard/orders/${order.id.replace("#", "")}`;
                    }}
                    aria-label={`View ${order.id}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#EAE8D9] text-[#77754E] transition hover:border-[#55532B] hover:bg-[#EDEEDC] hover:text-[#55532B]"
                  >
                    <Eye size={17} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center">
                  <ShoppingBag
                    size={30}
                    className="mx-auto mb-3 text-[#C3C0A8]"
                  />
                  <p className="text-sm font-semibold text-[#55532B]">
                    No orders found
                  </p>
                  <p className="mt-1 text-xs text-[#999781]">
                    Try another search or status filter.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#F0EEE3] px-5 py-4">
        <p className="text-xs text-[#999781]">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/dashboard/orders";
          }}
          className="text-xs font-semibold text-[#55532B] transition hover:underline"
        >
          Manage Orders →
        </button>
      </div>
    </section>
  );
}
