package com.codeinnov8ors.placement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeinnov8ors.placement.entity.PlacementOutcome;
import com.codeinnov8ors.placement.entity.enums.StudentResponse;

public interface PlacementOutcomeRepository extends JpaRepository<PlacementOutcome, Long> {

	Optional<PlacementOutcome> findByApplicationId(Long applicationId);

	List<PlacementOutcome> findByStudentProfileIdAndStudentResponse(Long studentProfileId, StudentResponse studentResponse);
}
