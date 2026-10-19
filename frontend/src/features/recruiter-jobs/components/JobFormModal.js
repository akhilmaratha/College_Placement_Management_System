"use client";

import { useId, useState } from "react";
import { X } from "lucide-react";

const EMPTY_FORM = {
  title: "",
  description: "",
  location: "",
  jobType: "Full-time",
  salary: "",
  eligibility: "",
  minCgpa: "",
  skills: "",
  deadline: "",
  status: "Draft",
};

function toFormValues(job) {
  if (!job) {
    return { ...EMPTY_FORM };
  }

  return {
    title: job.title ?? "",
    description: job.description ?? "",
    location: job.location ?? "",
    jobType: job.jobType ?? "Full-time",
    salary: job.salary ?? "",
    eligibility: job.eligibility ?? "",
    minCgpa: job.minCgpa ?? "",
    skills: job.skills ?? "",
    deadline: job.deadline ?? "",
    status: job.status ?? "Draft",
  };
}

export default function JobFormModal({
  open,
  mode = "create",
  initialJob = null,
  onClose,
  onSubmit,
}) {
  if (!open) {
    return null;
  }

  return (
    <JobFormModalInner
      key={`${mode}-${initialJob?.id ?? "new"}`}
      mode={mode}
      initialJob={initialJob}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function JobFormModalInner({ mode, initialJob, onClose, onSubmit }) {
  const titleId = useId();
  const [values, setValues] = useState(() => toFormValues(initialJob));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function updateField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function validate() {
    const next = {};
    if (!values.title.trim()) {
      next.title = "Title is required.";
    }
    if (!values.description.trim()) {
      next.description = "Description is required.";
    }
    if (!values.location.trim()) {
      next.location = "Location is required.";
    }
    if (!values.jobType) {
      next.jobType = "Job type is required.";
    }
    if (!values.eligibility.trim()) {
      next.eligibility = "Eligibility is required.";
    }
    if (!values.skills.trim()) {
      next.skills = "Skills are required.";
    }
    if (!values.deadline) {
      next.deadline = "Deadline is required.";
    }
    if (values.minCgpa) {
      const cgpa = Number(values.minCgpa);
      if (Number.isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
        next.minCgpa = "Enter a CGPA between 0 and 10.";
      }
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
        ...values,
        title: values.title.trim(),
        description: values.description.trim(),
        location: values.location.trim(),
        salary: values.salary.trim(),
        eligibility: values.eligibility.trim(),
        minCgpa: values.minCgpa.trim(),
        skills: values.skills.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  }

  const heading = mode === "edit" ? "Edit Job" : "Create Job";

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
          <Field label="Title" error={errors.title} required>
            <input
              value={values.title}
              onChange={(event) => updateField("title", event.target.value)}
              className={inputClass(errors.title)}
              placeholder="Graduate Software Engineer"
            />
          </Field>

          <Field label="Description" error={errors.description} required>
            <textarea
              value={values.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={4}
              className={inputClass(errors.description)}
              placeholder="Role summary and responsibilities"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Location" error={errors.location} required>
              <input
                value={values.location}
                onChange={(event) => updateField("location", event.target.value)}
                className={inputClass(errors.location)}
                placeholder="Bengaluru"
              />
            </Field>

            <Field label="Job type" error={errors.jobType} required>
              <select
                value={values.jobType}
                onChange={(event) => updateField("jobType", event.target.value)}
                className={inputClass(errors.jobType)}
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Salary (optional)" error={errors.salary}>
              <input
                value={values.salary}
                onChange={(event) => updateField("salary", event.target.value)}
                className={inputClass(errors.salary)}
                placeholder="12 LPA"
              />
            </Field>

            <Field label="Min CGPA (optional)" error={errors.minCgpa}>
              <input
                value={values.minCgpa}
                onChange={(event) => updateField("minCgpa", event.target.value)}
                className={inputClass(errors.minCgpa)}
                placeholder="7.0"
                inputMode="decimal"
              />
            </Field>
          </div>

          <Field label="Eligibility" error={errors.eligibility} required>
            <input
              value={values.eligibility}
              onChange={(event) =>
                updateField("eligibility", event.target.value)
              }
              className={inputClass(errors.eligibility)}
              placeholder="CSE / IT"
            />
          </Field>

          <Field label="Skills" error={errors.skills} required>
            <input
              value={values.skills}
              onChange={(event) => updateField("skills", event.target.value)}
              className={inputClass(errors.skills)}
              placeholder="React, Java, SQL"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Deadline" error={errors.deadline} required>
              <input
                type="date"
                value={values.deadline}
                onChange={(event) => updateField("deadline", event.target.value)}
                className={inputClass(errors.deadline)}
              />
            </Field>

            <Field label="Status" error={errors.status} required>
              <select
                value={values.status}
                onChange={(event) => updateField("status", event.target.value)}
                className={inputClass(errors.status)}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Closed">Closed</option>
              </select>
            </Field>
          </div>

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
              {submitting
                ? "Saving…"
                : mode === "edit"
                  ? "Save changes"
                  : "Create job"}
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
  return `w-full rounded-[10px] border bg-white px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-secondary-text/70 focus-visible:ring-2 focus-visible:ring-primary/30 ${
    error
      ? "border-error focus-visible:border-error"
      : "border-border focus-visible:border-primary"
  }`;
}
