package com.codeinnov8ors.placement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.EntityGraph;

import com.codeinnov8ors.placement.entity.RecruiterProfile;

public interface RecruiterProfileRepository extends JpaRepository<RecruiterProfile, Long>, JpaSpecificationExecutor<RecruiterProfile> {

	@EntityGraph(attributePaths={"user","company"})
	Optional<RecruiterProfile> findByUserId(Long userId);

	List<RecruiterProfile> findByCompanyId(Long companyId);
}
