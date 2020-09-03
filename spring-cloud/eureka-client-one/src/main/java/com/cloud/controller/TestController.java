package com.cloud.controller;

import com.cloud.service.BaseEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.UnknownHostException;
import java.util.BitSet;

/**
 * Created by liuxh on 2017/5/31.
 */
@RestController
@RequestMapping(value="/test")
@RefreshScope
public class TestController {

    @Autowired
    BaseEntityService baseEntityService;

    @RequestMapping("/update")
    public String update(Model model,int total, Integer id) throws UnknownHostException {
        baseEntityService.update(total,id);
        return "success";
    }

    public void test (){
        BitSet bitSet = new BitSet();
        bitSet.size();
    }

}
