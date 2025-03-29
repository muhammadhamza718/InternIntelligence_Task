"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ResetPasswordForm from "@/components/reset-password-form";

export default function ResetPasswordFormWrapper() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    setToken(tokenParam);
  }, [searchParams]);

  // If no token is provided, redirect to home
  if (!token) {
    window.location.href = "/";
    return null;
  }

  return <ResetPasswordForm token={token} />;
}
