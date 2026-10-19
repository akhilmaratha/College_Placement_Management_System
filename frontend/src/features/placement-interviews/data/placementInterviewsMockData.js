/**
 * DEMO / MOCK UI DATA ONLY — Placement Officer Interviews Management
 *
 * TODO: Replace this module when interview APIs exist.
 * Do not treat these shapes as a confirmed backend contract.
 * Create/edit/reschedule/cancel interactions update local UI state only.
 *
 * Student and company labels reuse names already used in placement mock data
 * (students, drives) — not live student/company APIs.
 */

export const INTERVIEW_STATUSES = ["Upcoming", "Completed", "Cancelled"];

export const INTERVIEW_TYPES = ["Online", "On-campus", "Phone"];

/** Students already referenced in placement student mocks — for forms only. */
export const MOCK_STUDENTS = [
  "Aisha Khan",
  "Rohan Mehta",
  "Priya Nair",
  "Dev Patel",
  "Neha Sharma",
  "Arjun Desai",
  "Kavya Iyer",
  "Siddharth Rao",
];

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

/** Job openings already referenced in placement/recruiter mocks — for forms only. */
export const MOCK_JOB_OPENINGS = [
  { company: "Nimbus Analytics", jobTitle: "Graduate Software Engineer" },
  { company: "Nimbus Analytics", jobTitle: "Backend Intern" },
  { company: "Harbor Systems", jobTitle: "Associate Product Analyst" },
  { company: "Cedar Soft", jobTitle: "Junior Full-Stack Developer" },
  { company: "PixelForge Labs", jobTitle: "QA Trainee" },
  { company: "Orbit Cloud", jobTitle: "Cloud Engineering Intern" },
  { company: "Lumen Studio", jobTitle: "UI Design Associate" },
  { company: "Northwind Digital", jobTitle: "Junior Data Analyst" },
];

export const PLACEMENT_INTERVIEWS_MOCK = {
  isDemoData: true,
  demoNotice:
    "Showing mock interviews. Create, edit, reschedule, and cancel update local UI only — nothing is saved to a backend.",
  officer: {
    displayName: "Meera Joshi",
    role: "Placement Officer",
    email: "meera.joshi@college.edu",
    initials: "MJ",
  },
  students: [...MOCK_STUDENTS],
  companies: [...MOCK_COMPANIES],
  jobOpenings: MOCK_JOB_OPENINGS.map((item) => ({ ...item })),
  interviews: [
    {
      id: "pi-mock-1",
      studentName: "Aisha Khan",
      company: "Nimbus Analytics",
      jobTitle: "Graduate Software Engineer",
      interviewDate: "2026-10-22",
      interviewTime: "10:30",
      interviewType: "Online",
      meetingLink: "https://meet.example.com/nimbus-aisha",
      location: "",
      status: "Upcoming",
    },
    {
      id: "pi-mock-2",
      studentName: "Rohan Mehta",
      company: "Harbor Systems",
      jobTitle: "Associate Product Analyst",
      interviewDate: "2026-10-24",
      interviewTime: "14:00",
      interviewType: "On-campus",
      meetingLink: "",
      location: "Seminar Hall B, Block 2",
      status: "Upcoming",
    },
    {
      id: "pi-mock-3",
      studentName: "Neha Sharma",
      company: "Nimbus Analytics",
      jobTitle: "Backend Intern",
      interviewDate: "2026-10-27",
      interviewTime: "11:00",
      interviewType: "Online",
      meetingLink: "https://meet.example.com/nimbus-neha",
      location: "",
      status: "Upcoming",
    },
    {
      id: "pi-mock-4",
      studentName: "Priya Nair",
      company: "Cedar Soft",
      jobTitle: "Junior Full-Stack Developer",
      interviewDate: "2026-10-10",
      interviewTime: "09:30",
      interviewType: "On-campus",
      meetingLink: "",
      location: "Placement Cell Room 101",
      status: "Completed",
    },
    {
      id: "pi-mock-5",
      studentName: "Kavya Iyer",
      company: "Nimbus Analytics",
      jobTitle: "Graduate Software Engineer",
      interviewDate: "2026-09-28",
      interviewTime: "15:00",
      interviewType: "Phone",
      meetingLink: "",
      location: "",
      status: "Completed",
    },
    {
      id: "pi-mock-6",
      studentName: "Dev Patel",
      company: "PixelForge Labs",
      jobTitle: "QA Trainee",
      interviewDate: "2026-10-12",
      interviewTime: "16:30",
      interviewType: "Online",
      meetingLink: "https://meet.example.com/pixelforge-dev",
      location: "",
      status: "Cancelled",
    },
    {
      id: "pi-mock-7",
      studentName: "Arjun Desai",
      company: "Orbit Cloud",
      jobTitle: "Cloud Engineering Intern",
      interviewDate: "2026-11-05",
      interviewTime: "13:00",
      interviewType: "Online",
      meetingLink: "https://meet.example.com/orbit-arjun",
      location: "",
      status: "Upcoming",
    },
  ],
};
