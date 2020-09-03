package com.cloud.service;


import com.cloud.mapper.BaseEntityMapper;
import com.cloud.services.ClientOneService;
import com.cloud.services.ClientService;
import io.seata.core.context.RootContext;
import io.seata.spring.annotation.GlobalTransactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BaseEntityService {
    @Autowired
    private BaseEntityMapper baseEntityMapper;
    @Autowired
    public ClientService clientService;
    @Autowired
    public ClientOneService clientOneService;

    @GlobalTransactional(name = "selectById",rollbackFor = Exception.class)
    public String selectById(String tableName,Integer type,int times,String back) throws RuntimeException{
        System.out.println(RootContext.getXID());
        String content = clientService.update(times,1);
        String contentOne = clientOneService.update(times,1);
        if("error".equals(back)){
            throw new RuntimeException("执行回滚");
        }
        return "success";
    }

    @GlobalTransactional
    public String selectEntity(int id){
        return clientService.select(id);
    }

}
