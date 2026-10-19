/**
 * Placement officer drives data access (UI mock only).
 *
 * TODO: Wire to placement drive APIs when contracts exist.
 * Mutations intentionally stay client-side — never pretend a backend save succeeded.
 */

import { PLACEMENT_DRIVES_MOCK } from "@/features/placement-drives/data/placementDrivesMockData";

export class PlacementDrivesServiceError extends Error {
  constructor(message, { code = "PLACEMENT_DRIVES_ERROR" } = {}) {
    super(message);
    this.name = "PlacementDrivesServiceError";
    this.code = code;
  }
}

/**
 * Loads placement drives for the Placement Drives management page.
 * @returns {Promise<typeof PLACEMENT_DRIVES_MOCK>}
 */
export async function fetchPlacementDrives() {
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Backend placement drive APIs are not connected yet.
  return structuredClone(PLACEMENT_DRIVES_MOCK);
}
