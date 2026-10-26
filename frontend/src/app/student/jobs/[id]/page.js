"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import StudentShell from "@/components/layout/StudentShell";
import { StudentUnavailableState } from "@/components/student/StudentState";
export default function StudentJobDetailsPage() { const { id } = useParams(); const message = id ? "Job details are unavailable because the backend does not expose a student job-details endpoint." : "The job ID is missing or invalid."; return <StudentShell title="Job details" breadcrumb="Student / Job details"><div className="mx-auto flex max-w-2xl flex-col gap-5"><StudentUnavailableState message={message} /><Link href="/student/jobs" className="self-center rounded-[10px] border border-border bg-card px-4 py-2.5 text-sm font-semibold text-primary hover:bg-background">Back to Browse Jobs</Link></div></StudentShell>; }
