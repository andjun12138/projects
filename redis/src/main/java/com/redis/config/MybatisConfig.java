package com.redis.config;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.mapper.MapperScannerConfigurer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
* @author caimb
* @date Created in 2019-02-17 15:14
* @modifier
 */

@Configuration
@EnableCaching
public class MybatisConfig {

    @Bean(name = "dataSource")
    public DataSource getDataSource(){
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        return dataSource;
    }

    @Bean(name = "sqlSessionFactory")
    public SqlSessionFactory getSqlSessionFactory(DataSource dataSource) throws Exception{
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        factoryBean.setConfigLocation(new ClassPathResource("mybatis-config.xml"));
        return factoryBean.getObject();
    }

    @Bean
    public DataSourceTransactionManager makeDataSourceTransactionManager(DataSource dataSource) {
        DataSourceTransactionManager manager = new DataSourceTransactionManager();
        manager.setDataSource(dataSource);
        return manager;
    }

    @Bean(name = "mapperScannerConfigure")
    public MapperScannerConfigurer mapperScannerConfigurer(){
        MapperScannerConfigurer configure = new MapperScannerConfigurer();
        //configure.setBasePackage("com.github.heaweavy.common.components.datasource.admin.mapper; com.github.heaweavy.common.components.datasource.school.mapper");
            configure.setBasePackage("com.redis.mapper");
        return configure;
    }

    @Bean(name = "mapperScannerConfigureFactory")
    public MapperScannerConfigurer mapperScannerConfigurerFactory(){
        MapperScannerConfigurer configurer = new MapperScannerConfigurer();
        configurer.setBasePackage("com.redis.mapper");
        return configurer;
    }

    public void testDecMoneyStatistical() throws Exception{
        String startTime = "2017";
        String endTime = "2019";
        int type = 1;
        List<Map<String,Object>> res = new ArrayList<>();
        System.out.println(res);
    }
























}
