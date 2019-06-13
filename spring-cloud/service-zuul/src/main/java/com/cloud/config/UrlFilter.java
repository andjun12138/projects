package com.cloud.config;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

@Component
public class UrlFilter extends ZuulFilter{
    @Override
    public String filterType() {
        /*
        * pre：路由之前
        * routing：路由之时
        * post： 路由之后
        * error：发送错误调用
        * */
        return "pre";
    }

    @Override
    public int filterOrder() {
        /*
         * pre：路由之前
         * routing：路由之时
         * post： 路由之后
         * error：发送错误调用
         * */
        return 0;
    }

    //这里可以写逻辑判断，是否要过滤，本文true,永远过滤。
    public boolean shouldFilter() {
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();
        System.out.println(request.getRequestURL());
        return false;
    }
    //过滤器的具体逻辑，这里只是将请求的URL简单些到日志中
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();
        String message = String.format("%s >>> %s", request.getMethod(), request.getRequestURL().toString());
        return message;
    }
}
