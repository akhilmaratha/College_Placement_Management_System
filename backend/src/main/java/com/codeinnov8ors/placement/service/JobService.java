package com.codeinnov8ors.placement.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codeinnov8ors.placement.dto.job.JobRequest;
import com.codeinnov8ors.placement.dto.job.JobResponse;
import com.codeinnov8ors.placement.entity.Company;
import com.codeinnov8ors.placement.entity.JobOpening;
import com.codeinnov8ors.placement.entity.JobSkill;
import com.codeinnov8ors.placement.entity.Skill;
import com.codeinnov8ors.placement.entity.enums.CompanyVerificationStatus;
import com.codeinnov8ors.placement.entity.enums.JobOpeningStatus;
import com.codeinnov8ors.placement.entity.enums.JobType;
import com.codeinnov8ors.placement.repository.CompanyRepository;
import com.codeinnov8ors.placement.repository.JobOpeningRepository;
import com.codeinnov8ors.placement.repository.JobSkillRepository;
import com.codeinnov8ors.placement.repository.PlacementDriveRepository;
import com.codeinnov8ors.placement.repository.RecruiterProfileRepository;
import com.codeinnov8ors.placement.repository.SkillRepository;
import com.codeinnov8ors.placement.repository.UserRepository;

@Service
@org.springframework.context.annotation.Profile("!test")
@Transactional(readOnly = true)
public class JobService {
	private final JobOpeningRepository jobs;
	private final CompanyRepository companies;
	private final PlacementDriveRepository drives;
	private final RecruiterProfileRepository recruiters;
	private final UserRepository users;
	private final SkillRepository skills;
	private final JobSkillRepository jobSkills;

	public JobService(JobOpeningRepository jobs, CompanyRepository companies, PlacementDriveRepository drives,
			RecruiterProfileRepository recruiters, UserRepository users, SkillRepository skills, JobSkillRepository jobSkills) {
		this.jobs = jobs; this.companies = companies; this.drives = drives; this.recruiters = recruiters;
		this.users = users; this.skills = skills; this.jobSkills = jobSkills;
	}

	public Page<JobResponse> list(String q, Long companyId, String location, String jobType, String status,
			Instant deadlineFrom, Instant deadlineTo, Pageable pageable, Authentication auth) {
		boolean student = hasRole(auth, "STUDENT");
		boolean recruiter = hasRole(auth, "RECRUITER");
		if (!student && !recruiter && !hasRole(auth, "PLACEMENT_OFFICER", "ADMIN")) throw denied();
		Long ownedCompany = recruiter ? ownCompanyId(auth) : null;
		if (recruiter && companyId != null && !companyId.equals(ownedCompany)) throw denied();
		String term = q == null ? "" : q.trim().toLowerCase(Locale.ROOT);
		JobOpeningStatus requestedStatus = status == null || status.isBlank() ? null : parseStatus(status);
		JobType requestedType = jobType == null || jobType.isBlank() ? null : parseType(jobType);
		Specification<JobOpening> spec = (root, query, cb) -> {
			var predicates = new ArrayList<jakarta.persistence.criteria.Predicate>();
			var company = root.join("company");
			if (!term.isEmpty()) predicates.add(cb.or(cb.like(cb.lower(root.get("title")), "%" + term + "%"), cb.like(cb.lower(root.get("description")), "%" + term + "%"), cb.like(cb.lower(company.get("name")), "%" + term + "%")));
			if (location != null && !location.isBlank()) predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.trim().toLowerCase(Locale.ROOT) + "%"));
			if (companyId != null && !recruiter) predicates.add(cb.equal(company.get("id"), companyId));
			if (ownedCompany != null) predicates.add(cb.equal(company.get("id"), ownedCompany));
			if (requestedType != null) predicates.add(cb.equal(root.get("jobType"), requestedType));
			if (requestedStatus != null && !student) predicates.add(cb.equal(root.get("status"), requestedStatus));
			if (deadlineFrom != null) predicates.add(cb.greaterThanOrEqualTo(root.get("applicationDeadline"), deadlineFrom));
			if (deadlineTo != null) predicates.add(cb.lessThanOrEqualTo(root.get("applicationDeadline"), deadlineTo));
			if (student) {
				predicates.add(cb.equal(root.get("status"), JobOpeningStatus.PUBLISHED));
				predicates.add(cb.greaterThan(root.get("applicationDeadline"), Instant.now()));
				predicates.add(cb.equal(company.get("verificationStatus"), CompanyVerificationStatus.VERIFIED));
			}
			return cb.and(predicates.toArray(jakarta.persistence.criteria.Predicate[]::new));
		};
		return jobs.findAll(spec, pageable).map(this::response);
	}

	public JobResponse get(Long id, Authentication auth) {
		JobOpening job = jobs.findById(id).orElseThrow(() -> new IllegalArgumentException("Job not found"));
		if (hasRole(auth, "STUDENT")) {
			if (job.getStatus() != JobOpeningStatus.PUBLISHED || !job.getApplicationDeadline().isAfter(Instant.now()) || job.getCompany().getVerificationStatus() != CompanyVerificationStatus.VERIFIED) throw denied();
		} else if (hasRole(auth, "RECRUITER")) {
			if (!job.getCompany().getId().equals(ownCompanyId(auth))) throw denied();
		} else if (!hasRole(auth, "PLACEMENT_OFFICER", "ADMIN")) throw denied();
		return response(job);
	}

	@Transactional
	public JobResponse create(JobRequest request, Authentication auth) {
		boolean recruiter = hasRole(auth, "RECRUITER");
		if (!recruiter && !hasRole(auth, "PLACEMENT_OFFICER", "ADMIN")) throw denied();
		Company company = resolveCompany(request.companyId(), auth, recruiter);
		JobOpening job = new JobOpening(); job.setCompany(company); apply(job, request, auth, false);
		job.setStatus(JobOpeningStatus.DRAFT);
		JobOpening saved = jobs.save(job);
		replaceSkills(saved, request.skills());
		return response(saved);
	}

	@Transactional
	public JobResponse update(Long id, JobRequest request, Authentication auth) {
		JobOpening job = jobs.findById(id).orElseThrow(() -> new IllegalArgumentException("Job not found"));
		boolean recruiter = hasRole(auth, "RECRUITER");
		if (recruiter) {
			Long companyId = ownCompanyId(auth);
			if (!job.getCompany().getId().equals(companyId) || (request.companyId() != null && !request.companyId().equals(companyId))) throw denied();
		} else if (!hasRole(auth, "PLACEMENT_OFFICER", "ADMIN")) throw denied();
		else job.setCompany(resolveCompany(request.companyId(), auth, false));
		apply(job, request, auth, true);
		if (job.getStatus() == JobOpeningStatus.PUBLISHED && !job.getApplicationDeadline().isAfter(Instant.now())) throw new IllegalArgumentException("A published job must have a future application deadline");
		replaceSkills(job, request.skills());
		return response(job);
	}

	@Transactional
	public JobResponse updateStatus(Long id, String statusValue, Authentication auth) {
		JobOpening job = jobs.findById(id).orElseThrow(() -> new IllegalArgumentException("Job not found"));
		boolean recruiter = hasRole(auth, "RECRUITER");
		if (recruiter) {
			if (!job.getCompany().getId().equals(ownCompanyId(auth))) throw denied();
		} else if (!hasRole(auth, "PLACEMENT_OFFICER", "ADMIN")) throw denied();
		JobOpeningStatus next = parseStatus(statusValue);
		if (next == JobOpeningStatus.PUBLISHED) {
			if (!job.getApplicationDeadline().isAfter(Instant.now())) throw new IllegalArgumentException("Cannot publish a job after its application deadline");
			if (job.getCompany().getVerificationStatus() != CompanyVerificationStatus.VERIFIED) throw new IllegalArgumentException("Only jobs for verified companies can be published");
			if (job.getPostedAt() == null) job.setPostedAt(Instant.now());
		}
		job.setStatus(next);
		return response(job);
	}

	private void apply(JobOpening j, JobRequest r, Authentication auth, boolean updating) {
		j.setTitle(r.title().trim()); j.setDescription(r.description().trim()); j.setJobType(parseType(r.jobType()));
		j.setLocation(r.location().trim()); j.setSalaryText(blank(r.salaryText())); j.setMinSalary(r.minSalary()); j.setMaxSalary(r.maxSalary());
		if (r.minSalary() != null && r.maxSalary() != null && r.minSalary().compareTo(r.maxSalary()) > 0) throw new IllegalArgumentException("Minimum salary cannot exceed maximum salary");
		j.setApplicationDeadline(r.applicationDeadline()); j.setMinCgpa(r.minCgpa()); j.setAllowedBranches(r.allowedBranches().trim());
		j.setMaxActiveBacklogs(r.maxActiveBacklogs() == null ? 0 : r.maxActiveBacklogs()); j.setBatchYear(r.batchYear());
		if (hasRole(auth, "RECRUITER")) {
			if (r.placementDriveId() != null && (j.getPlacementDrive() == null || !r.placementDriveId().equals(j.getPlacementDrive().getId()))) throw denied();
		} else if (r.placementDriveId() == null) j.setPlacementDrive(null);
		else j.setPlacementDrive(drives.findById(r.placementDriveId()).orElseThrow(() -> new IllegalArgumentException("Placement drive not found")));
		if (!updating) j.setPostedAt(null);
	}

	private Company resolveCompany(Long requestedId, Authentication auth, boolean recruiter) {
		if (recruiter) {
			Long own = ownCompanyId(auth);
			if (requestedId != null && !requestedId.equals(own)) throw denied();
			return companies.findById(own).orElseThrow(() -> new AccessDeniedException("Recruiter's company no longer exists"));
		}
		if (requestedId == null) throw new IllegalArgumentException("companyId is required");
		return companies.findById(requestedId).orElseThrow(() -> new IllegalArgumentException("Company not found"));
	}

	private void replaceSkills(JobOpening job, List<String> requested) {
		jobSkills.deleteByJobOpeningId(job.getId());
		if (requested == null || requested.isEmpty()) return;
		var links = new ArrayList<JobSkill>();
		for (String name : requested.stream().map(String::trim).filter(s -> !s.isBlank()).distinct().toList()) {
			Skill skill = skills.findBySkillName(name).orElseThrow(() -> new IllegalArgumentException("Unknown skill in skills catalog: " + name));
			JobSkill link = new JobSkill(); link.setJobOpening(job); link.setSkill(skill); link.setMandatory(true); links.add(link);
		}
		jobSkills.saveAll(links);
	}

	private JobResponse response(JobOpening job) { return JobResponse.from(job, jobSkills.findByJobOpeningId(job.getId())); }
	private Long ownCompanyId(Authentication auth) {
		Long userId = users.findByEmail(auth.getName().toLowerCase(Locale.ROOT)).orElseThrow(() -> new AccessDeniedException("Authenticated user not found")).getId();
		return recruiters.findByUserId(userId).orElseThrow(() -> new AccessDeniedException("Recruiter company profile not found")).getCompany().getId();
	}
	private JobType parseType(String s) { for (JobType value : JobType.values()) if (value.getDbValue().equalsIgnoreCase(s.trim())) return value; throw new IllegalArgumentException("jobType must be Full-time, Internship, or Contract"); }
	private JobOpeningStatus parseStatus(String s) { for (JobOpeningStatus value : JobOpeningStatus.values()) if (value.getDbValue().equalsIgnoreCase(s.trim())) return value; throw new IllegalArgumentException("status must be Draft, Published, or Closed"); }
	private String blank(String s) { return s == null || s.isBlank() ? null : s.trim(); }
	private boolean hasRole(Authentication a, String... roles) { return a != null && a.getAuthorities().stream().anyMatch(x -> List.of(roles).stream().anyMatch(r -> x.getAuthority().equals("ROLE_" + r))); }
	private AccessDeniedException denied() { return new AccessDeniedException("Not authorized to access this job"); }
}
