package com.codeinnov8ors.placement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeinnov8ors.placement.entity.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {

	Optional<Company> findByName(String name);

	boolean existsByName(String name);
}
