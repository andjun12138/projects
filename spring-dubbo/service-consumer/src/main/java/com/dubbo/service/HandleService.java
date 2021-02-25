package com.dubbo.service;

import com.alibaba.dubbo.config.annotation.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
@Component
public class HandleService {
    private static final Logger logger = LoggerFactory.getLogger(HandleService.class);

    @Reference
    private ApiService apiService;

    public String apiTest(String params){
        return apiService.apiTest(params);
    }

}
