package com.codeinnov8ors.placement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeinnov8ors.placement.entity.JobOpening;
import com.codeinnov8ors.placement.entity.enums.JobOpeningStatus;

public interface JobOpeningRepository extends JpaRepository<JobOpening, Long> {

	List<JobOpening> findByCompanyId(Long companyId);

	List<JobOpening> findByPlacementDriveId(Long placementDriveId);

	List<JobOpening> findByStatus(JobOpeningStatus status);
}
