/**
 * Recruiter applicants data access (UI mock only).
 *
 * TODO: Wire to recruiter applicant APIs when contracts exist.
 * Mutations intentionally stay client-side — never pretend a backend save succeeded.
 */

import { RECRUITER_APPLICANTS_MOCK } from "@/features/recruiter-applicants/data/recruiterApplicantsMockData";

export class RecruiterApplicantsServiceError extends Error {
  constructor(message, { code = "RECRUITER_APPLICANTS_ERROR" } = {}) {
    super(message);
    this.name = "RecruiterApplicantsServiceError";
    this.code = code;
  }
}

/**
 * Loads recruiter applicants for the applicants page.
 * @returns {Promise<typeof RECRUITER_APPLICANTS_MOCK>}
 */
export async function fetchRecruiterApplicants() {
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Backend recruiter applicant APIs are not connected yet.
  return structuredClone(RECRUITER_APPLICANTS_MOCK);
}
