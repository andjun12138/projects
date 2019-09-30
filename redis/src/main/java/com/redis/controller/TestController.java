package com.redis.controller;

import com.redis.service.BaseEntityService;
import com.redis.service.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * Created by liuxh on 2017/5/31.
 */
@Controller
@Scope("prototype")
@RequestMapping(value="/test")
public class TestController {
    @Autowired
    private RedisService redisService;
    @Autowired
    private BaseEntityService baseEntityService;


    @RequestMapping("/index")
    public String index(Model model) throws UnknownHostException {
        System.out.println(this);
        InetAddress address = InetAddress.getLocalHost();//获取的是本地的IP地址 //PC-20140317PXKX/192.168.0.121
        String hostAddress = address.getHostAddress();//192.168.0.121
        model.addAttribute("hostAddress",hostAddress);
        return "common";
    }

    @RequestMapping("/test")
    @ResponseBody
    public Object test(){
        String result = "hello";
        redisService.set("session","world");
        result = result + " " + redisService.get("session");
        return result;
    }

    @RequestMapping("/result")
    public String result(Model model) throws UnknownHostException {
        String result = "hello";
        //result = result + " " + redisService.get("session");
        model.addAttribute("result",result);
        return "success";
    }
}
