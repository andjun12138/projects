package com.cloud.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.ui.Model;
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

    @RequestMapping("/index")
    public String index(Model model) throws UnknownHostException {
        return message;
    }

}
