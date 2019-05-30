package com.jsp.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by caimb on 2017/4/23.
 */
@Component
public class AppConfig implements ApplicationListener {
    private static final Logger logger = LoggerFactory.getLogger( AppConfig.class );

    @Autowired
    private ExecutorService executorService;

    private static ExecutorService fixedThreadPool;

    @Bean
    public ExecutorService getExecutorService() {
        if (fixedThreadPool == null) {
            fixedThreadPool = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
        }
        return fixedThreadPool;
    }

    public void onApplicationEvent(ApplicationEvent applicationEvent) {

    }
}
