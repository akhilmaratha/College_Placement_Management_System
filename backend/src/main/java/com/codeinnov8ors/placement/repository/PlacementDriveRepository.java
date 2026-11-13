package com.codeinnov8ors.placement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.codeinnov8ors.placement.entity.PlacementDrive;
import com.codeinnov8ors.placement.entity.enums.DriveStatus;

public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, Long>, JpaSpecificationExecutor<PlacementDrive> {

	List<PlacementDrive> findByStatus(DriveStatus status);
	long countByStatusIn(List<DriveStatus> statuses);
	List<PlacementDrive> findTop5ByStatusInOrderByStartDateAsc(List<DriveStatus> statuses);
}
