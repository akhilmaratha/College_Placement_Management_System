/**
 * Placement officer interviews data access (UI mock only).
 *
 * TODO: Wire to interview APIs when contracts exist.
 * Mutations intentionally stay client-side — never pretend a backend save succeeded.
 */

import { PLACEMENT_INTERVIEWS_MOCK } from "@/features/placement-interviews/data/placementInterviewsMockData";

export class PlacementInterviewsServiceError extends Error {
  constructor(message, { code = "PLACEMENT_INTERVIEWS_ERROR" } = {}) {
    super(message);
    this.name = "PlacementInterviewsServiceError";
    this.code = code;
  }
}

/**
 * Loads interviews for the Placement Officer Interviews management page.
 * @returns {Promise<typeof PLACEMENT_INTERVIEWS_MOCK>}
 */
export async function fetchPlacementInterviews() {
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Backend interview APIs are not connected yet.
  return structuredClone(PLACEMENT_INTERVIEWS_MOCK);
}
