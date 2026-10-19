"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Eye,
  Search,
  UserX,
  X,
} from "lucide-react";
import RecruiterShell from "@/components/layout/RecruiterShell";
import StatusBadge from "@/components/ui/StatusBadge";
import SummaryCard from "@/components/ui/SummaryCard";
import {
  APPLICATION_STATUSES,
  STATUS_PIPELINE,
} from "@/features/recruiter-applicants/data/recruiterApplicantsMockData";
import {
  fetchRecruiterApplicants,
  RecruiterApplicantsServiceError,
} from "@/services/recruiterApplicantsService";

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

function nextPipelineStatus(current) {
  const index = STATUS_PIPELINE.indexOf(current);
  if (index === -1 || index >= STATUS_PIPELINE.length - 1) {
    return null;
  }
  return STATUS_PIPELINE[index + 1];
}

function skillsOrCgpaLabel(applicant) {
  if (applicant.skills) {
    return applicant.skills;
  }
  if (applicant.cgpa) {
    return `CGPA ${applicant.cgpa}`;
  }
  return "—";
}

export default function ApplicantsView() {
  const [recruiter, setRecruiter] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [jobOpenings, setJobOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [mockNotice, setMockNotice] = useState(
    "Showing mock applicants. Status changes update local UI only — nothing is saved to a backend.",
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchRecruiterApplicants();
        if (!cancelled) {
          setRecruiter(result.recruiter);
          setApplicants(result.applicants ?? []);
          setJobOpenings(result.jobOpenings ?? []);
          if (result.demoNotice) {
            setMockNotice(result.demoNotice);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof RecruiterApplicantsServiceError
              ? err.message
              : "Unable to load applicants. Please try again.";
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
      total: applicants.length,
      applied: applicants.filter((item) => item.status === "Applied").length,
      shortlisted: applicants.filter((item) => item.status === "Shortlisted")
        .length,
      interviews: applicants.filter(
        (item) => item.status === "Interview Scheduled",
      ).length,
    };
  }, [applicants]);

  const filteredApplicants = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applicants.filter((applicant) => {
      if (jobFilter !== "All" && applicant.jobId !== jobFilter) {
        return false;
      }
      if (statusFilter !== "All" && applicant.status !== statusFilter) {
        return false;
      }
      if (!query) {
        return true;
      }

      const haystack = [
        applicant.studentName,
        applicant.jobTitle,
        applicant.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [applicants, search, jobFilter, statusFilter]);

  function applyStatusChange(applicantId, nextStatus) {
    const target = applicants.find((item) => item.id === applicantId);
    if (!target) {
      setActionError("Applicant not found. Refresh and try again.");
      setConfirmAction(null);
      return;
    }

    if (target.status === nextStatus) {
      setConfirmAction(null);
      return;
    }

    setApplicants((prev) =>
      prev.map((item) =>
        item.id === applicantId ? { ...item, status: nextStatus } : item,
      ),
    );
    setSelected((current) =>
      current?.id === applicantId
        ? { ...current, status: nextStatus }
        : current,
    );
    setMockNotice(
      `Updated ${target.studentName} to “${nextStatus}” in local UI only. No backend save occurred.`,
    );
    setActionError("");
    setConfirmAction(null);
  }

  function requestStatusChange(applicant, nextStatus, label) {
    setActionError("");
    setConfirmAction({
      applicant,
      nextStatus,
      label,
    });
  }

  return (
    <RecruiterShell
      title="Applicants"
      breadcrumb="Recruiter / Applicants"
      recruiter={recruiter}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Applicants
          </h2>
          <p className="mt-1 text-sm text-secondary-text sm:text-base">
            Review candidates across your job openings and move them through
            the hiring pipeline.
          </p>
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

        {actionError ? (
          <div
            role="alert"
            className="rounded-[12px] border border-error/30 bg-error-bg px-4 py-3 text-sm text-error"
          >
            {actionError}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total applicants"
            value={summary.total}
            loading={loading}
          />
          <SummaryCard
            label="Applied"
            value={summary.applied}
            loading={loading}
          />
          <SummaryCard
            label="Shortlisted"
            value={summary.shortlisted}
            loading={loading}
          />
          <SummaryCard
            label="Interviews"
            value={summary.interviews}
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
                  placeholder="Search by name, job title, or email"
                  className="w-full rounded-[10px] border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-secondary-text/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                />
              </span>
            </label>

            <label className="block text-sm lg:w-56">
              <span className="mb-1.5 block font-medium text-foreground">
                Job opening
              </span>
              <select
                value={jobFilter}
                onChange={(event) => setJobFilter(event.target.value)}
                className="w-full rounded-[10px] border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <option value="All">All openings</option>
                {jobOpenings.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm lg:w-52">
              <span className="mb-1.5 block font-medium text-foreground">
                Status
              </span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-[10px] border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <option value="All">All statuses</option>
                {APPLICATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="overflow-hidden rounded-[12px] border border-border bg-card shadow-sm">
          {loading ? (
            <div className="space-y-3 p-5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-[10px] bg-border/60"
                />
              ))}
            </div>
          ) : null}

          {!loading && filteredApplicants.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-base font-semibold text-foreground">
                No applicants found
              </p>
              <p className="mt-2 text-sm text-secondary-text">
                {error
                  ? "Fix the load error and try again."
                  : "Clear search or filters to see applicants here."}
              </p>
            </div>
          ) : null}

          {!loading && filteredApplicants.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border bg-background/80 text-secondary-text">
                    <tr>
                      <th className="px-5 py-3 font-medium">Student</th>
                      <th className="px-5 py-3 font-medium">Applied job</th>
                      <th className="px-5 py-3 font-medium">Applied</th>
                      <th className="px-5 py-3 font-medium">Skills / CGPA</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplicants.map((applicant) => (
                      <tr
                        key={applicant.id}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="px-5 py-3">
                          <p className="font-medium text-foreground">
                            {applicant.studentName}
                          </p>
                          {applicant.email ? (
                            <p className="mt-0.5 text-xs text-secondary-text">
                              {applicant.email}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {applicant.jobTitle}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {formatDate(applicant.appliedAt)}
                        </td>
                        <td className="max-w-[14rem] px-5 py-3 text-secondary-text">
                          <span className="line-clamp-2">
                            {skillsOrCgpaLabel(applicant)}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={applicant.status} />
                        </td>
                        <td className="px-5 py-3">
                          <ApplicantActions
                            applicant={applicant}
                            onView={setSelected}
                            onRequestChange={requestStatusChange}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="divide-y divide-border md:hidden">
                {filteredApplicants.map((applicant) => (
                  <li key={applicant.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground">
                          {applicant.studentName}
                        </p>
                        <p className="mt-1 text-sm text-secondary-text">
                          {applicant.jobTitle}
                        </p>
                        {applicant.email ? (
                          <p className="mt-0.5 text-xs text-secondary-text">
                            {applicant.email}
                          </p>
                        ) : null}
                      </div>
                      <StatusBadge status={applicant.status} />
                    </div>
                    <p className="text-sm text-secondary-text">
                      Applied {formatDate(applicant.appliedAt)} ·{" "}
                      {skillsOrCgpaLabel(applicant)}
                    </p>
                    <ApplicantActions
                      applicant={applicant}
                      onView={setSelected}
                      onRequestChange={requestStatusChange}
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      </div>

      {selected ? (
        <ApplicantDrawer
          applicant={selected}
          onClose={() => setSelected(null)}
          onRequestChange={requestStatusChange}
        />
      ) : null}

      {confirmAction ? (
        <ConfirmStatusDialog
          action={confirmAction}
          onCancel={() => setConfirmAction(null)}
          onConfirm={() =>
            applyStatusChange(
              confirmAction.applicant.id,
              confirmAction.nextStatus,
            )
          }
        />
      ) : null}
    </RecruiterShell>
  );
}

function StatusActionButtons({ applicant, onRequestChange }) {
  const nextStatus = nextPipelineStatus(applicant.status);
  const canShortlist = applicant.status === "Applied";
  const canReject =
    applicant.status !== "Rejected" && applicant.status !== "Selected";

  return (
    <>
      <ActionButton
        label="Shortlist"
        onClick={() =>
          onRequestChange(applicant, "Shortlisted", "Shortlist")
        }
        icon={CheckCircle2}
        disabled={!canShortlist}
      />
      <ActionButton
        label="Reject"
        onClick={() => onRequestChange(applicant, "Rejected", "Reject")}
        icon={UserX}
        disabled={!canReject}
      />
      <ActionButton
        label="Next stage"
        onClick={() =>
          onRequestChange(applicant, nextStatus, `Move to ${nextStatus}`)
        }
        icon={ChevronRight}
        disabled={!nextStatus}
      />
    </>
  );
}

function ApplicantActions({ applicant, onView, onRequestChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <ActionButton label="View" onClick={() => onView(applicant)} icon={Eye} />
      <StatusActionButtons
        applicant={applicant}
        onRequestChange={onRequestChange}
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

function ApplicantDrawer({ applicant, onClose, onRequestChange }) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-foreground/30"
      role="presentation"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="applicant-drawer-title"
        className="flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h3
              id="applicant-drawer-title"
              className="text-lg font-semibold text-foreground"
            >
              {applicant.studentName}
            </h3>
            <p className="mt-1 text-sm text-secondary-text">
              {applicant.jobTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] p-2 text-secondary-text outline-none hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Close applicant details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-4">
            <StatusBadge status={applicant.status} />
          </div>

          <dl className="space-y-3 text-sm">
            <DetailRow label="Email" value={applicant.email || "—"} />
            <DetailRow
              label="Applied on"
              value={formatDate(applicant.appliedAt)}
            />
            <DetailRow label="Branch" value={applicant.branch || "—"} />
            <DetailRow
              label="CGPA"
              value={applicant.cgpa ? applicant.cgpa : "—"}
            />
            <DetailRow label="Skills" value={applicant.skills || "—"} />
            {applicant.notes ? (
              <div>
                <dt className="text-secondary-text">Notes</dt>
                <dd className="mt-1 text-foreground">{applicant.notes}</dd>
              </div>
            ) : null}
          </dl>

          <p className="mt-6 rounded-[10px] border border-border bg-background px-3 py-2 text-xs text-secondary-text">
            Status actions on this page are local mock only — not connected to a
            backend API.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 border-t border-border px-5 py-4">
          <StatusActionButtons
            applicant={applicant}
            onRequestChange={onRequestChange}
          />
        </div>
      </aside>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-secondary-text">{label}</dt>
      <dd className="text-right text-foreground">{value}</dd>
    </div>
  );
}

function ConfirmStatusDialog({ action, onCancel, onConfirm }) {
  const { applicant, nextStatus, label } = action;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 p-4 sm:items-center"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-status-title"
        className="w-full max-w-md rounded-[12px] border border-border bg-card p-5 shadow-lg sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h3
          id="confirm-status-title"
          className="text-lg font-semibold text-foreground"
        >
          Confirm {label.toLowerCase()}
        </h3>
        <p className="mt-2 text-sm leading-6 text-secondary-text">
          Change <span className="font-medium text-foreground">{applicant.studentName}</span>{" "}
          from <span className="font-medium text-foreground">{applicant.status}</span>{" "}
          to <span className="font-medium text-foreground">{nextStatus}</span>?
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
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-white outline-none hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
