package com.cloud;

import io.seata.spring.annotation.datasource.EnableAutoDataSourceProxy;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;

@EnableEurekaClient
@EnableDiscoveryClient
//因为使用了mybatis的starter所以需要排除DataSourceAutoConfiguration，不然会产生循环依赖
//@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@SpringBootApplication
@EnableFeignClients
@MapperScan("com.cloud.mapper")
@EnableAutoDataSourceProxy
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}


/*	@Bean
	@LoadBalanced
	public GlobalTransactionScanner setGlobalTransactionScanner(){
		return new GlobalTransactionScanner("service-feign","my_test_tx_group");
	}*/
}
