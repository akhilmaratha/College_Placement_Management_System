package com.codeinnov8ors.placement.entity.enums;

/**
 * Enums whose persisted value may differ from the Java constant name
 * (spaces, hyphens) — matches VARCHAR CHECK constraints in database/schema.sql.
 */
public interface DbEnum {

	String getDbValue();

	static <E extends Enum<E> & DbEnum> E fromDbValue(Class<E> type, String dbValue) {
		if (dbValue == null) {
			return null;
		}
		for (E constant : type.getEnumConstants()) {
			if (constant.getDbValue().equals(dbValue)) {
				return constant;
			}
		}
		throw new IllegalArgumentException(
				"Unknown database value '" + dbValue + "' for " + type.getSimpleName());
	}
}
