package com.codeinnov8ors.placement.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import com.codeinnov8ors.placement.entity.Company;
import com.codeinnov8ors.placement.entity.RecruiterProfile;
import com.codeinnov8ors.placement.entity.User;
import com.codeinnov8ors.placement.entity.enums.CompanyVerificationStatus;
import com.codeinnov8ors.placement.entity.enums.UserRole;
import com.codeinnov8ors.placement.entity.enums.UserStatus;

@DataJpaTest
@ActiveProfiles("datajpa")
class RecruiterCompanyRelationshipTest {
	@Autowired UserRepository users;
	@Autowired CompanyRepository companies;
	@Autowired RecruiterProfileRepository recruiters;

	@Test void multipleRecruitersCanBelongToOneCompanyAndPersistAssociation() {
		Company company = new Company(); company.setName("Acme Test"); company.setIndustrySector("Software"); company.setLocation("Pune");
		company.setContactEmail("campus@acme.example"); company.setVerificationStatus(CompanyVerificationStatus.PENDING);
		company = companies.saveAndFlush(company);

		for (int i = 1; i <= 2; i++) {
			User user = new User(); user.setEmail("recruiter" + i + "@acme.example"); user.setPasswordHash("test-hash");
			user.setRole(UserRole.RECRUITER); user.setStatus(UserStatus.ACTIVE); user = users.saveAndFlush(user);
			RecruiterProfile profile = new RecruiterProfile(); profile.setUser(user); profile.setCompany(company);
			profile.setDesignation("Talent Partner"); recruiters.saveAndFlush(profile);
		}

		assertEquals(2, recruiters.findByCompanyId(company.getId()).size());
		assertEquals(company.getId(), recruiters.findByUserId(users.findByEmail("recruiter1@acme.example").orElseThrow().getId()).orElseThrow().getCompany().getId());
	}
}
