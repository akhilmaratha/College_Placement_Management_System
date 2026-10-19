package com.codeinnov8ors.placement.entity;

import java.time.Instant;

import com.codeinnov8ors.placement.entity.enums.InterviewMode;
import com.codeinnov8ors.placement.entity.enums.InterviewResult;
import com.codeinnov8ors.placement.entity.enums.InterviewRoundStatus;
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
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "interview_rounds", uniqueConstraints = @UniqueConstraint(name = "uq_interview_rounds_seq", columnNames = {
		"application_id", "round_number" }))
public class InterviewRound extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "application_id", nullable = false)
	private Application application;

	@Column(name = "round_number", nullable = false)
	private int roundNumber;

	@Column(name = "round_name", nullable = false, length = 100)
	private String roundName;

	@Column(name = "scheduled_at", nullable = false)
	private Instant scheduledAt;

	@Column(name = "duration_minutes", nullable = false)
	private int durationMinutes = 45;

	@Convert(converter = InterviewMode.ConverterImpl.class)
	@Column(name = "interview_mode", nullable = false, length = 30)
	private InterviewMode interviewMode = InterviewMode.IN_PERSON;

	@Column(name = "venue_or_link", length = 500)
	private String venueOrLink;

	@Column(name = "interviewer_name", length = 150)
	private String interviewerName;

	@Convert(converter = InterviewRoundStatus.ConverterImpl.class)
	@Column(name = "status", nullable = false, length = 30)
	private InterviewRoundStatus status = InterviewRoundStatus.SCHEDULED;

	@Convert(converter = InterviewResult.ConverterImpl.class)
	@Column(name = "result", nullable = false, length = 30)
	private InterviewResult result = InterviewResult.PENDING;

	@Column(name = "feedback", columnDefinition = "TEXT")
	private String feedback;

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

	public int getRoundNumber() {
		return roundNumber;
	}

	public void setRoundNumber(int roundNumber) {
		this.roundNumber = roundNumber;
	}

	public String getRoundName() {
		return roundName;
	}

	public void setRoundName(String roundName) {
		this.roundName = roundName;
	}

	public Instant getScheduledAt() {
		return scheduledAt;
	}

	public void setScheduledAt(Instant scheduledAt) {
		this.scheduledAt = scheduledAt;
	}

	public int getDurationMinutes() {
		return durationMinutes;
	}

	public void setDurationMinutes(int durationMinutes) {
		this.durationMinutes = durationMinutes;
	}

	public InterviewMode getInterviewMode() {
		return interviewMode;
	}

	public void setInterviewMode(InterviewMode interviewMode) {
		this.interviewMode = interviewMode;
	}

	public String getVenueOrLink() {
		return venueOrLink;
	}

	public void setVenueOrLink(String venueOrLink) {
		this.venueOrLink = venueOrLink;
	}

	public String getInterviewerName() {
		return interviewerName;
	}

	public void setInterviewerName(String interviewerName) {
		this.interviewerName = interviewerName;
	}

	public InterviewRoundStatus getStatus() {
		return status;
	}

	public void setStatus(InterviewRoundStatus status) {
		this.status = status;
	}

	public InterviewResult getResult() {
		return result;
	}

	public void setResult(InterviewResult result) {
		this.result = result;
	}

	public String getFeedback() {
		return feedback;
	}

	public void setFeedback(String feedback) {
		this.feedback = feedback;
	}
}
