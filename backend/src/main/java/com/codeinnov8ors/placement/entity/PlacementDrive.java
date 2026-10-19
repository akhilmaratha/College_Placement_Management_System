package com.codeinnov8ors.placement.entity;

import java.time.Instant;
import java.time.LocalDate;

import com.codeinnov8ors.placement.entity.enums.DriveMode;
import com.codeinnov8ors.placement.entity.enums.DriveStatus;
import com.codeinnov8ors.placement.entity.support.AuditableEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "placement_drives")
public class PlacementDrive extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "title", nullable = false, length = 200)
	private String title;

	@Column(name = "academic_year", nullable = false, length = 20)
	private String academicYear;

	@Column(name = "start_date", nullable = false)
	private LocalDate startDate;

	@Column(name = "end_date", nullable = false)
	private LocalDate endDate;

	@Column(name = "registration_deadline", nullable = false)
	private Instant registrationDeadline;

	@Convert(converter = DriveMode.ConverterImpl.class)
	@Column(name = "drive_mode", nullable = false, length = 30)
	private DriveMode driveMode = DriveMode.ON_CAMPUS;

	@Convert(converter = DriveStatus.ConverterImpl.class)
	@Column(name = "status", nullable = false, length = 30)
	private DriveStatus status = DriveStatus.UPCOMING;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "created_by_user_id", nullable = false)
	private User createdBy;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAcademicYear() {
		return academicYear;
	}

	public void setAcademicYear(String academicYear) {
		this.academicYear = academicYear;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public Instant getRegistrationDeadline() {
		return registrationDeadline;
	}

	public void setRegistrationDeadline(Instant registrationDeadline) {
		this.registrationDeadline = registrationDeadline;
	}

	public DriveMode getDriveMode() {
		return driveMode;
	}

	public void setDriveMode(DriveMode driveMode) {
		this.driveMode = driveMode;
	}

	public DriveStatus getStatus() {
		return status;
	}

	public void setStatus(DriveStatus status) {
		this.status = status;
	}

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}
}
