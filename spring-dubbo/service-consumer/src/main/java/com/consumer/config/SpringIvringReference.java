package com.consumer.config;

import com.alibaba.dubbo.config.ApplicationConfig;
import com.alibaba.dubbo.config.ReferenceConfig;
import com.alibaba.dubbo.config.RegistryConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * 最终获取消费者的入口
 * Created by hjf on 2017/4/13.
 */
/*
*运用Apiconfig中的基础配置，与注册中心建立连接并且读取到服务。
* */
@Component
public class SpringIvringReference {
    private static ConcurrentMap<Class<?>, ReferenceConfig> referenceMap = new ConcurrentHashMap();

    @Autowired
    private ApplicationConfig application;

    @Autowired
    private RegistryConfig registry;


    /**
     * 简单版，不通过配置获取
     * 获取引用（客户端）
     * @param type
     * @param <T>
     * @return
     */
    @Deprecated
    public  <T> T referenceService(Class<T> type) {
        if (referenceMap.containsKey(type)) {
            ReferenceConfig reference = referenceMap.get(type);
            return (T) reference.get();
        }else{
            synchronized (type) {
                if (referenceMap.containsKey(type)) {
                    ReferenceConfig reference = referenceMap.get(type);
                    return (T) reference.get();
                }
                // 此实例很重，封装了与注册中心的连接以及与提供者的连接，请自行缓存，否则可能造成内存和连接泄漏
                ReferenceConfig<T> reference = new ReferenceConfig();
                reference.setApplication(application);
                reference.setRegistry(registry); // 多个注册中心可以用setRegistries()
                reference.setInterface(type);
                reference.setVersion("2.0.2");
                referenceMap.put(type, reference);
                return reference.get();
            }
        }
    }
}
