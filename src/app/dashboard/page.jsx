import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const role = session.user.role || "user";

  switch (role) {
    case "admin":
      redirect("/dashboard/admin");

    case "manager":
      redirect("/dashboard/manager");

    case "user":
    default:
      redirect("/dashboard/user");
  }
}