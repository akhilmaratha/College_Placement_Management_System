"use client";

import { useId, useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  INTERVIEW_TYPES,
  MOCK_COMPANIES,
  MOCK_JOB_OPENINGS,
  MOCK_STUDENTS,
} from "@/features/placement-interviews/data/placementInterviewsMockData";

const EMPTY_FORM = {
  studentName: "",
  company: "",
  jobTitle: "",
  interviewDate: "",
  interviewTime: "",
  interviewType: "Online",
  meetingLink: "",
  location: "",
};

function toFormValues(interview) {
  if (!interview) {
    return { ...EMPTY_FORM };
  }

  return {
    studentName: interview.studentName ?? "",
    company: interview.company ?? "",
    jobTitle: interview.jobTitle ?? "",
    interviewDate: interview.interviewDate ?? "",
    interviewTime: interview.interviewTime ?? "",
    interviewType: interview.interviewType ?? "Online",
    meetingLink: interview.meetingLink ?? "",
    location: interview.location ?? "",
  };
}

export default function InterviewFormModal({
  open,
  mode = "create",
  initialInterview = null,
  students = MOCK_STUDENTS,
  companies = MOCK_COMPANIES,
  jobOpenings = MOCK_JOB_OPENINGS,
  onClose,
  onSubmit,
}) {
  if (!open) {
    return null;
  }

  return (
    <InterviewFormModalInner
      key={`${mode}-${initialInterview?.id ?? "new"}`}
      mode={mode}
      initialInterview={initialInterview}
      students={students}
      companies={companies}
      jobOpenings={jobOpenings}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function InterviewFormModalInner({
  mode,
  initialInterview,
  students,
  companies,
  jobOpenings,
  onClose,
  onSubmit,
}) {
  const titleId = useId();
  const [values, setValues] = useState(() => toFormValues(initialInterview));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const studentOptions = useMemo(
    () =>
      Array.from(
        new Set([...students, ...(values.studentName ? [values.studentName] : [])]),
      ).sort((a, b) => a.localeCompare(b)),
    [students, values.studentName],
  );

  const companyOptions = useMemo(
    () =>
      Array.from(
        new Set([...companies, ...(values.company ? [values.company] : [])]),
      ).sort((a, b) => a.localeCompare(b)),
    [companies, values.company],
  );

  const jobTitleOptions = useMemo(() => {
    const fromOpenings = jobOpenings
      .filter((item) => !values.company || item.company === values.company)
      .map((item) => item.jobTitle);
    return Array.from(
      new Set([
        ...fromOpenings,
        ...(values.jobTitle ? [values.jobTitle] : []),
      ]),
    ).sort((a, b) => a.localeCompare(b));
  }, [jobOpenings, values.company, values.jobTitle]);

  function updateField(field, value) {
    setValues((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "company") {
        const stillValid = jobOpenings.some(
          (item) => item.company === value && item.jobTitle === prev.jobTitle,
        );
        if (!stillValid) {
          next.jobTitle = "";
        }
      }
      return next;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function validate() {
    const next = {};
    if (!values.studentName.trim()) {
      next.studentName = "Student is required.";
    }
    if (!values.company.trim()) {
      next.company = "Company is required.";
    }
    if (!values.jobTitle.trim()) {
      next.jobTitle = "Job opening is required.";
    }
    if (!values.interviewDate) {
      next.interviewDate = "Interview date is required.";
    } else if (Number.isNaN(Date.parse(values.interviewDate))) {
      next.interviewDate = "Enter a valid interview date.";
    }
    if (!values.interviewTime) {
      next.interviewTime = "Interview time is required.";
    } else if (!/^\d{2}:\d{2}$/.test(values.interviewTime)) {
      next.interviewTime = "Enter a valid time.";
    }
    if (!values.interviewType) {
      next.interviewType = "Interview type is required.";
    }
    if (
      values.meetingLink.trim() &&
      !/^https?:\/\/.+/i.test(values.meetingLink.trim())
    ) {
      next.meetingLink = "Enter a valid URL starting with http:// or https://.";
    }
    if (
      values.interviewType === "Online" &&
      !values.meetingLink.trim() &&
      !values.location.trim()
    ) {
      next.meetingLink =
        "Provide a meeting link (or location) for online interviews.";
    }
    if (
      values.interviewType === "On-campus" &&
      !values.location.trim() &&
      !values.meetingLink.trim()
    ) {
      next.location =
        "Provide a meeting location (or link) for on-campus interviews.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting || !validate()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit?.({
        studentName: values.studentName.trim(),
        company: values.company.trim(),
        jobTitle: values.jobTitle.trim(),
        interviewDate: values.interviewDate.trim(),
        interviewTime: values.interviewTime.trim(),
        interviewType: values.interviewType,
        meetingLink: values.meetingLink.trim(),
        location: values.location.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  }

  const heading =
    mode === "reschedule"
      ? "Reschedule Interview"
      : mode === "edit"
        ? "Edit Interview"
        : "Add Interview";

  const submitLabel =
    mode === "reschedule"
      ? "Save new schedule"
      : mode === "edit"
        ? "Save changes"
        : "Schedule interview";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-4 sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[12px] border border-border bg-card p-5 shadow-lg sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2
              id={titleId}
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              {heading}
            </h2>
            <p className="mt-1 text-sm text-secondary-text">
              Changes stay in this browser session only — not saved to a backend.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] p-2 text-secondary-text outline-none hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Close form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Field label="Student" error={errors.studentName} required>
            <select
              value={values.studentName}
              onChange={(event) =>
                updateField("studentName", event.target.value)
              }
              className={inputClass(errors.studentName)}
              disabled={mode === "reschedule"}
            >
              <option value="">Select student</option>
              {studentOptions.map((student) => (
                <option key={student} value={student}>
                  {student}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company" error={errors.company} required>
              <select
                value={values.company}
                onChange={(event) => updateField("company", event.target.value)}
                className={inputClass(errors.company)}
                disabled={mode === "reschedule"}
              >
                <option value="">Select company</option>
                {companyOptions.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Job opening" error={errors.jobTitle} required>
              <select
                value={values.jobTitle}
                onChange={(event) =>
                  updateField("jobTitle", event.target.value)
                }
                className={inputClass(errors.jobTitle)}
                disabled={mode === "reschedule" || !values.company}
              >
                <option value="">
                  {values.company ? "Select job opening" : "Select company first"}
                </option>
                {jobTitleOptions.map((jobTitle) => (
                  <option key={jobTitle} value={jobTitle}>
                    {jobTitle}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Interview date"
              error={errors.interviewDate}
              required
            >
              <input
                type="date"
                value={values.interviewDate}
                onChange={(event) =>
                  updateField("interviewDate", event.target.value)
                }
                className={inputClass(errors.interviewDate)}
              />
            </Field>

            <Field
              label="Interview time"
              error={errors.interviewTime}
              required
            >
              <input
                type="time"
                value={values.interviewTime}
                onChange={(event) =>
                  updateField("interviewTime", event.target.value)
                }
                className={inputClass(errors.interviewTime)}
              />
            </Field>
          </div>

          <Field label="Interview type" error={errors.interviewType} required>
            <select
              value={values.interviewType}
              onChange={(event) =>
                updateField("interviewType", event.target.value)
              }
              className={inputClass(errors.interviewType)}
            >
              {INTERVIEW_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Meeting link (optional)"
            error={errors.meetingLink}
          >
            <input
              type="url"
              value={values.meetingLink}
              onChange={(event) =>
                updateField("meetingLink", event.target.value)
              }
              className={inputClass(errors.meetingLink)}
              placeholder="https://meet.example.com/…"
            />
          </Field>

          <Field label="Meeting location (optional)" error={errors.location}>
            <input
              value={values.location}
              onChange={(event) => updateField("location", event.target.value)}
              className={inputClass(errors.location)}
              placeholder="Seminar Hall B, Block 2"
            />
          </Field>

          <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-[10px] border border-border px-4 py-2 text-sm font-semibold text-foreground outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-white outline-none hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Saving…" : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, required, children }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-foreground">
        {label}
        {required ? <span className="text-error"> *</span> : null}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-sm text-error" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function inputClass(error) {
  return `w-full rounded-[10px] border bg-white px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-secondary-text/70 focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:bg-background disabled:opacity-70 ${
    error
      ? "border-error focus-visible:border-error"
      : "border-border focus-visible:border-primary"
  }`;
}
