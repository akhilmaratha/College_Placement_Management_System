package com.codeinnov8ors.placement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeinnov8ors.placement.entity.InterviewRound;

public interface InterviewRoundRepository extends JpaRepository<InterviewRound, Long> {

	List<InterviewRound> findByApplicationIdOrderByRoundNumberAsc(Long applicationId);

	Optional<InterviewRound> findByApplicationIdAndRoundNumber(Long applicationId, int roundNumber);
}
