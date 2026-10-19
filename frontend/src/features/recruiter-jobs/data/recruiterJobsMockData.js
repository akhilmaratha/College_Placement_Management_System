/**
 * MOCK UI DATA ONLY — Recruiter Manage Jobs
 *
 * TODO: Replace this module when recruiter job APIs exist.
 * Do not treat these shapes as a confirmed backend contract.
 * Create/edit/close interactions update local UI state only.
 */

export const RECRUITER_JOBS_MOCK = {
  recruiter: {
    displayName: "Recruiter",
    company: "Nimbus Analytics",
    initials: "RA",
  },
  jobs: [
    {
      id: "rj-mock-1",
      title: "Graduate Software Engineer",
      description:
        "Entry-level role working on analytics products with mentorship.",
      location: "Bengaluru",
      jobType: "Full-time",
      salary: "12 LPA",
      eligibility: "CSE / IT",
      minCgpa: "7.0",
      skills: "JavaScript, React, SQL",
      deadline: "2026-11-05",
      postedAt: "2026-10-12",
      applicants: 24,
      status: "Published",
    },
    {
      id: "rj-mock-2",
      title: "Backend Intern",
      description: "Summer internship focused on APIs and cloud fundamentals.",
      location: "Remote",
      jobType: "Internship",
      salary: "25k / month",
      eligibility: "CSE / IT / ECE",
      minCgpa: "7.0",
      skills: "Java, Spring Boot, PostgreSQL",
      deadline: "2026-10-28",
      postedAt: "2026-10-05",
      applicants: 41,
      status: "Published",
    },
    {
      id: "rj-mock-3",
      title: "Platform Engineer",
      description: "Draft posting for reliability and platform tooling.",
      location: "Hyderabad",
      jobType: "Full-time",
      salary: "14 LPA",
      eligibility: "CSE / IT",
      minCgpa: "7.5",
      skills: "Linux, Docker, Kubernetes",
      deadline: "2026-12-15",
      postedAt: "2026-10-15",
      applicants: 0,
      status: "Draft",
    },
    {
      id: "rj-mock-4",
      title: "QA Trainee",
      description: "Closed drive from the previous hiring season.",
      location: "Chennai",
      jobType: "Full-time",
      salary: "6 LPA",
      eligibility: "Any branch",
      minCgpa: "6.0",
      skills: "Manual testing, Selenium",
      deadline: "2026-09-01",
      postedAt: "2026-08-01",
      applicants: 18,
      status: "Closed",
    },
    {
      id: "rj-mock-5",
      title: "Associate Data Analyst",
      description: "Analyze placement funnel metrics and report insights.",
      location: "Pune",
      jobType: "Full-time",
      salary: "9 LPA",
      eligibility: "Any branch",
      minCgpa: "6.5",
      skills: "SQL, Python, Tableau",
      deadline: "2026-11-18",
      postedAt: "2026-10-09",
      applicants: 12,
      status: "Published",
    },
  ],
};
