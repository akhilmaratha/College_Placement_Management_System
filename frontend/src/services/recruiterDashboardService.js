import { getApiBaseUrl } from "@/lib/api";
export class RecruiterDashboardServiceError extends Error { constructor(message) { super(message); this.name="RecruiterDashboardServiceError"; } }
export async function fetchRecruiterDashboard() {
  let response;
  try { response=await fetch(`${getApiBaseUrl()}/api/dashboard/recruiter`,{credentials:"include",cache:"no-store"}); }
  catch { throw new RecruiterDashboardServiceError("Could not reach recruiter dashboard data."); }
  const body=await response.json().catch(()=>({}));
  if(!response.ok) throw new RecruiterDashboardServiceError(body.error??`Dashboard request failed (${response.status}).`);
  return { recruiter:{displayName:"Recruiter",company:body.companyName}, summary:{totalJobs:body.summary.totalJobs,publishedJobs:body.summary.activeJobs,totalApplicants:body.summary.totalApplications,interviewsScheduled:body.summary.upcomingInterviews}, recentJobs:(body.recentJobs??[]).map(j=>({id:j.id,title:j.title,status:j.status,deadline:j.deadline,applicantCount:j.applicantCount})), recentApplicants:(body.recentApplications??[]).map(a=>({id:a.id,candidateName:a.studentName,jobTitle:a.jobTitle,status:a.status})), upcomingInterviews:body.upcomingInterviews??[] };
}
