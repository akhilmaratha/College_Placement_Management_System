export class StudentJobsServiceError extends Error {
  constructor(message, { code = "JOBS_ERROR" } = {}) {
    super(message);
    this.name = "StudentJobsServiceError";
    this.code = code;
  }
}

export async function fetchStudentJobs() {
  throw new StudentJobsServiceError(
    "Job listings are unavailable because the backend student jobs endpoint has not been implemented yet.",
    { code: "API_NOT_IMPLEMENTED" },
  );
}

export async function fetchStudentJob() {
  throw new StudentJobsServiceError(
    "Job details are unavailable because the backend student jobs endpoint has not been implemented yet.",
    { code: "API_NOT_IMPLEMENTED" },
  );
}

export async function applyToStudentJob() {
  throw new StudentJobsServiceError(
    "Applications cannot be submitted until the backend application endpoint is implemented.",
    { code: "API_NOT_IMPLEMENTED" },
  );
}
