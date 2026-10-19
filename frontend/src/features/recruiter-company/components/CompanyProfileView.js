"use client";

import { useEffect, useId, useState } from "react";
import {
  Building2,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  X,
} from "lucide-react";
import RecruiterShell from "@/components/layout/RecruiterShell";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  fetchRecruiterCompany,
  RecruiterCompanyServiceError,
} from "@/services/recruiterCompanyService";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^https?:\/\/.+/i;
const PHONE_PATTERN = /^[+]?[\d\s()-]{7,20}$/;

const EMPTY_FORM = {
  name: "",
  logoUrl: "",
  website: "",
  industry: "",
  location: "",
  description: "",
  contactEmail: "",
  phone: "",
};

function toFormValues(company) {
  if (!company) {
    return { ...EMPTY_FORM };
  }

  return {
    name: company.name ?? "",
    logoUrl: company.logoUrl ?? "",
    website: company.website ?? "",
    industry: company.industry ?? "",
    location: company.location ?? "",
    description: company.description ?? "",
    contactEmail: company.contactEmail ?? "",
    phone: company.phone ?? "",
  };
}

function deriveInitials(name) {
  const parts = String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) {
    return "??";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function deriveProfileStatus(values) {
  const required = [
    values.name,
    values.website,
    values.industry,
    values.location,
    values.description,
    values.contactEmail,
    values.phone,
  ];
  return required.every((value) => String(value ?? "").trim())
    ? "Complete"
    : "Draft";
}

function inputClass(error) {
  return `w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-secondary-text/70 focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:bg-background disabled:opacity-80 ${
    error
      ? "border-error focus-visible:border-error"
      : "border-border focus-visible:border-primary"
  }`;
}

export default function CompanyProfileView() {
  const formId = useId();
  const [recruiter, setRecruiter] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState({ ...EMPTY_FORM });
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [mockNotice, setMockNotice] = useState(
    "Showing mock company profile. Edit and Save update local UI only — nothing is saved to a backend.",
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchRecruiterCompany();
        if (!cancelled) {
          setRecruiter(result.recruiter);
          setCompany(result.company ?? null);
          setValues(toFormValues(result.company));
          if (result.demoNotice) {
            setMockNotice(result.demoNotice);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof RecruiterCompanyServiceError
              ? err.message
              : "Unable to load company profile. Please try again.";
          setError(message);
          setCompany(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function validate() {
    const next = {};
    const trimmedName = values.name.trim();
    const trimmedWebsite = values.website.trim();
    const trimmedIndustry = values.industry.trim();
    const trimmedLocation = values.location.trim();
    const trimmedDescription = values.description.trim();
    const trimmedEmail = values.contactEmail.trim();
    const trimmedPhone = values.phone.trim();
    const trimmedLogoUrl = values.logoUrl.trim();

    if (!trimmedName) {
      next.name = "Company name is required.";
    }

    if (!trimmedWebsite) {
      next.website = "Website is required.";
    } else if (!URL_PATTERN.test(trimmedWebsite)) {
      next.website = "Enter a valid URL starting with http:// or https://.";
    }

    if (trimmedLogoUrl && !URL_PATTERN.test(trimmedLogoUrl)) {
      next.logoUrl = "Enter a valid logo URL starting with http:// or https://.";
    }

    if (!trimmedIndustry) {
      next.industry = "Industry is required.";
    }

    if (!trimmedLocation) {
      next.location = "Location is required.";
    }

    if (!trimmedDescription) {
      next.description = "Description is required.";
    } else if (trimmedDescription.length < 20) {
      next.description = "Description should be at least 20 characters.";
    }

    if (!trimmedEmail) {
      next.contactEmail = "Contact email is required.";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      next.contactEmail = "Enter a valid email address.";
    }

    if (!trimmedPhone) {
      next.phone = "Phone is required.";
    } else if (!PHONE_PATTERN.test(trimmedPhone)) {
      next.phone = "Enter a valid phone number.";
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleEdit() {
    if (!company) {
      return;
    }
    setValues(toFormValues(company));
    setFieldErrors({});
    setIsEditing(true);
  }

  function handleCancel() {
    setValues(toFormValues(company));
    setFieldErrors({});
    setIsEditing(false);
  }

  async function handleSave(event) {
    event.preventDefault();
    if (saving || !validate()) {
      return;
    }

    setSaving(true);
    try {
      const nextCompany = {
        ...company,
        name: values.name.trim(),
        logoUrl: values.logoUrl.trim(),
        logoInitials: deriveInitials(values.name.trim()),
        website: values.website.trim(),
        industry: values.industry.trim(),
        location: values.location.trim(),
        description: values.description.trim(),
        contactEmail: values.contactEmail.trim(),
        phone: values.phone.trim(),
        profileStatus: deriveProfileStatus(values),
      };

      // Local UI update only — no backend company profile API exists.
      setCompany(nextCompany);
      setRecruiter((prev) =>
        prev
          ? {
              ...prev,
              company: nextCompany.name,
            }
          : prev,
      );
      setValues(toFormValues(nextCompany));
      setIsEditing(false);
      setMockNotice(
        "Saved in this browser session only — not connected to a backend. Changes will reset on reload.",
      );
    } finally {
      setSaving(false);
    }
  }

  const display = isEditing ? values : toFormValues(company);
  const logoInitials =
    company?.logoInitials ?? deriveInitials(display.name || "Company");
  const profileStatus =
    company?.profileStatus ?? deriveProfileStatus(display);

  return (
    <RecruiterShell
      title="Company Profile"
      breadcrumb="Recruiter / Company Profile"
      recruiter={recruiter}
      actions={
        !loading && company && !isEditing ? (
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-primary px-3 py-2 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        ) : null
      }
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Company Profile
            </h2>
            <p className="mt-1 text-sm text-secondary-text sm:text-base">
              Keep hiring details current for campus placement drives.
            </p>
          </div>
          {!loading && company && !isEditing ? (
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40 sm:hidden"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Edit profile
            </button>
          ) : null}
        </div>

        {mockNotice ? (
          <div
            role="status"
            className="rounded-[12px] border border-border bg-card px-4 py-3 text-sm text-secondary-text"
          >
            {mockNotice}
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="rounded-[12px] border border-error/30 bg-error-bg px-4 py-3 text-sm text-error"
          >
            {error}
          </div>
        ) : null}

        {loading ? (
          <div
            className="rounded-[12px] border border-border bg-card p-8 shadow-sm"
            aria-busy="true"
            aria-live="polite"
          >
            <div className="flex items-center gap-3 text-sm text-secondary-text">
              <span
                className="h-5 w-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
                aria-hidden="true"
              />
              Loading company profile…
            </div>
            <div className="mt-6 space-y-4">
              <div className="h-20 animate-pulse rounded-[10px] bg-background" />
              <div className="h-10 animate-pulse rounded-[10px] bg-background" />
              <div className="h-10 animate-pulse rounded-[10px] bg-background" />
              <div className="h-24 animate-pulse rounded-[10px] bg-background" />
            </div>
          </div>
        ) : null}

        {!loading && !error && !company ? (
          <div className="rounded-[12px] border border-border bg-card p-8 text-center shadow-sm">
            <Building2 className="mx-auto h-10 w-10 text-secondary-text" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No company profile yet
            </h3>
            <p className="mt-2 text-sm text-secondary-text">
              Company details are not available. Try again later or contact
              placement support.
            </p>
          </div>
        ) : null}

        {!loading && company ? (
          <form
            id={formId}
            onSubmit={handleSave}
            noValidate
            className="rounded-[12px] border border-border bg-card shadow-sm"
          >
            <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex min-w-0 items-start gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-border bg-primary/10 text-lg font-semibold text-primary"
                  aria-label={`${display.name || "Company"} logo placeholder`}
                >
                  <span aria-hidden="true">{logoInitials}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-lg font-semibold tracking-tight text-foreground">
                      {display.name || "Untitled company"}
                    </h3>
                    <StatusBadge status={profileStatus} />
                  </div>
                  <p className="mt-1 text-sm text-secondary-text">
                    {display.industry || "Industry not set"}
                    {display.location ? ` · ${display.location}` : ""}
                  </p>
                </div>
              </div>

              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-[10px] border border-border px-4 py-2 text-sm font-semibold text-foreground outline-none transition hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <span
                          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                          aria-hidden="true"
                        />
                        Saving…
                      </span>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              ) : null}
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Company name"
                  error={fieldErrors.name}
                  required
                  htmlFor={`${formId}-name`}
                >
                  <input
                    id={`${formId}-name`}
                    value={display.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    disabled={!isEditing || saving}
                    aria-invalid={Boolean(fieldErrors.name)}
                    className={inputClass(fieldErrors.name)}
                    placeholder="Nimbus Analytics"
                  />
                </Field>

                <Field
                  label="Industry"
                  error={fieldErrors.industry}
                  required
                  htmlFor={`${formId}-industry`}
                >
                  <input
                    id={`${formId}-industry`}
                    value={display.industry}
                    onChange={(event) =>
                      updateField("industry", event.target.value)
                    }
                    disabled={!isEditing || saving}
                    aria-invalid={Boolean(fieldErrors.industry)}
                    className={inputClass(fieldErrors.industry)}
                    placeholder="Data Analytics"
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Website"
                  error={fieldErrors.website}
                  required
                  htmlFor={`${formId}-website`}
                >
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-text" />
                    <input
                      id={`${formId}-website`}
                      type="url"
                      value={display.website}
                      onChange={(event) =>
                        updateField("website", event.target.value)
                      }
                      disabled={!isEditing || saving}
                      aria-invalid={Boolean(fieldErrors.website)}
                      className={`${inputClass(fieldErrors.website)} pl-9`}
                      placeholder="https://company.example"
                    />
                  </div>
                  {!isEditing && display.website ? (
                    <a
                      href={display.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-sm font-medium text-primary outline-none hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      Open website
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : null}
                </Field>

                <Field
                  label="Location"
                  error={fieldErrors.location}
                  required
                  htmlFor={`${formId}-location`}
                >
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-text" />
                    <input
                      id={`${formId}-location`}
                      value={display.location}
                      onChange={(event) =>
                        updateField("location", event.target.value)
                      }
                      disabled={!isEditing || saving}
                      aria-invalid={Boolean(fieldErrors.location)}
                      className={`${inputClass(fieldErrors.location)} pl-9`}
                      placeholder="Bengaluru, Karnataka"
                    />
                  </div>
                </Field>
              </div>

              <Field
                label="Logo URL"
                error={fieldErrors.logoUrl}
                htmlFor={`${formId}-logo`}
                hint="File upload is not available yet. Paste a public image URL or leave blank to use initials."
              >
                <input
                  id={`${formId}-logo`}
                  type="url"
                  value={display.logoUrl}
                  onChange={(event) => updateField("logoUrl", event.target.value)}
                  disabled={!isEditing || saving}
                  aria-invalid={Boolean(fieldErrors.logoUrl)}
                  className={inputClass(fieldErrors.logoUrl)}
                  placeholder="https://… (optional)"
                />
              </Field>

              <Field
                label="Description"
                error={fieldErrors.description}
                required
                htmlFor={`${formId}-description`}
              >
                <textarea
                  id={`${formId}-description`}
                  value={display.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  disabled={!isEditing || saving}
                  rows={5}
                  aria-invalid={Boolean(fieldErrors.description)}
                  className={inputClass(fieldErrors.description)}
                  placeholder="Brief overview of your company for students and placement officers"
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Contact email"
                  error={fieldErrors.contactEmail}
                  required
                  htmlFor={`${formId}-email`}
                >
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-text" />
                    <input
                      id={`${formId}-email`}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={display.contactEmail}
                      onChange={(event) =>
                        updateField("contactEmail", event.target.value)
                      }
                      disabled={!isEditing || saving}
                      aria-invalid={Boolean(fieldErrors.contactEmail)}
                      className={`${inputClass(fieldErrors.contactEmail)} pl-9`}
                      placeholder="campus@company.example"
                    />
                  </div>
                </Field>

                <Field
                  label="Phone"
                  error={fieldErrors.phone}
                  required
                  htmlFor={`${formId}-phone`}
                >
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-text" />
                    <input
                      id={`${formId}-phone`}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={display.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      disabled={!isEditing || saving}
                      aria-invalid={Boolean(fieldErrors.phone)}
                      className={`${inputClass(fieldErrors.phone)} pl-9`}
                      placeholder="+91 80 4000 1200"
                    />
                  </div>
                </Field>
              </div>
            </div>
          </form>
        ) : null}
      </div>
    </RecruiterShell>
  );
}

function Field({ label, error, required, htmlFor, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-error"> *</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p className="mt-1.5 text-xs text-secondary-text">{hint}</p>
      ) : null}
      {error ? (
        <p className="mt-1.5 text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
