package com.cloud.services;

import com.cloud.impl.TestServiceImpl;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;

@FeignClient(value="eureka-client",fallback = TestServiceImpl.class)
public interface TestService{
    @RequestMapping(value = "/test/index")
    String getHelloContent();

/*
    @RequestMapping(value = "/test/{index}")
    void testParam(@PathVariable("index") String index, @RequestParam("indexName") String indexName);*/

}
