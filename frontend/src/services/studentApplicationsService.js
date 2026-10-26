export class StudentApplicationsServiceError extends Error {
  constructor(message, { code = "APPLICATIONS_ERROR" } = {}) {
    super(message);
    this.name = "StudentApplicationsServiceError";
    this.code = code;
  }
}

export async function fetchStudentApplications() {
  throw new StudentApplicationsServiceError(
    "Applications are unavailable because the backend student applications endpoint has not been implemented yet.",
    { code: "API_NOT_IMPLEMENTED" },
  );
}
