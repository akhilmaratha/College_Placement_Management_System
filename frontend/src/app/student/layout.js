import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function StudentLayout({ children }) {
  return <ProtectedRoute role="STUDENT">{children}</ProtectedRoute>;
}
