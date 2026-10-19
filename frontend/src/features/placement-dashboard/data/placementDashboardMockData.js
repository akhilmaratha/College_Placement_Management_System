/**
 * DEMO / MOCK UI DATA ONLY — Placement Officer Dashboard
 *
 * TODO: Replace this module when placement officer dashboard APIs are available.
 * Do not treat these values as live college placement statistics or a confirmed API contract.
 */

export const PLACEMENT_DASHBOARD_MOCK = {
  isDemoData: true,
  demoNotice:
    "Demo data for UI preview only — not live placement officer statistics.",
  officer: {
    displayName: "Meera Joshi",
    role: "Placement Officer",
    email: "meera.joshi@college.edu",
    initials: "MJ",
  },
  summary: {
    registeredStudents: 1248,
    activeDrives: 12,
    applications: 486,
    studentsPlaced: 214,
  },
  recentDrives: [
    {
      id: "po-drive-1",
      company: "Nimbus Analytics",
      title: "Campus Drive — Software Engineer",
      deadline: "2026-11-05",
      status: "Open",
    },
    {
      id: "po-drive-2",
      company: "Harbor Systems",
      title: "Analyst Hiring Drive",
      deadline: "2026-11-12",
      status: "Open",
    },
    {
      id: "po-drive-3",
      company: "Cedar Soft",
      title: "Full-Stack Graduate Program",
      deadline: "2026-10-28",
      status: "Closed",
    },
    {
      id: "po-drive-4",
      company: "PixelForge Labs",
      title: "QA Trainee Batch",
      deadline: "2026-11-20",
      status: "Upcoming",
    },
  ],
  upcomingInterviews: [
    {
      id: "po-int-1",
      date: "2026-10-22",
      company: "Nimbus Analytics",
      jobTitle: "Graduate Software Engineer",
      status: "Scheduled",
    },
    {
      id: "po-int-2",
      date: "2026-10-24",
      company: "Harbor Systems",
      jobTitle: "Associate Product Analyst",
      status: "Scheduled",
    },
    {
      id: "po-int-3",
      date: "2026-10-27",
      company: "Cedar Soft",
      jobTitle: "Junior Full-Stack Developer",
      status: "Scheduled",
    },
  ],
  recentStudentActivity: [
    {
      id: "po-act-1",
      student: "Priya Nair",
      company: "Cedar Soft",
      jobTitle: "Junior Full-Stack Developer",
      status: "Selected",
      activityDate: "2026-10-11",
    },
    {
      id: "po-act-2",
      student: "Aisha Khan",
      company: "Nimbus Analytics",
      jobTitle: "Graduate Software Engineer",
      status: "Shortlisted",
      activityDate: "2026-10-14",
    },
    {
      id: "po-act-3",
      student: "Rohan Mehta",
      company: "Harbor Systems",
      jobTitle: "Associate Product Analyst",
      status: "Applied",
      activityDate: "2026-10-13",
    },
    {
      id: "po-act-4",
      student: "Dev Patel",
      company: "PixelForge Labs",
      jobTitle: "QA Trainee",
      status: "Rejected",
      activityDate: "2026-10-09",
    },
  ],
};
