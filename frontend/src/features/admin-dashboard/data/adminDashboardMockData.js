/**
 * DEMO / MOCK UI DATA ONLY — Admin Dashboard
 *
 * TODO: Replace this module when backend placement admin APIs are available.
 * Do not treat these values as real college statistics or a confirmed API contract.
 * Upcoming interviews intentionally empty — show empty state rather than inventing interviews.
 */

export const ADMIN_DASHBOARD_MOCK = {
  isDemoData: true,
  demoNotice:
    "Demo data for UI preview only — not live college placement statistics.",
  admin: {
    displayName: "Admin User",
    role: "Placement Officer",
    email: "admin@college.edu",
    initials: "AU",
  },
  summary: {
    totalStudents: 1248,
    registeredCompanies: 86,
    activePlacementDrives: 12,
    studentsPlaced: 214,
  },
  placementOverview: {
    label: "Demo monthly placements (sample)",
    months: [
      { month: "May", placed: 18 },
      { month: "Jun", placed: 24 },
      { month: "Jul", placed: 31 },
      { month: "Aug", placed: 27 },
      { month: "Sep", placed: 42 },
      { month: "Oct", placed: 36 },
    ],
  },
  recentDrives: [
    {
      id: "drive-demo-1",
      title: "Campus Drive — Software Engineer",
      company: "Nimbus Analytics",
      deadline: "2026-11-05",
      status: "Open",
    },
    {
      id: "drive-demo-2",
      title: "Analyst Hiring Drive",
      company: "Harbor Systems",
      deadline: "2026-11-12",
      status: "Open",
    },
    {
      id: "drive-demo-3",
      title: "Full-Stack Graduate Program",
      company: "Cedar Soft",
      deadline: "2026-10-28",
      status: "Closed",
    },
    {
      id: "drive-demo-4",
      title: "QA Trainee Batch",
      company: "PixelForge Labs",
      deadline: "2026-11-20",
      status: "Upcoming",
    },
  ],
  recentApplications: [
    {
      id: "app-demo-1",
      student: "Aisha Khan",
      jobTitle: "Graduate Software Engineer",
      company: "Nimbus Analytics",
      status: "Shortlisted",
      appliedDate: "2026-10-14",
    },
    {
      id: "app-demo-2",
      student: "Rohan Mehta",
      jobTitle: "Associate Product Analyst",
      company: "Harbor Systems",
      status: "Applied",
      appliedDate: "2026-10-13",
    },
    {
      id: "app-demo-3",
      student: "Priya Nair",
      jobTitle: "Junior Full-Stack Developer",
      company: "Cedar Soft",
      status: "Selected",
      appliedDate: "2026-10-11",
    },
    {
      id: "app-demo-4",
      student: "Dev Patel",
      jobTitle: "QA Trainee",
      company: "PixelForge Labs",
      status: "Rejected",
      appliedDate: "2026-10-09",
    },
  ],
  // Intentionally empty — prefer empty state over fabricated interviews.
  upcomingInterviews: [],
};
