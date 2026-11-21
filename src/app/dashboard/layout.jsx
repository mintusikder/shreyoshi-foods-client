
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F7F6E9] lg:flex">
      <DashboardSidebar />

      <main className="min-w-0 flex-1 px-4 pb-8 pt-20 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
