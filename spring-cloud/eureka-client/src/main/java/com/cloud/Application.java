package com.cloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@EnableEurekaClient
@SpringBootApplication
@Controller("test")
public class Application{

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}


	@RequestMapping(value = "/test", method = RequestMethod.GET)
	@ResponseBody
	public String cancelRecommended(@RequestBody List<Long> ids) throws Exception {
		return "hello world!";
	}


}
