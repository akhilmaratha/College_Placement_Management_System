package com.codeinnov8ors.placement.entity.enums;

import jakarta.persistence.Converter;

/**
 * CHECK (interview_mode IN ('In-Person', 'Video Call', 'Phone'))
 */
public enum InterviewMode implements DbEnum {
	IN_PERSON("In-Person"),
	VIDEO_CALL("Video Call"),
	PHONE("Phone");

	private final String dbValue;

	InterviewMode(String dbValue) {
		this.dbValue = dbValue;
	}

	@Override
	public String getDbValue() {
		return dbValue;
	}

	@Converter(autoApply = false)
	public static class ConverterImpl extends DbEnumConverter<InterviewMode> {
		public ConverterImpl() {
			super(InterviewMode.class);
		}
	}
}
