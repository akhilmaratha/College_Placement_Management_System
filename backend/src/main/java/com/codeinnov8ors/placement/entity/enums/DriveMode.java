package com.codeinnov8ors.placement.entity.enums;

import jakarta.persistence.Converter;

/**
 * CHECK (drive_mode IN ('On-Campus', 'Virtual', 'Pooled'))
 */
public enum DriveMode implements DbEnum {
	ON_CAMPUS("On-Campus"),
	VIRTUAL("Virtual"),
	POOLED("Pooled");

	private final String dbValue;

	DriveMode(String dbValue) {
		this.dbValue = dbValue;
	}

	@Override
	public String getDbValue() {
		return dbValue;
	}

	@Converter(autoApply = false)
	public static class ConverterImpl extends DbEnumConverter<DriveMode> {
		public ConverterImpl() {
			super(DriveMode.class);
		}
	}
}
