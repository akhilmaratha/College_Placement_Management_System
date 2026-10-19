package com.codeinnov8ors.placement.entity.enums;

import jakarta.persistence.Converter;

/**
 * CHECK (current_status IN ('Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'))
 */
public enum ApplicationStatus implements DbEnum {
	APPLIED("Applied"),
	SHORTLISTED("Shortlisted"),
	INTERVIEW_SCHEDULED("Interview Scheduled"),
	SELECTED("Selected"),
	REJECTED("Rejected");

	private final String dbValue;

	ApplicationStatus(String dbValue) {
		this.dbValue = dbValue;
	}

	@Override
	public String getDbValue() {
		return dbValue;
	}

	@Converter(autoApply = false)
	public static class ConverterImpl extends DbEnumConverter<ApplicationStatus> {
		public ConverterImpl() {
			super(ApplicationStatus.class);
		}
	}
}
