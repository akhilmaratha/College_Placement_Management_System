"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StudentShell from "@/components/layout/StudentShell";
import StatusBadge from "@/components/ui/StatusBadge";
import SummaryCard from "@/components/ui/SummaryCard";
import OpportunityRow from "@/features/student-dashboard/components/OpportunityRow";
import { Award, Briefcase, Calendar, ClipboardList } from "lucide-react";
import {
  fetchStudentDashboard,
  StudentDashboardServiceError,
} from "@/services/studentDashboardService";

function formatAppliedDate(isoDate) {
  if (!isoDate) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

function SectionCard({ title, action, children }) {
  return (
    <section className="rounded-[12px] border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function LoadingBlock({ rows = 3 }) {
  return (
    <div className="space-y-3 p-5" aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-[10px] bg-border/60" />
      ))}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-sm text-secondary-text">{message}</p>
    </div>
  );
}

export default function StudentDashboardView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchStudentDashboard();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof StudentDashboardServiceError
              ? err.message
              : "Unable to load your dashboard. Please try again.";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const student = data?.student;
  const summary = data?.summary;
  const profile = data?.profileCompletion;
  const opportunities = data?.eligibleOpportunities ?? [];
  const applications = data?.recentApplications ?? [];
  const interviews = data?.upcomingInterviews ?? [];

  return (
    <StudentShell
      title="Overview"
      breadcrumb="Student / Overview"
      student={student}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome back, {student?.displayName ?? "Student"}
          </h2>
          <p className="mt-1 text-sm text-secondary-text sm:text-base">
            Here is an overview of your placement activity.
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-[12px] border border-error/30 bg-error-bg px-4 py-3 text-sm text-error"
          >
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Eligible Job Drives"
            value={summary?.eligibleJobDrives ?? "—"}
            icon={Briefcase}
            loading={loading}
          />
          <SummaryCard
            label="Applications Submitted"
            value={summary?.applicationsSubmitted ?? "—"}
            icon={ClipboardList}
            loading={loading}
          />
          <SummaryCard
            label="Interviews Scheduled"
            value={summary?.interviewsScheduled ?? "—"}
            icon={Calendar}
            loading={loading}
          />
          <SummaryCard
            label="Offers Received"
            value={summary?.offersReceived ?? "—"}
            icon={Award}
            loading={loading}
          />
        </div>

        <SectionCard
          title="Profile completion"
          action={
            <Link
              href="/student/profile"
              className="text-sm font-medium text-primary outline-none hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Complete profile
            </Link>
          }
        >
          {loading ? (
            <LoadingBlock rows={2} />
          ) : profile ? (
            <div className="space-y-4 p-5">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    {profile.percent}% complete
                  </p>
                  <p className="text-xs text-secondary-text">
                    Keep your profile updated for eligibility matching
                  </p>
                </div>
                <div
                  className="h-2.5 overflow-hidden rounded-full bg-border"
                  role="progressbar"
                  aria-valuenow={profile.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Profile completion"
                >
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, profile.percent))}%` }}
                  />
                </div>
              </div>
              {profile.missingDetails?.length ? (
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Missing details
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-secondary-text">
                    {profile.missingDetails.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-secondary-text">
                  Your profile looks complete. You can still review details anytime.
                </p>
              )}
            </div>
          ) : (
            <EmptyState message="Profile completion data is unavailable." />
          )}
        </SectionCard>

        <SectionCard
          title="Eligible opportunities"
          action={
            <Link
              href="/student/jobs"
              className="text-sm font-medium text-primary outline-none hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Browse all
            </Link>
          }
        >
          {loading ? (
            <LoadingBlock />
          ) : opportunities.length === 0 ? (
            <EmptyState message="No eligible job drives right now. Check Browse Jobs for new openings." />
          ) : (
            <>
              <div className="hidden border-b border-border px-5 py-2 text-xs font-medium uppercase tracking-wide text-secondary-text sm:grid sm:grid-cols-[1.4fr_1fr_0.8fr_auto] sm:gap-4">
                <span>Role / Company</span>
                <span>Eligibility</span>
                <span>Deadline</span>
                <span className="sr-only">Actions</span>
              </div>
              <ul>
                {opportunities.map((opportunity) => (
                  <OpportunityRow key={opportunity.id} opportunity={opportunity} />
                ))}
              </ul>
            </>
          )}
        </SectionCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            title="Recent applications"
            action={
              <Link
                href="/student/applications"
                className="text-sm font-medium text-primary outline-none hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                View all
              </Link>
            }
          >
            {loading ? (
              <LoadingBlock />
            ) : applications.length === 0 ? (
              <EmptyState message="You have not submitted any applications yet." />
            ) : (
              <ul className="divide-y divide-border">
                {applications.map((application) => (
                  <li
                    key={application.id}
                    className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {application.jobTitle}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-secondary-text">
                        {application.company} · Applied{" "}
                        {formatAppliedDate(application.appliedDate)}
                      </p>
                    </div>
                    <StatusBadge status={application.status} />
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Upcoming interviews">
            {loading ? (
              <LoadingBlock rows={2} />
            ) : interviews.length === 0 ? (
              <EmptyState message="No upcoming interviews scheduled. When shortlisted, interview details will appear here." />
            ) : (
              <ul className="divide-y divide-border">
                {interviews.map((interview) => (
                  <li key={interview.id} className="px-5 py-4">
                    <p className="font-semibold text-foreground">
                      {interview.jobTitle}
                    </p>
                    <p className="mt-0.5 text-sm text-secondary-text">
                      {interview.company} · {interview.scheduledAt}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>
    </StudentShell>
  );
}
