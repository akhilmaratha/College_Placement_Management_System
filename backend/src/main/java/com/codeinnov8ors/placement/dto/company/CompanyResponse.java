package com.codeinnov8ors.placement.dto.company;

import com.codeinnov8ors.placement.entity.Company;
import com.codeinnov8ors.placement.entity.enums.CompanyVerificationStatus;

public record CompanyResponse(Long id, String name, String websiteUrl, String industrySector, String location,
		String description, String contactEmail, String contactPhone, String logoUrl,
		CompanyVerificationStatus verificationStatus) {
	public static CompanyResponse from(Company c, boolean publicView) {
		return new CompanyResponse(c.getId(), c.getName(), c.getWebsiteUrl(), c.getIndustrySector(), c.getLocation(),
			c.getDescription(), publicView ? null : c.getContactEmail(), publicView ? null : c.getContactPhone(),
			c.getLogoUrl(), c.getVerificationStatus());
	}
}
