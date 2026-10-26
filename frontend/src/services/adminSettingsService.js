/**
 * The Spring Boot backend does not currently expose admin settings endpoints.
 */

export class AdminSettingsServiceError extends Error {
  constructor(message, { code = "ADMIN_SETTINGS_ERROR" } = {}) {
    super(message);
    this.name = "AdminSettingsServiceError";
    this.code = code;
  }
}

/**
 * Loads admin settings for the Settings page.
 * @returns {Promise<typeof ADMIN_SETTINGS_MOCK>}
 */
export async function fetchAdminSettings() {
  throw new AdminSettingsServiceError(
    "Admin settings are unavailable because the backend does not expose admin settings or profile endpoints yet.",
    { code: "BACKEND_ENDPOINT_MISSING" },
  );
}
