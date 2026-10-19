package com.codeinnov8ors.placement.entity.enums;

import jakarta.persistence.Converter;

/**
 * CHECK (student_response IN ('Pending', 'Accepted', 'Declined', 'Revoked'))
 */
public enum StudentResponse implements DbEnum {
	PENDING("Pending"),
	ACCEPTED("Accepted"),
	DECLINED("Declined"),
	REVOKED("Revoked");

	private final String dbValue;

	StudentResponse(String dbValue) {
		this.dbValue = dbValue;
	}

	@Override
	public String getDbValue() {
		return dbValue;
	}

	@Converter(autoApply = false)
	public static class ConverterImpl extends DbEnumConverter<StudentResponse> {
		public ConverterImpl() {
			super(StudentResponse.class);
		}
	}
}
