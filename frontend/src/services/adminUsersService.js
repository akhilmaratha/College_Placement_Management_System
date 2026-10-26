export class AdminUsersServiceError extends Error {
  constructor(message, { code = "ADMIN_USERS_ERROR" } = {}) {
    super(message);
    this.name = "AdminUsersServiceError";
    this.code = code;
  }
}

export async function fetchAdminUsers() {
  throw new AdminUsersServiceError(
    "User management is unavailable because the backend does not expose admin user endpoints yet.",
    { code: "BACKEND_ENDPOINT_MISSING" },
  );
}
