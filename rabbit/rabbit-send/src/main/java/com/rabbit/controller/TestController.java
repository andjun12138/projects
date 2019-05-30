package com.rabbit.controller;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * Created by liuxh on 2017/5/31.
 */
@Controller
@RequestMapping(value="/test")
public class TestController {

    public static String message = "";

    @Autowired
    private AmqpTemplate amqpTemplate;

    @RequestMapping("/index")
    public String index(Model model) throws UnknownHostException {
        InetAddress address = InetAddress.getLocalHost();//获取的是本地的IP地址 //PC-20140317PXKX/192.168.0.121
        String hostAddress = address.getHostAddress();//192.168.0.121
        model.addAttribute("hostAddress",hostAddress);
        return "view/success";
    }

    @RequestMapping("/send")
    public String send(Model model) throws UnknownHostException{
        InetAddress address = InetAddress.getLocalHost();//获取的是本地的IP地址 //PC-20140317PXKX/192.168.0.121
        String hostAddress = address.getHostAddress();//192.168.0.121;
        return "view/success";
    }

    @RequestMapping("/topic")
    public String topic(Model model){
        for (int i = 0; i < 20;i++) {
            String context = "hello word" + i;
            System.out.println("Sender : " + context);
            this.amqpTemplate.convertAndSend("amq.topic", "10.0.20.4.rabbitMQ.queue.test", context);
        }
        return "view/success";
    }
}
