/**
 * Shared API helpers for frontend services.
 * Base URL comes from NEXT_PUBLIC_API_URL (see .env.example).
 */

export function getApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    return "";
  }

  return baseUrl.replace(/\/$/, "");
}
