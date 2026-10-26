import Link from "next/link";
import StudentShell from "@/components/layout/StudentShell";
import { StudentUnavailableState } from "@/components/student/StudentState";

export const metadata = {
  title: "Job Details | CampusPlacements",
  description: "Placement job details.",
};

export default function StudentJobDetailsPage() {
  return (
    <StudentShell title="Job details" breadcrumb="Student / Job details">
      <div className="mx-auto flex max-w-2xl flex-col gap-5">
        <StudentUnavailableState message="Job details are unavailable because the backend does not expose a student job-details endpoint." />
        <Link href="/student/jobs" className="self-center rounded-[10px] border border-border bg-card px-4 py-2.5 text-sm font-semibold text-primary hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
          Back to Browse Jobs
        </Link>
      </div>
    </StudentShell>
  );
}
