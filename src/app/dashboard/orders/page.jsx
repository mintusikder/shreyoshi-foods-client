
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  RefreshCw,
  Search,
  ShoppingBag,
  Package,
  Phone,
  MapPin,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

import {
  getAdminOrders,
  updateOrderStatus,
} from "@/lib/api/orders";

const statusOptions = [
  "new",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const statusStyles = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-indigo-100 text-indigo-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const formatPrice = (amount) =>
  `৳${Number(amount || 0).toLocaleString("en-BD")}`;

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setRefreshing(true);

      const data = await getAdminOrders();

      setOrders(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(err.message || "অর্ডার লোড করা যায়নি।");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    // প্রতি ৫ সেকেন্ডে নতুন অর্ডার চেক করবে
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      await updateOrderStatus(orderId, newStatus);

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );
    } catch (err) {
      console.error("Update status error:", err);
      alert(err.message || "Order status update করা যায়নি।");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const customerName = order.customer?.name || "";
    const phone = order.customer?.phone || "";
    const orderId = order.orderId || "";

    const keyword = search.toLowerCase();

    return (
      customerName.toLowerCase().includes(keyword) ||
      phone.includes(search) ||
      orderId.toLowerCase().includes(keyword)
    );
  });

  const newOrders = orders.filter(
    (order) => order.orderStatus === "new"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "delivered"
  ).length;

  const totalSales = orders
    .filter((order) => order.orderStatus !== "cancelled")
    .reduce(
      (total, order) =>
        total + Number(order.pricing?.total || 0),
      0
    );

  return (
    <div className="min-h-screen bg-[#F8F8F2] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-xs font-bold tracking-widest text-[#A18A42]">
            STORE MANAGEMENT
          </p>

          <h1 className="text-2xl font-extrabold text-[#55532B] sm:text-3xl">
            All Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track all customer orders.
          </p>
        </div>

        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#55532B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#716F3B] disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh Orders
        </button>
      </div>

      {/* Statistics */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={orders.length}
          icon={<ShoppingBag size={22} />}
        />

        <StatCard
          title="New Orders"
          value={newOrders}
          icon={<Package size={22} />}
        />

        <StatCard
          title="Delivered Orders"
          value={deliveredOrders}
          icon={<ShoppingBag size={22} />}
        />

        <StatCard
          title="Total Order Value"
          value={formatPrice(totalSales)}
          icon={<Package size={22} />}
        />
      </div>

      {/* Search */}
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[#E8DCA9]/50 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-[#55532B]">Order List</h2>
          <p className="mt-1 text-xs text-gray-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        <div className="relative w-full sm:max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order, customer or phone..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#8B8953]"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-2xl bg-white p-12 text-center text-sm text-gray-500">
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D8D4B9] bg-white px-5 py-16 text-center">
          <ShoppingBag
            size={42}
            className="mx-auto mb-3 text-[#A49C7B]"
          />

          <h3 className="font-bold text-[#55532B]">
            No Orders Found
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            {search
              ? "আপনার সার্চের সাথে কোনো অর্ডার পাওয়া যায়নি।"
              : "এখনো কোনো কাস্টমার অর্ডার করেনি।"}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-2xl border border-[#E8DCA9]/50 bg-white shadow-sm"
            >
              {/* Order Header */}
              <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <p className="text-xs text-gray-400">
                    ORDER ID
                  </p>

                  <h3 className="mt-1 font-extrabold text-[#55532B]">
                    {order.orderId || order._id}
                  </h3>

                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <CalendarDays size={13} />
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize ${
                      statusStyles[order.orderStatus] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.orderStatus || "new"}
                  </span>

                  <select
                    value={order.orderStatus || "new"}
                    disabled={updatingId === order._id}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold capitalize text-[#55532B] outline-none focus:border-[#8B8953] disabled:opacity-50"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  {updatingId === order._id && (
                    <span className="text-xs text-gray-400">
                      Updating...
                    </span>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 gap-5 p-4 sm:grid-cols-2 sm:p-6">
                <div>
                  <h4 className="mb-3 text-xs font-bold tracking-wider text-[#A18A42]">
                    CUSTOMER INFORMATION
                  </h4>

                  <p className="font-bold text-[#55532B]">
                    {order.customer?.name || "Unknown Customer"}
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <Phone size={15} />
                    {order.customer?.phone || "N/A"}
                  </p>

                  {order.customer?.email && (
                    <p className="mt-1 break-all text-sm text-gray-500">
                      {order.customer.email}
                    </p>
                  )}

                  <p className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                    <MapPin size={16} className="mt-0.5 shrink-0" />

                    <span>
                      {[
                        order.shippingAddress?.address,
                        order.shippingAddress?.area,
                        order.shippingAddress?.district,
                        order.shippingAddress?.division,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Address not available"}
                    </span>
                  </p>
                </div>

                <div>
                  <h4 className="mb-3 text-xs font-bold tracking-wider text-[#A18A42]">
                    PAYMENT INFORMATION
                  </h4>

                  <p className="text-sm text-gray-600">
                    Payment Method:{" "}
                    <span className="font-bold uppercase text-[#55532B]">
                      {order.payment?.method || "N/A"}
                    </span>
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    Payment Status:{" "}
                    <span className="font-bold capitalize text-[#55532B]">
                      {order.payment?.status || "Pending"}
                    </span>
                  </p>

                  {order.note && (
                    <p className="mt-3 rounded-lg bg-[#F7F6E9] p-3 text-sm text-gray-600">
                      <strong>Note:</strong> {order.note}
                    </p>
                  )}
                </div>
              </div>

              {/* Products */}
              <div className="border-t border-gray-100 px-4 py-4 sm:px-6">
                <h4 className="mb-3 text-xs font-bold tracking-wider text-[#A18A42]">
                  ORDERED PRODUCTS
                </h4>

                <div className="space-y-3">
                  {(order.items || []).map((item, index) => (
                    <div
                      key={item.productId || index}
                      className="flex items-center gap-3"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || "Product"}
                          className="h-14 w-14 rounded-lg border border-gray-100 object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#F7F6E9] text-[#8B8953]">
                          <Package size={23} />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#55532B]">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-[#55532B]">
                        {formatPrice(
                          Number(item.price || 0) *
                            Number(item.quantity || 0)
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-gray-100 bg-[#FBFBF5] p-4 sm:px-6">
                <div className="ml-auto max-w-xs space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>
                      {formatPrice(order.pricing?.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery Charge</span>
                    <span>
                      {formatPrice(order.pricing?.deliveryCharge)}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-[#E8DCA9] pt-3 text-base font-extrabold text-[#55532B]">
                    <span>Total</span>
                    <span>
                      {formatPrice(order.pricing?.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-[#E8DCA9]/50 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7F6E9] text-[#55532B]">
        {icon}
      </div>

      <p className="text-sm text-gray-500">{title}</p>

      <h3 className="mt-1 text-2xl font-extrabold text-[#55532B]">
        {value}
      </h3>
    </div>
  );
}
