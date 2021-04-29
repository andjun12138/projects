package com.redis.config;

import com.redis.entity.BaseEntity;
import org.springframework.stereotype.Service;

@Service
public class RedisReceiver {

    //第一个监听方法--监听频道doStart
    public void doStart(BaseEntity baseEntity){
        System.out.println(baseEntity);
        System.out.println(baseEntity.getAccount());
    }

    //第二个监听方法--监听频道doInit
    public void doInit(BaseEntity baseEntity){
        System.out.println(baseEntity);
        System.out.println(baseEntity.getAccount());
    }
}