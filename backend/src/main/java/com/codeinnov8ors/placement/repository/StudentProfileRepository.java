package com.codeinnov8ors.placement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeinnov8ors.placement.entity.StudentProfile;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

	Optional<StudentProfile> findByUserId(Long userId);

	Optional<StudentProfile> findByRollNumber(String rollNumber);

	boolean existsByRollNumber(String rollNumber);
}
