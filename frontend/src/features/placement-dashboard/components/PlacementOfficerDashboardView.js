"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Users,
} from "lucide-react";
import PlacementOfficerShell from "@/components/layout/PlacementOfficerShell";
import StatusBadge from "@/components/ui/StatusBadge";
import SummaryCard from "@/components/ui/SummaryCard";
import {
  fetchPlacementDashboard,
  PlacementDashboardServiceError,
} from "@/services/placementDashboardService";

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

export default function PlacementOfficerDashboardView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchPlacementDashboard();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof PlacementDashboardServiceError
              ? err.message
              : "Unable to load the placement dashboard. Please try again.";
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

  const officer = data?.officer;
  const summary = data?.summary;
  const recentDrives = data?.recentDrives ?? [];
  const upcomingInterviews = data?.upcomingInterviews ?? [];
  const recentStudentActivity = data?.recentStudentActivity ?? [];
  const demoNotice = data?.demoNotice;

  return (
    <PlacementOfficerShell
      title="Overview"
      breadcrumb="Placement / Overview"
      officer={officer}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome back, {officer?.displayName ?? "Placement Officer"}
          </h2>
          <p className="mt-1 text-sm text-secondary-text sm:text-base">
            Monitor students, drives, applications, and placement outcomes.
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
            label="Registered Students"
            value={summary?.registeredStudents ?? "—"}
            icon={Users}
            loading={loading}
          />
          <SummaryCard
            label="Active Drives"
            value={summary?.activeDrives ?? "—"}
            icon={BriefcaseBusiness}
            loading={loading}
          />
          <SummaryCard
            label="Applications"
            value={summary?.applications ?? "—"}
            icon={ClipboardList}
            loading={loading}
          />
          <SummaryCard
            label="Students Placed"
            value={summary?.studentsPlaced ?? "—"}
            icon={GraduationCap}
            loading={loading}
          />
        </div>

        <SectionCard
          title="Recent placement drives"
          action={
            <Link
              href="/placement/drives"
              className="text-sm font-medium text-primary outline-none hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              View drives
            </Link>
          }
        >
          {loading ? (
            <LoadingBlock />
          ) : recentDrives.length === 0 ? (
            <EmptyState message="No recent placement drives to show." />
          ) : (
            <>
              <div className="hidden border-b border-border px-5 py-2 text-xs font-medium uppercase tracking-wide text-secondary-text sm:grid sm:grid-cols-[1.4fr_1fr_0.9fr_0.8fr] sm:gap-4">
                <span>Company</span>
                <span>Drive</span>
                <span>Deadline</span>
                <span>Status</span>
              </div>
              <ul className="divide-y divide-border">
                {recentDrives.map((drive) => (
                  <li
                    key={drive.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:grid sm:grid-cols-[1.4fr_1fr_0.9fr_0.8fr] sm:items-center sm:gap-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {drive.company}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-secondary-text sm:hidden">
                        {drive.title}
                      </p>
                    </div>
                    <p className="hidden truncate text-sm text-secondary-text sm:block">
                      {drive.title}
                    </p>
                    <p className="text-sm text-secondary-text">
                      <span className="sm:hidden">Deadline: </span>
                      {formatDate(drive.deadline)}
                    </p>
                    <StatusBadge status={drive.status} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard title="Upcoming interviews">
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
                        {interview.company}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-secondary-text">
                        {interview.jobTitle
                          ? `${interview.jobTitle} · ${formatDate(interview.date)}`
                          : formatDate(interview.date)}
                      </p>
                    </div>
                    <StatusBadge status={interview.status ?? "Scheduled"} />
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard
            title="Recent student placement activity"
            action={
              <Link
                href="/placement/students"
                className="text-sm font-medium text-primary outline-none hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                View students
              </Link>
            }
          >
            {loading ? (
              <LoadingBlock rows={2} />
            ) : recentStudentActivity.length === 0 ? (
              <EmptyState message="No recent student placement activity to show." />
            ) : (
              <ul className="divide-y divide-border">
                {recentStudentActivity.map((activity) => (
                  <li
                    key={activity.id}
                    className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {activity.student}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-secondary-text">
                        {activity.jobTitle
                          ? `${activity.jobTitle} · ${activity.company}`
                          : activity.company}
                      </p>
                    </div>
                    <StatusBadge status={activity.status} />
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>

        <SectionCard title="Quick links">
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            <QuickActionLink
              href="/placement/students"
              label="Students"
              description="Browse registered students"
              icon={Users}
            />
            <QuickActionLink
              href="/placement/drives"
              label="Placement Drives"
              description="Review campus hiring drives"
              icon={CalendarDays}
            />
          </div>
        </SectionCard>
      </div>
    </PlacementOfficerShell>
  );
}
