/**
 * Admin settings data access (UI mock only).
 *
 * TODO: Wire to admin settings APIs when contracts exist.
 * Mutations intentionally stay client-side — never pretend a backend save succeeded.
 */

import { ADMIN_SETTINGS_MOCK } from "@/features/admin-settings/data/adminSettingsMockData";

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
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Backend admin settings APIs are not connected yet.
  return structuredClone(ADMIN_SETTINGS_MOCK);
}
