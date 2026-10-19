package com.codeinnov8ors.placement.entity.enums;

import jakarta.persistence.Converter;

/**
 * CHECK (status IN ('Upcoming', 'Open', 'In Progress', 'Closed'))
 */
public enum DriveStatus implements DbEnum {
	UPCOMING("Upcoming"),
	OPEN("Open"),
	IN_PROGRESS("In Progress"),
	CLOSED("Closed");

	private final String dbValue;

	DriveStatus(String dbValue) {
		this.dbValue = dbValue;
	}

	@Override
	public String getDbValue() {
		return dbValue;
	}

	@Converter(autoApply = false)
	public static class ConverterImpl extends DbEnumConverter<DriveStatus> {
		public ConverterImpl() {
			super(DriveStatus.class);
		}
	}
}
