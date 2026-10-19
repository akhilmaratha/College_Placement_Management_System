"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Search, X } from "lucide-react";
import StudentShell from "@/components/layout/StudentShell";
import JobCard from "@/features/student-jobs/components/JobCard";
import {
  fetchStudentJobs,
  StudentJobsServiceError,
} from "@/services/studentJobsService";

const PAGE_SIZE = 6;

const JOB_TYPES = ["All", "Full-time", "Internship"];
const LOCATIONS = ["All", "Bengaluru", "Hyderabad", "Pune", "Chennai", "Mumbai", "Remote"];
const ELIGIBILITY_FILTERS = [
  { value: "all", label: "All eligibility" },
  { value: "cse", label: "CSE / IT focus" },
  { value: "any", label: "Any branch" },
];
const APPLICATION_STATUSES = [
  "All",
  "Not Applied",
  "Applied",
  "Shortlisted",
  "Rejected",
];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "deadline", label: "Deadline" },
];

function matchesEligibility(job, filter) {
  if (filter === "all") {
    return true;
  }

  const text = `${job.eligibility ?? ""}`.toLowerCase();
  if (filter === "cse") {
    return text.includes("cse") || text.includes("it");
  }
  if (filter === "any") {
    return text.includes("any branch");
  }
  return true;
}

export default function BrowseJobsView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [eligibility, setEligibility] = useState("all");
  const [applicationStatus, setApplicationStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [extraVisible, setExtraVisible] = useState(0);
  const [activeFilterKey, setActiveFilterKey] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [actionNotice, setActionNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchStudentJobs();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof StudentJobsServiceError
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

  const filteredJobs = useMemo(() => {
    const jobs = data?.jobs ?? [];
    const query = search.trim().toLowerCase();

    const next = jobs.filter((job) => {
      if (location !== "All" && job.location !== location) {
        return false;
      }
      if (jobType !== "All" && job.jobType !== jobType) {
        return false;
      }
      if (
        applicationStatus !== "All" &&
        job.applicationStatus !== applicationStatus
      ) {
        return false;
      }
      if (!matchesEligibility(job, eligibility)) {
        return false;
      }
      if (!query) {
        return true;
      }

      const haystack = [
        job.title,
        job.company,
        job.location,
        job.jobType,
        job.eligibility,
        job.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });

    next.sort((a, b) => {
      if (sortBy === "deadline") {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return new Date(b.postedAt) - new Date(a.postedAt);
    });

    return next;
  }, [
    data?.jobs,
    search,
    location,
    jobType,
    eligibility,
    applicationStatus,
    sortBy,
  ]);

  const filterKey = [
    search,
    location,
    jobType,
    eligibility,
    applicationStatus,
    sortBy,
  ].join("|");

  if (filterKey !== activeFilterKey) {
    setActiveFilterKey(filterKey);
    setExtraVisible(0);
  }

  const visibleCount = PAGE_SIZE + extraVisible;
  const visibleJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  function handleApply(job) {
    setActionNotice(
      `Applications are not connected yet. “${job.title}” cannot be submitted until the backend is available.`,
    );
  }

  const filterControls = (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-foreground">Location</span>
        <select
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="w-full rounded-[10px] border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          {LOCATIONS.map((option) => (
            <option key={option} value={option}>
              {option === "All" ? "All locations" : option}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-foreground">Job type</span>
        <select
          value={jobType}
          onChange={(event) => setJobType(event.target.value)}
          className="w-full rounded-[10px] border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          {JOB_TYPES.map((option) => (
            <option key={option} value={option}>
              {option === "All" ? "All types" : option}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-foreground">
          Eligibility
        </span>
        <select
          value={eligibility}
          onChange={(event) => setEligibility(event.target.value)}
          className="w-full rounded-[10px] border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          {ELIGIBILITY_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-foreground">
          Application status
        </span>
        <select
          value={applicationStatus}
          onChange={(event) => setApplicationStatus(event.target.value)}
          className="w-full rounded-[10px] border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          {APPLICATION_STATUSES.map((option) => (
            <option key={option} value={option}>
              {option === "All" ? "All statuses" : option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  return (
    <StudentShell
      title="Browse Jobs"
      breadcrumb="Student / Browse Jobs"
      student={data?.student}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Browse Jobs
          </h2>
          <p className="mt-1 text-sm text-secondary-text sm:text-base">
            Search eligible placement drives and filter by location, type, and
            status.
          </p>
        </div>

        {actionNotice ? (
          <div
            role="status"
            className="rounded-[12px] border border-border bg-card px-4 py-3 text-sm text-secondary-text"
          >
            {actionNotice}
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

        <section className="rounded-[12px] border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
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
                  placeholder="Title, company, or keyword"
                  className="w-full rounded-[10px] border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-secondary-text/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                />
              </span>
            </label>

            <label className="block text-sm lg:w-44">
              <span className="mb-1.5 block font-medium text-foreground">
                Sort by
              </span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full rounded-[10px] border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-border bg-white px-3 py-2.5 text-sm font-semibold text-foreground outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40 lg:hidden"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              Filters
            </button>
          </div>

          <div className="mt-4 hidden lg:block">{filterControls}</div>
          {filtersOpen ? (
            <div className="mt-4 border-t border-border pt-4 lg:hidden">
              {filterControls}
            </div>
          ) : null}
        </section>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-56 animate-pulse rounded-[12px] border border-border bg-card"
              />
            ))}
          </div>
        ) : null}

        {!loading && !error && filteredJobs.length === 0 ? (
          <div className="rounded-[12px] border border-border bg-card px-6 py-14 text-center shadow-sm">
            <p className="text-base font-semibold text-foreground">
              No jobs match your filters
            </p>
            <p className="mt-2 text-sm text-secondary-text">
              Try clearing search or widening location and eligibility filters.
            </p>
          </div>
        ) : null}

        {!loading && filteredJobs.length > 0 ? (
          <>
            <p className="text-sm text-secondary-text">
              Showing {visibleJobs.length} of {filteredJobs.length} jobs
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {visibleJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={setSelectedJob}
                  onApply={handleApply}
                />
              ))}
            </div>
            {hasMore ? (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setExtraVisible((count) => count + PAGE_SIZE)
                  }
                  className="rounded-[10px] border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground outline-none transition hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  Load more
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      {selectedJob ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-4 sm:items-center"
          role="presentation"
          onClick={() => setSelectedJob(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-detail-title"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[12px] border border-border bg-card p-5 shadow-lg sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3
                  id="job-detail-title"
                  className="text-lg font-semibold text-foreground"
                >
                  {selectedJob.title}
                </h3>
                <p className="mt-1 text-sm text-secondary-text">
                  {selectedJob.company}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded-[10px] p-2 text-secondary-text outline-none hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Close details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-secondary-text">
              {selectedJob.description || "No description available."}
            </p>
            <dl className="mt-4 space-y-2 text-sm text-foreground">
              <div className="flex justify-between gap-3">
                <dt className="text-secondary-text">Location</dt>
                <dd>{selectedJob.location}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-secondary-text">Type</dt>
                <dd>{selectedJob.jobType}</dd>
              </div>
              {selectedJob.ctc ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-secondary-text">CTC</dt>
                  <dd>{selectedJob.ctc}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-3">
                <dt className="text-secondary-text">Eligibility</dt>
                <dd className="text-right">{selectedJob.eligibility}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded-[10px] border border-border px-4 py-2 text-sm font-semibold text-foreground outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleApply(selectedJob);
                  setSelectedJob(null);
                }}
                disabled={
                  selectedJob.applicationStatus &&
                  selectedJob.applicationStatus !== "Not Applied"
                }
                className="rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-white outline-none hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </StudentShell>
  );
}
