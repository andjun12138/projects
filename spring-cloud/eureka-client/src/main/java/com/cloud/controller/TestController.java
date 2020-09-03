package com.cloud.controller;

import com.cloud.service.BaseEntityService;
import com.cloud.service.CacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.UnknownHostException;

/**
 * Created by liuxh on 2017/5/31.
 */
@RestController
@RequestMapping(value="/test")
@RefreshScope
public class TestController {
    @Value("${config-server-hello}")
    String message;

    @Autowired
    BaseEntityService baseEntityService;

    @RequestMapping("/index")
    public String index(Model model) throws UnknownHostException {
        return message;
    }
    @RequestMapping("/update")
    public String update(Model model,int total, Integer id) throws UnknownHostException {
        baseEntityService.update(total,id);
        return "success";
    }



    @RequestMapping("/insert")
    public String insert(Model model) throws UnknownHostException {
        baseEntityService.insert();
        return "success";
    }


    @RequestMapping("/select")
    public Object select(Model model,Integer id) throws UnknownHostException {
        return baseEntityService.select(id);
    }

    @Autowired
    public CacheService cacheService;

    @RequestMapping("/removeCache/{id}")
    public String removeCache(Model model, @PathVariable("id") Integer id) throws UnknownHostException {
        cacheService.removeCache(id);
        return "success";
    }

}
