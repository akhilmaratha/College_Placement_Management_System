package com.codeinnov8ors.placement.service;

import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Profile;
import org.springframework.transaction.annotation.Transactional;

import com.codeinnov8ors.placement.dto.student.StudentProfileResponse;
import com.codeinnov8ors.placement.dto.student.StudentProfileUpdateRequest;
import com.codeinnov8ors.placement.entity.AcademicRecord;
import com.codeinnov8ors.placement.entity.StudentProfile;
import com.codeinnov8ors.placement.repository.AcademicRecordRepository;
import com.codeinnov8ors.placement.repository.StudentProfileRepository;
import com.codeinnov8ors.placement.repository.StudentSkillRepository;
import com.codeinnov8ors.placement.repository.ResumeRepository;
import com.codeinnov8ors.placement.repository.UserRepository;

import jakarta.persistence.criteria.Join;

@Service
@Profile("!test")
@Transactional(readOnly = true)
public class StudentService {
	private final StudentProfileRepository students;
	private final UserRepository users;
	private final AcademicRecordRepository academics;
	private final StudentSkillRepository skills;
	private final ResumeRepository resumes;

	public StudentService(StudentProfileRepository students, UserRepository users, AcademicRecordRepository academics,
			StudentSkillRepository skills, ResumeRepository resumes) {
		this.students = students; this.users = users; this.academics = academics; this.skills = skills; this.resumes = resumes;
	}

	public StudentProfileResponse me(Authentication auth) {
		return response(students.findByUserId(userId(auth)).orElseThrow(() -> new IllegalArgumentException("Student profile not found")), auth);
	}

	@Transactional
	public StudentProfileResponse updateMe(Authentication auth, StudentProfileUpdateRequest request) {
		StudentProfile profile = students.findByUserId(userId(auth)).orElseThrow(() -> new IllegalArgumentException("Student profile not found"));
		if (!hasRole(auth, "STUDENT")) throw new AccessDeniedException("Only students can update their own profile");
		profile.setFullName(request.fullName().trim()); profile.setPhoneNumber(request.phoneNumber().trim());
		profile.setAlternateEmail(blankToNull(request.alternateEmail())); profile.setGender(parseGender(request.gender()));
		profile.setDateOfBirth(request.dateOfBirth()); profile.setCurrentAddress(blankToNull(request.currentAddress()));
		profile.setLinkedinUrl(blankToNull(request.linkedinUrl())); profile.setGithubUrl(blankToNull(request.githubUrl()));
		return response(profile, auth);
	}

	public StudentProfileResponse byId(Long id, Authentication auth) {
		StudentProfile p = students.findById(id).orElseThrow(() -> new IllegalArgumentException("Student profile not found"));
		if (hasRole(auth, "STUDENT") && !p.getUser().getId().equals(userId(auth))) throw new AccessDeniedException("Students may only view their own profile");
		if (!hasRole(auth, "STUDENT", "RECRUITER", "PLACEMENT_OFFICER", "ADMIN")) throw new AccessDeniedException("Not authorized to view student profiles");
		return response(p, auth);
	}

	public Page<StudentProfileResponse> directory(String q, Pageable pageable, Authentication auth) {
		if (!hasRole(auth, "PLACEMENT_OFFICER", "ADMIN")) throw new AccessDeniedException("Not authorized to access the student directory");
		String term = q == null ? "" : q.trim().toLowerCase(Locale.ROOT);
		Specification<StudentProfile> spec = (root, query, cb) -> {
			if (term.isEmpty()) return cb.conjunction();
			Join<Object, Object> user = root.join("user");
			return cb.or(cb.like(cb.lower(root.get("fullName")), "%" + term + "%"), cb.like(cb.lower(root.get("rollNumber")), "%" + term + "%"), cb.like(cb.lower(user.get("email")), "%" + term + "%"));
		};
		return students.findAll(spec, pageable).map(p -> response(p, auth));
	}

	private StudentProfileResponse response(StudentProfile p, Authentication auth) {
		AcademicRecord a = academics.findByStudentProfileId(p.getId()).orElse(null);
		boolean recruiter = hasRole(auth, "RECRUITER");
		return new StudentProfileResponse(p.getId(), p.getFullName(), recruiter ? null : p.getUser().getEmail(),
			recruiter ? null : p.getRollNumber(), recruiter ? null : p.getPhoneNumber(), recruiter ? null : p.getAlternateEmail(),
			recruiter ? null : p.getGender() == null ? null : p.getGender().getDbValue(), recruiter ? null : p.getDateOfBirth(),
			recruiter ? null : p.getCurrentAddress(), p.getLinkedinUrl(), p.getGithubUrl(), a == null ? null : a.getDegreeProgram(),
			a == null ? null : a.getDepartmentBranch(), a == null ? null : a.getGraduationYear(), a == null ? null : a.getCurrentCgpa(),
			skills.findByStudentProfileId(p.getId()).stream().map(s -> s.getSkill().getSkillName()).toList(),
			resumes.findByStudentProfileId(p.getId()).stream().map(r -> new StudentProfileResponse.ResumeInfo(r.getId(), r.getTitle(), r.getOriginalFileName(), r.getFileSizeBytes(), r.getMimeType(), r.isDefaultResume())).toList(), p.isProfileComplete());
	}
	private Long userId(Authentication auth) { return users.findByEmail(auth.getName().toLowerCase(Locale.ROOT)).orElseThrow(() -> new AccessDeniedException("Authenticated user not found")).getId(); }
	private boolean hasRole(Authentication a, String... roles) { return a != null && a.getAuthorities().stream().anyMatch(x -> List.of(roles).stream().anyMatch(r -> x.getAuthority().equals("ROLE_" + r))); }
	private String blankToNull(String v) { return v == null || v.isBlank() ? null : v.trim(); }
	private com.codeinnov8ors.placement.entity.enums.Gender parseGender(String v) { if (v == null || v.isBlank()) return null; try { return com.codeinnov8ors.placement.entity.enums.Gender.valueOf(v.trim().toUpperCase(Locale.ROOT).replace(' ', '_')); } catch (IllegalArgumentException e) { throw new IllegalArgumentException("gender must be Male, Female, Other, or Prefer not to say"); } }
}
