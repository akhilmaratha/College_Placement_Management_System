package com.codeinnov8ors.placement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeinnov8ors.placement.entity.StudentSkill;

public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {

	List<StudentSkill> findByStudentProfileId(Long studentProfileId);

	Optional<StudentSkill> findByStudentProfileIdAndSkillId(Long studentProfileId, Long skillId);
}
