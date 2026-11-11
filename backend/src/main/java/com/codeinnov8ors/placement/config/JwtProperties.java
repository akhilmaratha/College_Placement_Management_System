package com.codeinnov8ors.placement.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Profile;

@ConfigurationProperties(prefix = "app.jwt")
@Profile("!test")
public class JwtProperties {

	private String secret;
	private long expirationMs = 3_600_000L;
	private String cookieName = "CPMS_AUTH";
	private boolean secureCookie;

	public String getSecret() { return secret; }
	public void setSecret(String secret) { this.secret = secret; }
	public long getExpirationMs() { return expirationMs; }
	public void setExpirationMs(long expirationMs) { this.expirationMs = expirationMs; }
	public String getCookieName() { return cookieName; }
	public void setCookieName(String cookieName) { this.cookieName = cookieName; }
	public boolean isSecureCookie() { return secureCookie; }
	public void setSecureCookie(boolean secureCookie) { this.secureCookie = secureCookie; }
}
