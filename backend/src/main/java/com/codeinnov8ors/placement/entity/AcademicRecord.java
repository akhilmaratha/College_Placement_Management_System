package com.codeinnov8ors.placement.entity;

import java.math.BigDecimal;
import java.time.Instant;

import com.codeinnov8ors.placement.entity.enums.AcademicVerificationStatus;
import com.codeinnov8ors.placement.entity.support.AuditableEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "academic_records", uniqueConstraints = @UniqueConstraint(name = "uq_academic_records_student", columnNames = "student_profile_id"))
public class AcademicRecord extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "student_profile_id", nullable = false, unique = true)
	private StudentProfile studentProfile;

	@Column(name = "degree_program", nullable = false, length = 100)
	private String degreeProgram;

	@Column(name = "department_branch", nullable = false, length = 100)
	private String departmentBranch;

	@Column(name = "graduation_year", nullable = false)
	private Integer graduationYear;

	@Column(name = "current_cgpa", nullable = false, precision = 4, scale = 2)
	private BigDecimal currentCgpa = BigDecimal.ZERO.setScale(2);

	@Column(name = "tenth_percentage", precision = 5, scale = 2)
	private BigDecimal tenthPercentage;

	@Column(name = "twelfth_percentage", precision = 5, scale = 2)
	private BigDecimal twelfthPercentage;

	@Column(name = "active_backlogs", nullable = false)
	private int activeBacklogs;

	@Column(name = "cleared_backlogs", nullable = false)
	private int clearedBacklogs;

	@Enumerated(EnumType.STRING)
	@Column(name = "verification_status", nullable = false, length = 30)
	private AcademicVerificationStatus verificationStatus = AcademicVerificationStatus.PENDING;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "verified_by_user_id")
	private User verifiedBy;

	@Column(name = "verified_at")
	private Instant verifiedAt;

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

	public String getDegreeProgram() {
		return degreeProgram;
	}

	public void setDegreeProgram(String degreeProgram) {
		this.degreeProgram = degreeProgram;
	}

	public String getDepartmentBranch() {
		return departmentBranch;
	}

	public void setDepartmentBranch(String departmentBranch) {
		this.departmentBranch = departmentBranch;
	}

	public Integer getGraduationYear() {
		return graduationYear;
	}

	public void setGraduationYear(Integer graduationYear) {
		this.graduationYear = graduationYear;
	}

	public BigDecimal getCurrentCgpa() {
		return currentCgpa;
	}

	public void setCurrentCgpa(BigDecimal currentCgpa) {
		this.currentCgpa = currentCgpa;
	}

	public BigDecimal getTenthPercentage() {
		return tenthPercentage;
	}

	public void setTenthPercentage(BigDecimal tenthPercentage) {
		this.tenthPercentage = tenthPercentage;
	}

	public BigDecimal getTwelfthPercentage() {
		return twelfthPercentage;
	}

	public void setTwelfthPercentage(BigDecimal twelfthPercentage) {
		this.twelfthPercentage = twelfthPercentage;
	}

	public int getActiveBacklogs() {
		return activeBacklogs;
	}

	public void setActiveBacklogs(int activeBacklogs) {
		this.activeBacklogs = activeBacklogs;
	}

	public int getClearedBacklogs() {
		return clearedBacklogs;
	}

	public void setClearedBacklogs(int clearedBacklogs) {
		this.clearedBacklogs = clearedBacklogs;
	}

	public AcademicVerificationStatus getVerificationStatus() {
		return verificationStatus;
	}

	public void setVerificationStatus(AcademicVerificationStatus verificationStatus) {
		this.verificationStatus = verificationStatus;
	}

	public User getVerifiedBy() {
		return verifiedBy;
	}

	public void setVerifiedBy(User verifiedBy) {
		this.verifiedBy = verifiedBy;
	}

	public Instant getVerifiedAt() {
		return verifiedAt;
	}

	public void setVerifiedAt(Instant verifiedAt) {
		this.verifiedAt = verifiedAt;
	}
}
