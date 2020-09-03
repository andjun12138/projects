package com.cloud.services;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(value="eureka-client-one")
public interface ClientOneService {
    @RequestMapping(value = "/test/index")
    String getHelloContent();


    @RequestMapping(value = "/test/update")
    String update(@RequestParam("total") int total, @RequestParam("id") int id);
/*
    @RequestMapping(value = "/test/{index}")
    void testParam(@PathVariable("index") String index, @RequestParam("indexName") String indexName);*/
}
