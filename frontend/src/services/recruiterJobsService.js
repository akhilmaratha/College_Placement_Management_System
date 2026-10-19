/**
 * Recruiter jobs data access (UI mock only).
 *
 * TODO: Wire to recruiter job APIs when contracts exist.
 * Mutations intentionally stay client-side — never pretend a backend save succeeded.
 */

import { RECRUITER_JOBS_MOCK } from "@/features/recruiter-jobs/data/recruiterJobsMockData";

export class RecruiterJobsServiceError extends Error {
  constructor(message, { code = "RECRUITER_JOBS_ERROR" } = {}) {
    super(message);
    this.name = "RecruiterJobsServiceError";
    this.code = code;
  }
}

/**
 * Loads recruiter-managed jobs for the manage jobs page.
 * @returns {Promise<typeof RECRUITER_JOBS_MOCK>}
 */
export async function fetchRecruiterJobs() {
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Backend recruiter job APIs are not connected yet.
  return structuredClone(RECRUITER_JOBS_MOCK);
}
