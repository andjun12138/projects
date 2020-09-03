package com.cloud.impl;

import com.cloud.services.ClientService;

//@Component
public class ClientServiceImpl implements ClientService {

    public String getHelloContent() {
        return "service is not available !(feign)";
    }


    public String update(int i,int j) {
        return "service is not available !(feign)";
    }

    public String select(int i) {
        return "service is not available !(feign)";
    }
}
