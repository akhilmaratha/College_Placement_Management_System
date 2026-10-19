"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  Globe,
  Mail,
  Settings2,
  UserRound,
  X,
} from "lucide-react";
import AdminShell from "@/components/layout/AdminShell";
import { ACADEMIC_YEAR_OPTIONS } from "@/features/admin-settings/data/adminSettingsMockData";
import {
  fetchAdminSettings,
  AdminSettingsServiceError,
} from "@/services/adminSettingsService";
import { getCurrentUser } from "@/services/authService";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_PATTERN = /^https?:\/\/.+/i;

const EMPTY_FORM = {
  collegeName: "",
  website: "",
  contactEmail: "",
  academicYear: "",
  applicationsOpen: true,
  requireResume: true,
  allowMultipleOffers: false,
  emailAlerts: true,
  inAppAlerts: true,
  driveAnnouncements: true,
  applicationUpdates: false,
};

function toFormValues(settings) {
  if (!settings) {
    return { ...EMPTY_FORM };
  }

  return {
    collegeName: settings.institution?.collegeName ?? "",
    website: settings.institution?.website ?? "",
    contactEmail: settings.institution?.contactEmail ?? "",
    academicYear: settings.placement?.academicYear ?? "",
    applicationsOpen: Boolean(settings.placement?.applicationsOpen),
    requireResume: Boolean(settings.placement?.requireResume),
    allowMultipleOffers: Boolean(settings.placement?.allowMultipleOffers),
    emailAlerts: Boolean(settings.notifications?.emailAlerts),
    inAppAlerts: Boolean(settings.notifications?.inAppAlerts),
    driveAnnouncements: Boolean(settings.notifications?.driveAnnouncements),
    applicationUpdates: Boolean(settings.notifications?.applicationUpdates),
  };
}

function formToSettings(values) {
  return {
    institution: {
      collegeName: values.collegeName.trim(),
      website: values.website.trim(),
      contactEmail: values.contactEmail.trim(),
    },
    placement: {
      academicYear: values.academicYear.trim(),
      applicationsOpen: Boolean(values.applicationsOpen),
      requireResume: Boolean(values.requireResume),
      allowMultipleOffers: Boolean(values.allowMultipleOffers),
    },
    notifications: {
      emailAlerts: Boolean(values.emailAlerts),
      inAppAlerts: Boolean(values.inAppAlerts),
      driveAnnouncements: Boolean(values.driveAnnouncements),
      applicationUpdates: Boolean(values.applicationUpdates),
    },
  };
}

function serializeForm(values) {
  return JSON.stringify({
    collegeName: values.collegeName.trim(),
    website: values.website.trim(),
    contactEmail: values.contactEmail.trim(),
    academicYear: values.academicYear.trim(),
    applicationsOpen: Boolean(values.applicationsOpen),
    requireResume: Boolean(values.requireResume),
    allowMultipleOffers: Boolean(values.allowMultipleOffers),
    emailAlerts: Boolean(values.emailAlerts),
    inAppAlerts: Boolean(values.inAppAlerts),
    driveAnnouncements: Boolean(values.driveAnnouncements),
    applicationUpdates: Boolean(values.applicationUpdates),
  });
}

function deriveInitials(name, email) {
  const parts = String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  const local = String(email ?? "").split("@")[0] ?? "";
  if (local.length >= 2) {
    return local.slice(0, 2).toUpperCase();
  }
  return "AD";
}

function inputClass(error) {
  return `w-full rounded-[10px] border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-secondary-text/70 focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:bg-background disabled:opacity-80 ${
    error
      ? "border-error focus-visible:border-error"
      : "border-border focus-visible:border-primary"
  }`;
}

export default function AdminSettingsView() {
  const formId = useId();
  const [admin, setAdmin] = useState(null);
  const [profileSource, setProfileSource] = useState("demo");
  const [settings, setSettings] = useState(null);
  const [values, setValues] = useState({ ...EMPTY_FORM });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [mockNotice, setMockNotice] = useState(
    "Showing mock admin settings. Save updates local UI only — nothing is saved to a backend.",
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      try {
        const [result, sessionUser] = await Promise.all([
          fetchAdminSettings(),
          getCurrentUser(),
        ]);

        if (cancelled) {
          return;
        }

        setSettings(result.settings ?? null);
        setValues(toFormValues(result.settings));

        if (result.demoNotice) {
          setMockNotice(result.demoNotice);
        }

        if (sessionUser) {
          setAdmin({
            displayName: sessionUser.name ?? "Admin",
            role: sessionUser.role ?? "ADMIN",
            email: sessionUser.email ?? "",
            initials:
              sessionUser.initials ??
              deriveInitials(sessionUser.name, sessionUser.email),
            isDemoProfile: false,
          });
          setProfileSource("session");
        } else {
          setAdmin(result.admin ?? null);
          setProfileSource("demo");
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof AdminSettingsServiceError
              ? err.message
              : "Unable to load settings. Please try again.";
          setError(message);
          setSettings(null);
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

  const isDirty = useMemo(() => {
    if (!settings) {
      return false;
    }
    return serializeForm(values) !== serializeForm(toFormValues(settings));
  }, [settings, values]);

  useEffect(() => {
    if (!isDirty) {
      return undefined;
    }

    function onBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  function updateField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  }

  function validate() {
    const next = {};
    const trimmedName = values.collegeName.trim();
    const trimmedWebsite = values.website.trim();
    const trimmedEmail = values.contactEmail.trim();
    const trimmedYear = values.academicYear.trim();

    if (!trimmedName) {
      next.collegeName = "College name is required.";
    }

    if (!trimmedWebsite) {
      next.website = "Website is required.";
    } else if (!URL_PATTERN.test(trimmedWebsite)) {
      next.website = "Enter a valid URL starting with http:// or https://.";
    }

    if (!trimmedEmail) {
      next.contactEmail = "Contact email is required.";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      next.contactEmail = "Enter a valid email address.";
    }

    if (!trimmedYear) {
      next.academicYear = "Academic year is required.";
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleCancel() {
    setValues(toFormValues(settings));
    setFieldErrors({});
    setSuccessMessage("");
  }

  async function handleSave(event) {
    event.preventDefault();
    if (saving || !validate()) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      // Brief delay so the saving UI state is observable.
      await new Promise((resolve) => setTimeout(resolve, 300));

      const nextSettings = formToSettings(values);

      // Local UI update only — no backend admin settings API exists.
      setSettings(nextSettings);
      setValues(toFormValues(nextSettings));
      setMockNotice(
        "Saved in this browser session only — not connected to a backend. Changes will reset on reload.",
      );
      setSuccessMessage(
        "Settings updated in this session only. Backend save is not connected yet.",
      );
    } catch {
      setError("Unable to apply settings locally. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const shellAdmin = admin
    ? {
        displayName: admin.displayName,
        role: admin.role,
        initials: admin.initials,
      }
    : undefined;

  return (
    <AdminShell
      title="Settings"
      breadcrumb="Admin / Settings"
      admin={shellAdmin}
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Settings
            </h2>
            <p className="mt-1 text-sm text-secondary-text sm:text-base">
              Institution, placement, and notification preferences for campus
              placements.
            </p>
          </div>
          {isDirty && !loading ? (
            <p
              role="status"
              className="rounded-[10px] border border-border bg-card px-3 py-2 text-xs font-medium text-secondary-text"
            >
              Unsaved changes
            </p>
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

        {successMessage ? (
          <div
            role="status"
            className="flex items-start gap-2 rounded-[12px] border border-success/30 bg-success-bg px-4 py-3 text-sm text-success"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{successMessage}</span>
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
              Loading settings…
            </div>
            <div className="mt-6 space-y-4">
              <div className="h-28 animate-pulse rounded-[10px] bg-background" />
              <div className="h-28 animate-pulse rounded-[10px] bg-background" />
              <div className="h-28 animate-pulse rounded-[10px] bg-background" />
            </div>
          </div>
        ) : null}

        {!loading && !error && !settings ? (
          <div className="rounded-[12px] border border-border bg-card p-8 text-center shadow-sm">
            <Settings2 className="mx-auto h-10 w-10 text-secondary-text" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Settings unavailable
            </h3>
            <p className="mt-2 text-sm text-secondary-text">
              Admin settings could not be loaded. Try again later.
            </p>
          </div>
        ) : null}

        {!loading && settings ? (
          <form
            id={formId}
            onSubmit={handleSave}
            noValidate
            className="flex flex-col gap-6"
          >
            <Section
              icon={Building2}
              title="Institution information"
              description="College identity and public contact details used across placement pages."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="College name"
                  error={fieldErrors.collegeName}
                  required
                  htmlFor={`${formId}-college`}
                  className="sm:col-span-2"
                >
                  <input
                    id={`${formId}-college`}
                    value={values.collegeName}
                    onChange={(event) =>
                      updateField("collegeName", event.target.value)
                    }
                    disabled={saving}
                    aria-invalid={Boolean(fieldErrors.collegeName)}
                    className={inputClass(fieldErrors.collegeName)}
                    placeholder="Riverside Institute of Technology"
                  />
                </Field>

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
                      value={values.website}
                      onChange={(event) =>
                        updateField("website", event.target.value)
                      }
                      disabled={saving}
                      aria-invalid={Boolean(fieldErrors.website)}
                      className={`${inputClass(fieldErrors.website)} pl-9`}
                      placeholder="https://college.example.edu"
                    />
                  </div>
                </Field>

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
                      value={values.contactEmail}
                      onChange={(event) =>
                        updateField("contactEmail", event.target.value)
                      }
                      disabled={saving}
                      aria-invalid={Boolean(fieldErrors.contactEmail)}
                      className={`${inputClass(fieldErrors.contactEmail)} pl-9`}
                      placeholder="placements@college.example.edu"
                    />
                  </div>
                </Field>
              </div>
            </Section>

            <Section
              icon={CalendarDays}
              title="Placement configuration"
              description="Academic year and campus placement behaviour for the current cycle."
            >
              <div className="grid gap-5">
                <Field
                  label="Academic year"
                  error={fieldErrors.academicYear}
                  required
                  htmlFor={`${formId}-year`}
                >
                  <select
                    id={`${formId}-year`}
                    value={values.academicYear}
                    onChange={(event) =>
                      updateField("academicYear", event.target.value)
                    }
                    disabled={saving}
                    aria-invalid={Boolean(fieldErrors.academicYear)}
                    className={inputClass(fieldErrors.academicYear)}
                  >
                    <option value="">Select academic year</option>
                    {ACADEMIC_YEAR_OPTIONS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="grid gap-3">
                  <ToggleRow
                    id={`${formId}-applications-open`}
                    label="Student applications open"
                    description="When off, students cannot start new job applications in the UI demo."
                    checked={values.applicationsOpen}
                    disabled={saving}
                    onChange={(checked) =>
                      updateField("applicationsOpen", checked)
                    }
                  />
                  <ToggleRow
                    id={`${formId}-require-resume`}
                    label="Require resume for applications"
                    description="Prompt students to attach a resume before submitting (demo preference)."
                    checked={values.requireResume}
                    disabled={saving}
                    onChange={(checked) =>
                      updateField("requireResume", checked)
                    }
                  />
                  <ToggleRow
                    id={`${formId}-multiple-offers`}
                    label="Allow multiple offer acceptances"
                    description="Demo setting for whether students may accept more than one offer."
                    checked={values.allowMultipleOffers}
                    disabled={saving}
                    onChange={(checked) =>
                      updateField("allowMultipleOffers", checked)
                    }
                  />
                </div>
              </div>
            </Section>

            <Section
              icon={Bell}
              title="Notification preferences"
              description="Email and in-app alerts. Labels below are mock UI only — delivery is not connected."
            >
              <div className="grid gap-3">
                <ToggleRow
                  id={`${formId}-email-alerts`}
                  label="Email alerts"
                  description="Mock preference for email notifications."
                  checked={values.emailAlerts}
                  disabled={saving}
                  onChange={(checked) => updateField("emailAlerts", checked)}
                />
                <ToggleRow
                  id={`${formId}-inapp-alerts`}
                  label="In-app alerts"
                  description="Mock preference for in-app notification badges."
                  checked={values.inAppAlerts}
                  disabled={saving}
                  onChange={(checked) => updateField("inAppAlerts", checked)}
                />
                <ToggleRow
                  id={`${formId}-drive-announce`}
                  label="Drive announcement emails"
                  description="Mock preference for new placement drive emails."
                  checked={values.driveAnnouncements}
                  disabled={saving || !values.emailAlerts}
                  onChange={(checked) =>
                    updateField("driveAnnouncements", checked)
                  }
                />
                <ToggleRow
                  id={`${formId}-app-updates`}
                  label="Application status emails"
                  description="Mock preference for application status update emails."
                  checked={values.applicationUpdates}
                  disabled={saving || !values.emailAlerts}
                  onChange={(checked) =>
                    updateField("applicationUpdates", checked)
                  }
                />
              </div>
            </Section>

            <Section
              icon={UserRound}
              title="Account preferences"
              description={
                profileSource === "session"
                  ? "Signed-in admin profile from the current session."
                  : "Demo admin profile for UI preview — authentication is not connected, so this is not a live logged-in user."
              }
            >
              {admin ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-primary text-sm font-semibold text-white"
                      aria-hidden="true"
                    >
                      {admin.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {admin.displayName}
                      </p>
                      <p className="truncate text-sm text-secondary-text">
                        {admin.email || "Email not available"}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-secondary-text">
                        {admin.role}
                      </p>
                    </div>
                  </div>
                  {profileSource === "demo" || admin.isDemoProfile ? (
                    <span className="inline-flex w-fit items-center rounded-[8px] border border-border bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary-text">
                      Demo profile
                    </span>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-secondary-text">
                  Admin profile is not available.
                </p>
              )}
            </Section>

            <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-2 rounded-[12px] border border-border bg-card/95 p-3 shadow-sm backdrop-blur sm:p-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving || !isDirty}
                className="inline-flex items-center gap-1.5 rounded-[10px] border border-border px-4 py-2.5 text-sm font-semibold text-foreground outline-none transition hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !isDirty}
                className="inline-flex items-center justify-center rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-70"
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
          </form>
        ) : null}
      </div>
    </AdminShell>
  );
}

function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-[12px] border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            <p className="mt-1 text-sm text-secondary-text">{description}</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
    </section>
  );
}

function Field({ label, error, required, htmlFor, hint, className = "", children }) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-foreground"
      >
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

function ToggleRow({
  id,
  label,
  description,
  checked,
  disabled,
  onChange,
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[10px] border border-border bg-background/60 px-4 py-3">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
        <p className="mt-0.5 text-xs text-secondary-text">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? "bg-primary" : "bg-border"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
