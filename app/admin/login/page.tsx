import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidAdminSession } from "@/lib/db";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value ?? "";
  if (isValidAdminSession(token)) {
    redirect("/admin");
  }
  return <LoginForm />;
}