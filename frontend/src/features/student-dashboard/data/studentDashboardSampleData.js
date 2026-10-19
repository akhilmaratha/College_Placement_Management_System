/**
 * SAMPLE UI DATA ONLY — Student Dashboard
 *
 * TODO: Replace this module when backend placement APIs are available.
 * Do not treat these shapes as a confirmed API contract.
 * Upcoming interviews intentionally empty — do not invent fake interviews.
 */

export const STUDENT_DASHBOARD_SAMPLE = {
  student: {
    displayName: "Student",
    email: "student@college.edu",
    initials: "ST",
  },
  summary: {
    eligibleJobDrives: 8,
    applicationsSubmitted: 5,
    interviewsScheduled: 0,
    offersReceived: 1,
  },
  profileCompletion: {
    percent: 72,
    missingDetails: ["Resume upload", "LinkedIn profile", "Preferred job locations"],
  },
  eligibleOpportunities: [
    {
      id: "opp-sample-1",
      company: "Nimbus Analytics",
      jobTitle: "Graduate Software Engineer",
      minCgpa: "7.0",
      eligibility: "CSE / IT · Min CGPA 7.0",
      deadline: "2026-11-05",
    },
    {
      id: "opp-sample-2",
      company: "Harbor Systems",
      jobTitle: "Associate Product Analyst",
      minCgpa: "6.5",
      eligibility: "Any branch · Min CGPA 6.5",
      deadline: "2026-11-12",
    },
    {
      id: "opp-sample-3",
      company: "Cedar Soft",
      jobTitle: "Junior Full-Stack Developer",
      minCgpa: "7.5",
      eligibility: "CSE / ECE · Min CGPA 7.5",
      deadline: "2026-11-20",
    },
  ],
  recentApplications: [
    {
      id: "app-sample-1",
      jobTitle: "Graduate Software Engineer",
      company: "Nimbus Analytics",
      appliedDate: "2026-10-10",
      status: "Shortlisted",
    },
    {
      id: "app-sample-2",
      jobTitle: "Associate Product Analyst",
      company: "Harbor Systems",
      appliedDate: "2026-10-08",
      status: "Applied",
    },
    {
      id: "app-sample-3",
      jobTitle: "QA Trainee",
      company: "PixelForge Labs",
      appliedDate: "2026-10-02",
      status: "Rejected",
    },
    {
      id: "app-sample-4",
      jobTitle: "Backend Intern",
      company: "Cedar Soft",
      appliedDate: "2026-09-28",
      status: "Selected",
    },
  ],
  // Intentionally empty — show empty state rather than fabricated interviews.
  upcomingInterviews: [],
};
