/**
 * Client-side CSV helpers for demo report exports.
 * Filenames and header comments mark the file as demo sample data.
 */

function escapeCsvCell(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function rowsToCsv(rows) {
  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
}

/**
 * Builds and downloads a CSV from the current filtered demo report tables.
 * @param {{
 *   students: Array<Record<string, unknown>>,
 *   companies: Array<Record<string, unknown>>,
 *   filters: { academicYear: string, department: string, placementStatus: string },
 * }} params
 */
export function downloadDemoReportsCsv({ students, companies, filters }) {
  const stamp = new Date().toISOString().slice(0, 10);
  const filterNote = [
    `academicYear=${filters.academicYear}`,
    `department=${filters.department}`,
    `placementStatus=${filters.placementStatus}`,
  ].join("; ");

  const lines = [
    "# DEMO DATA ONLY — not live college placement statistics",
    `# Generated from filtered CampusPlacements demo reports (${filterNote})`,
    "",
    "# Student placement summary",
    rowsToCsv([
      [
        "Name",
        "Student ID",
        "Department",
        "Academic Year",
        "Placement Status",
        "Company",
        "Package (LPA)",
        "Applications",
      ],
      ...students.map((student) => [
        student.name,
        student.studentId,
        student.department,
        student.academicYear,
        student.placementStatus,
        student.company || "",
        student.packageLpa ?? "",
        student.applications ?? 0,
      ]),
    ]),
    "",
    "# Company-wise placement summary",
    rowsToCsv([
      [
        "Company",
        "Academic Year",
        "Departments",
        "Students Placed",
        "Drives",
        "Avg Package (LPA)",
      ],
      ...companies.map((company) => [
        company.name,
        company.academicYear,
        Array.isArray(company.departments)
          ? company.departments.join("; ")
          : "",
        company.studentsPlaced ?? 0,
        company.drives ?? 0,
        company.avgPackageLpa ?? "",
      ]),
    ]),
  ];

  const blob = new Blob([lines.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `demo-placement-reports-${stamp}.csv`;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
