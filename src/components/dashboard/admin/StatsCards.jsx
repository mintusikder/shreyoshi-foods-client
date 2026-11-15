
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Package,
  RefreshCw,
} from "lucide-react";

import { getProducts } from "@/lib/api/products";

export default function StatsCards() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProductCount = useCallback(async () => {
    try {
      const products = await getProducts();

      setTotalProducts(products.length);
      setError("");
    } catch (err) {
      console.error("Product Count Error:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load
    fetchProductCount();

    // Listen for product creation in this application
    const handleProductsUpdated = () => {
      fetchProductCount();
    };

    window.addEventListener(
      "products-updated",
      handleProductsUpdated
    );

    // Refresh every 3 seconds for updates from other admins
    const interval = setInterval(() => {
      fetchProductCount();
    }, 3000);

    return () => {
      window.removeEventListener(
        "products-updated",
        handleProductsUpdated
      );

      clearInterval(interval);
    };
  }, [fetchProductCount]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {/* Total Products */}
      <div className="rounded-xl border border-[#EAE8DF] bg-white p-5 shadow-sm transition hover:shadow-md">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Products
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#55532B]">
              {loading ? (
                <span className="text-xl">Loading...</span>
              ) : (
                totalProducts.toLocaleString("en-BD")
              )}
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Total products added to store
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7F6E9] text-[#55532B]">
            <Package size={25} />
          </div>

        </div>

        {error && (
          <p className="mt-3 text-xs text-red-500">
            {error}
          </p>
        )}

        <div className="mt-4 flex items-center gap-1 text-xs text-green-600">
          <RefreshCw size={12} />
          Auto updating
        </div>

      </div>

    </div>
  );
}
