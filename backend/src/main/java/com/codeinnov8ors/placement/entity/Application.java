package com.codeinnov8ors.placement.entity;

import java.time.Instant;

import com.codeinnov8ors.placement.entity.enums.ApplicationStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "applications", uniqueConstraints = @UniqueConstraint(name = "uq_applications_student_job", columnNames = {
		"student_profile_id", "job_opening_id" }))
public class Application {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "student_profile_id", nullable = false)
	private StudentProfile studentProfile;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "job_opening_id", nullable = false)
	private JobOpening jobOpening;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "resume_id", nullable = false)
	private Resume resume;

	@Convert(converter = ApplicationStatus.ConverterImpl.class)
	@Column(name = "current_status", nullable = false, length = 30)
	private ApplicationStatus currentStatus = ApplicationStatus.APPLIED;

	@Column(name = "student_remarks", columnDefinition = "TEXT")
	private String studentRemarks;

	@Column(name = "recruiter_notes", columnDefinition = "TEXT")
	private String recruiterNotes;

	@Column(name = "applied_at", nullable = false)
	private Instant appliedAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	@PrePersist
	void onPersist() {
		Instant now = Instant.now();
		if (appliedAt == null) {
			appliedAt = now;
		}
		updatedAt = now;
	}

	@PreUpdate
	void onUpdate() {
		updatedAt = Instant.now();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public StudentProfile getStudentProfile() {
		return studentProfile;
	}

	public void setStudentProfile(StudentProfile studentProfile) {
		this.studentProfile = studentProfile;
	}

	public JobOpening getJobOpening() {
		return jobOpening;
	}

	public void setJobOpening(JobOpening jobOpening) {
		this.jobOpening = jobOpening;
	}

	public Resume getResume() {
		return resume;
	}

	public void setResume(Resume resume) {
		this.resume = resume;
	}

	public ApplicationStatus getCurrentStatus() {
		return currentStatus;
	}

	public void setCurrentStatus(ApplicationStatus currentStatus) {
		this.currentStatus = currentStatus;
	}

	public String getStudentRemarks() {
		return studentRemarks;
	}

	public void setStudentRemarks(String studentRemarks) {
		this.studentRemarks = studentRemarks;
	}

	public String getRecruiterNotes() {
		return recruiterNotes;
	}

	public void setRecruiterNotes(String recruiterNotes) {
		this.recruiterNotes = recruiterNotes;
	}

	public Instant getAppliedAt() {
		return appliedAt;
	}

	public void setAppliedAt(Instant appliedAt) {
		this.appliedAt = appliedAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}
}
