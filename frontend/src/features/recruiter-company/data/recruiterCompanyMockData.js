/**
 * MOCK UI DATA ONLY — Recruiter Company Profile
 *
 * TODO: Replace this module when recruiter company profile APIs exist.
 * Do not treat these shapes as a confirmed backend contract.
 * Edit/save interactions update local UI state only.
 */

export const RECRUITER_COMPANY_MOCK = {
  isDemoData: true,
  demoNotice:
    "Demo company profile for UI preview only — not connected to a backend. Save updates local edit state only.",
  recruiter: {
    displayName: "Recruiter",
    company: "Nimbus Analytics",
    initials: "RA",
  },
  company: {
    id: "rc-mock-1",
    name: "Nimbus Analytics",
    logoUrl: "",
    logoInitials: "NA",
    website: "https://nimbusanalytics.example",
    industry: "Data Analytics",
    location: "Bengaluru, Karnataka",
    description:
      "Nimbus Analytics builds decision-support products for mid-market teams. Campus hiring focuses on software engineering, data analysis, and product roles.",
    contactEmail: "campus@nimbusanalytics.example",
    phone: "+91 80 4000 1200",
    profileStatus: "Complete",
  },
};
