package com.jsp.controller;

import com.jsp.BaseEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.concurrent.ExecutorService;

/**
 * Created by liuxh on 2017/5/31.
 */
@Controller
@RequestMapping(value="/test")
public class TestController {
    @Autowired
    private BaseEntityService baseEntityService;
    @Autowired
    private ExecutorService executorService;

    @RequestMapping("/index")
    public String index() {
        return "/view/success";
    }


}
