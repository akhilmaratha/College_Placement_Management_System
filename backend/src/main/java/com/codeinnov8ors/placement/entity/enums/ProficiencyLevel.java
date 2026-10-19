package com.codeinnov8ors.placement.entity.enums;

import jakarta.persistence.Converter;

/**
 * CHECK (proficiency_level IN ('Beginner', 'Intermediate', 'Advanced'))
 */
public enum ProficiencyLevel implements DbEnum {
	BEGINNER("Beginner"),
	INTERMEDIATE("Intermediate"),
	ADVANCED("Advanced");

	private final String dbValue;

	ProficiencyLevel(String dbValue) {
		this.dbValue = dbValue;
	}

	@Override
	public String getDbValue() {
		return dbValue;
	}

	@Converter(autoApply = false)
	public static class ConverterImpl extends DbEnumConverter<ProficiencyLevel> {
		public ConverterImpl() {
			super(ProficiencyLevel.class);
		}
	}
}
