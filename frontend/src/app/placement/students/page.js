import { redirect } from "next/navigation";

export const metadata = {
  title: "Student Management | CampusPlacements",
  description:
    "Placement officer directory of registered students, academic profiles, and placement status.",
};

export default function PlacementStudentsPage() { redirect("/placement-officer/students"); }
