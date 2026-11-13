package com.codeinnov8ors.placement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.codeinnov8ors.placement.entity.ApplicationStatusHistory;

public interface ApplicationStatusHistoryRepository extends JpaRepository<ApplicationStatusHistory, Long> {}
