package com.kafka.service;

import com.rabbitmq.client.Channel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.core.ChannelAwareMessageListener;
import org.springframework.stereotype.Service;

@Service
public class HandleService implements ChannelAwareMessageListener{
    private static final Logger logger = LoggerFactory.getLogger(HandleService.class);

    public void onMessage(Message message, Channel channel) throws Exception {
        byte[] body = message.getBody();
        logger.info("接收的消息:"+new String(body));
        //TODO 消费失败应该怎么做? 成功后怎么做？ 出异常了怎么做？
        channel.basicAck(message.getMessageProperties().getDeliveryTag(),false);
    }
}
