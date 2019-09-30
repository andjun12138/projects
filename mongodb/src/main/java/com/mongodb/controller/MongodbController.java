package com.mongodb.controller;

import com.mongodb.BasicDBObject;
import com.mongodb.BulkWriteOperation;
import com.mongodb.DBObject;
import com.mongodb.WriteResult;
import com.mongodb.entity.Entity;
import com.mongodb.mongo.domain.*;
import com.mongodb.mongo.enumeration.MongoFunction;
import com.mongodb.mongo.enumeration.MongoLogic;
import com.mongodb.mongo.enumeration.MongoSign;
import com.mongodb.service.MongoDBService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by liuxh on 2017/12/6.
 */
@Controller
@RequestMapping(value = {"/mongodb", "*/mongodb"})
public class MongodbController {

    @Autowired
    private MongoDBService mongoDBService;

    @Autowired
    private MongoTemplate mongoTemplate;

    @RequestMapping("/entity")
    @ResponseBody
    public Object create(){
        Entity entity = new Entity();
        String collection = "s_base_entity";
        Long entityId =  mongoDBService.getNextId(collection);
        entity.setId(entityId);
        mongoTemplate.insert(entity,collection);
        return entityId;
    }


    @RequestMapping("/queryView")
    @ResponseBody
    public Object queryView(){
        String collection = "s_base_entity";
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(4));
        WriteResult wr = mongoTemplate.remove(query,collection);
        return wr.getN();

        //return mongoTemplate.findAll(Entity.class,"s_base_entity");
    }

    @RequestMapping("/update")
    @ResponseBody
    public Object update(){

        return mongoTemplate.findAll(Entity.class,"s_base_entity");
    }







    @RequestMapping("/createView")
    @ResponseBody
    public Object createView(){
  /*添加测试数据start*/
        Map<String, Object> doc = new HashMap<>();

        //lookup
        List<MongoLookup> mongoLookupList = new ArrayList<>();
        //{$lookup:{from:\"orders\",localField:\"_id\",foreignField:\"pid\",as:\"inventory_docs\"}
        MongoLookup mongoLookup1 = MongoBuilders.lookupUnJoin("\"orders\"","\"id\"","\"pid\"","\"inventory_docs\"");
        mongoLookupList.add(mongoLookup1);
        MongoLookup mongoLookup2 = MongoBuilders.lookupUnJoin("\"orders\"","\"id\"","\"pid\"","\"inventory_docs1\"");
        //mongoLookupList.add(mongoLookup2);
        MongoLookup mongoLookup3 = MongoBuilders.lookupJoin("\"orders\"","{order_id:\"$_id\"}","[{$match:{$expr:{$and:[{$eq:[\"$pid\",\"$$order_id\"]}]}}}]","\"inventory_docs2\"");
        //mongoLookupList.add(mongoLookup3);
        doc.put(MongoBuilders.LOOKUP,mongoLookupList);
        //project
        List<MongoProject> mongoProjectList = new ArrayList<>();
        MongoProject mongoProject1 = MongoBuilders.project("price",1);
        mongoProjectList.add(mongoProject1);
        MongoProject mongoProject2 = MongoBuilders.project("\"inventory_docs.ordername\"",1);
        mongoProjectList.add(mongoProject2);
        MongoProject mongoProject3 = MongoBuilders.project("\"inventory_docs1.ordername\"",1);
        // mongoProjectList.add(mongoProject3);
        MongoProject mongoProject4 = MongoBuilders.project("\"inventory_docs2.ordername\"",1);
        // mongoProjectList.add(mongoProject4);
        MongoProject mongoProject5 = MongoBuilders.project("productname",1);
        mongoProjectList.add(mongoProject5);
        MongoProject mongoProject6 = MongoBuilders.project("\"quantity\"",1);
        mongoProjectList.add(mongoProject6);
        doc.put(MongoBuilders.PROJECT,mongoProjectList);
        mongoDBService.createView("productOrderView","product",doc);
        return null;
    }

    @RequestMapping("/bulkExecute")
    @ResponseBody
    public Object bulkExecute(){
        List<Map<String,Object>> list = new ArrayList<>();
        for (int i = 3000001;i < 5000000;i++){
            Map<String,Object> map = new HashMap<>();
            map.put("name","黄俊发"+i);
            map.put("sex","男");
            map.put("age",18+i);
            map.put("id",i);
            list.add(map);
        }
        BulkWriteOperation bulkWriteOperation = mongoTemplate.getCollection("mytest").initializeOrderedBulkOperation();
        for (Map<String,Object> insertMap : list) {
            DBObject saveObject = new BasicDBObject();
            saveObject.putAll(insertMap);
            bulkWriteOperation.insert(saveObject);
        }
        bulkWriteOperation.execute();
        return null;
    }

    @RequestMapping("/addIndexWithCollection")
    @ResponseBody
    public Object addIndexWithCollection(){
        Map<String,Object> map = new HashMap<>();
        map.put("id",1);
        mongoDBService.addIndexWithCollection("teacher",map);
        return null;
    }

    @RequestMapping("/dropIndexWithCollection")
    @ResponseBody
    public Object dropIndexWithCollection(){
        Map<String,Object> map = new HashMap<>();
        map.put("id",1);
        mongoDBService.dropIndexWithCollection("teacher",map);
        return null;
    }

    @RequestMapping("/executeCommand")
    @ResponseBody
    public Object executeCommand(){
        String jsCommand = " function(param1,param2){ var myTest = db.teacher.find();  return myTest[0].name}";
        mongoDBService.executeCommand(jsCommand,"hello"," word");
        return mongoDBService.executeCommand(jsCommand,"hello"," word");
    }

    @RequestMapping("/dynamicReallyDelete")
    @ResponseBody
    public Object dynamicReallyDelete(){
        String collection = "teacher";
        Map<String,Object> deleteMap = new HashMap<>();
        deleteMap.put("name","黄俊发");
        deleteMap.put("id",6);
        mongoDBService.dynamicReallyDelete(collection,deleteMap);
        return null;
    }

    @RequestMapping("/dynamicSoftDelete")
    @ResponseBody
    public Object dynamicSoftDelete(){
        Map<String,Object> deleteMap = new HashMap<>();
        deleteMap.put("name","黄俊发");
        mongoDBService.dynamicSoftDelete("teacher",deleteMap);
        return null;
    }

    @RequestMapping("/dynamicInsertOrUpdate")
    @ResponseBody
    public Object dynamicInsertOrUpdate(){
        String collection = "teacher";
        Map<String,Object> fieldMap = new HashMap<>();
        fieldMap.put("name","黄俊发");
        fieldMap.put("sex","男");
        return mongoDBService.dynamicInsertOrUpdate(collection,"id","",fieldMap);
    }

    /*
    *
    * 没有删除集合，只是修改了维护自增id的表里面deleted字段
    * */
    @RequestMapping("/deleteCollection")
    @ResponseBody
    public Object deleteCollection(){
        String collection = "teacher";
        mongoDBService.deleteCollection(collection);
        return null;
    }


    @RequestMapping("/createCollection")
    @ResponseBody
    public Object createCollection(){
        Object id = mongoDBService.getNextId("teacher");
        System.out.println(id);
        mongoDBService.createCollection("teacher");
        mongoDBService.isExistCollection("teacher");
        return null;
    }

    @RequestMapping("/simpleDynamicQuery")
    @ResponseBody
    public Object simpleDynamicQuery(){
        Map<String,Object> queryMap = new HashMap<>();
        queryMap.put("age",18);
        Map<String,Object> projectMap = new HashMap<>();
        projectMap.put("_id",0);
        Map<String,Object> sortMap = new HashMap<>();
        sortMap.put("id",-1);
        MongoLimit mongoLimit = new MongoLimit(1L,1L);
        return mongoDBService.simpleDynamicQuery("teacher",queryMap,projectMap,sortMap,null);
    }

    @RequestMapping("/dynamicQueryTest")
    @ResponseBody
    public Object dynamicQueryTest() {
        /*添加测试数据start*/
        Map<String, Object> doc = new HashMap<>();
        //collection
        doc.put(MongoBuilders.COLLECTION,"product");
        //project
        List<MongoProject> mongoProjectList = new ArrayList<>();
        MongoProject mongoProject1 = MongoBuilders.project("price",1);
        mongoProjectList.add(mongoProject1);
        MongoProject mongoProject5 = MongoBuilders.project("productname",1);
        mongoProjectList.add(mongoProject5);
        MongoProject mongoProject6 = MongoBuilders.project("\"quantity\"",1);
        mongoProjectList.add(mongoProject6);
        MongoProject mongoProject7 = MongoBuilders.project("\"_id\"",0);
        mongoProjectList.add(mongoProject7);
        doc.put(MongoBuilders.PROJECT,mongoProjectList);

        /*添加测试数据end*/
        String collection = (String) doc.get(MongoBuilders.COLLECTION);
        if (collection.isEmpty()){
            return null;
        }
        return mongoDBService.dynamicQuery(doc);
    }
    @RequestMapping("/dynamicSelfQuery")
    @ResponseBody
    public Object dynamicSelfQuery(){
        Map<String, Object> doc = new HashMap<>();
        doc.put(MongoBuilders.COLLECTION,"teacher");
        MongoMatch mongoMatch = new MongoMatch("id","{$in:[1,3,4,7]}");
        doc.put(MongoBuilders.MATCH,mongoMatch);
        MongoGraphLookup mongoGraphLookup = new MongoGraphLookup("\"teacher\"","\"$id\"","\"id\"","\"pid\"","\"children\"");
        doc.put(MongoBuilders.GRAPHLOOKUP,mongoGraphLookup);
        //group
        MongoGroup mongoGroup = MongoBuilders.group("id:\"$id\"",
                MongoBuilders.groupCalculate("\"children\"",
                        MongoBuilders.groupCalculate("\"$children.id\"",MongoFunction.PUSH,null,null))
              );
        doc.put(MongoBuilders.GROUP,mongoGroup);
        List<Map<String,Object>> datas = mongoDBService.dynamicQuery(doc);
        String returnStr = "";
        for (Map<String,Object> data : datas){
            List list = (List) data.get("children");
            String str = list.get(0).toString();
            if (str.length() != 3) {//有点写死
                str = str.substring(1, str.length() - 1);
                returnStr = returnStr + str + ",";
            }
        }
        returnStr = returnStr.substring(0,returnStr.length()-1);
        return returnStr;
    }

    @RequestMapping("/dynamicQuery")
    @ResponseBody
    public Object dynamicQuery() {
        /*添加测试数据start*/
        Map<String, Object> doc = new HashMap<>();
        //collection
        doc.put(MongoBuilders.COLLECTION,"product");
        //project
        List<MongoProject> mongoProjectList = new ArrayList<>();
        MongoProject mongoProject1 = MongoBuilders.project("price",1);
        mongoProjectList.add(mongoProject1);
        MongoProject mongoProject2 = MongoBuilders.project("\"inventory_docs.ordername\"",1);
        mongoProjectList.add(mongoProject2);
        MongoProject mongoProject3 = MongoBuilders.project("\"inventory_docs1.ordername\"",1);
        mongoProjectList.add(mongoProject3);
        MongoProject mongoProject4 = MongoBuilders.project("\"inventory_docs2.ordername\"",1);
        mongoProjectList.add(mongoProject4);
        MongoProject mongoProject5 = MongoBuilders.project("productname",1);
        mongoProjectList.add(mongoProject5);
        MongoProject mongoProject6 = MongoBuilders.project("\"quantity\"",1);
        mongoProjectList.add(mongoProject6);
        doc.put(MongoBuilders.PROJECT,mongoProjectList);
        //lookup
        List<MongoLookup> mongoLookupList = new ArrayList<>();
        //{$lookup:{from:\"orders\",localField:\"_id\",foreignField:\"pid\",as:\"inventory_docs\"}
        MongoLookup mongoLookup1 = MongoBuilders.lookupUnJoin("\"orders\"","\"_id\"","\"pid\"","\"inventory_docs\"");
        mongoLookupList.add(mongoLookup1);
        MongoLookup mongoLookup2 = MongoBuilders.lookupUnJoin("\"orders\"","\"_id\"","\"pid\"","\"inventory_docs1\"");
        mongoLookupList.add(mongoLookup2);
        MongoLookup mongoLookup3 = MongoBuilders.lookupJoin("\"orders\"","{order_id:\"$_id\"}","[{$match:{$expr:{$and:[{$eq:[\"$pid\",\"$$order_id\"]}]}}}]","\"inventory_docs2\"");
        mongoLookupList.add(mongoLookup3);
        doc.put(MongoBuilders.LOOKUP,mongoLookupList);
        //match
        MongoMatch mongoMatch = MongoBuilders.match( MongoLogic.OR,
                MongoBuilders.match("productname","{$regex:\"品\"}"),
                MongoBuilders.match(MongoLogic.AND,
                        MongoBuilders.match("price","{$gt:30,$lt:90}"),
                        MongoBuilders.match("\"inventory_docs.ordername\"","{$regex:\"订单\"}")));
        doc.put(MongoBuilders.MATCH,mongoMatch);
        //group
        MongoGroup mongoGroup = MongoBuilders.group("type:\"$type\",productname:\"$productname\"",
                MongoBuilders.groupCalculate("\"price\"",
                        MongoBuilders.groupCalculate("\"$price\"",MongoFunction.SUM,null,null)),
                MongoBuilders.groupCalculate("\"totalprice\"",
                        MongoBuilders.groupCalculate(null,MongoFunction.SUM, MongoSign.MULTIPLY,
                                MongoBuilders.groupCalculate("\"$price\",\"$quantity\",\"$price\"",MongoFunction.SUM, MongoSign.MULTIPLY,null),
                                MongoBuilders.groupCalculate("\"$price\",\"$quantity\",\"$price\"",MongoFunction.SUM, MongoSign.MULTIPLY,null))),
                MongoBuilders.groupCalculate("\"averageQuantity\"",
                        MongoBuilders.groupCalculate("\"$quantity\"",MongoFunction.AVG,null,null)));
        //doc.put(MongoBuilders.GROUP,mongoGroup);
        //limit
        MongoLimit mongoLimit = MongoBuilders.limit(1L,1L);
        doc.put(MongoBuilders.LIMIT,mongoLimit);
        //sort
        MongoSort mongoSort = MongoBuilders.sort("price",1);
        doc.put(MongoBuilders.SORT,mongoSort);
        //count
        MongoCount mongoCount = MongoBuilders.count("\"price\"");
        //doc.put(MongoBuilders.COUNT,mongoCount);

        /*添加测试数据end*/
        String collection = (String) doc.get(MongoBuilders.COLLECTION);
        if (collection.isEmpty()){
            return null;
        }
        return mongoDBService.dynamicQuery(doc);
    }

    @RequestMapping("/dropCollection")
    @ResponseBody
    public Object dropCollection(){
        mongoDBService.dropCollection("teacher");
        return null;
    }

}
