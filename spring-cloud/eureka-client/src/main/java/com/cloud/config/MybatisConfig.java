package com.cloud.config;

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

/**
* @author caimb
* @date Created in 2019-02-17 15:14
* @modifier
 */

@Configuration
@EnableCaching
public class MybatisConfig {

/*    @Bean
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource getDataSource(){
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        return dataSource;
    }
    *//*
     * 这个是要特别注意的地方，seata对数据源做了代理和接管，在每个参与分布式事务的服务中，都要做如下配置：
     * *//*
    @Primary
    @Bean("dataSourceProxy")
    public DataSourceProxy dataSourceProxy(DataSource dataSource){
        return new DataSourceProxy(dataSource);
    }

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSourceProxy dataSourceProxy)throws Exception{
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSourceProxy);
*//*        sqlSessionFactoryBean.setMapperLocations(new PathMatchingResourcePatternResolver()
                .getResources("classpath*:/mapper/*.xml"));*//*
        sqlSessionFactoryBean.setTransactionFactory(new SpringManagedTransactionFactory());
        sqlSessionFactoryBean.setConfigLocation(new ClassPathResource("mybatis-config.xml"));
        return sqlSessionFactoryBean.getObject();
    }*/


    @Bean
    public DataSource getDataSource(){
        DataSource dataSource = new ComboPooledDataSource();
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
            configure.setBasePackage("com.cloud.mapper");
        return configure;
    }

    @Bean(name = "mapperScannerConfigureFactory")
    public MapperScannerConfigurer mapperScannerConfigurerFactory(){
        MapperScannerConfigurer configurer = new MapperScannerConfigurer();
        configurer.setBasePackage("com.cloud.mapper");
        return configurer;
    }


/*
    @Bean
    public GlobalTransactionScanner globalTransactionScanner() {
        GlobalTransactionScanner globalTransactionScanner = new GlobalTransactionScanner("client-system", "my_test_tx_group");
        return globalTransactionScanner;
    }*/



















}
