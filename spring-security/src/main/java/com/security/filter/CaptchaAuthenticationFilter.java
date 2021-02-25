package com.security.filter;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CaptchaAuthenticationFilter extends AbstractAuthenticationProcessingFilter{

    private String processUrl;

    public CaptchaAuthenticationFilter(String defaultFilterProcessesUrl) {
        super(defaultFilterProcessesUrl);
        this.processUrl = defaultFilterProcessesUrl;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        System.out.println(req.getServletPath());
        //当路由是登录路由时才验证
        if (processUrl.equals(req.getServletPath())) {
            Object expect = req.getSession().getAttribute("code");//这里放在session里面的code参数名称有点简单了,可以根据实际情况修改,这里只是做案例演示
            String code = req.getParameter("code");
            expect="123456";
            //简单验证code
            if (code == null || !code.equals(expect)){
                throw new BadCredentialsException("验证码错误");
            }
        }
        chain.doFilter(request, response);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse)
            throws AuthenticationException {
        return null;
    }

}
