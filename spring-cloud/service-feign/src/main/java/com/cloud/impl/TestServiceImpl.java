package com.cloud.impl;

import com.cloud.services.TestService;

public class TestServiceImpl implements TestService {

    public String getHelloContent() {
        return "service is not available !(feign)";    }
}
