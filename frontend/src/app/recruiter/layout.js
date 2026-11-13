import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function RecruiterLayout({ children }) {
  return <ProtectedRoute role="RECRUITER">{children}</ProtectedRoute>;
}
