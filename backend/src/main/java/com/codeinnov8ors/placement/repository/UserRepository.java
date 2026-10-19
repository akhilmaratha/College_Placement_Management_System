package com.codeinnov8ors.placement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeinnov8ors.placement.entity.User;
import com.codeinnov8ors.placement.entity.enums.UserRole;
import com.codeinnov8ors.placement.entity.enums.UserStatus;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);

	long countByRoleAndStatus(UserRole role, UserStatus status);
}
