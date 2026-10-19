"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  ClipboardList,
  Download,
  GraduationCap,
  Users,
} from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import StatusBadge from "@/components/ui/StatusBadge";
import SummaryCard from "@/components/ui/SummaryCard";
import PlacementOverviewChart from "@/features/admin-dashboard/components/PlacementOverviewChart";
import {
  ACADEMIC_YEARS,
  DEPARTMENTS,
  PLACEMENT_STATUSES,
} from "@/features/admin-reports/data/adminReportsMockData";
import { downloadDemoReportsCsv } from "@/features/admin-reports/utils/exportDemoCsv";
import {
  fetchAdminReports,
  AdminReportsServiceError,
} from "@/services/adminReportsService";

function SectionCard({ title, action, children }) {
  return (
    <section className="rounded-[12px] border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function LoadingBlock({ rows = 4 }) {
  return (
    <div className="space-y-3 p-5" aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-12 animate-pulse rounded-[10px] bg-border/60"
        />
      ))}
    </div>
  );
}

function EmptyState({ title, message }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-secondary-text">{message}</p>
    </div>
  );
}

function formatPackage(value) {
  if (value == null || value === "") {
    return "—";
  }
  return `${value} LPA`;
}

function matchesDepartmentFilter(departments, departmentFilter) {
  if (departmentFilter === "All") {
    return true;
  }
  return Array.isArray(departments) && departments.includes(departmentFilter);
}

export default function AdminReportsView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [academicYear, setAcademicYear] = useState("All");
  const [department, setDepartment] = useState("All");
  const [placementStatus, setPlacementStatus] = useState("All");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchAdminReports();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof AdminReportsServiceError
              ? err.message
              : "Unable to load placement reports. Please try again.";
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

  const demoNotice = data?.demoNotice;
  const admin = data?.admin;

  const filteredStudents = useMemo(() => {
    const students = data?.students ?? [];
    return students.filter((student) => {
      if (academicYear !== "All" && student.academicYear !== academicYear) {
        return false;
      }
      if (department !== "All" && student.department !== department) {
        return false;
      }
      if (
        placementStatus !== "All" &&
        student.placementStatus !== placementStatus
      ) {
        return false;
      }
      return true;
    });
  }, [data, academicYear, department, placementStatus]);

  const companiesByYearAndDept = useMemo(() => {
    const companies = data?.companies ?? [];
    return companies.filter((company) => {
      if (academicYear !== "All" && company.academicYear !== academicYear) {
        return false;
      }
      return matchesDepartmentFilter(company.departments, department);
    });
  }, [data, academicYear, department]);

  const filteredCompanies = useMemo(() => {
    return companiesByYearAndDept.filter((company) => {
      // Placement status applies to student outcomes; when filtering to Placed,
      // keep companies that recorded at least one placement in the demo set.
      if (placementStatus === "Placed" && !(company.studentsPlaced > 0)) {
        return false;
      }
      if (
        placementStatus === "Unplaced" ||
        placementStatus === "In Process"
      ) {
        // Company rows are placement outcomes — hide when status is non-placed.
        return false;
      }
      return true;
    });
  }, [companiesByYearAndDept, placementStatus]);

  const filteredDrives = useMemo(() => {
    const drives = data?.drives ?? [];
    return drives.filter((drive) => {
      if (academicYear !== "All" && drive.academicYear !== academicYear) {
        return false;
      }
      return matchesDepartmentFilter(drive.departments, department);
    });
  }, [data, academicYear, department]);

  const summary = useMemo(() => {
    const applications = filteredStudents.reduce(
      (total, student) => total + (Number(student.applications) || 0),
      0,
    );

    return {
      registeredStudents: filteredStudents.length,
      participatingCompanies: new Set(
        companiesByYearAndDept.map((company) => company.name),
      ).size,
      placementDrives: filteredDrives.length,
      applications,
      studentsPlaced: filteredStudents.filter(
        (student) => student.placementStatus === "Placed",
      ).length,
    };
  }, [filteredStudents, companiesByYearAndDept, filteredDrives]);

  const chartData = useMemo(() => {
    const placementTrends = data?.placementTrends ?? {};

    if (academicYear !== "All" && placementTrends[academicYear]) {
      return placementTrends[academicYear];
    }

    const yearKeys = Object.keys(placementTrends);
    if (yearKeys.length === 0) {
      return { label: "Demo placement overview", months: [] };
    }

    // Merge demo monthly totals when “All” academic years is selected.
    const monthOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthMap = new Map();
    for (const key of yearKeys) {
      const months = placementTrends[key]?.months ?? [];
      for (const item of months) {
        monthMap.set(
          item.month,
          (monthMap.get(item.month) ?? 0) + (item.placed ?? 0),
        );
      }
    }

    const months = monthOrder
      .filter((month) => monthMap.has(month))
      .map((month) => ({ month, placed: monthMap.get(month) }));

    return {
      label: "Demo monthly placements · all sample years",
      months,
    };
  }, [data, academicYear]);

  const hasActiveFilters =
    academicYear !== "All" ||
    department !== "All" ||
    placementStatus !== "All";

  function clearFilters() {
    setAcademicYear("All");
    setDepartment("All");
    setPlacementStatus("All");
  }

  function handleExportCsv() {
    downloadDemoReportsCsv({
      students: filteredStudents,
      companies: filteredCompanies,
      filters: {
        academicYear,
        department,
        placementStatus,
      },
    });
  }

  const canExport =
    !loading &&
    !error &&
    (filteredStudents.length > 0 || filteredCompanies.length > 0);

  return (
    <AdminShell
      title="Placement Reports"
      breadcrumb="Dashboard / Reports"
      admin={admin}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Placement Reports
            </h2>
            <p className="mt-1 text-sm text-secondary-text sm:text-base">
              Review demo placement summaries, trends, and filtered outcomes.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!canExport}
            className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground outline-none transition hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Export demo CSV
          </button>
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

        <section className="rounded-[12px] border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <label className="block text-sm lg:w-44">
              <span className="mb-1.5 block font-medium text-foreground">
                Academic year
              </span>
              <select
                value={academicYear}
                onChange={(event) => setAcademicYear(event.target.value)}
                className="w-full rounded-[10px] border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <option value="All">All years</option>
                {ACADEMIC_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm lg:w-44">
              <span className="mb-1.5 block font-medium text-foreground">
                Department
              </span>
              <select
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                className="w-full rounded-[10px] border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <option value="All">All departments</option>
                {DEPARTMENTS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm lg:w-44">
              <span className="mb-1.5 block font-medium text-foreground">
                Placement status
              </span>
              <select
                value={placementStatus}
                onChange={(event) => setPlacementStatus(event.target.value)}
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
          <p className="mt-3 text-xs text-secondary-text">
            Filters apply to the demo dataset shown on this page. Export uses
            the current filtered tables only.
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            label="Registered students"
            value={summary.registeredStudents}
            icon={Users}
            loading={loading}
          />
          <SummaryCard
            label="Participating companies"
            value={summary.participatingCompanies}
            icon={Building2}
            loading={loading}
          />
          <SummaryCard
            label="Placement drives"
            value={summary.placementDrives}
            icon={CalendarDays}
            loading={loading}
          />
          <SummaryCard
            label="Applications"
            value={summary.applications}
            icon={ClipboardList}
            loading={loading}
          />
          <SummaryCard
            label="Students placed"
            value={summary.studentsPlaced}
            icon={GraduationCap}
            loading={loading}
          />
        </div>

        <SectionCard title="Placement trend">
          <PlacementOverviewChart
            months={chartData.months}
            label={chartData.label}
            loading={loading}
          />
        </SectionCard>

        <SectionCard title="Student placement summary">
          {loading ? <LoadingBlock /> : null}

          {!loading && filteredStudents.length === 0 ? (
            <EmptyState
              title="No students match these filters"
              message={
                error
                  ? "Fix the load error and try again."
                  : "Clear or adjust filters to see demo student rows."
              }
            />
          ) : null}

          {!loading && filteredStudents.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border bg-background/80 text-secondary-text">
                    <tr>
                      <th className="px-5 py-3 font-medium">Student</th>
                      <th className="px-5 py-3 font-medium">Department</th>
                      <th className="px-5 py-3 font-medium">Academic year</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Company</th>
                      <th className="px-5 py-3 font-medium">Package</th>
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
                          <p className="mt-0.5 text-xs text-secondary-text">
                            {student.studentId}
                          </p>
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {student.department}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {student.academicYear}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={student.placementStatus} />
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {student.company || "—"}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {formatPackage(student.packageLpa)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="divide-y divide-border md:hidden">
                {filteredStudents.map((student) => (
                  <li key={student.id} className="flex flex-col gap-2 px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground">
                          {student.name}
                        </p>
                        <p className="mt-0.5 text-sm text-secondary-text">
                          {student.studentId} · {student.department} ·{" "}
                          {student.academicYear}
                        </p>
                      </div>
                      <StatusBadge status={student.placementStatus} />
                    </div>
                    <p className="text-sm text-secondary-text">
                      {student.company || "No company"} ·{" "}
                      {formatPackage(student.packageLpa)}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </SectionCard>

        <SectionCard title="Company-wise placement summary">
          {loading ? <LoadingBlock rows={3} /> : null}

          {!loading && filteredCompanies.length === 0 ? (
            <EmptyState
              title="No companies match these filters"
              message={
                error
                  ? "Fix the load error and try again."
                  : placementStatus === "Unplaced" ||
                      placementStatus === "In Process"
                    ? "Company summaries are shown for placed outcomes. Choose All or Placed status."
                    : "Clear or adjust filters to see demo company rows."
              }
            />
          ) : null}

          {!loading && filteredCompanies.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border bg-background/80 text-secondary-text">
                    <tr>
                      <th className="px-5 py-3 font-medium">Company</th>
                      <th className="px-5 py-3 font-medium">Academic year</th>
                      <th className="px-5 py-3 font-medium">Departments</th>
                      <th className="px-5 py-3 font-medium">Students placed</th>
                      <th className="px-5 py-3 font-medium">Drives</th>
                      <th className="px-5 py-3 font-medium">Avg package</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map((company) => (
                      <tr
                        key={company.id}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="px-5 py-3 font-medium text-foreground">
                          {company.name}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {company.academicYear}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {Array.isArray(company.departments)
                            ? company.departments.join(", ")
                            : "—"}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {company.studentsPlaced ?? 0}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {company.drives ?? 0}
                        </td>
                        <td className="px-5 py-3 text-secondary-text">
                          {formatPackage(company.avgPackageLpa)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="divide-y divide-border md:hidden">
                {filteredCompanies.map((company) => (
                  <li key={company.id} className="flex flex-col gap-1 px-5 py-4">
                    <p className="font-semibold text-foreground">
                      {company.name}
                    </p>
                    <p className="text-sm text-secondary-text">
                      {company.academicYear} ·{" "}
                      {Array.isArray(company.departments)
                        ? company.departments.join(", ")
                        : "—"}
                    </p>
                    <p className="text-sm text-secondary-text">
                      Placed: {company.studentsPlaced ?? 0} · Drives:{" "}
                      {company.drives ?? 0} ·{" "}
                      {formatPackage(company.avgPackageLpa)}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </SectionCard>
      </div>
    </AdminShell>
  );
}
