package com.redis.config;

import com.redis.interceptor.AuthInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;


/**
 * @author caimb
 * @date Created in 2018/5/15 11:41
 * @modifier
 */

@Configuration
@ControllerAdvice
//@EnableWebMvc   //加上这行会关闭spring boot默认的mvc配置 see boot chapter 26.1.1
public class MvcConfig extends WebMvcConfigurerAdapter {
//    private static Logger logger = LoggerFactory.getLogger( ExceptionHandler.class );

    @Autowired
    private AuthInterceptor authInterceptor;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry){
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");

        super.addResourceHandlers(registry);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor).addPathPatterns("/**")
                //静态文件
                .excludePathPatterns(new String[]{"/static/**","/error/**"})
                .excludePathPatterns(new String[]{"/test/result"})
                .excludePathPatterns(new String[]{"/login.html"});
        super.addInterceptors(registry);
    }
}
