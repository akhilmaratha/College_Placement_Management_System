package com.codeinnov8ors.placement.dto.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;

public record AuthResponse(@JsonIgnore String token, long expiresIn, AuthenticatedUser user) {
}
