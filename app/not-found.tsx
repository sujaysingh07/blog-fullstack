import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function NotFound() {
  const cookieStore = await cookies();
  const isAuthenticated = Boolean(cookieStore.get("access_token")?.value);

  redirect(isAuthenticated ? "/admin/dashboard" : "/auth/login");
}
