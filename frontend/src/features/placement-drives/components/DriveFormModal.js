"use client";

import { useId, useState } from "react";
import { X } from "lucide-react";
import {
  DRIVE_STATUSES,
  MOCK_COMPANIES,
} from "@/features/placement-drives/data/placementDrivesMockData";

const EMPTY_FORM = {
  name: "",
  company: "",
  jobTitle: "",
  description: "",
  eligibility: "",
  minCgpa: "",
  skills: "",
  applicationDeadline: "",
  interviewDate: "",
  status: "Upcoming",
};

function toFormValues(drive) {
  if (!drive) {
    return { ...EMPTY_FORM };
  }

  return {
    name: drive.name ?? "",
    company: drive.company ?? "",
    jobTitle: drive.jobTitle ?? "",
    description: drive.description ?? "",
    eligibility: drive.eligibility ?? "",
    minCgpa: drive.minCgpa ?? "",
    skills: drive.skills ?? "",
    applicationDeadline: drive.applicationDeadline ?? "",
    interviewDate: drive.interviewDate ?? "",
    status: drive.status ?? "Upcoming",
  };
}

export default function DriveFormModal({
  open,
  mode = "create",
  initialDrive = null,
  companies = MOCK_COMPANIES,
  onClose,
  onSubmit,
}) {
  if (!open) {
    return null;
  }

  return (
    <DriveFormModalInner
      key={`${mode}-${initialDrive?.id ?? "new"}`}
      mode={mode}
      initialDrive={initialDrive}
      companies={companies}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function DriveFormModalInner({
  mode,
  initialDrive,
  companies,
  onClose,
  onSubmit,
}) {
  const titleId = useId();
  const [values, setValues] = useState(() => toFormValues(initialDrive));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const companyOptions = Array.from(
    new Set([
      ...companies,
      ...(values.company ? [values.company] : []),
    ]),
  ).sort((a, b) => a.localeCompare(b));

  function updateField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function validate() {
    const next = {};
    if (!values.name.trim()) {
      next.name = "Drive name is required.";
    }
    if (!values.company.trim()) {
      next.company = "Company is required.";
    }
    if (!values.jobTitle.trim()) {
      next.jobTitle = "Job title is required.";
    }
    if (!values.description.trim()) {
      next.description = "Description is required.";
    }
    if (!values.eligibility.trim()) {
      next.eligibility = "Eligibility criteria are required.";
    }
    if (!values.skills.trim()) {
      next.skills = "Required skills are required.";
    }
    if (!values.applicationDeadline) {
      next.applicationDeadline = "Application deadline is required.";
    }
    if (!values.status) {
      next.status = "Drive status is required.";
    }
    if (values.minCgpa) {
      const cgpa = Number(values.minCgpa);
      if (Number.isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
        next.minCgpa = "Enter a CGPA between 0 and 10.";
      }
    }
    if (
      values.interviewDate &&
      values.applicationDeadline &&
      values.interviewDate < values.applicationDeadline
    ) {
      next.interviewDate =
        "Interview date should be on or after the application deadline.";
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
        name: values.name.trim(),
        company: values.company.trim(),
        jobTitle: values.jobTitle.trim(),
        description: values.description.trim(),
        eligibility: values.eligibility.trim(),
        minCgpa: values.minCgpa.trim(),
        skills: values.skills.trim(),
        interviewDate: values.interviewDate.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  }

  const heading = mode === "edit" ? "Edit Drive" : "Add Drive";

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
          <Field label="Drive name" error={errors.name} required>
            <input
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              className={inputClass(errors.name)}
              placeholder="Campus Drive — Software Engineer"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company" error={errors.company} required>
              <select
                value={values.company}
                onChange={(event) => updateField("company", event.target.value)}
                className={inputClass(errors.company)}
              >
                <option value="">Select company</option>
                {companyOptions.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Job title" error={errors.jobTitle} required>
              <input
                value={values.jobTitle}
                onChange={(event) => updateField("jobTitle", event.target.value)}
                className={inputClass(errors.jobTitle)}
                placeholder="Graduate Software Engineer"
              />
            </Field>
          </div>

          <Field label="Description" error={errors.description} required>
            <textarea
              value={values.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={4}
              className={inputClass(errors.description)}
              placeholder="Drive summary and role overview"
            />
          </Field>

          <Field
            label="Eligibility criteria"
            error={errors.eligibility}
            required
          >
            <input
              value={values.eligibility}
              onChange={(event) =>
                updateField("eligibility", event.target.value)
              }
              className={inputClass(errors.eligibility)}
              placeholder="CSE / IT"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Min CGPA (optional)" error={errors.minCgpa}>
              <input
                value={values.minCgpa}
                onChange={(event) => updateField("minCgpa", event.target.value)}
                className={inputClass(errors.minCgpa)}
                placeholder="7.0"
                inputMode="decimal"
              />
            </Field>

            <Field label="Required skills" error={errors.skills} required>
              <input
                value={values.skills}
                onChange={(event) => updateField("skills", event.target.value)}
                className={inputClass(errors.skills)}
                placeholder="React, Java, SQL"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Application deadline"
              error={errors.applicationDeadline}
              required
            >
              <input
                type="date"
                value={values.applicationDeadline}
                onChange={(event) =>
                  updateField("applicationDeadline", event.target.value)
                }
                className={inputClass(errors.applicationDeadline)}
              />
            </Field>

            <Field
              label="Interview date (optional)"
              error={errors.interviewDate}
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
          </div>

          <Field label="Drive status" error={errors.status} required>
            <select
              value={values.status}
              onChange={(event) => updateField("status", event.target.value)}
              className={inputClass(errors.status)}
            >
              {DRIVE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
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
              {submitting
                ? "Saving…"
                : mode === "edit"
                  ? "Save changes"
                  : "Create drive"}
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
