package com.codeinnov8ors.placement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeinnov8ors.placement.entity.JobSkill;

public interface JobSkillRepository extends JpaRepository<JobSkill, Long> {

	List<JobSkill> findByJobOpeningId(Long jobOpeningId);

	Optional<JobSkill> findByJobOpeningIdAndSkillId(Long jobOpeningId, Long skillId);
}
