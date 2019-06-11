package com.cloud.services;

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

    public String getHelloContent(){
        return restTemplate.getForObject("http://eureka-client/test/index",String.class);
    }
}
