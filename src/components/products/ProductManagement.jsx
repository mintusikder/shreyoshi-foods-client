
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
  Package,
  Filter,
} from "lucide-react";

import AddProductModal from "./AddProduct";
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  updateProduct,
} from "@/lib/api/products";

const categories = [
  "Mustard Oil",
  "Honey",
  "Ghee",
  "Rice & Pulses",
  "Spices",
  "Dry Fruits",
  "Combo",
  "Organic Foods",
  "Popular",
  "All Products",
];

function formatPrice(value) {
  const amount = Number(value || 0);

  return `৳${amount.toLocaleString("en-BD")}`;
}

function StatusBadge({ status }) {
  const published = status === "published";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        published
          ? "bg-green-100 text-green-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      setError("");

      const data = await getAdminProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();

    const handleUpdate = () => loadProducts(false);

    window.addEventListener("products-updated", handleUpdate);

    return () => {
      window.removeEventListener("products-updated", handleUpdate);
    };
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !keyword ||
        product.name?.toLowerCase().includes(keyword) ||
        product.sku?.toLowerCase().includes(keyword) ||
        product.slug?.toLowerCase().includes(keyword);

      const matchesCategory =
        categoryFilter === "all" ||
        product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const openAddModal = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSave = async (productData) => {
    try {
      setSaving(true);

      if (selectedProduct) {
        await updateProduct(selectedProduct._id, productData);
      } else {
        await createProduct(productData);
      }

      setModalOpen(false);
      setSelectedProduct(null);

      await loadProducts(false);
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteProduct(product._id);
      await loadProducts(false);
    } catch (err) {
      setError(err.message || "Product deletion failed.");
    }
  };

  const totalPublished = products.filter(
    (product) => product.status === "published"
  ).length;

  const totalDraft = products.filter(
    (product) => product.status === "draft"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your store products, inventory and publishing status.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => loadProducts(false)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#55532B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#414020]"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {products.length}
              </p>
            </div>
            <div className="rounded-xl bg-[#55532B]/10 p-3 text-[#55532B]">
              <Package size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Published Products</p>
          <p className="mt-1 text-2xl font-bold text-green-700">
            {totalPublished}
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Draft Products</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {totalDraft}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_180px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, SKU or slug..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#55532B] focus:ring-2 focus:ring-[#55532B]/10"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#55532B]"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#55532B]"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <Filter size={14} />
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Product Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={28}
                className="mx-auto animate-spin text-[#55532B]"
              />
              <p className="mt-3 text-sm text-gray-500">
                Loading products...
              </p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
            <Package size={38} className="text-gray-300" />
            <h3 className="mt-3 font-semibold text-gray-800">
              No products found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>
            {products.length === 0 && (
              <button
                type="button"
                onClick={openAddModal}
                className="mt-4 rounded-lg bg-[#55532B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#414020]"
              >
                Add Your First Product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Product</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Price</th>
                  <th className="px-5 py-4 font-semibold">Stock</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="transition hover:bg-gray-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex min-w-[240px] items-center gap-3">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                          {product.images?.main ? (
                            <img
                              src={product.images.main}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-gray-300">
                              <Package size={20} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            SKU: {product.sku || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {product.category || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(product.salePrice || product.regularPrice)}
                      </p>
                      {product.salePrice &&
                        Number(product.salePrice) <
                          Number(product.regularPrice) && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatPrice(product.regularPrice)}
                          </p>
                        )}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {product.stockQuantity ?? 0}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={product.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {product.status === "published" && (
                          <Link
                            href={`/products/${encodeURIComponent(product.slug)}`}
                            target="_blank"
                            title="View Product"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye size={17} />
                          </Link>
                        )}

                        <button
                          type="button"
                          title="Edit Product"
                          onClick={() => openEditModal(product)}
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          title="Delete Product"
                          onClick={() => handleDelete(product)}
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddProductModal
        key={selectedProduct?._id || "new-product"}
        open={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        product={selectedProduct}
      />
    </div>
  );
}
