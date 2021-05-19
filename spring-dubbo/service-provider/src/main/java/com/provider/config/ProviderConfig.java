
package com.provider.config;
import com.alibaba.dubbo.config.ApplicationConfig;
import com.alibaba.dubbo.config.ProtocolConfig;
import com.alibaba.dubbo.config.RegistryConfig;
import com.alibaba.dubbo.config.ServiceConfig;
import com.common.service.ApiService;
import com.provider.service.ApiServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Configuration;


/**
 * Created by caimb on 2017/4/23.
 */

/*
* 服务提供者发布服务。通过使用DubboConfig配置中的bean来发布服务
* */
@Configuration
public class ProviderConfig implements ApplicationListener {


    @Autowired
    private ApplicationConfig application;

    @Autowired
    private RegistryConfig registry;

    @Autowired
    private ProtocolConfig protocol;


    public void onApplicationEvent(ApplicationEvent event) {
       // 服务实现
        ApiService apiService = new ApiServiceImpl();
        //发布服务
        System.out.println(application+"'''''''''''''''''''''''''''''''''''''''''''''''''''''");
        ServiceConfig<ApiService> service = new ServiceConfig<ApiService>(); // 此实例很重，封装了与注册中心的连接，请自行缓存，否则可能造成内存和连接泄漏
        service.setApplication(application);
        service.setRegistry(registry); // 多个注册中心可以用setRegistries()
        service.setProtocol(protocol); // 多个协议可以用setProtocols()
        service.setInterface(ApiService.class);
        service.setRef(apiService);
        service.setVersion("2.0.2");
        // 暴露及注册服务
        service.export();

    }

}

