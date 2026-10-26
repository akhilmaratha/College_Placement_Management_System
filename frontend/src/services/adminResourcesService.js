/**
 * Admin resource data access.
 *
 * The current Spring Boot project contains entities and repositories for these
 * resources, but no REST controllers or admin endpoints. Keep that distinction
 * explicit instead of falling back to recruiter-scoped APIs or demo records.
 */
export class AdminResourcesServiceError extends Error {
  constructor(message, { code = "ADMIN_RESOURCE_ERROR" } = {}) {
    super(message);
    this.name = "AdminResourcesServiceError";
    this.code = code;
  }
}

const RESOURCE_LABELS = {
  jobs: "job openings",
  drives: "placement drives",
  applications: "applications",
  interviews: "interviews",
};

export async function fetchAdminResource(resource) {
  const label = RESOURCE_LABELS[resource] ?? "admin data";
  throw new AdminResourcesServiceError(
    `Admin ${label} are unavailable because the backend does not expose admin REST endpoints yet.`,
    { code: "BACKEND_ENDPOINT_MISSING" },
  );
}
