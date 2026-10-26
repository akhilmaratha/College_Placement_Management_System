"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, useSyncExternalStore } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import {
  AuthServiceError,
  getDashboardPathForRole,
  login,
} from "@/services/authService";

const REMEMBERED_EMAIL_KEY = "campusplacements.rememberedEmail";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function subscribeRememberedEmail() {
  return () => {};
}

function getRememberedEmailSnapshot() {
  try {
    return localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? "";
  } catch {
    return "";
  }
}

function getRememberedEmailServerSnapshot() {
  return "";
}

export default function LoginForm() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();
  const formErrorId = useId();

  const rememberedEmail = useSyncExternalStore(
    subscribeRememberedEmail,
    getRememberedEmailSnapshot,
    getRememberedEmailServerSnapshot,
  );

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailValue = email ?? rememberedEmail;
  const rememberMeValue = rememberMe ?? Boolean(rememberedEmail);

  function validate() {
    const nextErrors = { email: "", password: "" };
    const trimmedEmail = emailValue.trim();

    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    }

    setFieldErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password;
  }

  function persistRememberedEmail(trimmedEmail) {
    try {
      if (rememberMeValue) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, trimmedEmail);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }
    } catch {
      // Storage may be unavailable; ignore.
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (isSubmitting) {
      return;
    }

    if (!validate()) {
      return;
    }

    const trimmedEmail = emailValue.trim();
    setIsSubmitting(true);

    try {
      persistRememberedEmail(trimmedEmail);
      const session = await login({
        email: trimmedEmail,
        password,
        rememberMe: rememberMeValue,
      });

      const role = session?.user?.role ?? session?.role;
      const dashboardPath = getDashboardPathForRole(role);

      if (dashboardPath === "/login") {
        throw new AuthServiceError(
          "Your account role could not be determined. Please contact placement support.",
          { code: "ROLE_NOT_FOUND" },
        );
      }

      router.replace(dashboardPath);
    } catch (error) {
      const message =
        error instanceof AuthServiceError
          ? error.message
          : "Unable to sign in. Please check your credentials and try again.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex flex-col items-center text-center sm:items-start sm:text-left">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-primary text-white">
            <GraduationCap className="h-6 w-6" />
          </span>
          <span className="text-xl font-semibold tracking-tight text-foreground">
            CampusPlacements
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm leading-6 text-secondary-text sm:text-base">
          Sign in to continue to your placement portal.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-[12px] border border-border bg-card p-6 shadow-sm sm:p-8"
        aria-describedby={formError ? formErrorId : undefined}
      >
        {formError ? (
          <div
            id={formErrorId}
            role="alert"
            className="mb-5 rounded-[10px] border border-error/30 bg-error-bg px-4 py-3 text-sm text-error"
          >
            {formError}
          </div>
        ) : null}

        <div className="space-y-5">
          <div>
            <label
              htmlFor={emailId}
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={emailValue}
              onChange={(event) => {
                setEmail(event.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: "" }));
                }
              }}
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={
                fieldErrors.email ? `${emailId}-error` : undefined
              }
              className="w-full rounded-[10px] border border-border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-secondary-text/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="you@college.edu"
            />
            {fieldErrors.email ? (
              <p
                id={`${emailId}-error`}
                className="mt-1.5 text-sm text-error"
                role="alert"
              >
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor={passwordId}
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <div className="relative">
              <input
                id={passwordId}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: "" }));
                  }
                }}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? `${passwordId}-error` : undefined
                }
                className="w-full rounded-[10px] border border-border bg-white py-2.5 pl-3.5 pr-11 text-sm text-foreground outline-none transition placeholder:text-secondary-text/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isSubmitting}
                className="absolute inset-y-0 right-0 flex items-center rounded-r-[10px] px-3 text-secondary-text outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {fieldErrors.password ? (
              <p
                id={`${passwordId}-error`}
                className="mt-1.5 text-sm text-error"
                role="alert"
              >
                {fieldErrors.password}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label
              htmlFor={rememberId}
              className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
            >
              <input
                id={rememberId}
                name="rememberMe"
                type="checkbox"
                checked={rememberMeValue}
                onChange={(event) => setRememberMe(event.target.checked)}
                disabled={isSubmitting}
                className="h-4 w-4 rounded border-border text-primary accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed"
              />
              Remember me
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary outline-none hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  aria-hidden="true"
                />
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-xs leading-5 text-secondary-text sm:text-sm">
        College Placement Management System
      </p>
    </div>
  );
}
