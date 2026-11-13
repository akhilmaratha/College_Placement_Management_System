import { getApiBaseUrl } from "@/lib/api";

export class RecruiterCompanyServiceError extends Error {
  constructor(message, { status = null } = {}) { super(message); this.name = "RecruiterCompanyServiceError"; this.status = status; }
}

async function request(path, options = {}) {
  let response;
  try { response = await fetch(`${getApiBaseUrl()}${path}`, { credentials: "include", cache: "no-store", ...options }); }
  catch { throw new RecruiterCompanyServiceError("Could not reach the recruiter company service."); }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new RecruiterCompanyServiceError(body.error ?? `Company request failed (${response.status}).`, { status: response.status });
  return body;
}

function mapCompany(c) {
  return { ...c, website: c.websiteUrl ?? "", industry: c.industrySector ?? "", phone: c.contactPhone ?? "" };
}

export async function fetchRecruiterCompany() {
  const recruiter = await request("/api/recruiters/me");
  const company = mapCompany(await request(`/api/companies/${recruiter.companyId}`));
  return { recruiter: { ...recruiter, company: company.name }, company };
}

export async function updateRecruiterCompany(companyId, values) {
  const company = await request(`/api/companies/${companyId}`, {
    method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: values.name, logoUrl: values.logoUrl || null, websiteUrl: values.website || null,
      industrySector: values.industry, location: values.location, description: values.description || null,
      contactEmail: values.contactEmail, contactPhone: values.phone || null }),
  });
  return mapCompany(company);
}
