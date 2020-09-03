package com.flowable.service;

import com.flowable.entity.BaseEntity;
import com.flowable.help.CalUtils;
import com.flowable.mapper.BaseEntityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BaseEntityService {
    @Autowired
    private BaseEntityMapper baseEntityMapper;

    public Map<String,Object> baseCal(String tableName,Integer type,String times){
        Map<String,Object> result = new HashMap<String, Object>();
        List<BaseEntity> records = baseEntityMapper.getRecords(tableName,type,times);
        if( type == null) {
            result.put("list",records);
        }else if (type == 0){
            List<Map<String,Object>> bugAvg = CalUtils.calBugAvg(records);
            result.put("list",bugAvg);
        }else if (type == 1){
            List<Map<String,Object>> saleAvg = CalUtils.calSaleAvg(records);
            result.put("list",saleAvg);
        }
        return result;


    }
}
