package com.plec.artistes.security;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.mitre.openid.connect.client.NamedAdminAuthoritiesMapper;
import org.mitre.openid.connect.client.SubjectIssuerGrantedAuthority;
//import org.mitre.openid.connect.client.UserInfoFetcher;
import org.mitre.openid.connect.model.OIDCAuthenticationToken;
import org.mitre.openid.connect.model.UserInfo;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.google.common.base.Strings;
import com.google.common.collect.Lists;

public class CustomOIDCAuthenticationProvider implements AuthenticationProvider{
//	private UserInfoFetcher userInfoFetcher = new UserInfoFetcher();
	private CustomUserInfoFetcher userInfoFetcher = new CustomUserInfoFetcher();

	private GrantedAuthoritiesMapper authoritiesMapper = new NamedAdminAuthoritiesMapper();

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.springframework.security.authentication.AuthenticationProvider#
	 * authenticate(org.springframework.security.core.Authentication)
	 */
	public Authentication authenticate(final Authentication authentication)
			throws AuthenticationException {

		if (!supports(authentication.getClass())) {
			return null;
		}

		if (authentication instanceof OIDCAuthenticationToken) {

			OIDCAuthenticationToken token = (OIDCAuthenticationToken) authentication;

			Collection<SubjectIssuerGrantedAuthority> authorities = Lists.newArrayList(new SubjectIssuerGrantedAuthority(token.getSub(), token.getIssuer()));

			UserInfo userInfo = userInfoFetcher.loadUserInfo(token);

			if (userInfo == null) {
				// TODO: user Info not found -- error?
			} else {
				if (!Strings.isNullOrEmpty(userInfo.getSub()) && !userInfo.getSub().equals(token.getSub())) {
					// the userinfo came back and the user_id fields don't match what was in the id_token
					throw new UsernameNotFoundException("user_id mismatch between id_token and user_info call: " + token.getSub() + " / " + userInfo.getSub());
				}
			}
			
			//set users roles
			Set<GrantedAuthority> grantedAuthorities = new HashSet<GrantedAuthority>();
			grantedAuthorities.addAll(authoritiesMapper.mapAuthorities(authorities));
			//add custom roles
			//call service to determine user's role
			grantedAuthorities.add(new SimpleGrantedAuthority("MY_CUSTOM_ROLE"));
			if ("admin".equals(userInfo.getGivenName())) {
				grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
			}
			
			return new OIDCAuthenticationToken(token.getSub(),
					token.getIssuer(),
					userInfo, grantedAuthorities,
					token.getIdTokenValue(), token.getAccessTokenValue(), token.getRefreshTokenValue());
		}

		return null;
	}

	/**
	 * @param authoritiesMapper
	 */
	public void setAuthoritiesMapper(GrantedAuthoritiesMapper authoritiesMapper) {
		this.authoritiesMapper = authoritiesMapper;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * org.springframework.security.authentication.AuthenticationProvider#supports
	 * (java.lang.Class)
	 */
	public boolean supports(Class<?> authentication) {
		return OIDCAuthenticationToken.class.isAssignableFrom(authentication);
	}
}
