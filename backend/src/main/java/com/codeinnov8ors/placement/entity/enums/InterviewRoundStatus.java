package com.codeinnov8ors.placement.entity.enums;

import jakarta.persistence.Converter;

/**
 * CHECK (status IN ('Scheduled', 'Completed', 'Rescheduled', 'Cancelled', 'No Show'))
 */
public enum InterviewRoundStatus implements DbEnum {
	SCHEDULED("Scheduled"),
	COMPLETED("Completed"),
	RESCHEDULED("Rescheduled"),
	CANCELLED("Cancelled"),
	NO_SHOW("No Show");

	private final String dbValue;

	InterviewRoundStatus(String dbValue) {
		this.dbValue = dbValue;
	}

	@Override
	public String getDbValue() {
		return dbValue;
	}

	@Converter(autoApply = false)
	public static class ConverterImpl extends DbEnumConverter<InterviewRoundStatus> {
		public ConverterImpl() {
			super(InterviewRoundStatus.class);
		}
	}
}
