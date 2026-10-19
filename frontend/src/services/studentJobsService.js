/**
 * Student jobs listing data access.
 *
 * TODO: Wire to a jobs listing API when the contract exists.
 * Until then, returns isolated mock UI data — not a confirmed contract.
 */

import { STUDENT_JOBS_MOCK } from "@/features/student-jobs/data/studentJobsMockData";

export class StudentJobsServiceError extends Error {
  constructor(message, { code = "JOBS_ERROR" } = {}) {
    super(message);
    this.name = "StudentJobsServiceError";
    this.code = code;
  }
}

/**
 * Loads jobs for the student browse page.
 * @returns {Promise<typeof STUDENT_JOBS_MOCK>}
 */
export async function fetchStudentJobs() {
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Backend jobs APIs are not connected yet.
  return structuredClone(STUDENT_JOBS_MOCK);
}
