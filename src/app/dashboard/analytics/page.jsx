
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  IndianRupee,
  Package,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  Users,
  Wallet,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { getAnalytics } from "@/lib/api/analytics";

const filters = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
  { label: "Custom", value: "custom" },
];

const money = (value) =>
  `৳${Number(value || 0).toLocaleString("en-BD", {
    maximumFractionDigits: 0,
  })}`;

const number = (value) =>
  Number(value || 0).toLocaleString("en-BD");

const statusStyles = {
  new: "bg-blue-50 text-blue-700",
  confirmed: "bg-indigo-50 text-indigo-700",
  processing: "bg-amber-50 text-amber-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

const statusLabels = {
  new: "New",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function StatCard({ title, value, subtitle, icon: Icon, iconBg }) {
  return (
    <div className="rounded-2xl border border-[#EAE9DF] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#29291F]">
            {value}
          </h3>
          <p className="mt-2 text-xs text-gray-400">{subtitle}</p>
        </div>

        <div className={`rounded-xl p-3 ${iconBg}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold text-[#29291F]">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function RevenueChart({ data }) {
  const maxRevenue = Math.max(
    ...data.map((item) => Number(item.revenue || 0)),
    1
  );

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        No sales data available for this period.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex h-64 items-end gap-2 overflow-x-auto border-b border-l border-gray-100 px-2 pb-2 pt-5">
        {data.map((item) => {
          const height = Math.max(
            (Number(item.revenue || 0) / maxRevenue) * 100,
            2
          );

          return (
            <div
              key={item.date}
              className="group flex h-full min-w-[22px] flex-1 flex-col items-center justify-end"
              title={`${item.date}: ${money(item.revenue)} | ${item.orders} orders`}
            >
              <div className="relative flex h-full w-full items-end justify-center">
                <div
                  className="w-full max-w-9 rounded-t-md bg-[#77743B] transition-all duration-300 group-hover:bg-[#55532B]"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="mt-2 whitespace-nowrap text-[10px] text-gray-400">
                {item.date.slice(5)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <span>{data.length} sales days</span>
        <span>Revenue in BDT (৳)</span>
      </div>
    </div>
  );
}

function StatusBreakdown({ data }) {
  const total = data.reduce(
    (sum, item) => sum + Number(item.count || 0),
    0
  );

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const percentage = total
          ? (Number(item.count || 0) / total) * 100
          : 0;

        return (
          <div key={item.status}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-gray-600">
                {statusLabels[item.status] || item.status}
              </span>
              <span className="text-sm font-bold text-[#29291F]">
                {number(item.count)}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#77743B]"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}

      {!total && (
        <p className="py-8 text-center text-sm text-gray-400">
          No orders found.
        </p>
      )}
    </div>
  );
}

function AnalyticsPage() {
  const [range, setRange] = useState("30d");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    if (range === "custom" && (!from || !to)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await getAnalytics({ range, from, to });
      setData(result);
    } catch (err) {
      setError(err.message || "Analytics load failed");
    } finally {
      setLoading(false);
    }
  }, [range, from, to]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const overview = data?.overview || {};
  const inventory = data?.inventory || {};

  const exportCSV = () => {
    if (!data) return;

    const rows = [
      ["Shreyoshi Foods - Analytics"],
      ["Metric", "Value"],
      ["Total Revenue", overview.totalRevenue || 0],
      ["Total Orders", overview.totalOrders || 0],
      ["Valid Orders", overview.validOrders || 0],
      ["Cancelled Orders", overview.cancelledOrders || 0],
      ["Average Order Value", overview.averageOrderValue || 0],
      ["Total Customers", overview.totalCustomers || 0],
      ["Repeat Customers", overview.repeatCustomers || 0],
      [],
      ["Revenue Trend"],
      ["Date", "Revenue", "Orders"],
      ...(data.revenueTrend || []).map((item) => [
        item.date,
        item.revenue,
        item.orders,
      ]),
      [],
      ["Top Products"],
      ["Product", "Quantity Sold", "Sales"],
      ...(data.topProducts || []).map((item) => [
        item.name,
        item.quantity,
        item.sales,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "shreyoshi-foods-analytics.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F3] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-[#77743B]">
              <BarChart3 size={17} />
              <span className="font-semibold">BUSINESS OVERVIEW</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#29291F] sm:text-3xl">
              Analytics
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor your store performance, sales and customers.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={loadAnalytics}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E5E4D8] bg-white px-4 py-2.5 text-sm font-semibold text-[#55532B] hover:bg-[#F5F4EB] disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              onClick={exportCSV}
              disabled={!data}
              className="inline-flex items-center gap-2 rounded-xl bg-[#55532B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#414021] disabled:opacity-50"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Date Filters */}
        <div className="rounded-2xl border border-[#EAE9DF] bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-600">
            <CalendarDays size={17} />
            Date Range
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setRange(filter.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  range === filter.value
                    ? "bg-[#55532B] text-white"
                    : "bg-[#F5F5EF] text-gray-600 hover:bg-[#EBEBDD]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {range === "custom" && (
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <label className="text-sm text-gray-600">
                From
                <input
                  type="date"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                  className="mt-1 block rounded-lg border border-gray-200 px-3 py-2"
                />
              </label>

              <label className="text-sm text-gray-600">
                To
                <input
                  type="date"
                  min={from || undefined}
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                  className="mt-1 block rounded-lg border border-gray-200 px-3 py-2"
                />
              </label>

              <button
                onClick={loadAnalytics}
                disabled={!from || !to || loading}
                className="rounded-lg bg-[#55532B] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle size={19} />
            <span>{error}</span>
            <button
              onClick={loadAnalytics}
              className="ml-auto font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading && !data ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        ) : data ? (
          <>
            {/* KPI Cards */}
            <section>
              <SectionTitle
                title="Sales Overview"
                subtitle="Your store performance for the selected period"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Total Revenue"
                  value={money(overview.totalRevenue)}
                  subtitle="Excluding cancelled orders"
                  icon={Wallet}
                  iconBg="bg-[#F0F0E4] text-[#55532B]"
                />
                <StatCard
                  title="Total Orders"
                  value={number(overview.totalOrders)}
                  subtitle={`${number(overview.cancelledOrders)} cancelled`}
                  icon={ShoppingCart}
                  iconBg="bg-blue-50 text-blue-600"
                />
                <StatCard
                  title="Average Order Value"
                  value={money(overview.averageOrderValue)}
                  subtitle="Revenue per non-cancelled order"
                  icon={IndianRupee}
                  iconBg="bg-purple-50 text-purple-600"
                />
                <StatCard
                  title="Customers"
                  value={number(overview.totalCustomers)}
                  subtitle={`${number(overview.repeatCustomers)} repeat customers`}
                  icon={Users}
                  iconBg="bg-green-50 text-green-600"
                />
              </div>
            </section>

            {/* Revenue + Status */}
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <div className="rounded-2xl border border-[#EAE9DF] bg-white p-5 shadow-sm xl:col-span-2">
                <SectionTitle
                  title="Revenue Overview"
                  subtitle="Daily revenue from non-cancelled orders"
                />
                <RevenueChart data={data.revenueTrend || []} />
              </div>

              <div className="rounded-2xl border border-[#EAE9DF] bg-white p-5 shadow-sm">
                <SectionTitle
                  title="Order Status"
                  subtitle="Orders by current status"
                />
                <StatusBreakdown data={data.orderStatuses || []} />
              </div>
            </section>

            {/* Product + Customer */}
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <div className="rounded-2xl border border-[#EAE9DF] bg-white p-5 shadow-sm xl:col-span-2">
                <SectionTitle
                  title="Top Selling Products"
                  subtitle="Best performing products by quantity sold"
                />

                {data.topProducts?.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
                          <th className="pb-3 font-semibold">Product</th>
                          <th className="pb-3 font-semibold">Quantity</th>
                          <th className="pb-3 text-right font-semibold">
                            Sales
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topProducts.map((product, index) => (
                          <tr
                            key={`${product.slug}-${index}`}
                            className="border-b border-gray-50 last:border-0"
                          >
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1F0E6] text-xs font-bold text-[#55532B]">
                                  {index + 1}
                                </span>
                                <span className="font-semibold text-gray-700">
                                  {product.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 text-gray-600">
                              {number(product.quantity)}
                            </td>
                            <td className="py-4 text-right font-semibold text-[#55532B]">
                              {money(product.sales)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="py-10 text-center text-sm text-gray-400">
                    No product sales found for this period.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-[#EAE9DF] bg-white p-5 shadow-sm">
                <SectionTitle
                  title="Customer Insights"
                  subtitle="Based on non-cancelled orders"
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-[#F7F7F1] p-4">
                    <div className="flex items-center gap-3">
                      <Users size={19} className="text-[#77743B]" />
                      <span className="text-sm text-gray-600">
                        Total Customers
                      </span>
                    </div>
                    <strong className="text-lg text-[#29291F]">
                      {number(overview.totalCustomers)}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-green-50 p-4">
                    <div className="flex items-center gap-3">
                      <ArrowUpRight size={19} className="text-green-600" />
                      <span className="text-sm text-gray-600">
                        Repeat Customers
                      </span>
                    </div>
                    <strong className="text-lg text-green-700">
                      {number(overview.repeatCustomers)}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
                    <div className="flex items-center gap-3">
                      <Activity size={19} className="text-blue-600" />
                      <span className="text-sm text-gray-600">
                        One-time Customers
                      </span>
                    </div>
                    <strong className="text-lg text-blue-700">
                      {number(overview.newCustomers)}
                    </strong>
                  </div>

                  <p className="pt-2 text-xs leading-5 text-gray-400">
                    Customers are identified by their phone number. These
                    figures represent customers with orders in the selected
                    date range, not all registered accounts.
                  </p>
                </div>
              </div>
            </section>

            {/* Inventory */}
            <section>
              <SectionTitle
                title="Inventory Overview"
                subtitle="Current published product stock"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Total Products"
                  value={number(inventory.totalProducts)}
                  subtitle="Published products"
                  icon={Package}
                  iconBg="bg-[#F0F0E4] text-[#55532B]"
                />
                <StatCard
                  title="Low Stock"
                  value={number(inventory.lowStock)}
                  subtitle="1 to 5 units remaining"
                  icon={AlertTriangle}
                  iconBg="bg-amber-50 text-amber-600"
                />
                <StatCard
                  title="Out of Stock"
                  value={number(inventory.outOfStock)}
                  subtitle="Products with zero stock"
                  icon={XCircle}
                  iconBg="bg-red-50 text-red-600"
                />
                <StatCard
                  title="Inventory Value"
                  value={money(inventory.inventoryValue)}
                  subtitle="Estimated value at current product prices"
                  icon={ShoppingBag}
                  iconBg="bg-green-50 text-green-600"
                />
              </div>
            </section>

            {/* Stock Alerts */}
            <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#EAE9DF] bg-white p-5 shadow-sm">
                <SectionTitle
                  title="Low Stock Alerts"
                  subtitle="Products that need restocking soon"
                />

                {inventory.lowStockProducts?.length ? (
                  <div className="space-y-3">
                    {inventory.lowStockProducts.map((product, index) => (
                      <div
                        key={`${product.name}-${index}`}
                        className="flex items-center justify-between gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                            <Package size={17} />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {product.name}
                          </span>
                        </div>
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                          {product.stock} left
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-gray-400">
                    No low-stock products.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-[#EAE9DF] bg-white p-5 shadow-sm">
                <SectionTitle
                  title="Out of Stock"
                  subtitle="Products currently unavailable"
                />

                {inventory.outOfStockProducts?.length ? (
                  <div className="space-y-3">
                    {inventory.outOfStockProducts.map((product, index) => (
                      <div
                        key={`${product.name}-${index}`}
                        className="flex items-center justify-between gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-red-50 p-2 text-red-600">
                            <Package size={17} />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {product.name}
                          </span>
                        </div>
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                          Out of stock
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-gray-400">
                    No out-of-stock products.
                  </p>
                )}
              </div>
            </section>

            <p className="pb-4 text-center text-xs text-gray-400">
              Analytics data is calculated from your store orders and
              published products. Revenue excludes cancelled orders.
            </p>
          </>
        ) : !error ? (
          <div className="rounded-2xl border border-[#EAE9DF] bg-white p-10 text-center text-sm text-gray-400">
            No analytics data available.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default AnalyticsPage;
