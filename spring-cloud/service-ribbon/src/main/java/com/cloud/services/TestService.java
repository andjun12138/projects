package com.cloud.services;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TestService{
    private static final Logger logger = LoggerFactory.getLogger(TestService.class);


    @Autowired
    public RestTemplate restTemplate;

    @HystrixCommand(fallbackMethod = "getHelloContentFailure")
    public String getHelloContent(){
        return restTemplate.getForObject("http://eureka-client/test/index",String.class);
    }

    public String getHelloContentFailure(){
        return "service is not available !(ribbon)";
    }
}
