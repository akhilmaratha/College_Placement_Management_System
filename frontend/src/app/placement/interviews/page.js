import { redirect } from "next/navigation";

export const metadata = {
  title: "Interviews | CampusPlacements",
  description:
    "Schedule and manage student interviews for campus placement drives.",
};

export default function PlacementInterviewsPage() { redirect("/placement-officer/interviews"); }
