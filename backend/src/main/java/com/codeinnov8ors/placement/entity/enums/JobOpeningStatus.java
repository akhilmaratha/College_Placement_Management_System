package com.codeinnov8ors.placement.entity.enums;

import jakarta.persistence.Converter;

/**
 * CHECK (status IN ('Draft', 'Published', 'Closed'))
 */
public enum JobOpeningStatus implements DbEnum {
	DRAFT("Draft"),
	PUBLISHED("Published"),
	CLOSED("Closed");

	private final String dbValue;

	JobOpeningStatus(String dbValue) {
		this.dbValue = dbValue;
	}

	@Override
	public String getDbValue() {
		return dbValue;
	}

	@Converter(autoApply = false)
	public static class ConverterImpl extends DbEnumConverter<JobOpeningStatus> {
		public ConverterImpl() {
			super(JobOpeningStatus.class);
		}
	}
}
