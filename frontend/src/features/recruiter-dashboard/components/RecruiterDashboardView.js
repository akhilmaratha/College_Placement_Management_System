"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ClipboardList,
  FilePlus2,
  Users,
} from "lucide-react";
import RecruiterShell from "@/components/layout/RecruiterShell";
import StatusBadge from "@/components/ui/StatusBadge";
import SummaryCard from "@/components/ui/SummaryCard";
import {
  fetchRecruiterDashboard,
  RecruiterDashboardServiceError,
} from "@/services/recruiterDashboardService";

function formatDate(isoDate) {
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

function QuickActionLink({ href, label, description, icon: Icon }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-[12px] border border-border bg-card px-4 py-4 text-left shadow-sm outline-none transition hover:border-primary/30 hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        <span className="mt-0.5 block text-xs text-secondary-text">
          {description}
        </span>
      </span>
    </Link>
  );
}

export default function RecruiterDashboardView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchRecruiterDashboard();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof RecruiterDashboardServiceError
              ? err.message
              : "Unable to load the recruiter dashboard. Please try again.";
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

  const recruiter = data?.recruiter;
  const summary = data?.summary;
  const recentJobs = data?.recentJobs ?? [];
  const recentApplicants = data?.recentApplicants ?? [];
  const demoNotice = data?.demoNotice;

  return (
    <RecruiterShell
      title="Overview"
      breadcrumb="Recruiter / Overview"
      recruiter={recruiter}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome back, {recruiter?.displayName ?? "Recruiter"}
          </h2>
          <p className="mt-1 text-sm text-secondary-text sm:text-base">
            {recruiter?.company
              ? `Hiring overview for ${recruiter.company}.`
              : "Monitor jobs, applicants, and interview activity."}
          </p>
        </div>

        {demoNotice ? (
          <div
            role="status"
            className="rounded-[12px] border border-info/25 bg-info-bg px-4 py-3 text-sm text-info"
          >
            {demoNotice}
          </div>
        ) : null}

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
            label="Total Jobs"
            value={summary?.totalJobs ?? "—"}
            icon={BriefcaseBusiness}
            loading={loading}
          />
          <SummaryCard
            label="Published Jobs"
            value={summary?.publishedJobs ?? "—"}
            icon={FilePlus2}
            loading={loading}
          />
          <SummaryCard
            label="Total Applicants"
            value={summary?.totalApplicants ?? "—"}
            icon={Users}
            loading={loading}
          />
          <SummaryCard
            label="Interviews Scheduled"
            value={summary?.interviewsScheduled ?? "—"}
            icon={CalendarDays}
            loading={loading}
          />
        </div>

        <SectionCard
          title="Recent job openings"
          action={
            <Link
              href="/recruiter/jobs"
              className="text-sm font-medium text-primary outline-none hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Manage jobs
            </Link>
          }
        >
          {loading ? (
            <LoadingBlock />
          ) : recentJobs.length === 0 ? (
            <EmptyState message="No job openings to show yet. Create a posting from Manage Jobs." />
          ) : (
            <>
              <div className="hidden border-b border-border px-5 py-2 text-xs font-medium uppercase tracking-wide text-secondary-text sm:grid sm:grid-cols-[1.6fr_0.8fr_0.9fr_0.7fr] sm:gap-4">
                <span>Title</span>
                <span>Status</span>
                <span>Deadline</span>
                <span>Applicants</span>
              </div>
              <ul className="divide-y divide-border">
                {recentJobs.map((job) => (
                  <li
                    key={job.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:grid sm:grid-cols-[1.6fr_0.8fr_0.9fr_0.7fr] sm:items-center sm:gap-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {job.title}
                      </p>
                      <p className="mt-0.5 text-sm text-secondary-text sm:hidden">
                        Deadline: {formatDate(job.deadline)}
                      </p>
                    </div>
                    <StatusBadge status={job.status} />
                    <p className="hidden text-sm text-secondary-text sm:block">
                      {formatDate(job.deadline)}
                    </p>
                    <p className="text-sm text-secondary-text">
                      <span className="sm:hidden">Applicants: </span>
                      {typeof job.applicantCount === "number"
                        ? job.applicantCount
                        : "—"}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </SectionCard>

        <SectionCard
          title="Recent applicant activity"
          action={
            <Link
              href="/recruiter/applicants"
              className="text-sm font-medium text-primary outline-none hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              View applicants
            </Link>
          }
        >
          {loading ? (
            <LoadingBlock />
          ) : recentApplicants.length === 0 ? (
            <EmptyState message="No recent applicant activity to show." />
          ) : (
            <ul className="divide-y divide-border">
              {recentApplicants.map((application) => (
                <li
                  key={application.id}
                  className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {application.candidateName}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-secondary-text">
                      {application.jobTitle}
                    </p>
                  </div>
                  <StatusBadge status={application.status} />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Quick actions">
          <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
            <QuickActionLink
              href="/recruiter/jobs"
              label="Manage Jobs"
              description="Create and publish openings"
              icon={BriefcaseBusiness}
            />
            <QuickActionLink
              href="/recruiter/company"
              label="Company Profile"
              description="Update company details"
              icon={Building2}
            />
            <QuickActionLink
              href="/recruiter/applicants"
              label="Applicants"
              description="Review candidate activity"
              icon={ClipboardList}
            />
          </div>
        </SectionCard>
      </div>
    </RecruiterShell>
  );
}
