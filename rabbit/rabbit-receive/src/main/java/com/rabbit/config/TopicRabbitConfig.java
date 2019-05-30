package com.rabbit.config;

import com.rabbit.service.HandleService;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.AcknowledgeMode;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import java.io.IOException;


/*
*   Topic 类型的RabbitMQ 配置
* */
/*
*
* */

@Configuration
public class TopicRabbitConfig {
    private static String address = "10.0.20.4:5672";// (RabbitMQ的真实服务器地址) 本机地址,如果多个可以用逗号分隔
    private static String username = "root";
    private static String password = "123456";
    @Bean
    @Scope("prototype")
    public HandleService handleService(){
        return new HandleService();
    }

    //创建mq连接
    @Bean(name = "connectionFactory")
    public CachingConnectionFactory connectionFactory(){
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
        connectionFactory.setUsername(username);
        connectionFactory.setPassword(password);
        connectionFactory.setVirtualHost("/");
        connectionFactory.setPublisherConfirms(true);
        connectionFactory.setAddresses(address);
        return connectionFactory;
    }
    //创建监听器，监听队列
    @Bean
    public SimpleMessageListenerContainer mqMessageContainer(HandleService handleService) throws AmqpException, IOException {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer(connectionFactory());
        container.setQueueNames(new String[]{"10.0.20.4.rabbitMQ.queue.1"});//与rabbitMQ中创建的队列一样
        //container.setQueueNames(Queues());
        container.setPrefetchCount(100);//每个消费者获取的最大的消息数量
        container.setConcurrentConsumers(5);//消费者个数
        container.setAcknowledgeMode(AcknowledgeMode.MANUAL);//手工确认
        container.setMessageListener(handleService);//监听处理类
        return container;
    }
}