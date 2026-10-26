"use client";
import StudentShell from "@/components/layout/StudentShell";
import { StudentUnavailableState } from "@/components/student/StudentState";
export default function StudentProfilePage() { return <StudentShell title="My Profile" breadcrumb="Student / My Profile"><div className="mx-auto flex w-full max-w-5xl flex-col gap-6"><div><h2 className="text-2xl font-semibold tracking-tight">My Profile</h2><p className="mt-1 text-sm text-secondary-text">Personal, academic, skills, and resume information will appear here when the profile API is available.</p></div><StudentUnavailableState message="Profile editing and saving are unavailable because the backend does not currently expose student profile endpoints. No changes were submitted." /></div></StudentShell>; }
