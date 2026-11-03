
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tags,
  Warehouse,
  Users,
  ChartNoAxesCombined,
  FileBarChart,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Store,
  Truck,
  Leaf,
  UserRound,
  MapPinned,
  Heart,
  ClipboardList,
} from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";

// Role Based Menu Configuration
const roleMenus = {
  admin: [
    {
      title: "OVERVIEW",
      items: [
        { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
        { name: "Analytics", href: "/dashboard/analytics", icon: ChartNoAxesCombined },
      ],
    },
    {
      title: "STORE MANAGEMENT",
      items: [
        { name: "Products", href: "/dashboard/products", icon: Package },
        { name: "Categories", href: "/dashboard/categories", icon: Tags },
        { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
        { name: "Inventory", href: "/dashboard/inventory", icon: Warehouse },
        { name: "Shipping", href: "/dashboard/shipping", icon: Truck },
      ],
    },
    {
      title: "CUSTOMER & REPORTS",
      items: [
        { name: "Customers", href: "/dashboard/customers", icon: Users },
        { name: "Sales Reports", href: "/dashboard/reports", icon: FileBarChart },
      ],
    },
  ],

  manager: [
    {
      title: "OVERVIEW",
      items: [
        { name: "Dashboard", href: "/dashboard/manager", icon: LayoutDashboard },
        { name: "Analytics", href: "/dashboard/analytics", icon: ChartNoAxesCombined },
      ],
    },
    {
      title: "STORE MANAGEMENT",
      items: [
        { name: "Products", href: "/dashboard/products", icon: Package },
        { name: "Categories", href: "/dashboard/categories", icon: Tags },
        { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
        { name: "Inventory", href: "/dashboard/inventory", icon: Warehouse },
        { name: "Shipping", href: "/dashboard/shipping", icon: Truck },
      ],
    },
    {
      title: "REPORTS",
      items: [
        { name: "Sales Reports", href: "/dashboard/reports", icon: FileBarChart },
      ],
    },
  ],

  user: [
    {
      title: "MY ACCOUNT",
      items: [
        { name: "My Account", href: "/dashboard/user", icon: LayoutDashboard },
        { name: "My Orders", href: "/dashboard/my-orders", icon: ShoppingBag },
        { name: "Order Tracking", href: "/dashboard/order-tracking", icon: MapPinned },
        { name: "My Wishlist", href: "/dashboard/wishlist", icon: Heart },
      ],
    },
    {
      title: "ACCOUNT SETTINGS",
      items: [
        { name: "My Profile", href: "/dashboard/profile", icon: UserRound },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
      ],
    },
  ],
};

// Role Information
const roleInfo = {
  admin: {
    label: "ADMINISTRATOR",
    color: "bg-purple-100 text-purple-700",
  },
  manager: {
    label: "MANAGER",
    color: "bg-blue-100 text-blue-700",
  },
  user: {
    label: "CUSTOMER",
    color: "bg-green-100 text-green-700",
  },
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Current User Role
  const role = roleMenus[user?.role] ? user.role : "user";

  // Get Role Based Menu
  const menuGroups = roleMenus[role];
  const currentRole = roleInfo[role];

  // Active Menu
  const isActive = (href) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Close Mobile Sidebar
  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  // Logout
  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        console.error("Logout failed:", error.message);
        return;
      }

      window.dispatchEvent(new Event("auth-state-changed"));

      router.replace("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  // Avatar Initial
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-[60] flex h-11 w-11 items-center justify-center rounded-xl bg-[#55532B] text-white shadow-lg transition hover:bg-[#777443] lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[70]
          flex w-[280px] flex-col
          border-r border-[#E8DCA9]/50
          bg-[#FFFEF7] shadow-xl
          transition-transform duration-300
          lg:sticky lg:top-0 lg:z-40 lg:h-screen
          lg:translate-x-0 lg:shadow-none
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Brand Header */}
        <div className="flex h-[90px] shrink-0 items-center justify-between border-b border-[#E8DCA9]/60 px-5">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#55532B] text-[#E8DCA9]">
              <Leaf size={27} />
            </div>

            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-[#55532B]">
                SHREYOSHI
                <span className="text-[#A18A42]"> FOODS</span>
              </h2>

              <p className="text-[9px] font-semibold tracking-[2px] text-[#9A946F]">
                PURE NATURE · PURE TASTE
              </p>
            </div>
          </Link>

          <button
            onClick={closeMobileMenu}
            className="rounded-lg p-2 text-[#77745C] transition hover:bg-[#F7F6E9] lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={21} />
          </button>
        </div>

        {/* Store Information */}
        <div className="mx-4 mt-5 flex shrink-0 items-center gap-3 rounded-xl bg-[#F7F6E9] p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8DCA9]/50 text-[#55532B]">
            <Store size={20} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold text-[#55532B]">
              Store Management
            </p>
            <p className="mt-0.5 text-[10px] text-[#9A946F]">
              Organic Food Store
            </p>
          </div>

          <span className="ml-auto h-2 w-2 rounded-full bg-green-600" />
        </div>

        {/* Navigation */}
        <nav className="custom-scrollbar flex-1 space-y-7 overflow-y-auto px-4 py-6">
          {isPending ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="space-y-3">
                  <div className="h-3 w-24 rounded bg-[#E8DCA9]" />
                  <div className="h-11 rounded-xl bg-[#F7F6E9]" />
                  <div className="h-11 rounded-xl bg-[#F7F6E9]" />
                </div>
              ))}
            </div>
          ) : (
            menuGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-3 px-3 text-[10px] font-bold tracking-[1.8px] text-[#A49C7B]">
                  {group.title}
                </p>

                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={`
                          group flex items-center gap-3
                          rounded-xl px-3 py-3
                          text-[13px] font-semibold
                          transition-all duration-200
                          ${
                            active
                              ? "bg-[#55532B] text-[#FFFEF7] shadow-md shadow-[#55532B]/15"
                              : "text-[#77745C] hover:bg-[#F7F6E9] hover:text-[#55532B]"
                          }
                        `}
                      >
                        <Icon
                          size={19}
                          strokeWidth={active ? 2.4 : 1.8}
                        />

                        <span className="flex-1">{item.name}</span>

                        {active && <ChevronRight size={16} />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </nav>

        {/* User Profile & Logout */}
        <div className="shrink-0 border-t border-[#E8DCA9]/60 p-4">
          {isPending ? (
            <div className="mb-4 flex animate-pulse items-center gap-3 rounded-xl bg-[#F7F6E9] p-3">
              <div className="h-11 w-11 rounded-full bg-[#E8DCA9]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-[#E8DCA9]" />
                <div className="h-2 w-32 rounded bg-[#E8DCA9]" />
              </div>
            </div>
          ) : user ? (
            <div className="mb-4 rounded-xl bg-[#F7F6E9] p-3">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8DCA9] text-[#55532B]">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold">
                      {userInitial}
                    </span>
                  )}
                </div>

                {/* User Details */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#55532B]">
                    {user.name || "User"}
                  </p>

                  <p className="truncate text-[11px] text-[#8B896B]">
                    {user.email}
                  </p>
                </div>

                <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
              </div>

              {/* Role Badge */}
              <div className="mt-3">
                <span
                  className={`inline-flex rounded-md px-2 py-1 text-[9px] font-extrabold tracking-wider ${currentRole.color}`}
                >
                  {currentRole.label}
                </span>
              </div>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="mb-4 flex items-center gap-3 rounded-xl bg-[#F7F6E9] p-3 text-sm font-semibold text-[#55532B] transition hover:bg-[#E8DCA9]/40"
            >
              <Users size={20} />
              Sign In to Your Account
            </Link>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={loggingOut || isPending || !user}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={19} />
            {loggingOut ? "Logging Out..." : "Logout"}
          </button>

          <p className="mt-3 text-center text-[10px] text-[#A49C7B]">
            © 2026 Shreyoshi Foods
          </p>
        </div>
      </aside>
    </>
  );
}
