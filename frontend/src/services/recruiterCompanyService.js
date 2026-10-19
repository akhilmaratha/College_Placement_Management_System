/**
 * Recruiter company profile data access (UI mock only).
 *
 * TODO: Wire to recruiter company profile APIs when contracts exist.
 * Mutations intentionally stay client-side — never pretend a backend save succeeded.
 */

import { RECRUITER_COMPANY_MOCK } from "@/features/recruiter-company/data/recruiterCompanyMockData";

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
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Backend recruiter company APIs are not connected yet.
  return structuredClone(RECRUITER_COMPANY_MOCK);
}
