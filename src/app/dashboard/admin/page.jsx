
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  Package,
  ShoppingBag,
  Users,
  Wallet,
  RefreshCw,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ClipboardList,
  AlertTriangle,
  ArrowRight,
  Eye,
  Plus,
} from "lucide-react";

import { getAdminProducts } from "@/lib/api/products";
import { getAdminOrders } from "@/lib/api/orders";

// Currency Formatter
function formatPrice(value) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

// Date Formatter
function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Order Status Badge
function OrderStatus({ status }) {
  const styles = {
    new: "bg-blue-100 text-blue-700",
    confirmed: "bg-indigo-100 text-indigo-700",
    processing: "bg-amber-100 text-amber-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const label = {
    new: "New",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  const normalizedStatus = String(status || "new").toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[normalizedStatus] || "bg-gray-100 text-gray-600"
      }`}
    >
      {label[normalizedStatus] || normalizedStatus}
    </span>
  );
}

// Statistic Card
function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  loading,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          {loading ? (
            <div className="mt-3 h-8 w-24 animate-pulse rounded bg-gray-200" />
          ) : (
            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              {value}
            </h2>
          )}

          <p className="mt-2 text-xs text-gray-400">
            {description}
          </p>
        </div>

        <div className={`shrink-0 rounded-xl p-3 ${color}`}>
          <Icon size={25} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Load Dashboard Data
  const loadDashboardData = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const [productsData, ordersData] = await Promise.all([
        getAdminProducts(),
        getAdminOrders(),
      ]);

      setProducts(
        Array.isArray(productsData) ? productsData : []
      );

      setOrders(
        Array.isArray(ordersData) ? ordersData : []
      );
    } catch (err) {
      setError(
        err.message || "Unable to load dashboard information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();

    const handleProductsUpdate = () => {
      loadDashboardData(false);
    };

    const handleOrdersUpdate = () => {
      loadDashboardData(false);
    };

    window.addEventListener(
      "products-updated",
      handleProductsUpdate
    );

    window.addEventListener(
      "orders-updated",
      handleOrdersUpdate
    );

    return () => {
      window.removeEventListener(
        "products-updated",
        handleProductsUpdate
      );

      window.removeEventListener(
        "orders-updated",
        handleOrdersUpdate
      );
    };
  }, [loadDashboardData]);

  // Order Status Counts
  const getOrderCount = (status) => {
    return orders.filter(
      (order) =>
        String(order.orderStatus || "").toLowerCase() === status
    ).length;
  };

  // Customers who have placed orders
  const uniqueCustomers = new Set(
    orders
      .map((order) => {
        const customer = order.customer || {};

        return (
          customer.phone ||
          customer.email ||
          customer.name ||
          null
        );
      })
      .filter(Boolean)
      .map((value) => String(value).toLowerCase())
  );

  // Delivered Orders Revenue
  const totalRevenue = orders
    .filter(
      (order) =>
        String(order.orderStatus || "").toLowerCase() ===
        "delivered"
    )
    .reduce((total, order) => {
      const amount =
        order.pricing?.total ??
        order.totalAmount ??
        order.total ??
        0;

      return total + Number(amount || 0);
    }, 0);

  // Low Stock Products
  const lowStockProducts = products.filter((product) => {
    const stock = Number(product.stockQuantity ?? 0);

    return (
      product.stockStatus === "low_stock" ||
      (!["out_of_stock", "out of stock"].includes(
        String(product.stockStatus || "").toLowerCase()
      ) &&
        stock > 0 &&
        stock <= 5)
    );
  });

  // Recent Orders
  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = new Date(
        a.createdAt || a.updatedAt || 0
      ).getTime();

      const dateB = new Date(
        b.createdAt || b.updatedAt || 0
      ).getTime();

      return dateB - dateA;
    })
    .slice(0, 5);

  const statusCards = [
    {
      title: "New Orders",
      count: getOrderCount("new"),
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Confirmed",
      count: getOrderCount("confirmed"),
      icon: CheckCircle,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Processing",
      count: getOrderCount("processing"),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Shipped",
      count: getOrderCount("shipped"),
      icon: Truck,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Delivered",
      count: getOrderCount("delivered"),
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Cancelled",
      count: getOrderCount("cancelled"),
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#88865A]">
            SHREYOSHI FOODS
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor your store, orders and business performance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadDashboardData(false)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh Data
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => loadDashboardData(false)}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Products"
          value={products.length.toLocaleString("en-BD")}
          description="Products in your store"
          icon={Package}
          color="bg-[#55532B]/10 text-[#55532B]"
          loading={loading}
        />

        <StatCard
          title="Total Orders"
          value={orders.length.toLocaleString("en-BD")}
          description="All received orders"
          icon={ShoppingBag}
          color="bg-orange-50 text-[#F58220]"
          loading={loading}
        />

        <StatCard
          title="Customers with Orders"
          value={uniqueCustomers.size.toLocaleString("en-BD")}
          description="Unique customers who ordered"
          icon={Users}
          color="bg-blue-50 text-blue-600"
          loading={loading}
        />

        <StatCard
          title="Delivered Revenue"
          value={formatPrice(totalRevenue)}
          description="Revenue from delivered orders"
          icon={Wallet}
          color="bg-green-50 text-green-600"
          loading={loading}
        />

      </div>

      {/* Order Status */}
      <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Order Overview
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Track your order progress
            </p>
          </div>

          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#55532B] hover:text-[#F58220]"
          >
            View Orders
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">

          {statusCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-lg border border-gray-100 p-3 transition hover:border-gray-200"
              >
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${item.bg} ${item.color}`}>
                  <Icon size={19} />
                </div>

                <p className="text-xs text-gray-500">
                  {item.title}
                </p>

                {loading ? (
                  <div className="mt-2 h-6 w-12 animate-pulse rounded bg-gray-200" />
                ) : (
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {item.count.toLocaleString("en-BD")}
                  </p>
                )}
              </div>
            );
          })}

        </div>
      </section>

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        {/* Recent Orders */}
        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm xl:col-span-2">

          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Latest customer orders
              </p>
            </div>

            <Link
              href="/dashboard/orders"
              className="text-sm font-semibold text-[#55532B] hover:text-[#F58220]"
            >
              View All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-12 animate-pulse rounded bg-gray-100"
                />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center p-5 text-center">
              <ShoppingBag size={35} className="text-gray-300" />

              <p className="mt-3 font-semibold text-gray-700">
                No Orders Yet
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead className="bg-gray-50 text-xs text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">
                      Order ID
                    </th>

                    <th className="px-5 py-3 font-semibold">
                      Customer
                    </th>

                    <th className="px-5 py-3 font-semibold">
                      Amount
                    </th>

                    <th className="px-5 py-3 font-semibold">
                      Status
                    </th>

                    <th className="px-5 py-3 font-semibold">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order, index) => {
                    const customer = order.customer || {};

                    const amount =
                      order.pricing?.total ??
                      order.totalAmount ??
                      order.total ??
                      0;

                    return (
                      <tr
                        key={order._id || order.orderId || index}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 text-sm font-semibold text-[#55532B]">
                          {order.orderId || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-800">
                            {customer.name || "Customer"}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {customer.phone || ""}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                          {formatPrice(amount)}
                        </td>

                        <td className="px-5 py-4">
                          <OrderStatus status={order.orderStatus} />
                        </td>

                        <td className="px-5 py-4 text-xs text-gray-500">
                          {formatDate(
                            order.createdAt || order.updatedAt
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </section>

        {/* Low Stock Products */}
        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Low Stock Alert
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Products running low
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <AlertTriangle size={19} />
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-12 animate-pulse rounded bg-gray-100"
                />
              ))}
            </div>
          ) : lowStockProducts.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center p-5 text-center">
              <CheckCircle size={35} className="text-green-500" />

              <p className="mt-3 font-semibold text-gray-700">
                Stock Looks Good!
              </p>

              <p className="mt-1 text-xs text-gray-400">
                No low-stock products found.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3 p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                    {product.images?.main ? (
                      <img
                        src={product.images.main}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package size={19} className="text-gray-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs font-medium text-amber-600">
                      Stock: {product.stockQuantity ?? 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-100 p-4">
            <Link
              href="/dashboard/products"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#55532B]/5 px-3 py-2.5 text-sm font-semibold text-[#55532B] transition hover:bg-[#55532B]/10"
            >
              Manage Products
              <ArrowRight size={16} />
            </Link>
          </div>

        </section>

      </div>

      {/* Quick Access */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Quick Access
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Quickly manage your store
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

          <Link
            href="/dashboard/products"
            className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-[#55532B]/30 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-[#55532B]/10 p-3 text-[#55532B]">
                <Package size={23} />
              </div>

              <div>
                <p className="font-bold text-gray-900">
                  Product Management
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Add, edit and manage products
                </p>
              </div>
            </div>

            <ArrowRight
              size={19}
              className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#55532B]"
            />
          </Link>

          <Link
            href="/dashboard/orders"
            className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-[#F58220]/30 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-orange-50 p-3 text-[#F58220]">
                <ShoppingBag size={23} />
              </div>

              <div>
                <p className="font-bold text-gray-900">
                  Order Management
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  View and manage customer orders
                </p>
              </div>
            </div>

            <ArrowRight
              size={19}
              className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#F58220]"
            />
          </Link>

        </div>
      </section>

    </div>
  );
}
