import { redirect } from "next/navigation";

export const metadata = {
  title: "Placement Drives | CampusPlacements",
  description:
    "Manage campus placement drives, eligibility, and application deadlines.",
};

export default function PlacementDrivesPage() { redirect("/placement-officer/drives"); }
