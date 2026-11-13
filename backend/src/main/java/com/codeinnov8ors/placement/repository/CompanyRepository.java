package com.codeinnov8ors.placement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.codeinnov8ors.placement.entity.Company;

public interface CompanyRepository extends JpaRepository<Company, Long>, JpaSpecificationExecutor<Company> {

	Optional<Company> findByName(String name);

	boolean existsByName(String name);
	long countByVerificationStatus(com.codeinnov8ors.placement.entity.enums.CompanyVerificationStatus status);
}
