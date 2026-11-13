package com.codeinnov8ors.placement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.codeinnov8ors.placement.entity.JobOpening;
import com.codeinnov8ors.placement.entity.enums.JobOpeningStatus;

public interface JobOpeningRepository extends JpaRepository<JobOpening, Long>, JpaSpecificationExecutor<JobOpening> {
	interface JobApplicantCount { Long getJobId(); Long getApplicantCount(); }

	List<JobOpening> findByCompanyId(Long companyId);

	List<JobOpening> findByPlacementDriveId(Long placementDriveId);

	List<JobOpening> findByStatus(JobOpeningStatus status);

	boolean existsByPlacementDriveIdAndCompanyId(Long placementDriveId, Long companyId);
	long countByStatusAndApplicationDeadlineAfter(JobOpeningStatus status, java.time.Instant after);
	long countByCompanyId(Long companyId);
	long countByStatus(JobOpeningStatus status);
	long countByCompanyIdAndStatus(Long companyId, JobOpeningStatus status);
	long countByCompanyIdAndStatusAndApplicationDeadlineAfter(Long companyId, JobOpeningStatus status, java.time.Instant after);
	@EntityGraph(attributePaths="company")
	List<JobOpening> findTop5ByCompanyIdOrderByUpdatedAtDesc(Long companyId);
	@EntityGraph(attributePaths="company")
	List<JobOpening> findTop5ByOrderByUpdatedAtDesc();
	@EntityGraph(attributePaths="company")
	List<JobOpening> findTop5ByStatusAndApplicationDeadlineAfterOrderByApplicationDeadlineAsc(JobOpeningStatus status, java.time.Instant after);
	@Query("select j.id as jobId,count(a.id) as applicantCount from JobOpening j left join Application a on a.jobOpening.id=j.id where j.id in :jobIds group by j.id")
	List<JobApplicantCount> countApplicantsByJobIds(@Param("jobIds") List<Long> jobIds);
}
