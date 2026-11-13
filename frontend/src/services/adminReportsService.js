import { getApiBaseUrl } from "@/lib/api";
async function request(path){let response;try{response=await fetch(`${getApiBaseUrl()}${path}`,{credentials:"include",cache:"no-store"});}catch{throw new Error("Could not reach reporting data.");}const body=await response.json().catch(()=>({}));if(!response.ok)throw new Error(body.error??`Report request failed (${response.status}).`);return body;}
function query(params){const q=new URLSearchParams();for(const [key,value] of Object.entries(params))if(value!==""&&value!=null)q.set(key,String(value));return q.toString();}
export const fetchPlacementSummary=(filters={})=>request(`/api/reports/placement-summary?${query(filters)}`);
export const fetchApplicationReport=(filters={})=>request(`/api/reports/applications?${query(filters)}`);
export const fetchCompanyReport=(filters={})=>request(`/api/reports/companies?${query(filters)}`);
export const fetchJobReport=(filters={})=>request(`/api/reports/jobs?${query(filters)}`);
export const fetchDriveReport=(filters={})=>request(`/api/reports/drives?${query(filters)}`);
export const fetchInterviewReport=(filters={})=>request(`/api/reports/interviews?${query(filters)}`);
