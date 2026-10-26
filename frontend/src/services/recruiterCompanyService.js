/**
 * Recruiter company profile data access (UI mock only).
 *
 * TODO: Wire to recruiter company profile APIs when contracts exist.
 * Mutations intentionally stay client-side — never pretend a backend save succeeded.
 */

export class RecruiterCompanyServiceError extends Error {
  constructor(message, { code = "RECRUITER_COMPANY_ERROR" } = {}) {
    super(message);
    this.name = "RecruiterCompanyServiceError";
    this.code = code;
  }
}

/**
 * Loads the recruiter company profile for the company page.
 * @returns {Promise<typeof RECRUITER_COMPANY_MOCK>}
 */
export async function fetchRecruiterCompany() {
  throw new RecruiterCompanyServiceError(
    "Company profile data is unavailable because the backend recruiter company endpoint has not been implemented yet.",
    { code: "API_NOT_IMPLEMENTED" },
  );
}

export async function updateRecruiterCompany() {
  throw new RecruiterCompanyServiceError(
    "Company profile changes cannot be saved until the backend recruiter company endpoint is implemented.",
    { code: "API_NOT_IMPLEMENTED" },
  );
}
