package com.flowable.controller;

import com.flowable.service.BaseEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 * Created by liuxh on 2017/5/31.
 */
@Controller
@Scope("prototype")
@RequestMapping(value="/cost")
public class CostController {
    @Autowired
    private BaseEntityService baseEntityService;

    @RequestMapping("/cal/{tableName}")
    public String cal(@PathVariable("tableName") String tableName,Model model){
        model.addAttribute("tableName",tableName);
        return "index";
    }

    @RequestMapping("/getRecords")
    @ResponseBody
    public Object getRecords(@RequestBody Map<String,Object> params){
        String tableName = (String) params.get("tableName");
        String type = (String) params.get("type");
        Integer finalType = null;
        if ("bug".equals(type)){
            finalType = 0;
        }else if ("sale".equals(type)){
            finalType = 1;
        }
        String times = (String) params.get("times");
        Map<String,Object> result = baseEntityService.baseCal(tableName,finalType,times);
        return result;
    }
}
