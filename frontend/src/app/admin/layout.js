import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminLayout({ children }) {
  return <ProtectedRoute role="ADMIN">{children}</ProtectedRoute>;
}
