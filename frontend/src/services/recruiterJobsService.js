/**
 * Recruiter jobs data access (UI mock only).
 *
 * TODO: Wire to recruiter job APIs when contracts exist.
 * Mutations intentionally stay client-side — never pretend a backend save succeeded.
 */

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
  throw new RecruiterJobsServiceError(
    "Recruiter jobs are unavailable because the backend recruiter jobs endpoint has not been implemented yet.",
    { code: "API_NOT_IMPLEMENTED" },
  );
}

export async function createRecruiterJob() {
  throw new RecruiterJobsServiceError(
    "Jobs cannot be created until the backend recruiter jobs endpoint is implemented.",
    { code: "API_NOT_IMPLEMENTED" },
  );
}

export async function updateRecruiterJob() {
  throw new RecruiterJobsServiceError(
    "Jobs cannot be updated until the backend recruiter jobs endpoint is implemented.",
    { code: "API_NOT_IMPLEMENTED" },
  );
}

export async function closeRecruiterJob() {
  throw new RecruiterJobsServiceError(
    "Jobs cannot be closed until the backend recruiter jobs endpoint is implemented.",
    { code: "API_NOT_IMPLEMENTED" },
  );
}
