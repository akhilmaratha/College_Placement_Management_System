import PlacementOfficerDashboardView from "@/features/placement-dashboard/components/PlacementOfficerDashboardView";

export const metadata = {
  title: "Placement Overview | CampusPlacements",
  description:
    "Placement officer overview of students, drives, applications, and outcomes.",
};

export default function PlacementDashboardPage() {
  return <PlacementOfficerDashboardView />;
}
