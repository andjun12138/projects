package com.consumer.config;

import com.common.service.ApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

/**
 * Created by hjf on 2016/8/30.
 */
/*
*服务具体的bean
* */
@Component
public class ApiConfig {
/*    @Value("${app.collection.rootUrl}")
    private String apiRootUrl;
*/
    @Autowired
    SpringIvringReference reference;

    @Bean
    public ApiService getApiService() {
        return reference.referenceService(ApiService.class);
    }
}
