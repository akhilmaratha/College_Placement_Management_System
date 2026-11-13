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

import com.codeinnov8ors.placement.dto.drive.DriveRequest;
import com.codeinnov8ors.placement.dto.drive.DriveResponse;
import com.codeinnov8ors.placement.entity.PlacementDrive;
import com.codeinnov8ors.placement.entity.User;
import com.codeinnov8ors.placement.entity.enums.DriveMode;
import com.codeinnov8ors.placement.entity.enums.DriveStatus;
import com.codeinnov8ors.placement.repository.JobOpeningRepository;
import com.codeinnov8ors.placement.repository.PlacementDriveRepository;
import com.codeinnov8ors.placement.repository.RecruiterProfileRepository;
import com.codeinnov8ors.placement.repository.UserRepository;

@Service
@org.springframework.context.annotation.Profile("!test")
@Transactional(readOnly = true)
public class DriveService {
	private final PlacementDriveRepository drives;
	private final JobOpeningRepository jobs;
	private final UserRepository users;
	private final RecruiterProfileRepository recruiters;
	public DriveService(PlacementDriveRepository drives, JobOpeningRepository jobs, UserRepository users, RecruiterProfileRepository recruiters) {
		this.drives = drives; this.jobs = jobs; this.users = users; this.recruiters = recruiters;
	}

	public Page<DriveResponse> list(String q, String status, Instant from, Instant to, Pageable pageable, Authentication auth) {
		boolean student = hasRole(auth, "STUDENT"); boolean recruiter = hasRole(auth, "RECRUITER");
		if (!student && !recruiter && !hasRole(auth, "ADMIN", "PLACEMENT_OFFICER")) throw denied();
		String term = q == null ? "" : q.trim().toLowerCase(Locale.ROOT);
		DriveStatus wanted = status == null || status.isBlank() ? null : parseStatus(status);
		Long companyId = recruiter ? ownCompanyId(auth) : null;
		Specification<PlacementDrive> spec = (root, query, cb) -> {
			var p = new ArrayList<jakarta.persistence.criteria.Predicate>();
			if (!term.isEmpty()) p.add(cb.or(cb.like(cb.lower(root.get("title")), "%" + term + "%"), cb.like(cb.lower(root.get("academicYear")), "%" + term + "%")));
			if (from != null) p.add(cb.greaterThanOrEqualTo(root.get("registrationDeadline"), from));
			if (to != null) p.add(cb.lessThanOrEqualTo(root.get("registrationDeadline"), to));
			if (student) {
				p.add(root.get("status").in(DriveStatus.UPCOMING, DriveStatus.OPEN));
				p.add(cb.greaterThan(root.get("registrationDeadline"), Instant.now()));
			}
			else if (wanted != null) p.add(cb.equal(root.get("status"), wanted));
			if (recruiter) {
				var sub = query.subquery(Long.class); var job = sub.from(com.codeinnov8ors.placement.entity.JobOpening.class);
				sub.select(job.get("id")).where(cb.equal(job.get("placementDrive"), root), cb.equal(job.get("company").get("id"), companyId));
				p.add(cb.exists(sub));
			}
			return cb.and(p.toArray(jakarta.persistence.criteria.Predicate[]::new));
		};
		return drives.findAll(spec, pageable).map(DriveResponse::from);
	}

	public DriveResponse get(Long id, Authentication auth) {
		PlacementDrive d = drives.findById(id).orElseThrow(() -> new IllegalArgumentException("Placement drive not found"));
		if (hasRole(auth, "STUDENT")) {
			if ((d.getStatus() != DriveStatus.OPEN && d.getStatus() != DriveStatus.UPCOMING) || !d.getRegistrationDeadline().isAfter(Instant.now())) throw denied();
		} else if (hasRole(auth, "RECRUITER")) {
			if (!jobs.existsByPlacementDriveIdAndCompanyId(id, ownCompanyId(auth))) throw denied();
		} else if (!hasRole(auth, "ADMIN", "PLACEMENT_OFFICER")) throw denied();
		return DriveResponse.from(d);
	}

	@Transactional
	public DriveResponse create(DriveRequest request, Authentication auth) {
		requireManager(auth); validateDates(request);
		User creator = users.findByEmail(auth.getName().toLowerCase(Locale.ROOT)).orElseThrow(() -> new AccessDeniedException("Authenticated user not found"));
		PlacementDrive d = new PlacementDrive(); d.setCreatedBy(creator); apply(d, request); d.setStatus(DriveStatus.UPCOMING);
		return DriveResponse.from(drives.save(d));
	}

	@Transactional
	public DriveResponse update(Long id, DriveRequest request, Authentication auth) {
		requireManager(auth); validateDates(request);
		PlacementDrive d = drives.findById(id).orElseThrow(() -> new IllegalArgumentException("Placement drive not found"));
		apply(d, request); return DriveResponse.from(d);
	}

	@Transactional
	public DriveResponse updateStatus(Long id, String value, Authentication auth) {
		requireManager(auth);
		PlacementDrive d = drives.findById(id).orElseThrow(() -> new IllegalArgumentException("Placement drive not found"));
		DriveStatus next = parseStatus(value);
		if (next == DriveStatus.OPEN && !d.getRegistrationDeadline().isAfter(Instant.now())) throw new IllegalArgumentException("Cannot open a drive after its registration deadline");
		d.setStatus(next); return DriveResponse.from(d);
	}

	private void apply(PlacementDrive d, DriveRequest r) {
		d.setTitle(r.title().trim()); d.setAcademicYear(r.academicYear().trim()); d.setStartDate(r.startDate());
		d.setEndDate(r.endDate()); d.setRegistrationDeadline(r.registrationDeadline()); d.setDriveMode(parseMode(r.driveMode()));
	}
	private void validateDates(DriveRequest r) { if (r.endDate().isBefore(r.startDate())) throw new IllegalArgumentException("Drive end date must be on or after its start date"); }
	private DriveMode parseMode(String s) { for (DriveMode value : DriveMode.values()) if (value.getDbValue().equalsIgnoreCase(s.trim())) return value; throw new IllegalArgumentException("driveMode must be On-Campus, Virtual, or Pooled"); }
	private DriveStatus parseStatus(String s) { for (DriveStatus value : DriveStatus.values()) if (value.getDbValue().equalsIgnoreCase(s.trim())) return value; throw new IllegalArgumentException("status must be Upcoming, Open, In Progress, or Closed"); }
	private Long ownCompanyId(Authentication auth) {
		Long uid = users.findByEmail(auth.getName().toLowerCase(Locale.ROOT)).orElseThrow(() -> new AccessDeniedException("Authenticated user not found")).getId();
		return recruiters.findByUserId(uid).orElseThrow(() -> new AccessDeniedException("Recruiter company profile not found")).getCompany().getId();
	}
	private boolean hasRole(Authentication a, String... roles) { return a != null && a.getAuthorities().stream().anyMatch(x -> List.of(roles).stream().anyMatch(r -> x.getAuthority().equals("ROLE_" + r))); }
	private void requireManager(Authentication a) { if (!hasRole(a, "ADMIN", "PLACEMENT_OFFICER")) throw denied(); }
	private AccessDeniedException denied() { return new AccessDeniedException("Not authorized to access this placement drive"); }
}
