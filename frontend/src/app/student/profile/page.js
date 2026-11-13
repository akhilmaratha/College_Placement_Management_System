"use client";
import { useCallback, useEffect, useState } from "react";
import StudentShell from "@/components/layout/StudentShell";
import { StudentUnavailableState } from "@/components/student/StudentState";
import { fetchStudentProfile, updateStudentProfile } from "@/services/studentProfileService";

const editable = [
  ["fullName", "Full name", true], ["phoneNumber", "Phone number", true],
  ["alternateEmail", "Alternate email"], ["gender", "Gender"], ["dateOfBirth", "Date of birth", false, "date"],
  ["currentAddress", "Address", false, "textarea"], ["linkedinUrl", "LinkedIn URL"], ["githubUrl", "GitHub URL"],
];
const blank = Object.fromEntries(editable.map(([key]) => [key, ""]));

export default function StudentProfilePage() {
  const [profile, setProfile] = useState(null); const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const [error, setError] = useState(""); const [success, setSuccess] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const data = await fetchStudentProfile(); setProfile(data); setForm(Object.fromEntries(editable.map(([key]) => [key, data[key] ?? ""]))); }
    catch (e) { setError(e.message || "Unable to load your profile."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = setTimeout(load, 0); return () => clearTimeout(timer); }, [load]);
  async function save(event) {
    event.preventDefault(); setSaving(true); setError(""); setSuccess("");
    try { const data = await updateStudentProfile(form); setProfile(data); setForm(Object.fromEntries(editable.map(([key]) => [key, data[key] ?? ""]))); setSuccess("Profile updated successfully."); }
    catch (e) { setError(e.message || "Unable to save your profile."); }
    finally { setSaving(false); }
  }
  return <StudentShell title="My Profile" breadcrumb="Student / My Profile"><div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
    <div><h2 className="text-2xl font-semibold tracking-tight">My Profile</h2><p className="mt-1 text-sm text-secondary-text">Review your student details and keep your contact information current.</p></div>
    {loading ? <div className="h-48 animate-pulse rounded-xl border border-border bg-card" aria-label="Loading profile" /> : error && !profile ? <StudentUnavailableState message={error} /> : null}
    {!loading && profile ? <>
      {error ? <div role="alert" className="rounded-lg border border-error/30 bg-error-bg px-4 py-3 text-sm text-error">{error}</div> : null}
      {success ? <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{success}</div> : null}
      <form onSubmit={save} className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <h3 className="mb-5 text-lg font-semibold">Personal information</h3>
        <div className="grid gap-4 sm:grid-cols-2">{editable.map(([key, label, required, type]) => <label key={key} className={`text-sm ${type === "textarea" ? "sm:col-span-2" : ""}`}><span className="mb-1.5 block font-medium">{label}</span>{type === "textarea" ? <textarea rows={3} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="w-full rounded-lg border border-border bg-white px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary/30" /> : <input type={type ?? "text"} required={required} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="w-full rounded-lg border border-border bg-white px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-primary/30" />}</label>)}</div>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-secondary-text"><span>Email: {profile.email}</span><span>Student ID: {profile.rollNumber}</span></div>
        <button disabled={saving} className="mt-6 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button>
      </form>
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7"><h3 className="text-lg font-semibold">Academic information</h3>{profile.degreeProgram || profile.departmentBranch || profile.currentCgpa != null ? <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">{[["Program", profile.degreeProgram], ["Department", profile.departmentBranch], ["Graduation year", profile.graduationYear], ["CGPA", profile.currentCgpa]].map(([label, value]) => <div key={label}><dt className="text-secondary-text">{label}</dt><dd className="mt-1 font-medium">{value ?? "—"}</dd></div>)}</dl> : <p className="mt-3 text-sm text-secondary-text">Academic information is not available.</p>}{profile.skills?.length ? <p className="mt-4 text-sm"><span className="font-medium">Skills: </span>{profile.skills.join(", ")}</p> : null}{profile.resumes?.length ? <div className="mt-4 text-sm"><p className="font-medium">Resumes</p><ul className="mt-1 list-inside list-disc text-secondary-text">{profile.resumes.map(r => <li key={r.id}>{r.title} — {r.originalFileName}{r.defaultResume ? " (default)" : ""}</li>)}</ul></div> : <p className="mt-4 text-sm text-secondary-text">No resume information is available.</p>}</section>
    </> : null}
  </div></StudentShell>;
}
