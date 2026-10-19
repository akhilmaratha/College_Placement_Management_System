package com.codeinnov8ors.placement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeinnov8ors.placement.entity.ApplicationStatusHistory;

public interface ApplicationStatusHistoryRepository extends JpaRepository<ApplicationStatusHistory, Long> {

	List<ApplicationStatusHistory> findByApplicationIdOrderByChangedAtDesc(Long applicationId);
}
