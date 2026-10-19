/**
 * MOCK UI DATA ONLY — Recruiter Applicants
 *
 * TODO: Replace this module when recruiter applicant APIs exist.
 * Do not treat these shapes as a confirmed backend contract.
 * Status actions update local UI state only — nothing is persisted.
 */

export const APPLICATION_STATUSES = [
  "Applied",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "Rejected",
];

/** Ordered pipeline used for “move to next stage” in local UI only. */
export const STATUS_PIPELINE = [
  "Applied",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
];

export const RECRUITER_APPLICANTS_MOCK = {
  isDemoData: true,
  demoNotice:
    "Showing mock applicants. Shortlist, reject, and stage changes update local UI only — nothing is saved to a backend.",
  recruiter: {
    displayName: "Recruiter",
    company: "Nimbus Analytics",
    initials: "RA",
  },
  jobOpenings: [
    { id: "rj-mock-1", title: "Graduate Software Engineer" },
    { id: "rj-mock-2", title: "Backend Intern" },
    { id: "rj-mock-5", title: "Associate Data Analyst" },
    { id: "rj-mock-4", title: "QA Trainee" },
  ],
  applicants: [
    {
      id: "ra-mock-1",
      studentName: "Aisha Khan",
      email: "aisha.khan@student.campus.edu",
      jobId: "rj-mock-1",
      jobTitle: "Graduate Software Engineer",
      appliedAt: "2026-10-14",
      skills: "JavaScript, React, SQL",
      cgpa: "8.4",
      branch: "CSE",
      status: "Shortlisted",
      notes: "Strong project portfolio aligned with product analytics stack.",
    },
    {
      id: "ra-mock-2",
      studentName: "Rohan Mehta",
      email: "rohan.mehta@student.campus.edu",
      jobId: "rj-mock-2",
      jobTitle: "Backend Intern",
      appliedAt: "2026-10-12",
      skills: "Java, Spring Boot",
      cgpa: "7.9",
      branch: "IT",
      status: "Applied",
      notes: "",
    },
    {
      id: "ra-mock-3",
      studentName: "Priya Nair",
      email: "priya.nair@student.campus.edu",
      jobId: "rj-mock-5",
      jobTitle: "Associate Data Analyst",
      appliedAt: "2026-10-10",
      skills: "Python, SQL, Tableau",
      cgpa: "8.1",
      branch: "ECE",
      status: "Interview Scheduled",
      notes: "Campus interview slot reserved for next week.",
    },
    {
      id: "ra-mock-4",
      studentName: "Dev Patel",
      email: "dev.patel@student.campus.edu",
      jobId: "rj-mock-1",
      jobTitle: "Graduate Software Engineer",
      appliedAt: "2026-10-08",
      skills: "TypeScript, Node.js",
      cgpa: "7.2",
      branch: "CSE",
      status: "Rejected",
      notes: "Does not meet minimum CGPA for this drive.",
    },
    {
      id: "ra-mock-5",
      studentName: "Neha Sharma",
      email: "neha.sharma@student.campus.edu",
      jobId: "rj-mock-2",
      jobTitle: "Backend Intern",
      appliedAt: "2026-10-15",
      skills: "Java, PostgreSQL",
      cgpa: "8.7",
      branch: "CSE",
      status: "Applied",
      notes: "",
    },
    {
      id: "ra-mock-6",
      studentName: "Arjun Desai",
      email: "arjun.desai@student.campus.edu",
      jobId: "rj-mock-5",
      jobTitle: "Associate Data Analyst",
      appliedAt: "2026-10-11",
      skills: "SQL, Excel",
      cgpa: null,
      branch: "Mechanical",
      status: "Shortlisted",
      notes: "CGPA not listed on application form.",
    },
    {
      id: "ra-mock-7",
      studentName: "Sara Ali",
      email: "sara.ali@student.campus.edu",
      jobId: "rj-mock-1",
      jobTitle: "Graduate Software Engineer",
      appliedAt: "2026-10-13",
      skills: null,
      cgpa: "8.0",
      branch: "IT",
      status: "Applied",
      notes: "",
    },
    {
      id: "ra-mock-8",
      studentName: "Kabir Singh",
      email: "kabir.singh@student.campus.edu",
      jobId: "rj-mock-4",
      jobTitle: "QA Trainee",
      appliedAt: "2026-08-20",
      skills: "Manual testing, Selenium",
      cgpa: "7.5",
      branch: "CSE",
      status: "Selected",
      notes: "Offer extended for previous hiring season.",
    },
  ],
};
