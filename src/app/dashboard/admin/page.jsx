import { requireRole } from "@/lib/require-role";
import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";

export default async function AdminPage() {
  await requireRole(["admin"]);

  return <AdminDashboard />;
}