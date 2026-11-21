import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireRole(allowedRoles) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const role = session.user.role || "user";

  if (!allowedRoles.includes(role)) {
    redirect("/dashboard");
  }

  return session;
}