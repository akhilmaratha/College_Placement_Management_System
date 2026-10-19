"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  FilePenLine,
  Lock,
  Plus,
  Search,
} from "lucide-react";
import PlacementOfficerShell from "@/components/layout/PlacementOfficerShell";
import StatusBadge from "@/components/ui/StatusBadge";
import SummaryCard from "@/components/ui/SummaryCard";
import DriveFormModal from "@/features/placement-drives/components/DriveFormModal";
import {
  DRIVE_STATUSES,
  MOCK_COMPANIES,
} from "@/features/placement-drives/data/placementDrivesMockData";
import {
  fetchPlacementDrives,
  PlacementDrivesServiceError,
} from "@/services/placementDrivesService";

const STATUS_FILTERS = ["All", ...DRIVE_STATUSES];

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
  return `pd-local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function monthKey(isoDate) {
  if (!isoDate || isoDate.length < 7) {
    return "";
  }
  return isoDate.slice(0, 7);
}

export default function PlacementDrivesView() {
  const [officer, setOfficer] = useState(null);
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingDrive, setEditingDrive] = useState(null);
  const [viewDrive, setViewDrive] = useState(null);
  const [closingDrive, setClosingDrive] = useState(null);
  const [mockNotice, setMockNotice] = useState(
    "Showing mock placement drives. Create, edit, and close update local UI only — nothing is saved to a backend.",
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchPlacementDrives();
        if (!cancelled) {
          setOfficer(result.officer ?? null);
          setCompanies(result.companies?.length ? result.companies : MOCK_COMPANIES);
          setDrives(result.drives ?? []);
          if (result.demoNotice) {
            setMockNotice(result.demoNotice);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof PlacementDrivesServiceError
              ? err.message
              : "Unable to load placement drives. Please try again.";
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

  const companyOptions = useMemo(() => {
    const fromDrives = drives.map((drive) => drive.company).filter(Boolean);
    return Array.from(new Set([...companies, ...fromDrives])).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [companies, drives]);

  const summary = useMemo(() => {
    return {
      total: drives.length,
      open: drives.filter((drive) => drive.status === "Open").length,
      upcoming: drives.filter((drive) => drive.status === "Upcoming").length,
      closed: drives.filter((drive) => drive.status === "Closed").length,
    };
  }, [drives]);

  const filteredDrives = useMemo(() => {
    const query = search.trim().toLowerCase();

    return drives.filter((drive) => {
      if (companyFilter !== "All" && drive.company !== companyFilter) {
        return false;
      }
      if (statusFilter !== "All" && drive.status !== statusFilter) {
        return false;
      }
      if (dateFilter && monthKey(drive.applicationDeadline) !== dateFilter) {
        return false;
      }
      if (!query) {
        return true;
      }

      const haystack = [
        drive.name,
        drive.company,
        drive.jobTitle,
        drive.eligibility,
        drive.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [drives, search, companyFilter, dateFilter, statusFilter]);

  function openCreate() {
    setFormMode("create");
    setEditingDrive(null);
    setFormOpen(true);
  }

  function openEdit(drive) {
    setFormMode("edit");
    setEditingDrive(drive);
    setFormOpen(true);
  }

  function handleFormSubmit(values) {
    if (formMode === "edit" && editingDrive) {
      setDrives((prev) =>
        prev.map((drive) =>
          drive.id === editingDrive.id
            ? {
                ...drive,
                ...values,
              }
            : drive,
        ),
      );
      setMockNotice(
        `Updated “${values.name}” in local UI only. No backend save occurred.`,
      );
    } else {
      const nextDrive = {
        id: createLocalId(),
        ...values,
      };
      setDrives((prev) => [nextDrive, ...prev]);
      setMockNotice(
        `Created “${values.name}” in local UI only. No backend save occurred.`,
      );
    }

    setFormOpen(false);
    setEditingDrive(null);
  }

  function requestCloseDrive(drive) {
    if (drive.status === "Closed") {
      return;
    }
    setClosingDrive(drive);
  }

  function confirmCloseDrive() {
    if (!closingDrive) {
      return;
    }

    setDrives((prev) =>
      prev.map((item) =>
        item.id === closingDrive.id ? { ...item, status: "Closed" } : item,
      ),
    );
    setMockNotice(
      `Closed “${closingDrive.name}” in local UI only. No backend save occurred.`,
    );
    setClosingDrive(null);
    setViewDrive((current) =>
      current?.id === closingDrive.id
        ? { ...current, status: "Closed" }
        : current,
    );
  }

  return (
    <PlacementOfficerShell
      title="Placement Drives"
      breadcrumb="Placement / Placement Drives"
      officer={officer}
      actions={
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-[10px] bg-primary px-3 py-2 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Create Drive</span>
          <span className="sm:hidden">Create</span>
        </button>
      }
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Placement Drives
            </h2>
            <p className="mt-1 text-sm text-secondary-text sm:text-base">
              Review campus hiring drives, eligibility, and application windows.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40 sm:hidden"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Drive
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
            label="Total drives"
            value={summary.total}
            loading={loading}
          />
          <SummaryCard label="Open" value={summary.open} loading={loading} />
          <SummaryCard
            label="Upcoming"
            value={summary.upcoming}
            loading={loading}
          />
          <SummaryCard
            label="Closed"
            value={summary.closed}
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
                  placeholder="Search by drive, company, or job title"
                  className="w-full rounded-[10px] border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-secondary-text/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                />
              </span>
            </label>

            <label className="block text-sm lg:w-48">
              <span className="mb-1.5 block font-medium text-foreground">
                Company
              </span>
              <select
                value={companyFilter}
                onChange={(event) => setCompanyFilter(event.target.value)}
                className="w-full rounded-[10px] border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <option value="All">All companies</option>
                {companyOptions.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm lg:w-48">
              <span className="mb-1.5 block font-medium text-foreground">
                Deadline month
              </span>
              <input
                type="month"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="w-full rounded-[10px] border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              />
            </label>

            <label className="block text-sm lg:w-44">
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

          {!loading && filteredDrives.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-base font-semibold text-foreground">
                No drives found
              </p>
              <p className="mt-2 text-sm text-secondary-text">
                Create a drive or clear filters to see placement drives here.
              </p>
              <button
                type="button"
                onClick={openCreate}
                className="mt-5 inline-flex items-center gap-1.5 rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-white outline-none hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create Drive
              </button>
            </div>
          ) : null}

          {!loading && filteredDrives.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border bg-background/80 text-secondary-text">
                    <tr>
                      <th className="px-5 py-3 font-medium">Drive name</th>
                      <th className="px-5 py-3 font-medium">Company</th>
                      <th className="px-5 py-3 font-medium">Job title</th>
                      <th className="px-5 py-3 font-medium">Eligibility</th>
                      <th className="px-5 py-3 font-medium">Deadline</th>
                      <th className="px-5 py-3 font-medium">Interview</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrives.map((drive) => (
                      <tr
                        key={drive.id}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="px-5 py-3 font-medium text-foreground">
                          {drive.name}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {drive.company}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {drive.jobTitle}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {drive.eligibility}
                          {drive.minCgpa ? ` · CGPA ${drive.minCgpa}+` : ""}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {formatDate(drive.applicationDeadline)}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {formatDate(drive.interviewDate)}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={drive.status} />
                        </td>
                        <td className="px-5 py-3">
                          <DriveActions
                            drive={drive}
                            onView={setViewDrive}
                            onEdit={openEdit}
                            onClose={requestCloseDrive}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="divide-y divide-border lg:hidden">
                {filteredDrives.map((drive) => (
                  <li key={drive.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {drive.name}
                        </p>
                        <p className="mt-1 text-sm text-secondary-text">
                          {drive.company} · {drive.jobTitle}
                        </p>
                      </div>
                      <StatusBadge status={drive.status} />
                    </div>
                    <p className="text-sm text-secondary-text">
                      {drive.eligibility}
                      {drive.minCgpa ? ` · CGPA ${drive.minCgpa}+` : ""} ·
                      Deadline {formatDate(drive.applicationDeadline)}
                      {drive.interviewDate
                        ? ` · Interview ${formatDate(drive.interviewDate)}`
                        : ""}
                    </p>
                    <DriveActions
                      drive={drive}
                      onView={setViewDrive}
                      onEdit={openEdit}
                      onClose={requestCloseDrive}
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      </div>

      <DriveFormModal
        open={formOpen}
        mode={formMode}
        initialDrive={editingDrive}
        companies={companyOptions}
        onClose={() => {
          setFormOpen(false);
          setEditingDrive(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {viewDrive ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-4 sm:items-center"
          role="presentation"
          onClick={() => setViewDrive(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-drive-title"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[12px] border border-border bg-card p-5 shadow-lg sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h3
              id="view-drive-title"
              className="text-lg font-semibold text-foreground"
            >
              {viewDrive.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-secondary-text">
              {viewDrive.description}
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              <DetailRow label="Status">
                <StatusBadge status={viewDrive.status} />
              </DetailRow>
              <DetailRow label="Company" value={viewDrive.company} />
              <DetailRow label="Job title" value={viewDrive.jobTitle} />
              <DetailRow label="Eligibility" value={viewDrive.eligibility} />
              <DetailRow
                label="Min CGPA"
                value={viewDrive.minCgpa || "—"}
              />
              <DetailRow label="Skills" value={viewDrive.skills} />
              <DetailRow
                label="Application deadline"
                value={formatDate(viewDrive.applicationDeadline)}
              />
              <DetailRow
                label="Interview date"
                value={formatDate(viewDrive.interviewDate)}
              />
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  openEdit(viewDrive);
                  setViewDrive(null);
                }}
                className="rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-white outline-none hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setViewDrive(null)}
                className="rounded-[10px] border border-border px-4 py-2 text-sm font-semibold text-foreground outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {closingDrive ? (
        <ConfirmCloseDialog
          drive={closingDrive}
          onCancel={() => setClosingDrive(null)}
          onConfirm={confirmCloseDrive}
        />
      ) : null}
    </PlacementOfficerShell>
  );
}

function DetailRow({ label, value, children }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-secondary-text">{label}</dt>
      <dd className="text-right text-foreground">{children ?? value}</dd>
    </div>
  );
}

function DriveActions({ drive, onView, onEdit, onClose }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <ActionButton label="View" onClick={() => onView(drive)} icon={Eye} />
      <ActionButton
        label="Edit"
        onClick={() => onEdit(drive)}
        icon={FilePenLine}
      />
      <ActionButton
        label="Close"
        onClick={() => onClose(drive)}
        icon={Lock}
        disabled={drive.status === "Closed"}
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

function ConfirmCloseDialog({ drive, onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 p-4 sm:items-center"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-close-drive-title"
        className="w-full max-w-md rounded-[12px] border border-border bg-card p-5 shadow-lg sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h3
          id="confirm-close-drive-title"
          className="text-lg font-semibold text-foreground"
        >
          Close this drive?
        </h3>
        <p className="mt-2 text-sm leading-6 text-secondary-text">
          Mark{" "}
          <span className="font-medium text-foreground">{drive.name}</span> for{" "}
          <span className="font-medium text-foreground">{drive.company}</span> as
          Closed?
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
            Close drive
          </button>
        </div>
      </div>
    </div>
  );
}
