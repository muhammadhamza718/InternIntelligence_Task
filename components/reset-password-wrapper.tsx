"use client";

import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/reset-password-form";

export default function ResetPasswordFormWrapper() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // If no token is provided, redirect to home
  if (!token) {
    window.location.href = "/";
    return null;
  }

  return <ResetPasswordForm token={token} />;
} 