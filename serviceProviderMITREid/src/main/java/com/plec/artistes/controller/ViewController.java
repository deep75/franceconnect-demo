package com.plec.artistes.controller;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(value = "/view/")

public class ViewController {
	private static Logger LOGGER = Logger.getLogger(ViewController.class);

	@RequestMapping(value = "", method = RequestMethod.GET)
	public  String init() {
		return "view/init";
	}
}
