package com.codeinnov8ors.placement.entity;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import com.codeinnov8ors.placement.entity.enums.StudentResponse;
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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "placement_outcomes", uniqueConstraints = @UniqueConstraint(name = "uq_placement_outcomes_application", columnNames = "application_id"))
public class PlacementOutcome extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "application_id", nullable = false, unique = true)
	private Application application;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "student_profile_id", nullable = false)
	private StudentProfile studentProfile;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "company_id", nullable = false)
	private Company company;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "job_opening_id", nullable = false)
	private JobOpening jobOpening;

	@Column(name = "offered_ctc", nullable = false, precision = 12, scale = 2)
	private BigDecimal offeredCtc;

	@Column(name = "offer_letter_url", length = 500)
	private String offerLetterUrl;

	@Column(name = "offered_date", nullable = false)
	private LocalDate offeredDate;

	@Column(name = "acceptance_deadline")
	private LocalDate acceptanceDeadline;

	@Convert(converter = StudentResponse.ConverterImpl.class)
	@Column(name = "student_response", nullable = false, length = 30)
	private StudentResponse studentResponse = StudentResponse.PENDING;

	@Column(name = "response_date")
	private Instant responseDate;

	@Column(name = "joining_date")
	private LocalDate joiningDate;

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

	public StudentProfile getStudentProfile() {
		return studentProfile;
	}

	public void setStudentProfile(StudentProfile studentProfile) {
		this.studentProfile = studentProfile;
	}

	public Company getCompany() {
		return company;
	}

	public void setCompany(Company company) {
		this.company = company;
	}

	public JobOpening getJobOpening() {
		return jobOpening;
	}

	public void setJobOpening(JobOpening jobOpening) {
		this.jobOpening = jobOpening;
	}

	public BigDecimal getOfferedCtc() {
		return offeredCtc;
	}

	public void setOfferedCtc(BigDecimal offeredCtc) {
		this.offeredCtc = offeredCtc;
	}

	public String getOfferLetterUrl() {
		return offerLetterUrl;
	}

	public void setOfferLetterUrl(String offerLetterUrl) {
		this.offerLetterUrl = offerLetterUrl;
	}

	public LocalDate getOfferedDate() {
		return offeredDate;
	}

	public void setOfferedDate(LocalDate offeredDate) {
		this.offeredDate = offeredDate;
	}

	public LocalDate getAcceptanceDeadline() {
		return acceptanceDeadline;
	}

	public void setAcceptanceDeadline(LocalDate acceptanceDeadline) {
		this.acceptanceDeadline = acceptanceDeadline;
	}

	public StudentResponse getStudentResponse() {
		return studentResponse;
	}

	public void setStudentResponse(StudentResponse studentResponse) {
		this.studentResponse = studentResponse;
	}

	public Instant getResponseDate() {
		return responseDate;
	}

	public void setResponseDate(Instant responseDate) {
		this.responseDate = responseDate;
	}

	public LocalDate getJoiningDate() {
		return joiningDate;
	}

	public void setJoiningDate(LocalDate joiningDate) {
		this.joiningDate = joiningDate;
	}
}
