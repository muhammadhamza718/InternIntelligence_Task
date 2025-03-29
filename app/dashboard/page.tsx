import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, type TokenPayload } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export default async function Dashboard() {
  // Server-side auth check
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/");
  }

  try {
    // Verify token
    const payload: TokenPayload = await verifyToken(token);

    return (
      <div className="bg-white text-black h-screen px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {payload.email}!
          </h2>
          <p className="text-gray-600 mb-4">
            You have successfully logged in to your account.
          </p>
          <LogoutButton />
        </div>
      </div>
    );
  } catch {
    redirect("/");
  }
}
