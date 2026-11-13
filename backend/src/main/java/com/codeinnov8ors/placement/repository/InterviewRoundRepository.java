package com.codeinnov8ors.placement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import com.codeinnov8ors.placement.entity.InterviewRound;

public interface InterviewRoundRepository extends JpaRepository<InterviewRound, Long> {

	List<InterviewRound> findByApplicationIdOrderByRoundNumberAsc(Long applicationId);

	Optional<InterviewRound> findByApplicationIdAndRoundNumber(Long applicationId, int roundNumber);
	List<InterviewRound> findAllByOrderByScheduledAtAsc();
	long countByScheduledAtAfterAndStatusIn(java.time.Instant after, List<com.codeinnov8ors.placement.entity.enums.InterviewRoundStatus> statuses);
	long countByApplicationJobOpeningCompanyIdAndScheduledAtAfterAndStatusIn(Long companyId, java.time.Instant after, List<com.codeinnov8ors.placement.entity.enums.InterviewRoundStatus> statuses);
	long countByApplicationStudentProfileIdAndScheduledAtAfterAndStatusIn(Long studentId, java.time.Instant after, List<com.codeinnov8ors.placement.entity.enums.InterviewRoundStatus> statuses);
	@EntityGraph(attributePaths={"application","application.studentProfile","application.jobOpening","application.jobOpening.company"})
	List<InterviewRound> findTop5ByApplicationStudentProfileIdAndScheduledAtAfterAndStatusInOrderByScheduledAtAsc(Long studentId, java.time.Instant after, List<com.codeinnov8ors.placement.entity.enums.InterviewRoundStatus> statuses);
	@EntityGraph(attributePaths={"application","application.studentProfile","application.jobOpening","application.jobOpening.company"})
	List<InterviewRound> findTop5ByApplicationJobOpeningCompanyIdAndScheduledAtAfterAndStatusInOrderByScheduledAtAsc(Long companyId, java.time.Instant after, List<com.codeinnov8ors.placement.entity.enums.InterviewRoundStatus> statuses);
	@EntityGraph(attributePaths={"application","application.studentProfile","application.jobOpening","application.jobOpening.company"})
	List<InterviewRound> findTop5ByScheduledAtAfterAndStatusInOrderByScheduledAtAsc(java.time.Instant after, List<com.codeinnov8ors.placement.entity.enums.InterviewRoundStatus> statuses);
}
