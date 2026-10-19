/**
 * DEMO / MOCK UI DATA ONLY — Placement Officer Student Management
 *
 * TODO: Replace this module when placement officer student APIs exist.
 * Do not treat these shapes as a confirmed backend contract.
 * Read-only UI preview — no create/update persistence is available.
 */

export const PLACEMENT_STATUSES = ["Placed", "In Process", "Unplaced"];

export const DEPARTMENTS = [
  "CSE",
  "IT",
  "ECE",
  "Mechanical",
  "Civil",
];

export const GRADUATION_YEARS = [2025, 2026, 2027];

export const PLACEMENT_STUDENTS_MOCK = {
  isDemoData: true,
  demoNotice:
    "Showing demo students for UI preview only. No placement student API is connected — data is not live and cannot be saved.",
  officer: {
    displayName: "Meera Joshi",
    role: "Placement Officer",
    email: "meera.joshi@college.edu",
    initials: "MJ",
  },
  students: [
    {
      id: "po-stu-1",
      name: "Aisha Khan",
      email: "aisha.khan@student.campus.edu",
      studentId: "CSE2026-014",
      department: "CSE",
      graduationYear: 2026,
      degree: "B.Tech",
      cgpa: "8.4",
      placementStatus: "In Process",
      skills: ["JavaScript", "React", "SQL"],
      resumeAvailable: true,
      applicationHistory: [
        {
          id: "po-stu-1-app-1",
          company: "Nimbus Analytics",
          jobTitle: "Graduate Software Engineer",
          appliedAt: "2026-10-14",
          status: "Shortlisted",
        },
        {
          id: "po-stu-1-app-2",
          company: "Cedar Soft",
          jobTitle: "Junior Full-Stack Developer",
          appliedAt: "2026-10-02",
          status: "Applied",
        },
      ],
    },
    {
      id: "po-stu-2",
      name: "Rohan Mehta",
      email: "rohan.mehta@student.campus.edu",
      studentId: "IT2026-031",
      department: "IT",
      graduationYear: 2026,
      degree: "B.Tech",
      cgpa: "7.9",
      placementStatus: "Unplaced",
      skills: ["Java", "Spring Boot"],
      resumeAvailable: true,
      applicationHistory: [
        {
          id: "po-stu-2-app-1",
          company: "Harbor Systems",
          jobTitle: "Associate Product Analyst",
          appliedAt: "2026-10-13",
          status: "Applied",
        },
      ],
    },
    {
      id: "po-stu-3",
      name: "Priya Nair",
      email: "priya.nair@student.campus.edu",
      studentId: "ECE2025-008",
      department: "ECE",
      graduationYear: 2025,
      degree: "B.Tech",
      cgpa: "8.1",
      placementStatus: "Placed",
      skills: ["Python", "SQL", "Tableau"],
      resumeAvailable: true,
      applicationHistory: [
        {
          id: "po-stu-3-app-1",
          company: "Cedar Soft",
          jobTitle: "Junior Full-Stack Developer",
          appliedAt: "2026-09-20",
          status: "Selected",
        },
        {
          id: "po-stu-3-app-2",
          company: "Harbor Systems",
          jobTitle: "Associate Product Analyst",
          appliedAt: "2026-09-12",
          status: "Rejected",
        },
      ],
    },
    {
      id: "po-stu-4",
      name: "Dev Patel",
      email: "dev.patel@student.campus.edu",
      studentId: "CSE2026-052",
      department: "CSE",
      graduationYear: 2026,
      degree: "B.Tech",
      cgpa: "7.2",
      placementStatus: "Unplaced",
      skills: ["TypeScript", "Node.js"],
      resumeAvailable: false,
      applicationHistory: [
        {
          id: "po-stu-4-app-1",
          company: "PixelForge Labs",
          jobTitle: "QA Trainee",
          appliedAt: "2026-10-09",
          status: "Rejected",
        },
      ],
    },
    {
      id: "po-stu-5",
      name: "Neha Sharma",
      email: "neha.sharma@student.campus.edu",
      studentId: "CSE2027-003",
      department: "CSE",
      graduationYear: 2027,
      degree: "B.Tech",
      cgpa: "8.7",
      placementStatus: "In Process",
      skills: ["Java", "PostgreSQL"],
      resumeAvailable: true,
      applicationHistory: [
        {
          id: "po-stu-5-app-1",
          company: "Nimbus Analytics",
          jobTitle: "Backend Intern",
          appliedAt: "2026-10-15",
          status: "Interview Scheduled",
        },
      ],
    },
    {
      id: "po-stu-6",
      name: "Arjun Desai",
      email: "arjun.desai@student.campus.edu",
      studentId: "MECH2026-019",
      department: "Mechanical",
      graduationYear: 2026,
      degree: "B.Tech",
      cgpa: "7.5",
      placementStatus: "Unplaced",
      skills: ["SolidWorks", "MATLAB"],
      resumeAvailable: false,
      applicationHistory: [],
    },
    {
      id: "po-stu-7",
      name: "Kavya Iyer",
      email: "kavya.iyer@student.campus.edu",
      studentId: "IT2025-022",
      department: "IT",
      graduationYear: 2025,
      degree: "B.Tech",
      cgpa: "8.9",
      placementStatus: "Placed",
      skills: ["Python", "Django", "AWS"],
      resumeAvailable: true,
      applicationHistory: [
        {
          id: "po-stu-7-app-1",
          company: "Nimbus Analytics",
          jobTitle: "Graduate Software Engineer",
          appliedAt: "2026-09-05",
          status: "Selected",
        },
      ],
    },
    {
      id: "po-stu-8",
      name: "Siddharth Rao",
      email: "siddharth.rao@student.campus.edu",
      studentId: "CIV2027-011",
      department: "Civil",
      graduationYear: 2027,
      degree: "B.Tech",
      cgpa: "7.0",
      placementStatus: "Unplaced",
      skills: ["AutoCAD", "Project Planning"],
      resumeAvailable: true,
      applicationHistory: [],
    },
  ],
};
