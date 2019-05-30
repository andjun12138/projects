package com.redis.interceptor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Authentication and authorization
 * @author caimb
 * @date Created in 2019-02-16 16:03
 * @modifier
 */
@Component("authInterceptor")
public class AuthInterceptor extends HandlerInterceptorAdapter {
    private static final Logger logger = LoggerFactory.getLogger(AuthInterceptor.class);
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        HttpSession session = request.getSession( false );
        //获取路由
        String url = request.getRequestURI();
        //用户未登录
        if ( session == null ) {
            response.sendRedirect("/login.html");
            return false;
        }
        return true;
    }

}
