import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function PlacementOfficerLayout({ children }) {
  return <ProtectedRoute role="PLACEMENT_OFFICER">{children}</ProtectedRoute>;
}
