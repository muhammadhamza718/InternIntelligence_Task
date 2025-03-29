"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      toast.success("Logged out successfully", {
        onAutoClose: () => {
          router.push("/");
          router.refresh();
        },
      });
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
    >
      Logout
    </button>
  );
}
