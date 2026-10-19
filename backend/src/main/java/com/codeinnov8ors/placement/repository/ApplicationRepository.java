package com.codeinnov8ors.placement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeinnov8ors.placement.entity.Application;
import com.codeinnov8ors.placement.entity.enums.ApplicationStatus;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

	Optional<Application> findByStudentProfileIdAndJobOpeningId(Long studentProfileId, Long jobOpeningId);

	List<Application> findByStudentProfileId(Long studentProfileId);

	List<Application> findByJobOpeningIdAndCurrentStatus(Long jobOpeningId, ApplicationStatus currentStatus);
}
