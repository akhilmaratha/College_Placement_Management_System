package com.codeinnov8ors.placement.entity.enums;

import jakarta.persistence.Converter;

/**
 * CHECK (job_type IN ('Full-time', 'Internship', 'Contract'))
 */
public enum JobType implements DbEnum {
	FULL_TIME("Full-time"),
	INTERNSHIP("Internship"),
	CONTRACT("Contract");

	private final String dbValue;

	JobType(String dbValue) {
		this.dbValue = dbValue;
	}

	@Override
	public String getDbValue() {
		return dbValue;
	}

	@Converter(autoApply = false)
	public static class ConverterImpl extends DbEnumConverter<JobType> {
		public ConverterImpl() {
			super(JobType.class);
		}
	}
}
