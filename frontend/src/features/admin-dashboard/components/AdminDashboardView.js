"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Building2,
  CalendarDays,
  GraduationCap,
  Users,
} from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import StatusBadge from "@/components/ui/StatusBadge";
import SummaryCard from "@/components/ui/SummaryCard";
import PlacementOverviewChart from "@/features/admin-dashboard/components/PlacementOverviewChart";
import {
  fetchAdminDashboard,
  AdminDashboardServiceError,
} from "@/services/adminDashboardService";

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

function QuickActionButton({ label, icon: Icon }) {
  return (
    <button
      type="button"
      disabled
      title="Not available yet"
      className="flex cursor-not-allowed items-center gap-3 rounded-[12px] border border-border bg-card px-4 py-4 text-left opacity-70 shadow-sm"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        <span className="mt-0.5 block text-xs text-secondary-text">Coming soon</span>
      </span>
    </button>
  );
}

export default function AdminDashboardView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchAdminDashboard();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof AdminDashboardServiceError
              ? err.message
              : "Unable to load the admin dashboard. Please try again.";
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

  const admin = data?.admin;
  const summary = data?.summary;
  const placementOverview = data?.placementOverview;
  const recentDrives = data?.recentDrives ?? [];
  const recentApplications = data?.recentApplications ?? [];
  const upcomingInterviews = data?.upcomingInterviews ?? [];
  const demoNotice = data?.demoNotice;

  return (
    <AdminShell
      title="Admin Dashboard"
      breadcrumb="Dashboard / Overview"
      admin={admin}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Placement overview
          </h2>
          <p className="mt-1 text-sm text-secondary-text sm:text-base">
            Monitor students, companies, drives, and placement activity.
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
            label="Total Students"
            value={summary?.totalStudents ?? "—"}
            icon={Users}
            loading={loading}
          />
          <SummaryCard
            label="Registered Companies"
            value={summary?.registeredCompanies ?? "—"}
            icon={Building2}
            loading={loading}
          />
          <SummaryCard
            label="Active Placement Drives"
            value={summary?.activePlacementDrives ?? "—"}
            icon={CalendarDays}
            loading={loading}
          />
          <SummaryCard
            label="Students Placed"
            value={summary?.studentsPlaced ?? "—"}
            icon={GraduationCap}
            loading={loading}
          />
        </div>

        <SectionCard title="Placement Overview Chart">
          <PlacementOverviewChart
            months={placementOverview?.months ?? []}
            label={placementOverview?.label ?? "Demo placement overview"}
            loading={loading}
          />
        </SectionCard>

        <SectionCard title="Recent Placement Drives">
          {loading ? (
            <LoadingBlock />
          ) : recentDrives.length === 0 ? (
            <EmptyState message="No recent placement drives to show." />
          ) : (
            <>
              <div className="hidden border-b border-border px-5 py-2 text-xs font-medium uppercase tracking-wide text-secondary-text sm:grid sm:grid-cols-[1.5fr_1fr_0.9fr_0.7fr_auto] sm:gap-4">
                <span>Drive</span>
                <span>Company</span>
                <span>Deadline</span>
                <span>Status</span>
                <span className="sr-only">Actions</span>
              </div>
              <ul className="divide-y divide-border">
                {recentDrives.map((drive) => (
                  <li
                    key={drive.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:grid sm:grid-cols-[1.5fr_1fr_0.9fr_0.7fr_auto] sm:items-center sm:gap-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {drive.title}
                      </p>
                      <p className="mt-0.5 text-sm text-secondary-text sm:hidden">
                        {drive.company}
                      </p>
                    </div>
                    <p className="hidden truncate text-sm text-secondary-text sm:block">
                      {drive.company}
                    </p>
                    <p className="text-sm text-secondary-text">
                      <span className="sm:hidden">Deadline: </span>
                      {formatDate(drive.deadline)}
                    </p>
                    <StatusBadge status={drive.status} />
                    <button
                      type="button"
                      disabled
                      title="Drive details not available yet"
                      className="rounded-[10px] border border-border px-3 py-1.5 text-sm font-medium text-secondary-text/70 outline-none sm:justify-self-end"
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </SectionCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Recent Applications">
            {loading ? (
              <LoadingBlock />
            ) : recentApplications.length === 0 ? (
              <EmptyState message="No recent applications to show." />
            ) : (
              <ul className="divide-y divide-border">
                {recentApplications.map((application) => (
                  <li
                    key={application.id}
                    className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {application.student}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-secondary-text">
                        {application.jobTitle} · {application.company}
                        {application.appliedDate
                          ? ` · ${formatDate(application.appliedDate)}`
                          : ""}
                      </p>
                    </div>
                    <StatusBadge status={application.status} />
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Upcoming Interviews">
            {loading ? (
              <LoadingBlock rows={2} />
            ) : upcomingInterviews.length === 0 ? (
              <EmptyState message="No upcoming interviews scheduled." />
            ) : (
              <ul className="divide-y divide-border">
                {upcomingInterviews.map((interview) => (
                  <li
                    key={interview.id}
                    className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {interview.student}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-secondary-text">
                        {interview.company} · {interview.jobTitle}
                        {interview.scheduledAt ? ` · ${interview.scheduledAt}` : ""}
                      </p>
                    </div>
                    {interview.status ? (
                      <StatusBadge status={interview.status} />
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>

        <SectionCard title="Quick Actions">
          <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
            <QuickActionButton label="Manage Students" icon={Users} />
            <QuickActionButton label="Manage Companies" icon={Building2} />
            <QuickActionButton label="Create Placement Drive" icon={CalendarDays} />
            <QuickActionButton label="View Reports" icon={BarChart3} />
          </div>
        </SectionCard>
      </div>
    </AdminShell>
  );
}
