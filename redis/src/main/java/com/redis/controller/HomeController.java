package com.redis.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

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
}