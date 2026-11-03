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

      <StatsCards />

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueOverview />
        </div>

        <OrderSummary />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentOrders />
        </div>

        <TopProducts />
      </div>

      <LowStockAlert />
    </div>
  );
}