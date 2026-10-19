import LoginForm from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "Sign in | CampusPlacements",
  description: "Sign in to the College Placement Management System portal.",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <LoginForm />
    </main>
  );
}
