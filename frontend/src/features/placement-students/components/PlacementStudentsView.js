"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  FileText,
  GraduationCap,
  Search,
  Users,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import PlacementOfficerShell from "@/components/layout/PlacementOfficerShell";
import StatusBadge from "@/components/ui/StatusBadge";
import SummaryCard from "@/components/ui/SummaryCard";
import {
  DEPARTMENTS,
  GRADUATION_YEARS,
  PLACEMENT_STATUSES,
} from "@/features/placement-students/data/placementStudentsMockData";
import {
  fetchPlacementStudents,
  PlacementStudentsServiceError,
} from "@/services/placementStudentsService";

const MIN_SEARCH_LENGTH = 2;

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

function formatSkills(skills) {
  if (!Array.isArray(skills) || skills.length === 0) {
    return "—";
  }
  return skills.join(", ");
}

export default function PlacementStudentsView() {
  const [officer, setOfficer] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [demoNotice, setDemoNotice] = useState("");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchPlacementStudents();
        if (!cancelled) {
          setOfficer(result.officer ?? null);
          setStudents(result.students ?? []);
          if (result.demoNotice) {
            setDemoNotice(result.demoNotice);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof PlacementStudentsServiceError
              ? err.message
              : "Unable to load students. Please try again.";
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

  const searchValidation = useMemo(() => {
    const trimmed = search.trim();
    if (trimmed.length > 0 && trimmed.length < MIN_SEARCH_LENGTH) {
      return `Enter at least ${MIN_SEARCH_LENGTH} characters to search.`;
    }
    return "";
  }, [search]);

  const summary = useMemo(() => {
    return {
      total: students.length,
      placed: students.filter((item) => item.placementStatus === "Placed")
        .length,
      inProcess: students.filter(
        (item) => item.placementStatus === "In Process",
      ).length,
      unplaced: students.filter((item) => item.placementStatus === "Unplaced")
        .length,
    };
  }, [students]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    const searchActive = query.length >= MIN_SEARCH_LENGTH;

    return students.filter((student) => {
      if (
        departmentFilter !== "All" &&
        student.department !== departmentFilter
      ) {
        return false;
      }
      if (
        yearFilter !== "All" &&
        String(student.graduationYear) !== String(yearFilter)
      ) {
        return false;
      }
      if (
        statusFilter !== "All" &&
        student.placementStatus !== statusFilter
      ) {
        return false;
      }
      if (!searchActive) {
        return true;
      }

      const haystack = [student.name, student.email, student.studentId]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [students, search, departmentFilter, yearFilter, statusFilter]);

  function clearFilters() {
    setSearch("");
    setDepartmentFilter("All");
    setYearFilter("All");
    setStatusFilter("All");
  }

  const hasActiveFilters =
    search.trim().length > 0 ||
    departmentFilter !== "All" ||
    yearFilter !== "All" ||
    statusFilter !== "All";

  return (
    <PlacementOfficerShell
      title="Student Management"
      breadcrumb="Placement / Students"
      officer={officer}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Student Management
          </h2>
          <p className="mt-1 text-sm text-secondary-text sm:text-base">
            Browse registered students, review academic profiles, and check
            placement progress.
          </p>
        </div>

        {demoNotice ? (
          <div
            role="status"
            className="rounded-[12px] border border-border bg-card px-4 py-3 text-sm text-secondary-text"
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
            label="Registered students"
            value={summary.total}
            icon={Users}
            loading={loading}
          />
          <SummaryCard
            label="Placed"
            value={summary.placed}
            icon={UserCheck}
            loading={loading}
          />
          <SummaryCard
            label="In process"
            value={summary.inProcess}
            icon={GraduationCap}
            loading={loading}
          />
          <SummaryCard
            label="Unplaced"
            value={summary.unplaced}
            icon={UserX}
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
                  placeholder="Search by name, email, or student ID"
                  aria-invalid={Boolean(searchValidation)}
                  aria-describedby={
                    searchValidation ? "student-search-validation" : undefined
                  }
                  className="w-full rounded-[10px] border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-secondary-text/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                />
              </span>
              {searchValidation ? (
                <span
                  id="student-search-validation"
                  className="mt-1.5 block text-xs text-warning"
                >
                  {searchValidation}
                </span>
              ) : null}
            </label>

            <label className="block text-sm lg:w-44">
              <span className="mb-1.5 block font-medium text-foreground">
                Department
              </span>
              <select
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value)}
                className="w-full rounded-[10px] border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <option value="All">All departments</option>
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm lg:w-40">
              <span className="mb-1.5 block font-medium text-foreground">
                Graduation year
              </span>
              <select
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
                className="w-full rounded-[10px] border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <option value="All">All years</option>
                {GRADUATION_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm lg:w-44">
              <span className="mb-1.5 block font-medium text-foreground">
                Placement status
              </span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-[10px] border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <option value="All">All statuses</option>
                {PLACEMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-[10px] border border-border bg-white px-3 py-2.5 text-sm font-semibold text-foreground outline-none transition hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Clear
              </button>
            ) : null}
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

          {!loading && filteredStudents.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-base font-semibold text-foreground">
                No students found
              </p>
              <p className="mt-2 text-sm text-secondary-text">
                {error
                  ? "Fix the load error and try again."
                  : searchValidation
                    ? "Complete the search query or clear it to browse students."
                    : "Clear search or filters to see students here."}
              </p>
            </div>
          ) : null}

          {!loading && filteredStudents.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border bg-background/80 text-secondary-text">
                    <tr>
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Student ID</th>
                      <th className="px-5 py-3 font-medium">Department</th>
                      <th className="px-5 py-3 font-medium">CGPA</th>
                      <th className="px-5 py-3 font-medium">Placement status</th>
                      <th className="px-5 py-3 font-medium">Profile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="px-5 py-3">
                          <p className="font-medium text-foreground">
                            {student.name}
                          </p>
                          {student.email ? (
                            <p className="mt-0.5 text-xs text-secondary-text">
                              {student.email}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {student.studentId}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {student.department}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {student.cgpa ?? "—"}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={student.placementStatus} />
                        </td>
                        <td className="px-5 py-3">
                          <button
                            type="button"
                            onClick={() => setSelected(student)}
                            className="inline-flex items-center gap-1 rounded-[8px] border border-border bg-white px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none transition hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
                          >
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="divide-y divide-border md:hidden">
                {filteredStudents.map((student) => (
                  <li key={student.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground">
                          {student.name}
                        </p>
                        <p className="mt-1 text-sm text-secondary-text">
                          {student.studentId} · {student.department}
                        </p>
                        {student.email ? (
                          <p className="mt-0.5 text-xs text-secondary-text">
                            {student.email}
                          </p>
                        ) : null}
                      </div>
                      <StatusBadge status={student.placementStatus} />
                    </div>
                    <p className="text-sm text-secondary-text">
                      CGPA {student.cgpa ?? "—"} · Class of{" "}
                      {student.graduationYear ?? "—"}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelected(student)}
                      className="inline-flex items-center gap-1 rounded-[8px] border border-border bg-white px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none transition hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      View profile
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      </div>

      {selected ? (
        <StudentDrawer student={selected} onClose={() => setSelected(null)} />
      ) : null}
    </PlacementOfficerShell>
  );
}

function StudentDrawer({ student, onClose }) {
  const history = Array.isArray(student.applicationHistory)
    ? student.applicationHistory
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-foreground/30"
      role="presentation"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-drawer-title"
        className="flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h3
              id="student-drawer-title"
              className="text-lg font-semibold text-foreground"
            >
              {student.name}
            </h3>
            <p className="mt-1 text-sm text-secondary-text">
              {student.studentId}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] p-2 text-secondary-text outline-none hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Close student details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-4">
            <StatusBadge status={student.placementStatus} />
          </div>

          <h4 className="text-sm font-semibold text-foreground">
            Academic information
          </h4>
          <dl className="mt-3 space-y-3 text-sm">
            <DetailRow label="Email" value={student.email || "—"} />
            <DetailRow label="Degree" value={student.degree || "—"} />
            <DetailRow label="Department" value={student.department || "—"} />
            <DetailRow
              label="Graduation year"
              value={student.graduationYear ?? "—"}
            />
            <DetailRow
              label="CGPA"
              value={student.cgpa ? student.cgpa : "—"}
            />
          </dl>

          <h4 className="mt-6 text-sm font-semibold text-foreground">Skills</h4>
          <p className="mt-2 text-sm text-secondary-text">
            {formatSkills(student.skills)}
          </p>

          <h4 className="mt-6 text-sm font-semibold text-foreground">Resume</h4>
          <p className="mt-2 inline-flex items-center gap-2 text-sm text-secondary-text">
            <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
            {student.resumeAvailable
              ? "Resume on file (demo — download not available)"
              : "No resume uploaded"}
          </p>

          <h4 className="mt-6 text-sm font-semibold text-foreground">
            Application history
          </h4>
          {history.length === 0 ? (
            <p className="mt-2 text-sm text-secondary-text">
              No applications on record for this student.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {history.map((application) => (
                <li
                  key={application.id}
                  className="rounded-[10px] border border-border bg-background px-3 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {application.jobTitle}
                      </p>
                      <p className="mt-0.5 text-xs text-secondary-text">
                        {application.company} · Applied{" "}
                        {formatDate(application.appliedAt)}
                      </p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 rounded-[10px] border border-border bg-background px-3 py-2 text-xs text-secondary-text">
            Student create/edit is not available — no placement student write
            API is connected. This drawer is read-only demo data.
          </p>
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
