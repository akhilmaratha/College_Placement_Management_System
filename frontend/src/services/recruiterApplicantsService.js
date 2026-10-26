/**
 * Recruiter applicants data access (UI mock only).
 *
 * TODO: Wire to recruiter applicant APIs when contracts exist.
 * Mutations intentionally stay client-side — never pretend a backend save succeeded.
 */

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
  throw new RecruiterApplicantsServiceError(
    "Applicants are unavailable because the backend recruiter applicants endpoint has not been implemented yet.",
    { code: "API_NOT_IMPLEMENTED" },
  );
}

export async function updateRecruiterApplicantStatus() {
  throw new RecruiterApplicantsServiceError(
    "Applicant status cannot be changed until the backend recruiter applicants endpoint is implemented.",
    { code: "API_NOT_IMPLEMENTED" },
  );
}
