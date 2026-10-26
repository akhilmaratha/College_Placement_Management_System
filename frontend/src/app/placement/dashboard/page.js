import { redirect } from "next/navigation";

export const metadata = {
  title: "Placement Overview | CampusPlacements",
  description:
    "Placement officer overview of students, drives, applications, and outcomes.",
};

export default function PlacementDashboardPage() { redirect("/placement-officer/dashboard"); }
