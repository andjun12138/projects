package com.consumer.controller;

import com.consumer.service.HandleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by liuxh on 2017/5/31.
 */
@Controller
@RequestMapping(value="/test")
public class TestController {

    @Autowired
    private HandleService handleService;

    @RequestMapping("/api")
    public String apiTest(){
        return "说 ："+handleService.apiTest("hello ");
    }

}
