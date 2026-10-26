"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  FilePenLine,
  Lock,
  Plus,
  Search,
} from "lucide-react";
import RecruiterShell from "@/components/layout/RecruiterShell";
import StatusBadge from "@/components/ui/StatusBadge";
import SummaryCard from "@/components/ui/SummaryCard";
import JobFormModal from "@/features/recruiter-jobs/components/JobFormModal";
import {
  fetchRecruiterJobs,
  RecruiterJobsServiceError,
} from "@/services/recruiterJobsService";

const STATUS_FILTERS = ["All", "Draft", "Published", "Closed"];

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

function createLocalId() {
  return `rj-local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function ManageJobsView() {
  const [recruiter, setRecruiter] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingJob, setEditingJob] = useState(null);
  const [viewJob, setViewJob] = useState(null);
  const [mockNotice, setMockNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchRecruiterJobs();
        if (!cancelled) {
          setRecruiter(result.recruiter);
          setJobs(result.jobs ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof RecruiterJobsServiceError
              ? err.message
              : "Unable to load jobs. Please try again.";
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

  const summary = useMemo(() => {
    return {
      total: jobs.length,
      published: jobs.filter((job) => job.status === "Published").length,
      draft: jobs.filter((job) => job.status === "Draft").length,
      closed: jobs.filter((job) => job.status === "Closed").length,
    };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      if (statusFilter !== "All" && job.status !== statusFilter) {
        return false;
      }
      if (!query) {
        return true;
      }

      const haystack = [job.title, job.location, job.jobType, job.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [jobs, search, statusFilter]);

  function openCreate() {
    setFormMode("create");
    setEditingJob(null);
    setFormOpen(true);
  }

  function openEdit(job) {
    setFormMode("edit");
    setEditingJob(job);
    setFormOpen(true);
  }

  function handleFormSubmit(values) {
    if (error) {
      return;
    }
    if (formMode === "edit" && editingJob) {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === editingJob.id
            ? {
                ...job,
                ...values,
              }
            : job,
        ),
      );
      setMockNotice(
        `Updated “${values.title}” in local UI only. No backend save occurred.`,
      );
    } else {
      const nextJob = {
        id: createLocalId(),
        ...values,
        postedAt: new Date().toISOString().slice(0, 10),
        applicants: 0,
      };
      setJobs((prev) => [nextJob, ...prev]);
      setMockNotice(
        `Created “${values.title}” in local UI only. No backend save occurred.`,
      );
    }

    setFormOpen(false);
    setEditingJob(null);
  }

  function handleCloseJob(job) {
    if (job.status === "Closed") {
      return;
    }

    setJobs((prev) =>
      prev.map((item) =>
        item.id === job.id ? { ...item, status: "Closed" } : item,
      ),
    );
    setMockNotice(
      `Closed “${job.title}” in local UI only. No backend save occurred.`,
    );
  }

  return (
    <RecruiterShell
      title="Manage Jobs"
      breadcrumb="Recruiter / Manage Jobs"
      recruiter={recruiter}
      actions={
        <button
          type="button"
          onClick={openCreate}
          disabled={loading || Boolean(error)}
          className="inline-flex items-center gap-1.5 rounded-[10px] bg-primary px-3 py-2 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Create Job</span>
          <span className="sm:hidden">Create</span>
        </button>
      }
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Manage Jobs
            </h2>
            <p className="mt-1 text-sm text-secondary-text sm:text-base">
              Track drafts, published drives, and closed postings for your
              company.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            disabled={loading || Boolean(error)}
            className="inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40 sm:hidden"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Job
          </button>
        </div>

        {mockNotice ? (
          <div
            role="status"
            className="rounded-[12px] border border-border bg-card px-4 py-3 text-sm text-secondary-text"
          >
            {mockNotice}
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
            label="Total jobs"
            value={summary.total}
            loading={loading}
          />
          <SummaryCard
            label="Published"
            value={summary.published}
            loading={loading}
          />
          <SummaryCard
            label="Draft"
            value={summary.draft}
            loading={loading}
          />
          <SummaryCard
            label="Closed"
            value={summary.closed}
            loading={loading}
          />
        </div>

        <section className="rounded-[12px] border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <label className="block min-w-0 flex-1 text-sm">
              <span className="mb-1.5 block font-medium text-foreground">
                Search
              </span>
              <span className="relative block">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-text"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title, location, or type"
                  className="w-full rounded-[10px] border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-secondary-text/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                />
              </span>
            </label>

            <label className="block text-sm md:w-48">
              <span className="mb-1.5 block font-medium text-foreground">
                Status
              </span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-[10px] border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                {STATUS_FILTERS.map((option) => (
                  <option key={option} value={option}>
                    {option === "All" ? "All statuses" : option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="overflow-hidden rounded-[12px] border border-border bg-card shadow-sm">
          {loading ? (
            <div className="space-y-3 p-5" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-[10px] bg-border/60"
                />
              ))}
            </div>
          ) : null}

          {!loading && filteredJobs.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-base font-semibold text-foreground">
                No jobs found
              </p>
              <p className="mt-2 text-sm text-secondary-text">
                Create a job or clear filters to see postings here.
              </p>
              <button
                type="button"
                onClick={openCreate}
                className="mt-5 inline-flex items-center gap-1.5 rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-white outline-none hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create Job
              </button>
            </div>
          ) : null}

          {!loading && filteredJobs.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border bg-background/80 text-secondary-text">
                    <tr>
                      <th className="px-5 py-3 font-medium">Title</th>
                      <th className="px-5 py-3 font-medium">Type</th>
                      <th className="px-5 py-3 font-medium">Location</th>
                      <th className="px-5 py-3 font-medium">Posted</th>
                      <th className="px-5 py-3 font-medium">Deadline</th>
                      <th className="px-5 py-3 font-medium">Applicants</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((job) => (
                      <tr
                        key={job.id}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="px-5 py-3 font-medium text-foreground">
                          {job.title}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {job.jobType}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {job.location}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {formatDate(job.postedAt)}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {formatDate(job.deadline)}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {job.applicants ?? 0}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={job.status} />
                        </td>
                        <td className="px-5 py-3">
                          <JobActions
                            job={job}
                            onView={setViewJob}
                            onEdit={openEdit}
                            onClose={handleCloseJob}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="divide-y divide-border md:hidden">
                {filteredJobs.map((job) => (
                  <li key={job.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {job.title}
                        </p>
                        <p className="mt-1 text-sm text-secondary-text">
                          {job.jobType} · {job.location}
                        </p>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                    <p className="text-sm text-secondary-text">
                      Posted {formatDate(job.postedAt)} · Deadline{" "}
                      {formatDate(job.deadline)} · {job.applicants ?? 0}{" "}
                      applicants
                    </p>
                    <JobActions
                      job={job}
                      onView={setViewJob}
                      onEdit={openEdit}
                      onClose={handleCloseJob}
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      </div>

      <JobFormModal
        open={formOpen}
        mode={formMode}
        initialJob={editingJob}
        onClose={() => {
          setFormOpen(false);
          setEditingJob(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {viewJob ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-4 sm:items-center"
          role="presentation"
          onClick={() => setViewJob(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-job-title"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[12px] border border-border bg-card p-5 shadow-lg sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h3
              id="view-job-title"
              className="text-lg font-semibold text-foreground"
            >
              {viewJob.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-secondary-text">
              {viewJob.description}
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-secondary-text">Status</dt>
                <dd>
                  <StatusBadge status={viewJob.status} />
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-secondary-text">Location</dt>
                <dd className="text-foreground">{viewJob.location}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-secondary-text">Type</dt>
                <dd className="text-foreground">{viewJob.jobType}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-secondary-text">Salary</dt>
                <dd className="text-foreground">{viewJob.salary || "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-secondary-text">Eligibility</dt>
                <dd className="text-right text-foreground">
                  {viewJob.eligibility}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-secondary-text">Skills</dt>
                <dd className="text-right text-foreground">{viewJob.skills}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setViewJob(null)}
              className="mt-6 rounded-[10px] border border-border px-4 py-2 text-sm font-semibold text-foreground outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </RecruiterShell>
  );
}

function JobActions({ job, onView, onEdit, onClose }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <ActionButton label="View" onClick={() => onView(job)} icon={Eye} />
      <ActionButton
        label="Edit"
        onClick={() => onEdit(job)}
        icon={FilePenLine}
      />
      <ActionButton
        label="Close"
        onClick={() => onClose(job)}
        icon={Lock}
        disabled={job.status === "Closed"}
      />
    </div>
  );
}

function ActionButton({ label, onClick, icon: Icon, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1 rounded-[8px] border border-border bg-white px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none transition hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}
