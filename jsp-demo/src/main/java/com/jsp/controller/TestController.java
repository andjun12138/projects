package com.jsp.controller;

import com.jsp.mapper.DemandMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Map;
import java.util.concurrent.ExecutorService;

/**
 * Created by liuxh on 2017/5/31.
 */
@Controller
@RequestMapping(value="/test")
public class TestController {

    @Autowired
    private DemandMapper demandMapper;

    @Autowired
    private ExecutorService executorService;

    @RequestMapping("/index")
    public String index(Model model) throws UnknownHostException {
        InetAddress address = InetAddress.getLocalHost();//获取的是本地的IP地址 //PC-20140317PXKX/192.168.0.121
        String hostAddress = address.getHostAddress();//192.168.0.121
        model.addAttribute("hostAddress",hostAddress);
        System.out.println(executorService);
        return "view/success";
    }

    @RequestMapping("/test")
    public String test(Model model) throws UnknownHostException {
        Map<String,Object> map = demandMapper.getByIdForMap(1);
        model.addAttribute("hostAddress",map);
        return "view/success";
    }
}
