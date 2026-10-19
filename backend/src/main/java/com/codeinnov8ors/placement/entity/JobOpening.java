package com.codeinnov8ors.placement.entity;

import java.math.BigDecimal;
import java.time.Instant;

import com.codeinnov8ors.placement.entity.enums.JobOpeningStatus;
import com.codeinnov8ors.placement.entity.enums.JobType;
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
@Table(name = "job_openings")
public class JobOpening extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "company_id", nullable = false)
	private Company company;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "placement_drive_id")
	private PlacementDrive placementDrive;

	@Column(name = "title", nullable = false, length = 150)
	private String title;

	@Column(name = "description", nullable = false, columnDefinition = "TEXT")
	private String description;

	@Convert(converter = JobType.ConverterImpl.class)
	@Column(name = "job_type", nullable = false, length = 30)
	private JobType jobType = JobType.FULL_TIME;

	@Column(name = "location", nullable = false, length = 100)
	private String location;

	@Column(name = "salary_text", length = 100)
	private String salaryText;

	@Column(name = "min_salary", precision = 12, scale = 2)
	private BigDecimal minSalary;

	@Column(name = "max_salary", precision = 12, scale = 2)
	private BigDecimal maxSalary;

	@Column(name = "application_deadline", nullable = false)
	private Instant applicationDeadline;

	@Convert(converter = JobOpeningStatus.ConverterImpl.class)
	@Column(name = "status", nullable = false, length = 30)
	private JobOpeningStatus status = JobOpeningStatus.DRAFT;

	@Column(name = "min_cgpa", nullable = false, precision = 4, scale = 2)
	private BigDecimal minCgpa = BigDecimal.ZERO.setScale(2);

	@Column(name = "allowed_branches", nullable = false, length = 255)
	private String allowedBranches;

	@Column(name = "max_active_backlogs", nullable = false)
	private int maxActiveBacklogs;

	@Column(name = "batch_year")
	private Integer batchYear;

	@Column(name = "posted_at")
	private Instant postedAt;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Company getCompany() {
		return company;
	}

	public void setCompany(Company company) {
		this.company = company;
	}

	public PlacementDrive getPlacementDrive() {
		return placementDrive;
	}

	public void setPlacementDrive(PlacementDrive placementDrive) {
		this.placementDrive = placementDrive;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public JobType getJobType() {
		return jobType;
	}

	public void setJobType(JobType jobType) {
		this.jobType = jobType;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getSalaryText() {
		return salaryText;
	}

	public void setSalaryText(String salaryText) {
		this.salaryText = salaryText;
	}

	public BigDecimal getMinSalary() {
		return minSalary;
	}

	public void setMinSalary(BigDecimal minSalary) {
		this.minSalary = minSalary;
	}

	public BigDecimal getMaxSalary() {
		return maxSalary;
	}

	public void setMaxSalary(BigDecimal maxSalary) {
		this.maxSalary = maxSalary;
	}

	public Instant getApplicationDeadline() {
		return applicationDeadline;
	}

	public void setApplicationDeadline(Instant applicationDeadline) {
		this.applicationDeadline = applicationDeadline;
	}

	public JobOpeningStatus getStatus() {
		return status;
	}

	public void setStatus(JobOpeningStatus status) {
		this.status = status;
	}

	public BigDecimal getMinCgpa() {
		return minCgpa;
	}

	public void setMinCgpa(BigDecimal minCgpa) {
		this.minCgpa = minCgpa;
	}

	public String getAllowedBranches() {
		return allowedBranches;
	}

	public void setAllowedBranches(String allowedBranches) {
		this.allowedBranches = allowedBranches;
	}

	public int getMaxActiveBacklogs() {
		return maxActiveBacklogs;
	}

	public void setMaxActiveBacklogs(int maxActiveBacklogs) {
		this.maxActiveBacklogs = maxActiveBacklogs;
	}

	public Integer getBatchYear() {
		return batchYear;
	}

	public void setBatchYear(Integer batchYear) {
		this.batchYear = batchYear;
	}

	public Instant getPostedAt() {
		return postedAt;
	}

	public void setPostedAt(Instant postedAt) {
		this.postedAt = postedAt;
	}
}
