package com.codeinnov8ors.placement.entity.enums;

import jakarta.persistence.Converter;

/**
 * CHECK (result IN ('Pending', 'Cleared', 'Not Cleared', 'On Hold'))
 */
public enum InterviewResult implements DbEnum {
	PENDING("Pending"),
	CLEARED("Cleared"),
	NOT_CLEARED("Not Cleared"),
	ON_HOLD("On Hold");

	private final String dbValue;

	InterviewResult(String dbValue) {
		this.dbValue = dbValue;
	}

	@Override
	public String getDbValue() {
		return dbValue;
	}

	@Converter(autoApply = false)
	public static class ConverterImpl extends DbEnumConverter<InterviewResult> {
		public ConverterImpl() {
			super(InterviewResult.class);
		}
	}
}
