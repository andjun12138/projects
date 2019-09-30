package com.mongodb.util;

import com.mongodb.DBObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created by hjf on 2018/1/4.
 */
public class OtherUtil {

    public static List<Map<String,Object>> changeToListMap (Iterable<DBObject> objects){
        List<Map<String,Object>> object = new ArrayList<>();
        Iterator<DBObject> dbObject = objects.iterator();
        while (dbObject.hasNext()){
            object.add(dbObject.next().toMap());
        }
        return object;
    }
}
