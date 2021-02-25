package com.security.config;

import com.security.filter.CaptchaAuthenticationFilter;
import com.security.handler.MyAccessDeniedHandler;
import com.security.service.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter{

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private MyAccessDeniedHandler myAccessDeniedHandler;

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                //登录处理
                .formLogin() //表单方式，或httpBasic
                .loginPage("/login.html") // 登录页面
                .loginProcessingUrl("/form")  // 表单登录提交的action(前端登录的链接)
                .defaultSuccessUrl("/index.html") //默认登录成功的路由
                .failureUrl("/error.html") // 失败后跳转页面
                .permitAll()
                .and();

        //添加过滤器,/from与上面的表单登录提交的action一致  过滤器校验在UsernamePasswordAuthenticationFilter之前
        httpSecurity.addFilterBefore(new CaptchaAuthenticationFilter("/form"), UsernamePasswordAuthenticationFilter.class);

        httpSecurity.csrf().disable() //禁用跨站csrf攻击防御
                .authorizeRequests()
                .antMatchers("/css/**", "/error404","/**.jpg").permitAll() // 不需要登录就可以访问的路由配置
                .anyRequest().access("@rbacService.hasPermission(request,authentication)") //rbac 自定义权限路由(从数据库中获取权限配置 具体的权限配置看数据库内容)
                .and()
                .exceptionHandling().accessDeniedHandler(myAccessDeniedHandler) // 自定义权限不足的配置
        ;
    }
    @Autowired
    private MyAuthenticationProvider provider;  //注入我们自己的AuthenticationProvider


    /*
    * 自定义身份认证
    * */
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
/*        auth.userDetailsService(myUserDetailsService)
                .passwordEncoder(passwordEncoder);*/
        auth.authenticationProvider(provider);
    }
}
