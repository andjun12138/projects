package com.consumer.config;/*

package com.example.dubbo.config;


import com.alibaba.dubbo.config.ApplicationConfig;
import com.alibaba.dubbo.config.ReferenceConfig;
import com.alibaba.dubbo.config.RegistryConfig;
import com.example.dubbo.DemoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Configuration;


*/
/**
 * Created by hjf on 2017/4/23.
 *//*


@Configuration
public class ConsumerConfig implements ApplicationListener {

    @Autowired
    private ApplicationConfig application;

    @Autowired
    private RegistryConfig registry;

    @Override
    public void onApplicationEvent(ApplicationEvent event) {
        // 引用远程服务
        ReferenceConfig<DemoService> reference = new ReferenceConfig<DemoService>(); // 此实例很重，封装了与注册中心的连接以及与提供者的连接，请自行缓存，否则可能造成内存和连接泄漏
        reference.setApplication(application);
        reference.setRegistry(registry); // 多个注册中心可以用setRegistries()
        reference.setInterface(DemoService.class);
        reference.setVersion("1.0.0");
        DemoService demoService = reference.get();
        System.out.println(demoService+":::::::::::::");
    }

}
*/

