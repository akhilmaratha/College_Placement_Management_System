package com.codeinnov8ors.placement.dto.company;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CompanyRequest(
		@NotBlank @Size(max = 200) String name,
		@Size(max = 255) @Pattern(regexp = "^$|https?://.+", message = "must be a valid http(s) URL") String websiteUrl,
		@NotBlank @Size(max = 100) String industrySector,
		@NotBlank @Size(max = 150) String location,
		@Size(max = 10000) String description,
		@NotBlank @Email @Size(max = 255) String contactEmail,
		@Pattern(regexp = "^$|[+]?[0-9 ()-]{7,30}$", message = "must be a valid phone number") String contactPhone,
		@Size(max = 500) @Pattern(regexp = "^$|https?://.+", message = "must be a valid http(s) URL") String logoUrl) {}
