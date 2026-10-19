/**
 * MOCK UI DATA ONLY — Admin Settings
 *
 * TODO: Replace this module when admin settings APIs exist.
 * Do not treat these shapes as a confirmed backend contract.
 * Save updates local UI state only — nothing persists to a server.
 */

export const ACADEMIC_YEAR_OPTIONS = ["2024-25", "2025-26", "2026-27"];

export const ADMIN_SETTINGS_MOCK = {
  isDemoData: true,
  demoNotice:
    "Demo admin settings for UI preview only — not connected to a backend. Save updates local edit state only.",
  admin: {
    displayName: "Admin User",
    role: "System Administrator",
    email: "admin@college.edu",
    initials: "AU",
    isDemoProfile: true,
  },
  settings: {
    institution: {
      collegeName: "Riverside Institute of Technology",
      website: "https://riverside.example.edu",
      contactEmail: "placements@riverside.example.edu",
    },
    placement: {
      academicYear: "2025-26",
      applicationsOpen: true,
      requireResume: true,
      allowMultipleOffers: false,
    },
    notifications: {
      emailAlerts: true,
      inAppAlerts: true,
      driveAnnouncements: true,
      applicationUpdates: false,
    },
  },
};
