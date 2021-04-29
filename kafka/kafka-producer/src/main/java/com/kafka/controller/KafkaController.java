package com.kafka.controller;

import com.kafka.service.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by liuxh on 2017/5/31.
 */
@Controller
@RequestMapping(value="/kafka")
public class KafkaController {

    @Autowired
    private Product product;


    @RequestMapping("/send")
    public String topic(Model model){


        for (int i = 0; i < 20;i++) {
            String context = "hello word" + i;
            System.out.println("Sender : " + context);
            //this.amqpTemplate.convertAndSend("amq.topic", "10.0.20.4.rabbitMQ.queue.test", context);

            ListenableFuture<SendResult> listenableFuture;
            if (i%2 ==0 ){
                listenableFuture = product.send("message",context);
            }else {
                listenableFuture = product.send("message",context);
            }

            //生产者生产消息的回调函数
            listenableFuture.addCallback(new ListenableFutureCallback<SendResult>() {
                public void onFailure(Throwable throwable) {
                    System.out.println("调用失败");
                }

                public void onSuccess(SendResult s) {
                    System.out.println("调用成功：" + s);
                }
            });
        }
        return "view/success";
    }

}
