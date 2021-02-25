package com.security.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;

/**
 * Created by liuxh on 2017/12/6.
 */
@Controller
@RequestMapping(value = {"/","*/"})
public class LoginController {
    @Resource
    private PasswordEncoder passwordEncoder;

    @RequestMapping(value = {"/login.html"}, method = RequestMethod.GET)
    public String toLogin(Model model) throws Exception {
        return "login";
    }

/*    @RequestMapping(value = {"/login"}, method = RequestMethod.POST)
    public String index(Model model,String username,String password) throws Exception {
        return "index";
    }*/

    @RequestMapping(value = {"/index.html"}, method = RequestMethod.GET)
    public String toIndex(Model model) throws Exception {
        model.addAttribute("result","index");
        return "index";
    }
    @RequestMapping(value = {"/services.html"}, method = RequestMethod.GET)
    public String toServices(Model model) throws Exception {
        return "services";
    }
    @RequestMapping(value = {"/services1.html"}, method = RequestMethod.GET)
    public String toServices1(Model model) throws Exception {
        return "services1";
    }
    @RequestMapping(value = {"/services2.html"}, method = RequestMethod.GET)
    public String toServices2(Model model) throws Exception {
        return "services2";
    }
    @RequestMapping(value = {"/services3.html"}, method = RequestMethod.GET)
    public String toServices3(Model model) throws Exception {
        return "services3";
    }
    @RequestMapping(value = {"/services4.html"}, method = RequestMethod.GET)
    public String toServices4(Model model) throws Exception {
        return "services4";
    }
}
