import { getApiBaseUrl } from "@/lib/api";
export async function fetchAdminDashboard() {
  let response; try { response=await fetch(`${getApiBaseUrl()}/api/dashboard/admin`,{credentials:"include",cache:"no-store"}); }
  catch { throw new Error("Could not reach admin dashboard data."); }
  const body=await response.json().catch(()=>({})); if(!response.ok) throw new Error(body.error??`Dashboard request failed (${response.status}).`); return body;
}
