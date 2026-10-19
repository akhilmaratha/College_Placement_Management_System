package com.codeinnov8ors.placement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeinnov8ors.placement.entity.Resume;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

	List<Resume> findByStudentProfileId(Long studentProfileId);
}
