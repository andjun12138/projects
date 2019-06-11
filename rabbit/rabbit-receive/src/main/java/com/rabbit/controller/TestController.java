package com.rabbit.controller;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Date;

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
        String context = "hello too " + new Date();
        System.out.println("Sender : " + context);
        this.amqpTemplate.convertAndSend("amq.topic", "10.0.20.6.rabbitMQ.queue.test", context);
        System.out.println(message);
        return "view/success";
    }


    public void minMoney(){
        //endTime = "2019-01-16"
        float total = 0;
        float now = 20900+2200+300+350-15100-2000;
        float debt = 10000;
        float wage = 9300 * 2 + 1750 * 6 + 9300*6;
        float bonus = 3000 + 8000;

        float life = 2000*8;
        float entertainment = 500 * 8;
        float home = 1000 * 8;
        float love = 500*8;
        float wish = 85000;

        total = total + debt +  now + wage + bonus - (life + entertainment + home + love + wish);
        System.out.println(total);
    }

    public void maxMoney(){
        //endTime = "2019-01-16"
        float total = 0;
        float now = 20900+2200+300+350-15100;
        float debt = 10000;
        float wage = 9312 * 2 + 1850 * 6 + 9312*6;
        float bonus = 5000 + 8400;

        float life = 1900*8;
        float entertainment = 300 * 8;
        float home = 1000 * 7;
        float love = 400*8;
        float wish = 85000;

        total = total + debt +  now + wage + bonus - (life + entertainment + home + love + wish);
        System.out.println(total);
    }

    public void cal(){
        minMoney();
        System.out.println("---");
        maxMoney();
    }
}
