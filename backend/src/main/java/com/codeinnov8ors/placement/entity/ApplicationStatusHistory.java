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
import jakarta.persistence.Table;

@Entity
@Table(name = "application_status_history")
public class ApplicationStatusHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "application_id", nullable = false)
	private Application application;

	@Convert(converter = ApplicationStatus.ConverterImpl.class)
	@Column(name = "from_status", length = 30)
	private ApplicationStatus fromStatus;

	@Convert(converter = ApplicationStatus.ConverterImpl.class)
	@Column(name = "to_status", nullable = false, length = 30)
	private ApplicationStatus toStatus;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "changed_by_user_id", nullable = false)
	private User changedBy;

	@Column(name = "remarks", columnDefinition = "TEXT")
	private String remarks;

	@Column(name = "changed_at", nullable = false)
	private Instant changedAt;

	@PrePersist
	void onPersist() {
		if (changedAt == null) {
			changedAt = Instant.now();
		}
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Application getApplication() {
		return application;
	}

	public void setApplication(Application application) {
		this.application = application;
	}

	public ApplicationStatus getFromStatus() {
		return fromStatus;
	}

	public void setFromStatus(ApplicationStatus fromStatus) {
		this.fromStatus = fromStatus;
	}

	public ApplicationStatus getToStatus() {
		return toStatus;
	}

	public void setToStatus(ApplicationStatus toStatus) {
		this.toStatus = toStatus;
	}

	public User getChangedBy() {
		return changedBy;
	}

	public void setChangedBy(User changedBy) {
		this.changedBy = changedBy;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public Instant getChangedAt() {
		return changedAt;
	}

	public void setChangedAt(Instant changedAt) {
		this.changedAt = changedAt;
	}
}
