package com.codeinnov8ors.placement.service;

import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeinnov8ors.placement.dto.recruiter.RecruiterProfileUpdateRequest;
import com.codeinnov8ors.placement.dto.recruiter.RecruiterCompanyAssignmentRequest;
import com.codeinnov8ors.placement.dto.recruiter.RecruiterResponse;
import com.codeinnov8ors.placement.entity.RecruiterProfile;
import com.codeinnov8ors.placement.repository.RecruiterProfileRepository;
import com.codeinnov8ors.placement.repository.CompanyRepository;
import com.codeinnov8ors.placement.repository.UserRepository;

@Service
@org.springframework.context.annotation.Profile("!test")
@Transactional(readOnly = true)
public class RecruiterService {
	private final RecruiterProfileRepository recruiters;
	private final UserRepository users;
	private final CompanyRepository companies;
	public RecruiterService(RecruiterProfileRepository recruiters, UserRepository users, CompanyRepository companies) { this.recruiters = recruiters; this.users = users; this.companies = companies; }

	public RecruiterResponse me(Authentication auth) { return RecruiterResponse.from(own(auth)); }

	@Transactional
	public RecruiterResponse updateMe(Authentication auth, RecruiterProfileUpdateRequest request) {
		RecruiterProfile p = own(auth);
		p.setDesignation(blank(request.designation())); p.setPhoneNumber(blank(request.phoneNumber()));
		return RecruiterResponse.from(p);
	}

	public Page<RecruiterResponse> list(String q, Pageable pageable, Authentication auth) {
		requireManager(auth);
		String term = q == null ? "" : q.trim().toLowerCase(Locale.ROOT);
		Specification<RecruiterProfile> spec = (root, query, cb) -> {
			if (term.isEmpty()) return cb.conjunction();
			var user = root.join("user"); var company = root.join("company");
			return cb.or(cb.like(cb.lower(user.get("email")), "%" + term + "%"), cb.like(cb.lower(company.get("name")), "%" + term + "%"), cb.like(cb.lower(root.get("designation")), "%" + term + "%"));
		};
		return recruiters.findAll(spec, pageable).map(RecruiterResponse::from);
	}

	public RecruiterResponse get(Long id, Authentication auth) {
		requireManager(auth);
		return RecruiterResponse.from(recruiters.findById(id).orElseThrow(() -> new IllegalArgumentException("Recruiter not found")));
	}

	@Transactional
	public RecruiterResponse assignCompany(Long id, RecruiterCompanyAssignmentRequest request, Authentication auth) {
		requireManager(auth);
		RecruiterProfile p = recruiters.findById(id).orElseThrow(() -> new IllegalArgumentException("Recruiter not found"));
		var company = companies.findById(request.companyId()).orElseThrow(() -> new IllegalArgumentException("Company not found"));
		p.setCompany(company);
		return RecruiterResponse.from(p);
	}

	private RecruiterProfile own(Authentication auth) {
		if (!hasRole(auth, "RECRUITER")) throw new AccessDeniedException("Recruiter access required");
		Long userId = users.findByEmail(auth.getName().toLowerCase(Locale.ROOT)).orElseThrow(() -> new AccessDeniedException("Authenticated user not found")).getId();
		return recruiters.findByUserId(userId).orElseThrow(() -> new AccessDeniedException("Recruiter profile not found"));
	}
	private void requireManager(Authentication a) { if (!hasRole(a, "ADMIN", "PLACEMENT_OFFICER")) throw new AccessDeniedException("Only administrators and placement officers may list recruiter records"); }
	private boolean hasRole(Authentication a, String... roles) { return a != null && a.getAuthorities().stream().anyMatch(x -> List.of(roles).stream().anyMatch(r -> x.getAuthority().equals("ROLE_" + r))); }
	private String blank(String s) { return s == null || s.isBlank() ? null : s.trim(); }
}
