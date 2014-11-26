package com.plec.artistes.controller;

import java.security.Principal;
import java.util.Locale;

import org.apache.log4j.Logger;
import org.mitre.openid.connect.client.OIDCAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.plec.artistes.security.CustomOIDCAuthenticationFilter;

@Controller
@RequestMapping(value = "/admin/")
public class AdminController {
	private static Logger LOGGER = Logger.getLogger(AdminController.class);

	// filter reference so we can get class names and things like that.
	@Autowired
    private CustomOIDCAuthenticationFilter filter;
	
	@RequestMapping(value = "/admin", method = RequestMethod.GET)
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public String roleAdmin() {
		LOGGER.info("Acces to admin function");
		return "admin/admin";
	}
	
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home(Locale locale, Model model, Principal p) {

		model.addAttribute("issuerServiceClass", filter.getIssuerService().getClass().getSimpleName());
		model.addAttribute("serverConfigurationServiceClass", filter.getServerConfigurationService().getClass().getSimpleName());
		model.addAttribute("clientConfigurationServiceClass", filter.getClientConfigurationService().getClass().getSimpleName());
		model.addAttribute("authRequestOptionsServiceClass", filter.getAuthRequestOptionsService().getClass().getSimpleName());
		model.addAttribute("authRequestUriBuilderClass", filter.getAuthRequestUrlBuilder().getClass().getSimpleName());
		
		return "admin/home";
	}
	
	@RequestMapping("/user")
	@PreAuthorize("hasRole('ROLE_USER')")
	public String user(Principal p) {
		return "admin/user";
	}
	
	@RequestMapping("/login")
	public String login(Principal p) {
		return "admin/login";
	}

	/**
	 * @param filter the filter to set
	 */
	public void setFilter(CustomOIDCAuthenticationFilter filter) {
		this.filter = filter;
	}

}
