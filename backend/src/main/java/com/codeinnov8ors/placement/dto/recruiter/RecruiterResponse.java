package com.codeinnov8ors.placement.dto.recruiter;

import com.codeinnov8ors.placement.entity.RecruiterProfile;
import com.codeinnov8ors.placement.entity.enums.UserStatus;

public record RecruiterResponse(Long id, String email, UserStatus accountStatus, String designation,
		String phoneNumber, boolean primaryContact, Long companyId, String companyName) {
	public static RecruiterResponse from(RecruiterProfile p) {
		return new RecruiterResponse(p.getId(), p.getUser().getEmail(), p.getUser().getStatus(), p.getDesignation(),
			p.getPhoneNumber(), p.isPrimaryContact(), p.getCompany().getId(), p.getCompany().getName());
	}
}
