"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowLeft, CheckCircle2, GraduationCap } from "lucide-react";
import {
  AuthServiceError,
  requestPasswordReset,
} from "@/services/authService";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordForm() {
  const emailId = useId();
  const formErrorId = useId();
  const successId = useId();

  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function validate() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setFieldError("Email is required.");
      return false;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setFieldError("Enter a valid email address.");
      return false;
    }

    setFieldError("");
    return true;
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

    const trimmedEmail = email.trim();
    setIsSubmitting(true);

    try {
      await requestPasswordReset({ email: trimmedEmail });
      setIsSuccess(true);
    } catch (error) {
      const message =
        error instanceof AuthServiceError
          ? error.message
          : "Unable to send reset instructions. Please try again later.";
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
          Forgot your password?
        </h1>
        <p className="mt-2 text-sm leading-6 text-secondary-text sm:text-base">
          Enter your registered email address and we&apos;ll send you
          instructions to reset your password.
        </p>
      </div>

      {isSuccess ? (
        <div
          id={successId}
          role="status"
          className="rounded-[12px] border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold text-foreground">
              Check your email
            </h2>
            <p className="mt-2 text-sm leading-6 text-secondary-text">
              If an account exists for{" "}
              <span className="font-medium text-foreground">{email.trim()}</span>,
              you will receive password reset instructions shortly.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary outline-none hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to sign in
            </Link>
          </div>
        </div>
      ) : (
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
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (fieldError) {
                    setFieldError("");
                  }
                }}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldError)}
                aria-describedby={
                  fieldError ? `${emailId}-error` : undefined
                }
                className="w-full rounded-[10px] border border-border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-secondary-text/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
                placeholder="you@college.edu"
              />
              {fieldError ? (
                <p
                  id={`${emailId}-error`}
                  className="mt-1.5 text-sm text-error"
                  role="alert"
                >
                  {fieldError}
                </p>
              ) : null}
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
                  Sending…
                </span>
              ) : (
                "Send reset instructions"
              )}
            </button>
          </div>
        </form>
      )}

      {!isSuccess ? (
        <p className="mt-6 text-center text-sm text-secondary-text">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 font-medium text-primary outline-none hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to sign in
          </Link>
        </p>
      ) : null}

      <p className="mt-8 text-center text-xs leading-5 text-secondary-text sm:text-sm">
        College Placement Management System
      </p>
    </div>
  );
}
