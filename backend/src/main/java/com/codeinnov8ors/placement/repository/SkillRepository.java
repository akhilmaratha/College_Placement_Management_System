package com.codeinnov8ors.placement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeinnov8ors.placement.entity.Skill;

public interface SkillRepository extends JpaRepository<Skill, Long> {

	Optional<Skill> findBySkillName(String skillName);

	boolean existsBySkillName(String skillName);
}
