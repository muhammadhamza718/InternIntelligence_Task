import { Suspense } from "react";
import ResetPasswordFormWrapper from "@/components/reset-password-wrapper";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordFormWrapper />
      </Suspense>
    </div>
  );
}
