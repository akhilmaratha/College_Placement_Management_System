package com.codeinnov8ors.placement.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import com.codeinnov8ors.placement.entity.Skill;
import com.codeinnov8ors.placement.entity.User;
import com.codeinnov8ors.placement.entity.enums.UserRole;
import com.codeinnov8ors.placement.entity.enums.UserStatus;

/**
 * Mapping/repository smoke tests on H2 (PostgreSQL mode).
 * Not a substitute for validating against database/schema.sql on real PostgreSQL.
 */
@DataJpaTest
@ActiveProfiles("datajpa")
class UserAndSkillRepositoryTest {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private SkillRepository skillRepository;

	@Test
	void persistsUserWithRoleAndStatusEnums() {
		User user = new User();
		user.setEmail("student@college.edu");
		user.setPasswordHash("$2a$10$placeholderhashvalueforpersistencetest");
		user.setRole(UserRole.STUDENT);
		user.setStatus(UserStatus.ACTIVE);

		User saved = userRepository.saveAndFlush(user);

		assertTrue(saved.getId() != null && saved.getId() > 0);
		assertEquals(UserRole.STUDENT, userRepository.findByEmail("student@college.edu").orElseThrow().getRole());
		assertTrue(userRepository.existsByEmail("student@college.edu"));
	}

	@Test
	void persistsSkillWithUniqueName() {
		Skill skill = new Skill();
		skill.setSkillName("Java");
		skill.setCategory("Programming Language");

		Skill saved = skillRepository.saveAndFlush(skill);

		assertTrue(saved.getId() != null);
		assertEquals("Java", skillRepository.findBySkillName("Java").orElseThrow().getSkillName());
	}
}
