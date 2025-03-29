/* eslint-disable @typescript-eslint/ban-ts-comment */
import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <ResetPasswordFormWrapper />
    </div>
  );
}

// Client component to handle search params
("use client");
function ResetPasswordFormWrapper() {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  // If no token is provided, redirect to home
  if (!token) {
    window.location.href = "/";
    return null;
  }

  return <ResetPasswordForm token={token} />;
}
