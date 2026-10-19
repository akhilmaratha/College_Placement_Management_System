package com.codeinnov8ors.placement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeinnov8ors.placement.entity.PlacementDrive;
import com.codeinnov8ors.placement.entity.enums.DriveStatus;

public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, Long> {

	List<PlacementDrive> findByStatus(DriveStatus status);
}
