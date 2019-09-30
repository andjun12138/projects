package com.mongodb.config;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.WriteConcern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;
import org.springframework.data.mongodb.core.convert.DefaultDbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

import java.net.UnknownHostException;

/**
 * Created by hjf on 2017/12/6.
 */
@Configuration
public class MongoConfig {
    @Value("${spring.data.mongodb.uri}")
    private String MONGO_URI;

    @Bean
    public MongoMappingContext mongoMappingContext() {
        MongoMappingContext mappingContext = new MongoMappingContext();
        return mappingContext;
    }



    // ==================== 连接到 mongodb1 服务器 ======================================

    @Bean //使用自定义的typeMapper去除写入mongodb时的“_class”字段
    public MappingMongoConverter mappingMongoConverter() throws Exception {
        DefaultDbRefResolver dbRefResolver = new DefaultDbRefResolver(this.dbFactory());
        MappingMongoConverter converter = new MappingMongoConverter(dbRefResolver, this.mongoMappingContext());
        converter.setTypeMapper(new DefaultMongoTypeMapper(null));
        return converter;
    }


    @Bean
    public MongoClient mongoClient(){
        MongoClientURI uri = new MongoClientURI(MONGO_URI);
        MongoClient mongoClient = new MongoClient(uri);
        return  mongoClient;
    }

    @Bean
    @Primary
    public MongoDbFactory dbFactory() throws UnknownHostException {
        return new SimpleMongoDbFactory(new MongoClientURI(MONGO_URI));
    }

    @Bean
    @Primary MongoTemplate mongoTemplate2() throws Exception{
        MongoTemplate mongoTemplate = new MongoTemplate(this.dbFactory(),this.mappingMongoConverter());
        mongoTemplate.setWriteConcern(WriteConcern.MAJORITY);
        return mongoTemplate;
    }

    @Bean
    @Primary
    public MongoTemplate mongoTemplate() throws Exception {
        MongoTemplate mongoTemplate = new MongoTemplate(this.dbFactory(), this.mappingMongoConverter());
        mongoTemplate.setWriteConcern(WriteConcern.MAJORITY);//配置视图是时不能没有
        return mongoTemplate;
    }

}
