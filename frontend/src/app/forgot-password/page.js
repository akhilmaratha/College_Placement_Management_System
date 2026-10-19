import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";

export const metadata = {
  title: "Forgot password | CampusPlacements",
  description:
    "Reset your CampusPlacements password for the College Placement Management System.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <ForgotPasswordForm />
    </main>
  );
}
