package com.provider.service;

import com.common.service.ApiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ApiServiceImpl implements ApiService {
    private static final Logger logger = LoggerFactory.getLogger(ApiServiceImpl.class);

    public String apiTest(String params) {
        return params + " world ! ";
    }
}
