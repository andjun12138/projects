package com.cloud.impl;

import com.cloud.services.ClientOneService;

//@Component
public class ClientOneServiceImpl implements ClientOneService {

    public String getHelloContent() {
        return "service is not available !(feign)";
    }


    public String update(int i,int j) {
        return "service is not available !(feign)";
    }
}
