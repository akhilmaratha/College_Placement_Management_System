package com.codeinnov8ors.placement.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "resumes")
public class Resume {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "student_profile_id", nullable = false)
	private StudentProfile studentProfile;

	@Column(name = "title", nullable = false, length = 150)
	private String title;

	@Column(name = "file_storage_path", nullable = false, length = 500)
	private String fileStoragePath;

	@Column(name = "original_file_name", nullable = false, length = 255)
	private String originalFileName;

	@Column(name = "file_size_bytes", nullable = false)
	private Long fileSizeBytes;

	@Column(name = "mime_type", nullable = false, length = 100)
	private String mimeType = "application/pdf";

	@Column(name = "is_default", nullable = false)
	private boolean defaultResume;

	@Column(name = "uploaded_at", nullable = false)
	private Instant uploadedAt;

	@PrePersist
	void onPersist() {
		if (uploadedAt == null) {
			uploadedAt = Instant.now();
		}
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

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getFileStoragePath() {
		return fileStoragePath;
	}

	public void setFileStoragePath(String fileStoragePath) {
		this.fileStoragePath = fileStoragePath;
	}

	public String getOriginalFileName() {
		return originalFileName;
	}

	public void setOriginalFileName(String originalFileName) {
		this.originalFileName = originalFileName;
	}

	public Long getFileSizeBytes() {
		return fileSizeBytes;
	}

	public void setFileSizeBytes(Long fileSizeBytes) {
		this.fileSizeBytes = fileSizeBytes;
	}

	public String getMimeType() {
		return mimeType;
	}

	public void setMimeType(String mimeType) {
		this.mimeType = mimeType;
	}

	public boolean isDefaultResume() {
		return defaultResume;
	}

	public void setDefaultResume(boolean defaultResume) {
		this.defaultResume = defaultResume;
	}

	public Instant getUploadedAt() {
		return uploadedAt;
	}

	public void setUploadedAt(Instant uploadedAt) {
		this.uploadedAt = uploadedAt;
	}
}
