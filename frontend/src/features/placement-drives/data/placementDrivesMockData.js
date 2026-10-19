/**
 * DEMO / MOCK UI DATA ONLY — Placement Officer Drives Management
 *
 * TODO: Replace this module when placement drive APIs exist.
 * Do not treat these shapes as a confirmed backend contract.
 * Create/edit/close interactions update local UI state only.
 *
 * Company names reuse labels already used in placement/recruiter mock data
 * (e.g. recruiter company mock, placement dashboard) — not a live company API.
 */

export const DRIVE_STATUSES = ["Open", "Upcoming", "Closed"];

/** Companies already referenced elsewhere in UI mocks — for filters/forms only. */
export const MOCK_COMPANIES = [
  "Nimbus Analytics",
  "Harbor Systems",
  "Cedar Soft",
  "PixelForge Labs",
  "Northwind Digital",
  "Orbit Cloud",
  "Lumen Studio",
  "Summit Metrics",
];

export const PLACEMENT_DRIVES_MOCK = {
  isDemoData: true,
  demoNotice:
    "Showing mock placement drives. Create, edit, and close update local UI only — nothing is saved to a backend.",
  officer: {
    displayName: "Meera Joshi",
    role: "Placement Officer",
    email: "meera.joshi@college.edu",
    initials: "MJ",
  },
  companies: [...MOCK_COMPANIES],
  drives: [
    {
      id: "pd-mock-1",
      name: "Campus Drive — Software Engineer",
      company: "Nimbus Analytics",
      jobTitle: "Graduate Software Engineer",
      description:
        "On-campus hiring for entry-level software engineers with mentorship and product rotations.",
      eligibility: "CSE / IT",
      minCgpa: "7.0",
      skills: "JavaScript, React, SQL",
      applicationDeadline: "2026-11-05",
      interviewDate: "2026-11-12",
      status: "Open",
    },
    {
      id: "pd-mock-2",
      name: "Analyst Hiring Drive",
      company: "Harbor Systems",
      jobTitle: "Associate Product Analyst",
      description:
        "Campus drive for product analysts supporting reliability and customer operations.",
      eligibility: "Any branch",
      minCgpa: "6.5",
      skills: "SQL, Excel, Communication",
      applicationDeadline: "2026-11-12",
      interviewDate: "2026-11-18",
      status: "Open",
    },
    {
      id: "pd-mock-3",
      name: "Full-Stack Graduate Program",
      company: "Cedar Soft",
      jobTitle: "Junior Full-Stack Developer",
      description:
        "Graduate program covering frontend, APIs, and deployment practices.",
      eligibility: "CSE / IT / ECE",
      minCgpa: "7.0",
      skills: "JavaScript, Node.js, PostgreSQL",
      applicationDeadline: "2026-10-28",
      interviewDate: "2026-10-30",
      status: "Closed",
    },
    {
      id: "pd-mock-4",
      name: "QA Trainee Batch",
      company: "PixelForge Labs",
      jobTitle: "QA Trainee",
      description:
        "Upcoming trainee batch for manual and automation testing fundamentals.",
      eligibility: "Any branch",
      minCgpa: "6.0",
      skills: "Manual testing, Selenium",
      applicationDeadline: "2026-11-20",
      interviewDate: "",
      status: "Upcoming",
    },
    {
      id: "pd-mock-5",
      name: "Cloud Intern Drive",
      company: "Orbit Cloud",
      jobTitle: "Cloud Engineering Intern",
      description:
        "Summer internship focused on cloud fundamentals and infrastructure tooling.",
      eligibility: "CSE / IT",
      minCgpa: "7.5",
      skills: "Linux, AWS, Python",
      applicationDeadline: "2026-12-01",
      interviewDate: "2026-12-08",
      status: "Upcoming",
    },
    {
      id: "pd-mock-6",
      name: "Design Studio Campus Hire",
      company: "Lumen Studio",
      jobTitle: "UI Design Associate",
      description:
        "Closed campus hire for junior UI designers supporting client product work.",
      eligibility: "Any branch",
      minCgpa: "",
      skills: "Figma, Prototyping, Accessibility",
      applicationDeadline: "2026-09-15",
      interviewDate: "2026-09-22",
      status: "Closed",
    },
  ],
};
