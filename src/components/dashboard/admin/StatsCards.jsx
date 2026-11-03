
import {
  Wallet,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { adminStats } from "@/data/dashboard/admin-data";

const icons = {
  revenue: Wallet,
  orders: ShoppingBag,
  customers: Users,
  lowStock: Package,
};

const styles = {
  revenue: {
    iconBg: "bg-[#EDEEDC]",
    iconColor: "text-[#55532B]",
  },
  orders: {
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  customers: {
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  lowStock: {
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
};

export default function StatsCards() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {adminStats.map((stat) => {
        const Icon = icons[stat.id];
        const style = styles[stat.id];

        if (!Icon || !style) return null;

        return (
          <div
            key={stat.id}
            className="group rounded-2xl border border-[#EAE8D9] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${style.iconBg} ${style.iconColor}`}
              >
                <Icon size={23} strokeWidth={1.8} />
              </div>

              {stat.change && (
                <div
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    stat.trend === "down"
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {stat.trend === "down" ? (
                    <TrendingDown size={14} />
                  ) : (
                    <TrendingUp size={14} />
                  )}
                  {stat.change}
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="mt-5">
              <p className="text-sm font-medium text-[#85836D]">
                {stat.label}
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#292817] sm:text-3xl">
                {stat.value}
              </h2>

              <p className="mt-2 text-xs text-[#999781]">
                {stat.description}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
