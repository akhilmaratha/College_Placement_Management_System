package com.codeinnov8ors.placement.entity;

import java.time.LocalDate;

import com.codeinnov8ors.placement.entity.enums.Gender;
import com.codeinnov8ors.placement.entity.support.AuditableEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "student_profiles", uniqueConstraints = {
		@UniqueConstraint(name = "uq_student_profiles_user", columnNames = "user_id"),
		@UniqueConstraint(name = "uq_student_profiles_roll_number", columnNames = "roll_number")
})
public class StudentProfile extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	@Column(name = "roll_number", nullable = false, length = 50)
	private String rollNumber;

	@Column(name = "full_name", nullable = false, length = 150)
	private String fullName;

	@Column(name = "phone_number", nullable = false, length = 20)
	private String phoneNumber;

	@Column(name = "alternate_email", length = 255)
	private String alternateEmail;

	@Convert(converter = Gender.ConverterImpl.class)
	@Column(name = "gender", length = 20)
	private Gender gender;

	@Column(name = "date_of_birth")
	private LocalDate dateOfBirth;

	@Column(name = "current_address", columnDefinition = "TEXT")
	private String currentAddress;

	@Column(name = "linkedin_url", length = 255)
	private String linkedinUrl;

	@Column(name = "github_url", length = 255)
	private String githubUrl;

	@Column(name = "is_profile_complete", nullable = false)
	private boolean profileComplete;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getRollNumber() {
		return rollNumber;
	}

	public void setRollNumber(String rollNumber) {
		this.rollNumber = rollNumber;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getAlternateEmail() {
		return alternateEmail;
	}

	public void setAlternateEmail(String alternateEmail) {
		this.alternateEmail = alternateEmail;
	}

	public Gender getGender() {
		return gender;
	}

	public void setGender(Gender gender) {
		this.gender = gender;
	}

	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public String getCurrentAddress() {
		return currentAddress;
	}

	public void setCurrentAddress(String currentAddress) {
		this.currentAddress = currentAddress;
	}

	public String getLinkedinUrl() {
		return linkedinUrl;
	}

	public void setLinkedinUrl(String linkedinUrl) {
		this.linkedinUrl = linkedinUrl;
	}

	public String getGithubUrl() {
		return githubUrl;
	}

	public void setGithubUrl(String githubUrl) {
		this.githubUrl = githubUrl;
	}

	public boolean isProfileComplete() {
		return profileComplete;
	}

	public void setProfileComplete(boolean profileComplete) {
		this.profileComplete = profileComplete;
	}
}
