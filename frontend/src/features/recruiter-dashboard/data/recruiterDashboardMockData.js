/**
 * DEMO / MOCK UI DATA ONLY — Recruiter Dashboard
 *
 * TODO: Replace this module when recruiter dashboard APIs are available.
 * Do not treat these values as live hiring metrics or a confirmed API contract.
 */

export const RECRUITER_DASHBOARD_MOCK = {
  isDemoData: true,
  demoNotice:
    "Demo data for UI preview only — not live recruiter hiring statistics.",
  recruiter: {
    displayName: "Recruiter",
    company: "Nimbus Analytics",
    initials: "RA",
  },
  summary: {
    totalJobs: 5,
    publishedJobs: 3,
    totalApplicants: 95,
    interviewsScheduled: 4,
  },
  recentJobs: [
    {
      id: "rd-job-1",
      title: "Graduate Software Engineer",
      status: "Published",
      deadline: "2026-11-05",
      applicantCount: 24,
    },
    {
      id: "rd-job-2",
      title: "Backend Intern",
      status: "Published",
      deadline: "2026-10-28",
      applicantCount: 41,
    },
    {
      id: "rd-job-3",
      title: "Associate Data Analyst",
      status: "Published",
      deadline: "2026-11-18",
      applicantCount: 12,
    },
    {
      id: "rd-job-4",
      title: "Platform Engineer",
      status: "Draft",
      deadline: "2026-12-15",
      applicantCount: 0,
    },
  ],
  recentApplicants: [
    {
      id: "rd-app-1",
      candidateName: "Aisha Khan",
      jobTitle: "Graduate Software Engineer",
      status: "Shortlisted",
    },
    {
      id: "rd-app-2",
      candidateName: "Rohan Mehta",
      jobTitle: "Backend Intern",
      status: "Applied",
    },
    {
      id: "rd-app-3",
      candidateName: "Priya Nair",
      jobTitle: "Associate Data Analyst",
      status: "Interview Scheduled",
    },
    {
      id: "rd-app-4",
      candidateName: "Dev Patel",
      jobTitle: "Graduate Software Engineer",
      status: "Rejected",
    },
  ],
};
