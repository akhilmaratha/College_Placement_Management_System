import { getApiBaseUrl } from "@/lib/api";
export async function fetchPlacementDashboard() {
  let response; try { response=await fetch(`${getApiBaseUrl()}/api/dashboard/placement-officer`,{credentials:"include",cache:"no-store"}); }
  catch { throw new Error("Could not reach placement dashboard data."); }
  const body=await response.json().catch(()=>({})); if(!response.ok) throw new Error(body.error??`Dashboard request failed (${response.status}).`); return body;
}
