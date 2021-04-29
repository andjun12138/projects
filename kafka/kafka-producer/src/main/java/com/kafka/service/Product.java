package com.kafka.service;

import com.alibaba.fastjson.JSON;
import com.kafka.entity.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;
import org.springframework.util.concurrent.ListenableFuture;

@Component
public class Product {
      @Autowired
      private KafkaTemplate kafkaTemplate;

      public ListenableFuture<SendResult> send(String topic, String content){
            Message message = new Message();
            message.setUuid("1234");
            message.setTitle("test");
            message.setContent(content);
            //设置主题和其分区
            return kafkaTemplate.send(topic,0, null,JSON.toJSONString(message));
      }
}