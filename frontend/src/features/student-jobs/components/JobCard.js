"use client";

import {
  Building2,
  CalendarDays,
  GraduationCap,
  MapPin,
  Wallet,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

function formatDeadline(isoDate) {
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

export default function JobCard({
  job,
  onViewDetails,
  onApply,
  applyDisabled = false,
}) {
  const alreadyApplied =
    job.applicationStatus && job.applicationStatus !== "Not Applied";

  return (
    <article className="flex flex-col rounded-[12px] border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-primary/10 text-sm font-semibold text-primary"
          aria-hidden="true"
        >
          {job.companyInitials ?? job.company?.slice(0, 2)?.toUpperCase() ?? "??"}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                {job.title}
              </h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-secondary-text">
                <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{job.company}</span>
              </p>
            </div>
            {job.applicationStatus ? (
              <StatusBadge status={job.applicationStatus} />
            ) : null}
          </div>
        </div>
      </div>

      <dl className="mt-4 grid gap-2 text-sm text-secondary-text sm:grid-cols-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Location</dt>
          <dd>{job.location || "—"}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Job type</dt>
          <dd className="rounded-[8px] border border-border bg-background px-2 py-0.5 text-xs font-medium text-foreground">
            {job.jobType || "—"}
          </dd>
        </div>
        {job.ctc ? (
          <div className="flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <dt className="sr-only">CTC</dt>
            <dd>{job.ctc}</dd>
          </div>
        ) : null}
        {job.eligibility || job.minCgpa != null ? (
          <div className="flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <dt className="sr-only">Eligibility</dt>
            <dd className="truncate">
              {job.eligibility || `Min CGPA ${job.minCgpa}`}
            </dd>
          </div>
        ) : null}
        <div className="flex items-center gap-1.5 sm:col-span-2">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Deadline</dt>
          <dd>Apply by {formatDeadline(job.deadline)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => onViewDetails?.(job)}
          className="inline-flex flex-1 items-center justify-center rounded-[10px] border border-border bg-white px-3 py-2 text-sm font-semibold text-foreground outline-none transition hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40 sm:flex-none"
        >
          View Details
        </button>
        <button
          type="button"
          onClick={() => onApply?.(job)}
          disabled={applyDisabled || alreadyApplied}
          className="inline-flex flex-1 items-center justify-center rounded-[10px] bg-primary px-3 py-2 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
        >
          {alreadyApplied ? "Applied" : "Apply Now"}
        </button>
      </div>
    </article>
  );
}
