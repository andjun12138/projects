package com.cloud.service;


import com.cloud.entity.BaseEntity;
import com.cloud.mapper.BaseEntityMapper;
import io.seata.core.context.RootContext;
import io.seata.spring.annotation.GlobalTransactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BaseEntityService {
    @Autowired
    private BaseEntityMapper baseEntityMapper;

    public void update(int total,int id ){
        System.out.println(RootContext.getXID());
        BaseEntity oldBaseEntity = baseEntityMapper.selectById(id);
        BaseEntity baseEntity = new BaseEntity();
        baseEntity.setId(id);
        baseEntity.setType(oldBaseEntity.getType() + total);
        baseEntity.setTotal(oldBaseEntity.getTotal() - total);
        baseEntityMapper.update(baseEntity);
    }


    @Transactional
    public void insert(){
        System.out.println(RootContext.getXID());
        BaseEntity oldBaseEntity = baseEntityMapper.selectById(1);
        BaseEntity baseEntity = new BaseEntity();
        baseEntity.setId(2);
        baseEntity.setType(oldBaseEntity.getType());
        baseEntity.setTotal(oldBaseEntity.getTotal());
        baseEntityMapper.create(baseEntity);

        int i = 1/0;

        BaseEntity baseEntity1 = new BaseEntity();
        baseEntity1.setId(3);
        baseEntity1.setType(oldBaseEntity.getType());
        baseEntity1.setTotal(oldBaseEntity.getTotal());
        baseEntityMapper.create(baseEntity1);
    }

    //@GlobalTransactional
    @Transactional
    @Cacheable(value = "baseEntityCache",key = "#id")
    public BaseEntity select(int id ){
        BaseEntity baseEntity = baseEntityMapper.selectById(id);
        return baseEntity;
    }


    /*
    * 注意点:key中的值的类型要一致,本例中的id都为int,如果不一致，那么@CacheEvict注解会无效
    * */
    @Transactional
    @CacheEvict(value = "baseEntityCache",key = "#id")
    public void removeCache(int id ){
        //return true;
    }
}
