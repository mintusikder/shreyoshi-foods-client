
import { requireRole } from "@/lib/require-role";
import HeroManagement from "@/components/dashboard/admin/homepage/HeroManagement";

export const metadata = {
  title: "Homepage Management | Shreyoshi Foods",
};

export default async function HomepageManagementPage() {
  await requireRole(["admin"]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#55532B]">
          Homepage Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your homepage slider and right-side banner images.
        </p>
      </div>

      <HeroManagement />
    </div>
  );
}
