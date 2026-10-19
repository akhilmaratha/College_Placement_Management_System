package com.codeinnov8ors.placement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeinnov8ors.placement.entity.AcademicRecord;

public interface AcademicRecordRepository extends JpaRepository<AcademicRecord, Long> {

	Optional<AcademicRecord> findByStudentProfileId(Long studentProfileId);
}
