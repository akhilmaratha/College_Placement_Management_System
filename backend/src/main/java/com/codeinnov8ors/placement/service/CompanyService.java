package com.codeinnov8ors.placement.service;

import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeinnov8ors.placement.dto.company.CompanyRequest;
import com.codeinnov8ors.placement.dto.company.CompanyResponse;
import com.codeinnov8ors.placement.entity.Company;
import com.codeinnov8ors.placement.entity.enums.CompanyVerificationStatus;
import com.codeinnov8ors.placement.repository.CompanyRepository;
import com.codeinnov8ors.placement.repository.RecruiterProfileRepository;
import com.codeinnov8ors.placement.repository.UserRepository;

@Service
@org.springframework.context.annotation.Profile("!test")
@Transactional(readOnly = true)
public class CompanyService {
	private final CompanyRepository companies;
	private final RecruiterProfileRepository recruiters;
	private final UserRepository users;
	public CompanyService(CompanyRepository companies, RecruiterProfileRepository recruiters, UserRepository users) {
		this.companies = companies; this.recruiters = recruiters; this.users = users;
	}

	public Page<CompanyResponse> list(String q, Pageable pageable, Authentication auth) {
		String term = q == null ? "" : q.trim().toLowerCase(Locale.ROOT);
		if (isRecruiter(auth)) {
			Company own = ownCompany(auth);
			if (!matches(own, term)) return Page.empty(pageable);
			return new PageImpl<>(List.of(CompanyResponse.from(own, false)), pageable, 1);
		}
		boolean student = hasRole(auth, "STUDENT");
		if (!student && !hasRole(auth, "ADMIN", "PLACEMENT_OFFICER")) throw new AccessDeniedException("Not authorized to list companies");
		Specification<Company> spec = (root, query, cb) -> {
			var search = term.isEmpty() ? cb.conjunction() : cb.or(
				cb.like(cb.lower(root.get("name")), "%" + term + "%"),
				cb.like(cb.lower(root.get("industrySector")), "%" + term + "%"),
				cb.like(cb.lower(root.get("location")), "%" + term + "%"));
			return student ? cb.and(search, cb.equal(root.get("verificationStatus"), CompanyVerificationStatus.VERIFIED)) : search;
		};
		return companies.findAll(spec, pageable).map(c -> CompanyResponse.from(c, student));
	}

	public CompanyResponse get(Long id, Authentication auth) {
		Company c = companies.findById(id).orElseThrow(() -> new IllegalArgumentException("Company not found"));
		if (hasRole(auth, "STUDENT")) {
			if (c.getVerificationStatus() != CompanyVerificationStatus.VERIFIED) throw new AccessDeniedException("Company is not publicly available");
			return CompanyResponse.from(c, true);
		}
		if (isRecruiter(auth)) {
			if (!ownCompany(auth).getId().equals(id)) throw new AccessDeniedException("Recruiters may access only their own company");
			return CompanyResponse.from(c, false);
		}
		if (!hasRole(auth, "ADMIN", "PLACEMENT_OFFICER")) throw new AccessDeniedException("Not authorized to view this company");
		return CompanyResponse.from(c, false);
	}

	@Transactional
	public CompanyResponse create(CompanyRequest request, Authentication auth) {
		requireManager(auth);
		if (companies.existsByName(request.name().trim())) throw new IllegalArgumentException("A company with this name already exists");
		Company c = new Company(); apply(c, request); c.setVerificationStatus(CompanyVerificationStatus.PENDING);
		return CompanyResponse.from(companies.save(c), false);
	}

	@Transactional
	public CompanyResponse update(Long id, CompanyRequest request, Authentication auth) {
		Company c = companies.findById(id).orElseThrow(() -> new IllegalArgumentException("Company not found"));
		if (!hasRole(auth, "ADMIN", "PLACEMENT_OFFICER")) {
			if (!isRecruiter(auth) || !ownCompany(auth).getId().equals(id)) throw new AccessDeniedException("Not authorized to update this company");
		}
		companies.findByName(request.name().trim()).filter(existing -> !existing.getId().equals(id))
			.ifPresent(existing -> { throw new IllegalArgumentException("A company with this name already exists"); });
		apply(c, request);
		return CompanyResponse.from(c, false);
	}

	@Transactional
	public CompanyResponse setStatus(Long id, CompanyVerificationStatus status, Authentication auth) {
		requireManager(auth);
		Company c = companies.findById(id).orElseThrow(() -> new IllegalArgumentException("Company not found"));
		c.setVerificationStatus(status);
		return CompanyResponse.from(c, false);
	}

	private void apply(Company c, CompanyRequest r) {
		c.setName(r.name().trim()); c.setWebsiteUrl(blank(r.websiteUrl())); c.setIndustrySector(r.industrySector().trim());
		c.setLocation(r.location().trim()); c.setDescription(blank(r.description())); c.setContactEmail(r.contactEmail().trim().toLowerCase(Locale.ROOT));
		c.setContactPhone(blank(r.contactPhone())); c.setLogoUrl(blank(r.logoUrl()));
	}
	private String blank(String v) { return v == null || v.isBlank() ? null : v.trim(); }
	private boolean matches(Company c, String q) { return q.isEmpty() || c.getName().toLowerCase(Locale.ROOT).contains(q) || c.getIndustrySector().toLowerCase(Locale.ROOT).contains(q) || c.getLocation().toLowerCase(Locale.ROOT).contains(q); }
	private Company ownCompany(Authentication auth) {
		Long uid = users.findByEmail(auth.getName().toLowerCase(Locale.ROOT)).orElseThrow(() -> new AccessDeniedException("Authenticated user not found")).getId();
		return recruiters.findByUserId(uid).orElseThrow(() -> new AccessDeniedException("Recruiter company profile not found")).getCompany();
	}
	private boolean isRecruiter(Authentication a) { return hasRole(a, "RECRUITER"); }
	private boolean hasRole(Authentication a, String... roles) { return a != null && a.getAuthorities().stream().anyMatch(x -> List.of(roles).stream().anyMatch(r -> x.getAuthority().equals("ROLE_" + r))); }
	private void requireManager(Authentication a) { if (!hasRole(a, "ADMIN", "PLACEMENT_OFFICER")) throw new AccessDeniedException("Only administrators and placement officers may manage company status or create companies"); }
}
