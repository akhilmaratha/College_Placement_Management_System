"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  FilePenLine,
  Plus,
  Search,
  XCircle,
} from "lucide-react";
import PlacementOfficerShell from "@/components/layout/PlacementOfficerShell";
import StatusBadge from "@/components/ui/StatusBadge";
import SummaryCard from "@/components/ui/SummaryCard";
import InterviewFormModal from "@/features/placement-interviews/components/InterviewFormModal";
import {
  INTERVIEW_STATUSES,
  MOCK_COMPANIES,
  MOCK_JOB_OPENINGS,
  MOCK_STUDENTS,
} from "@/features/placement-interviews/data/placementInterviewsMockData";
import {
  fetchPlacementInterviews,
  PlacementInterviewsServiceError,
} from "@/services/placementInterviewsService";

const STATUS_FILTERS = ["All", ...INTERVIEW_STATUSES];

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

function formatTime(time) {
  if (!time) {
    return "—";
  }

  try {
    const [hours, minutes] = time.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return time;
    }
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch {
    return time;
  }
}

function formatDateTime(isoDate, time) {
  const datePart = formatDate(isoDate);
  const timePart = formatTime(time);
  if (datePart === "—" && timePart === "—") {
    return "—";
  }
  if (timePart === "—") {
    return datePart;
  }
  return `${datePart}, ${timePart}`;
}

function createLocalId() {
  return `pi-local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function canRescheduleOrCancel(interview) {
  return interview?.status === "Upcoming";
}

export default function InterviewsView() {
  const [officer, setOfficer] = useState(null);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [jobOpenings, setJobOpenings] = useState(MOCK_JOB_OPENINGS);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingInterview, setEditingInterview] = useState(null);
  const [cancellingInterview, setCancellingInterview] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [mockNotice, setMockNotice] = useState(
    "Showing mock interviews. Create, edit, reschedule, and cancel update local UI only — nothing is saved to a backend.",
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchPlacementInterviews();
        if (!cancelled) {
          setOfficer(result.officer ?? null);
          setStudents(
            result.students?.length ? result.students : MOCK_STUDENTS,
          );
          setCompanies(
            result.companies?.length ? result.companies : MOCK_COMPANIES,
          );
          setJobOpenings(
            result.jobOpenings?.length ? result.jobOpenings : MOCK_JOB_OPENINGS,
          );
          setInterviews(result.interviews ?? []);
          if (result.demoNotice) {
            setMockNotice(result.demoNotice);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof PlacementInterviewsServiceError
              ? err.message
              : "Unable to load interviews. Please try again.";
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

  const studentOptions = useMemo(() => {
    const fromInterviews = interviews
      .map((item) => item.studentName)
      .filter(Boolean);
    return Array.from(new Set([...students, ...fromInterviews])).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [students, interviews]);

  const companyOptions = useMemo(() => {
    const fromInterviews = interviews.map((item) => item.company).filter(Boolean);
    return Array.from(new Set([...companies, ...fromInterviews])).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [companies, interviews]);

  const jobOpeningOptions = useMemo(() => {
    const fromInterviews = interviews
      .filter((item) => item.company && item.jobTitle)
      .map((item) => ({ company: item.company, jobTitle: item.jobTitle }));
    const merged = [...jobOpenings, ...fromInterviews];
    const seen = new Set();
    return merged.filter((item) => {
      const key = `${item.company}::${item.jobTitle}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, [jobOpenings, interviews]);

  const summary = useMemo(() => {
    return {
      total: interviews.length,
      upcoming: interviews.filter((item) => item.status === "Upcoming").length,
      completed: interviews.filter((item) => item.status === "Completed")
        .length,
      cancelled: interviews.filter((item) => item.status === "Cancelled")
        .length,
    };
  }, [interviews]);

  const filteredInterviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return interviews.filter((interview) => {
      if (statusFilter !== "All" && interview.status !== statusFilter) {
        return false;
      }
      if (!query) {
        return true;
      }

      const haystack = [interview.studentName, interview.company]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [interviews, search, statusFilter]);

  function showFeedback(type, message) {
    setFeedback({ type, message });
  }

  function openCreate() {
    setFormMode("create");
    setEditingInterview(null);
    setFormOpen(true);
  }

  function openEdit(interview) {
    setFormMode("edit");
    setEditingInterview(interview);
    setFormOpen(true);
  }

  function openReschedule(interview) {
    if (!canRescheduleOrCancel(interview)) {
      return;
    }
    setFormMode("reschedule");
    setEditingInterview(interview);
    setFormOpen(true);
  }

  function handleFormSubmit(values) {
    if ((formMode === "edit" || formMode === "reschedule") && editingInterview) {
      const nextStatus =
        formMode === "reschedule" ? "Upcoming" : editingInterview.status;

      setInterviews((prev) =>
        prev.map((item) =>
          item.id === editingInterview.id
            ? {
                ...item,
                ...values,
                status: nextStatus,
              }
            : item,
        ),
      );

      const action =
        formMode === "reschedule" ? "Rescheduled" : "Updated";
      setMockNotice(
        `${action} interview for “${values.studentName}” with ${values.company} in local UI only. No backend save occurred.`,
      );
      showFeedback(
        "success",
        `${action} interview for ${values.studentName} (local UI only).`,
      );
    } else {
      const nextInterview = {
        id: createLocalId(),
        ...values,
        status: "Upcoming",
      };
      setInterviews((prev) => [nextInterview, ...prev]);
      setMockNotice(
        `Scheduled interview for “${values.studentName}” with ${values.company} in local UI only. No backend save occurred.`,
      );
      showFeedback(
        "success",
        `Interview scheduled for ${values.studentName} (local UI only).`,
      );
    }

    setFormOpen(false);
    setEditingInterview(null);
  }

  function requestCancel(interview) {
    if (!canRescheduleOrCancel(interview)) {
      return;
    }
    setCancellingInterview(interview);
  }

  function confirmCancel() {
    if (!cancellingInterview) {
      return;
    }

    setInterviews((prev) =>
      prev.map((item) =>
        item.id === cancellingInterview.id
          ? { ...item, status: "Cancelled" }
          : item,
      ),
    );
    setMockNotice(
      `Cancelled interview for “${cancellingInterview.studentName}” with ${cancellingInterview.company} in local UI only. No backend save occurred.`,
    );
    showFeedback(
      "success",
      `Cancelled interview for ${cancellingInterview.studentName} (local UI only).`,
    );
    setCancellingInterview(null);
  }

  return (
    <PlacementOfficerShell
      title="Interviews"
      breadcrumb="Placement / Interviews"
      officer={officer}
      actions={
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-[10px] bg-primary px-3 py-2 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Add Interview</span>
          <span className="sm:hidden">Add</span>
        </button>
      }
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Interviews
            </h2>
            <p className="mt-1 text-sm text-secondary-text sm:text-base">
              Schedule and track student interviews across campus drives.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40 sm:hidden"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Interview
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

        {feedback ? (
          <div
            role={feedback.type === "error" ? "alert" : "status"}
            className={`rounded-[12px] border px-4 py-3 text-sm ${
              feedback.type === "error"
                ? "border-error/30 bg-error-bg text-error"
                : "border-success/30 bg-success-bg text-success"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p>{feedback.message}</p>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="shrink-0 rounded-[8px] px-2 py-0.5 text-xs font-semibold outline-none hover:bg-white/50 focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Dismiss feedback"
              >
                Dismiss
              </button>
            </div>
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
            label="Total interviews"
            value={summary.total}
            loading={loading}
          />
          <SummaryCard
            label="Upcoming"
            value={summary.upcoming}
            loading={loading}
          />
          <SummaryCard
            label="Completed"
            value={summary.completed}
            loading={loading}
          />
          <SummaryCard
            label="Cancelled"
            value={summary.cancelled}
            loading={loading}
          />
        </div>

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
                  placeholder="Search by student or company"
                  className="w-full rounded-[10px] border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-secondary-text/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                />
              </span>
            </label>

            <label className="block text-sm lg:w-48">
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
            <div className="space-y-3 p-5" aria-busy="true" aria-live="polite">
              <span className="sr-only">Loading interviews</span>
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-[10px] bg-border/60"
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : null}

          {!loading && filteredInterviews.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-base font-semibold text-foreground">
                No interviews found
              </p>
              <p className="mt-2 text-sm text-secondary-text">
                Schedule an interview or clear filters to see interviews here.
              </p>
              <button
                type="button"
                onClick={openCreate}
                className="mt-5 inline-flex items-center gap-1.5 rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-white outline-none hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Interview
              </button>
            </div>
          ) : null}

          {!loading && filteredInterviews.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border bg-background/80 text-secondary-text">
                    <tr>
                      <th className="px-5 py-3 font-medium">Student</th>
                      <th className="px-5 py-3 font-medium">Company</th>
                      <th className="px-5 py-3 font-medium">Job title</th>
                      <th className="px-5 py-3 font-medium">Date &amp; time</th>
                      <th className="px-5 py-3 font-medium">Type</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInterviews.map((interview) => (
                      <tr
                        key={interview.id}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="px-5 py-3 font-medium text-foreground">
                          {interview.studentName}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {interview.company}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {interview.jobTitle}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {formatDateTime(
                            interview.interviewDate,
                            interview.interviewTime,
                          )}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {interview.interviewType}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={interview.status} />
                        </td>
                        <td className="px-5 py-3">
                          <InterviewActions
                            interview={interview}
                            onEdit={openEdit}
                            onReschedule={openReschedule}
                            onCancel={requestCancel}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="divide-y divide-border lg:hidden">
                {filteredInterviews.map((interview) => (
                  <li key={interview.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {interview.studentName}
                        </p>
                        <p className="mt-1 text-sm text-secondary-text">
                          {interview.company} · {interview.jobTitle}
                        </p>
                      </div>
                      <StatusBadge status={interview.status} />
                    </div>
                    <p className="text-sm text-secondary-text">
                      {formatDateTime(
                        interview.interviewDate,
                        interview.interviewTime,
                      )}{" "}
                      · {interview.interviewType}
                      {interview.location
                        ? ` · ${interview.location}`
                        : interview.meetingLink
                          ? " · Meeting link set"
                          : ""}
                    </p>
                    <InterviewActions
                      interview={interview}
                      onEdit={openEdit}
                      onReschedule={openReschedule}
                      onCancel={requestCancel}
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      </div>

      <InterviewFormModal
        open={formOpen}
        mode={formMode}
        initialInterview={editingInterview}
        students={studentOptions}
        companies={companyOptions}
        jobOpenings={jobOpeningOptions}
        onClose={() => {
          setFormOpen(false);
          setEditingInterview(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {cancellingInterview ? (
        <ConfirmCancelDialog
          interview={cancellingInterview}
          onCancel={() => setCancellingInterview(null)}
          onConfirm={confirmCancel}
        />
      ) : null}
    </PlacementOfficerShell>
  );
}

function InterviewActions({ interview, onEdit, onReschedule, onCancel }) {
  const mutable = canRescheduleOrCancel(interview);

  return (
    <div className="flex flex-wrap gap-1.5">
      <ActionButton
        label="Edit"
        onClick={() => onEdit(interview)}
        icon={FilePenLine}
      />
      <ActionButton
        label="Reschedule"
        onClick={() => onReschedule(interview)}
        icon={CalendarClock}
        disabled={!mutable}
      />
      <ActionButton
        label="Cancel"
        onClick={() => onCancel(interview)}
        icon={XCircle}
        disabled={!mutable}
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

function ConfirmCancelDialog({ interview, onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 p-4 sm:items-center"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-cancel-interview-title"
        className="w-full max-w-md rounded-[12px] border border-border bg-card p-5 shadow-lg sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h3
          id="confirm-cancel-interview-title"
          className="text-lg font-semibold text-foreground"
        >
          Cancel this interview?
        </h3>
        <p className="mt-2 text-sm leading-6 text-secondary-text">
          Cancel the interview for{" "}
          <span className="font-medium text-foreground">
            {interview.studentName}
          </span>{" "}
          with{" "}
          <span className="font-medium text-foreground">
            {interview.company}
          </span>
          ?
        </p>
        <p className="mt-3 rounded-[10px] border border-warning/25 bg-warning-bg px-3 py-2 text-xs text-warning">
          This updates local UI only. No backend API is connected — the change
          will not persist after refresh.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[10px] border border-border px-4 py-2 text-sm font-semibold text-foreground outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Keep interview
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-[10px] bg-error px-4 py-2 text-sm font-semibold text-white outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-error/40"
          >
            Cancel interview
          </button>
        </div>
      </div>
    </div>
  );
}
