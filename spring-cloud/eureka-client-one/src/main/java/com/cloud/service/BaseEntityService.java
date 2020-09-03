package com.cloud.service;


import com.cloud.entity.BaseEntity;
import com.cloud.mapper.BaseEntityMapper;
import io.seata.core.context.RootContext;
import io.seata.spring.annotation.GlobalTransactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BaseEntityService {
    @Autowired
    private BaseEntityMapper baseEntityMapper;

    //@GlobalTransactional
    @Transactional
    public void update(int total,int id ){
        System.out.println(RootContext.getXID());
        BaseEntity oldBaseEntity = baseEntityMapper.selectById(id);
        BaseEntity baseEntity = new BaseEntity();
        baseEntity.setId(id);
        baseEntity.setType(oldBaseEntity.getType() + total);
        baseEntity.setTotal(oldBaseEntity.getTotal() - total);
        baseEntityMapper.update(baseEntity);
    }
}
