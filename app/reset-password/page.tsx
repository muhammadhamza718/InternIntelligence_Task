/* eslint-disable @typescript-eslint/ban-ts-comment */
import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/reset-password-form";

// @ts-ignore
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token as string;

  // If no token is provided, redirect to home
  if (!token) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ResetPasswordForm token={token} />
    </div>
  );
}
