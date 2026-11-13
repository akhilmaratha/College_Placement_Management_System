package com.codeinnov8ors.placement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.codeinnov8ors.placement.entity.StudentProfile;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long>, JpaSpecificationExecutor<StudentProfile> {

	Optional<StudentProfile> findByUserId(Long userId);

	Optional<StudentProfile> findByRollNumber(String rollNumber);

	boolean existsByRollNumber(String rollNumber);
	long countByProfileComplete(boolean profileComplete);
}
