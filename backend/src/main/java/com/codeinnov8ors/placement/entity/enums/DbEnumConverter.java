package com.codeinnov8ors.placement.entity.enums;

import jakarta.persistence.AttributeConverter;

abstract class DbEnumConverter<E extends Enum<E> & DbEnum> implements AttributeConverter<E, String> {

	private final Class<E> enumType;

	protected DbEnumConverter(Class<E> enumType) {
		this.enumType = enumType;
	}

	@Override
	public String convertToDatabaseColumn(E attribute) {
		return attribute == null ? null : attribute.getDbValue();
	}

	@Override
	public E convertToEntityAttribute(String dbData) {
		return DbEnum.fromDbValue(enumType, dbData);
	}
}
