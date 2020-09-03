package com.flowable.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpSession;

/**
 * @author system
 * @date Created in 2018/6/12 19:09
 * @modifier
 */
@Controller
@RequestMapping({"/","*/"})//controller.base.path一般为entity.typeAlias
public class HomeController {


    @RequestMapping(value = "/login.html", method = RequestMethod.GET)
    public String login() throws Exception {
        System.out.println(this.hashCode());
        return "login";
    }

    /**
     * 云通关统计分析
     * @param model
     * @param session
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "iCustoms.html", method = RequestMethod.GET)
    public String iCustoms(Model model, HttpSession session) throws Exception {
        return "admin/statistical/iCustoms";
    }
}