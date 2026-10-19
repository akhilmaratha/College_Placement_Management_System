import Link from "next/link";
import StudentShell from "@/components/layout/StudentShell";

export const metadata = {
  title: "Job details | CampusPlacements",
  description: "Placement opportunity details.",
};

/** Placeholder for opportunity “View Details” links from the dashboard. */
export default function StudentJobDetailsPlaceholderPage() {
  return (
    <StudentShell title="Job details" breadcrumb="Student / Job details">
      <div className="mx-auto max-w-2xl rounded-[12px] border border-border bg-card p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Job details</h2>
        <p className="mt-2 text-sm text-secondary-text">
          Detailed job view is not implemented yet.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/student/jobs"
            className="inline-flex rounded-[10px] border border-border bg-white px-4 py-2.5 text-sm font-medium text-primary outline-none transition hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Browse Jobs
          </Link>
          <Link
            href="/student/dashboard"
            className="inline-flex rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Back to Overview
          </Link>
        </div>
      </div>
    </StudentShell>
  );
}
