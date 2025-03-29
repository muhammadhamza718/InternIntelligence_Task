import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/reset-password-form";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ResetPasswordPage({ searchParams }: Props) {
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
