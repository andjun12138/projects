package com.redis.help;


import com.redis.entity.BaseEntity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CalUtils {
    public static  List<Map<String,Object>> calSaleAvg(List<BaseEntity> lastRecordList){
        List<Map<String,Object>> result = new ArrayList<Map<String, Object>>();
        if (lastRecordList.size() > 0){
          int length = lastRecordList.size();
          for(int i = 0; i < length; i++){
              Map<String,Object> resultMap = commonSaleAvg(lastRecordList,i);
              result.add(resultMap);

          }
        }
        return result;
    }

    public static  List<Map<String,Object>> calBugAvg(List<BaseEntity> lastRecordList){
        List<Map<String,Object>> result = new ArrayList<Map<String, Object>>();
        if (lastRecordList.size() > 0){
            int length = lastRecordList.size();
            for(int i = 0; i < length; i++){
                Map<String,Object> resultMap = commonBugAvg(lastRecordList,i);
                result.add(resultMap);

            }
        }
        return result;
    }

    public static Map<String,Object> commonSaleAvg(List<BaseEntity> lastRecordList,int calLength){
        Map<String,Object> result = new HashMap<String, Object>();
        Integer many = 0;
        Float total = 0f;
        for (int j = 0 ; j <= calLength;j++){
            BaseEntity baseEntity = lastRecordList.get(j);
            many = many +  Integer.valueOf(baseEntity.getMany());
            total = total + Float.valueOf(baseEntity.getTotal());
        }
        Float avg = total / many;
        double saleAvg1 = avg  + avg*0.011;
        double saleAvg2 = avg  + avg*0.021;
        double saleAvg3 = avg  + avg*0.031;
        result.put("lastNum",calLength);
        result.put("avg",avg);
        result.put("saleAvg1",saleAvg1);
        result.put("saleAvg2",saleAvg2);
        result.put("saleAvg3",saleAvg3);
        result.put("total",total);
        result.put("many",many);
        return result;
    }


    public static Map<String,Object> commonBugAvg(List<BaseEntity> lastRecordList,int calLength){
        Map<String,Object> result = new HashMap<String, Object>();
        Integer many = 0;
        Float total = 0f;
        for (int j = 0 ; j <= calLength;j++){
            BaseEntity baseEntity = lastRecordList.get(j);
            many = many +  Integer.valueOf(baseEntity.getMany());
            total = total + Float.valueOf(baseEntity.getTotal()) + 5;
        }
        Float avg = total / many;
        double realAvg = (total + 0.001 * total)/many;
        double bugAvg1 = avg  - avg*0.011;
        double bugAvg2 = avg  - avg*0.021;
        double bugAvg3 = avg  - avg*0.031;
        result.put("lastNum",calLength);
        result.put("avg",avg);
        result.put("realAvg",realAvg);
        result.put("bugAvg1",bugAvg1);
        result.put("bugAvg2",bugAvg2);
        result.put("bugAvg3",bugAvg3);
        result.put("total",total);
        result.put("many",many);
        return result;
    }
}
