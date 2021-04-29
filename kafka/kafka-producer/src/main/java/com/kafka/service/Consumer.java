package com.kafka.service;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.PartitionOffset;
import org.springframework.kafka.annotation.TopicPartition;
import org.springframework.stereotype.Component;

import java.util.Optional;


@Component
public class Consumer {

    //两个消费者都用@KafkaListener(topics = "message")的话只有一个消费者会消费消息
    //两个消费者都用  @KafkaListener(id = "Consumer2",topicPartitions = {
    //            @TopicPartition(topic = "message", partitions = "0"),
    //    })的话两个消费者都会消费所有的消息

    //@KafkaListener(topics = "message")
    @KafkaListener(id = "Consumer1",topicPartitions = {
            @TopicPartition(topic = "message", partitions = "0"),
    })
    public void consumer1(ConsumerRecord consumerRecord){
        Optional<Object> kafkaMassage = Optional.ofNullable(consumerRecord.value());
        if(kafkaMassage.isPresent()){
            Object o = kafkaMassage.get();
            System.out.println("consumer-partitions"+o);
        }
    }

    //@KafkaListener(topics = "message")
    @KafkaListener(id = "Consumer2",topicPartitions = {
            @TopicPartition(topic = "message", partitions = "0"),
    })
    public void consumer2(ConsumerRecord consumerRecord){
        Optional<Object> kafkaMassage = Optional.ofNullable(consumerRecord.value());
        if(kafkaMassage.isPresent()){
            Object o = kafkaMassage.get();
            System.out.println("consumer"+o);
        }
    }
}