package com.codeinnov8ors.placement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeinnov8ors.placement.entity.RecruiterProfile;

public interface RecruiterProfileRepository extends JpaRepository<RecruiterProfile, Long> {

	Optional<RecruiterProfile> findByUserId(Long userId);

	List<RecruiterProfile> findByCompanyId(Long companyId);
}
