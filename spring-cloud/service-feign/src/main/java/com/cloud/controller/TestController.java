package com.cloud.controller;

import com.cloud.service.BaseEntityService;
import com.cloud.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.UnknownHostException;

/**
 * Created by liuxh on 2017/5/31.
 */
@RestController
@RequestMapping(value="/test")
public class TestController {

    @Autowired
    public ClientService clientService;

    @Autowired
    public BaseEntityService baseEntityService;

    @RequestMapping("/index")
    public String index(Model model) throws UnknownHostException {
        return clientService.getHelloContent();
    }


    @RequestMapping("/select/{count}/{back}")
    @ResponseBody
    public String select(Model model, @PathVariable("count") int count,@PathVariable("back") String back) throws UnknownHostException {
        return baseEntityService.selectById("base_entity",1,count,back);
    }


    @RequestMapping("/get/{id}")
    @ResponseBody
    public String selectEntity(Model model,@PathVariable("id") int id) throws UnknownHostException {
        return baseEntityService.selectEntity(id);
    }

}
