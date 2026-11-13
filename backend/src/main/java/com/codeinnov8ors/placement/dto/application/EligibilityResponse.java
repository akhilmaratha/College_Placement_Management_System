package com.codeinnov8ors.placement.dto.application;

import java.util.List;

public record EligibilityResponse(Long jobId, boolean eligible, List<String> reasons) {}
