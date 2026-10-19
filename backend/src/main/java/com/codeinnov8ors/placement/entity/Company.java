package com.codeinnov8ors.placement.entity;

import com.codeinnov8ors.placement.entity.enums.CompanyVerificationStatus;
import com.codeinnov8ors.placement.entity.support.AuditableEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "companies", uniqueConstraints = @UniqueConstraint(name = "uq_companies_name", columnNames = "name"))
public class Company extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "name", nullable = false, length = 200)
	private String name;

	@Column(name = "website_url", length = 255)
	private String websiteUrl;

	@Column(name = "industry_sector", nullable = false, length = 100)
	private String industrySector;

	@Column(name = "location", nullable = false, length = 150)
	private String location;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	@Column(name = "contact_email", nullable = false, length = 255)
	private String contactEmail;

	@Column(name = "contact_phone", length = 30)
	private String contactPhone;

	@Column(name = "logo_url", length = 500)
	private String logoUrl;

	@Enumerated(EnumType.STRING)
	@Column(name = "verification_status", nullable = false, length = 30)
	private CompanyVerificationStatus verificationStatus = CompanyVerificationStatus.PENDING;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getWebsiteUrl() {
		return websiteUrl;
	}

	public void setWebsiteUrl(String websiteUrl) {
		this.websiteUrl = websiteUrl;
	}

	public String getIndustrySector() {
		return industrySector;
	}

	public void setIndustrySector(String industrySector) {
		this.industrySector = industrySector;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getContactEmail() {
		return contactEmail;
	}

	public void setContactEmail(String contactEmail) {
		this.contactEmail = contactEmail;
	}

	public String getContactPhone() {
		return contactPhone;
	}

	public void setContactPhone(String contactPhone) {
		this.contactPhone = contactPhone;
	}

	public String getLogoUrl() {
		return logoUrl;
	}

	public void setLogoUrl(String logoUrl) {
		this.logoUrl = logoUrl;
	}

	public CompanyVerificationStatus getVerificationStatus() {
		return verificationStatus;
	}

	public void setVerificationStatus(CompanyVerificationStatus verificationStatus) {
		this.verificationStatus = verificationStatus;
	}
}
