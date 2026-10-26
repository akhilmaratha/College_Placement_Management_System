export class StudentProfileServiceError extends Error {
  constructor(message, { code = "PROFILE_ERROR" } = {}) {
    super(message);
    this.name = "StudentProfileServiceError";
    this.code = code;
  }
}

export async function fetchStudentProfile() {
  throw new StudentProfileServiceError(
    "Profile data is unavailable because the backend student profile endpoint has not been implemented yet.",
    { code: "API_NOT_IMPLEMENTED" },
  );
}

export async function updateStudentProfile() {
  throw new StudentProfileServiceError(
    "Profile changes cannot be saved until the backend student profile endpoint is implemented.",
    { code: "API_NOT_IMPLEMENTED" },
  );
}
