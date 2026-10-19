import Link from "next/link";
import StudentShell from "@/components/layout/StudentShell";

export const metadata = {
  title: "My Profile | CampusPlacements",
  description: "Manage your student placement profile.",
};

/** Placeholder route so student navigation and profile links resolve cleanly. */
export default function StudentProfilePlaceholderPage() {
  return (
    <StudentShell title="My Profile" breadcrumb="Student / My Profile">
      <div className="mx-auto max-w-2xl rounded-[12px] border border-border bg-card p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">My Profile</h2>
        <p className="mt-2 text-sm text-secondary-text">
          Profile editing will be available in a later phase.
        </p>
        <Link
          href="/student/dashboard"
          className="mt-6 inline-flex rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Back to Overview
        </Link>
      </div>
    </StudentShell>
  );
}
