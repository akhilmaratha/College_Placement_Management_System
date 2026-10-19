package com.codeinnov8ors.placement.entity.enums;

import jakarta.persistence.Converter;

/**
 * CHECK (gender IS NULL OR gender IN ('Male', 'Female', 'Other', 'Prefer not to say'))
 */
public enum Gender implements DbEnum {
	MALE("Male"),
	FEMALE("Female"),
	OTHER("Other"),
	PREFER_NOT_TO_SAY("Prefer not to say");

	private final String dbValue;

	Gender(String dbValue) {
		this.dbValue = dbValue;
	}

	@Override
	public String getDbValue() {
		return dbValue;
	}

	@Converter(autoApply = false)
	public static class ConverterImpl extends DbEnumConverter<Gender> {
		public ConverterImpl() {
			super(Gender.class);
		}
	}
}
