package com.consumer.service;

import com.common.service.ApiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
@Component
public class HandleService {
    private static final Logger logger = LoggerFactory.getLogger(HandleService.class);

    @Autowired
    private ApiService apiService;

    public String apiTest(String params){
        return apiService.apiTest(params);
    }

}
