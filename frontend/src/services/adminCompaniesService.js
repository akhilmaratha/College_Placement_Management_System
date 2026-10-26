export class AdminCompaniesServiceError extends Error {
  constructor(message, { code = "ADMIN_COMPANIES_ERROR" } = {}) {
    super(message);
    this.name = "AdminCompaniesServiceError";
    this.code = code;
  }
}

export async function fetchAdminCompanies() {
  throw new AdminCompaniesServiceError(
    "Company management is unavailable because the backend does not expose admin company endpoints yet.",
    { code: "BACKEND_ENDPOINT_MISSING" },
  );
}
