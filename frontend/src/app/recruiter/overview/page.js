import { redirect } from "next/navigation";

/** Legacy path — Overview lives at /recruiter/dashboard. */
export default function RecruiterOverviewRedirectPage() {
  redirect("/recruiter/dashboard");
}
