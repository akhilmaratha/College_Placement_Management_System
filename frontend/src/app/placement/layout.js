import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function PlacementLayout({ children }) {
  return <ProtectedRoute role="PLACEMENT_OFFICER">{children}</ProtectedRoute>;
}
