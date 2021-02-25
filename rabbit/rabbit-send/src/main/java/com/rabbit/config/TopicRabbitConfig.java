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
@Configuration
public class TopicRabbitConfig {
    //private static String address = "10.0.20.4:5672";// (RabbitMQ的真实服务器地址) 本机地址,如果多个可以用逗号分隔
    //private static String localHostName = "10.0.20.4";//本机的地址(真实的环境中用代码获取即可)

    private static String address = "localhost:5672";// (RabbitMQ的真实服务器地址) 本机地址,如果多个可以用逗号分隔
    private static String localHostName = "localhost";//本机的地址(真实的环境中用代码获取即可)
    private static String username = "root";
    private static String password = "123456";
    private static String route_key = "%s.rabbitMQ.queue.*";  // 交换器中的routeKey命名规则
    private static String queue_name = "%s.rabbitMQ.queue.%d"; // 项目队列的命名规则
    private static String exchangeName = "amq.topic";//可以通过cmd命令台 rabbitmqctl list_exchanges 查看Exchange;也可以代码创建，这里复用了以前的exchange
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
    //动态创建queue(每个RabbitMQ的服务器地址都有个连接)   queue的命名如 topic 的规则所示
    @Bean
    public String[] Queues() throws IOException {
        String[] queueNames = address.split(",");
        for (int i = 1;i <= queueNames.length;i++){
            String routeKey = String.format(route_key,localHostName);
            String queueName = String.format(queue_name,localHostName,i);
            /*
             queueDeclare方法参数说明:
             第一个参数 queue : 队列名
             第二个参数 durable : 是否持久化(durable:设置为true 表示队列持久化， 反之是非持久化。持久化可以将队列存盘，在服务器重启的时候不会丢失相关信息。
             第三个参数 exclusive :  设置是否排他。为true 则设置队列为排他的。如果一个队列被声明为排他队列，该队列仅对首次声明它的连接可见，并在连接断开时自动删除。
                                这里需要注意三点:排他队列是基于连接( Connection) 可见的，同一个连接的不同信道(Channel)是可以同时访问同一连接创建的排他队列;
                               "首次"是指如果一个连接己经声明了一个排他队列，其他连接是不允许建立同名的排他队列的，这个与普通队列不同:即使该队列是持久化的，
                                一旦连接关闭或者客户端退出，该排他队列都会被自动删除，这种队列适用于一个客户端同时发送和读取消息的应用场景。
             第四个参数 autoDelete : 设置是否自动删除。为true 则设置队列为自动删除。自动删除的前提是:至少有一个消费者连接到这个队列，之后所有与这个队列连接的消费者都断开时，
                                才会自动删除。不能把这个参数错误地理解为:当连接到此队列的所有客户端断开时，这个队列自动删除"，因为生产者客户端创建这个队列，
                                或者没有消费者客户端与这个队列连接时，都不会自动删除这个队列。
             第五个参数 arguments : 设置队列的其他一些参数，如x-rnessage-ttl、x-expires、x-rnax-length、x-rnax-length-bytes、x-dead-letter-exchange、x-deadletter-routing-key, x-rnax-priority等
            */
            /*
            * 作用：创建一个队列
            * */
            connectionFactory().createConnection().createChannel(false).queueDeclare(queueName, true, false, false, null);
             /*
             queueBind方法参数说明:
             第一个参数 queue : 队列名
             第二个参数 exchange : 交换器的名称
             第三个参数 routingKey : 用来绑定队列和交换器的路由键;
             补充:与queueBind相对于的queueUnBind解绑方法的参数一样
             */
            /*
             * 作用：创建队列与交换机绑定,这里因为在for循环里面，所以这个Exchange绑定了多个队列,注意routeKey路由规则来决定流向哪些队列
             * 为什么要绑定呢？因为rabbitMQ不会直接把消息投放到队列中，而是把消息发送到Exchange中，有其路由到一个或多个队列中
             * */
            connectionFactory().createConnection().createChannel(false).queueBind(queueName, exchangeName, routeKey);
            queueNames[i-1] = queueName;
        }
        return queueNames;
    }
    //创建监听器，监听队列
    @Bean
    public SimpleMessageListenerContainer mqMessageContainer(HandleService handleService) throws AmqpException, IOException {
        SimpleMessageListenerContainer container = new SimpleMessageListenerContainer(connectionFactory());
        container.setQueueNames(Queues());
        container.setPrefetchCount(100);//每个消费者获取的最大的消息数量
        container.setConcurrentConsumers(5);//消费者个数
        container.setAcknowledgeMode(AcknowledgeMode.MANUAL);//手工确认
        container.setMessageListener(handleService);//监听处理类
        return container;
    }
}