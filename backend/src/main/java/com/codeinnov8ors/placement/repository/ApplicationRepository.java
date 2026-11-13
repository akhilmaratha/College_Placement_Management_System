package com.codeinnov8ors.placement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import com.codeinnov8ors.placement.entity.Application;
import com.codeinnov8ors.placement.entity.enums.ApplicationStatus;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

	Optional<Application> findByStudentProfileIdAndJobOpeningId(Long studentProfileId, Long jobOpeningId);

	List<Application> findByStudentProfileId(Long studentProfileId);

	List<Application> findByJobOpeningIdAndCurrentStatus(Long jobOpeningId, ApplicationStatus currentStatus);
	List<Application> findByJobOpeningCompanyId(Long companyId);
	long countByStudentProfileId(Long studentProfileId);
	long countByStudentProfileIdAndCurrentStatus(Long studentProfileId, ApplicationStatus status);
	long countByJobOpeningCompanyId(Long companyId);
	long countByJobOpeningCompanyIdAndCurrentStatus(Long companyId, ApplicationStatus status);
	long countByCurrentStatus(ApplicationStatus status);
	long countByJobOpeningId(Long jobId);
	@EntityGraph(attributePaths={"studentProfile","jobOpening","jobOpening.company"})
	List<Application> findTop5ByStudentProfileIdOrderByAppliedAtDesc(Long studentProfileId);
	@EntityGraph(attributePaths={"studentProfile","jobOpening","jobOpening.company"})
	List<Application> findTop5ByJobOpeningCompanyIdOrderByAppliedAtDesc(Long companyId);
	@EntityGraph(attributePaths={"studentProfile","jobOpening","jobOpening.company"})
	List<Application> findTop5ByOrderByAppliedAtDesc();
}
