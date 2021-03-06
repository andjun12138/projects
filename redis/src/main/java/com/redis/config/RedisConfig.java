package com.redis.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;

import java.lang.reflect.Method;

@Configuration
@EnableCaching
public class RedisConfig extends CachingConfigurerSupport {
    //生成key的策略
    @Bean
    public KeyGenerator keyGenerator() {
        return new KeyGenerator() {
            public Object generate(Object target, Method method, Object... params) {
                StringBuilder sb = new StringBuilder();
                sb.append(target.getClass().getName());
                sb.append(method.getName());
                for (Object obj : params) {
                    sb.append(obj.toString());
                }
                return sb.toString();
            }
        };
    }
    //管理缓存
    @Bean
    public CacheManager cacheManager(RedisTemplate redisTemplate) {
        RedisCacheManager rcm = new RedisCacheManager(redisTemplate);
        return rcm;
    }
    //RedisTemplate配置
    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory factory) {
        StringRedisTemplate template = new StringRedisTemplate(factory);
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        template.setValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();
        return template;
    }
    //可以同时加两个消息监听
    @Bean
    RedisMessageListenerContainer container(RedisConnectionFactory connectionFactory,
                                            MessageListenerAdapter messageListenerAdapter,MessageListenerAdapter initListenerAdapter) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        // 以下为修改默认的序列化方式，网上大多数消息发布订阅都是String类型,但是实际中数据类型肯定不止String类型
        Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<Object>(
                Object.class);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        objectMapper.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(objectMapper);

        // 可以添加多个 messageListener，配置不同的交换机
        // 针对每一个消息处理可以设置不同的序列化方式--不可或缺，不然会接收不到消息
        messageListenerAdapter.setSerializer(jackson2JsonRedisSerializer);
        // 消息监听容器增加监听的消息，第一个参数是监听适配器，第2个参数是监听的频道。
        container.addMessageListener(messageListenerAdapter, new PatternTopic("channel:doStart"));
        // 针对每一个消息处理可以设置不同的序列化方式
        initListenerAdapter.setSerializer(jackson2JsonRedisSerializer);
        // 消息监听容器增加监听的消息，第一个参数是监听适配器，第2个参数是监听的频道。
        container.addMessageListener(initListenerAdapter, new PatternTopic("channel:doInit"));
        return container;
    }
    @Bean
    MessageListenerAdapter messageListenerAdapter(RedisReceiver receiver) {
        System.out.println("消息适配器1");
        //doStart是receive中的接收方法
        return new MessageListenerAdapter(receiver, "doStart");
    }
    @Bean
    MessageListenerAdapter initListenerAdapter(RedisReceiver receiver) {
        System.out.println("消息适配器1");
        //doInit是receive中的接收方法
        return new MessageListenerAdapter(receiver, "doInit");
    }

}


