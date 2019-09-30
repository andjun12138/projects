package com.mongodb.service.impl;

import com.mongodb.*;
import com.mongodb.mongo.domain.*;
import com.mongodb.mongo.enumeration.Lookup;
import com.mongodb.mongo.enumeration.MongoLogic;
import com.mongodb.service.MongoDBService;
import com.mongodb.util.OtherUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by hjf on 2018/1/4.
 */
@Service
public class MongoDBServiceImpl implements MongoDBService {
    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void createView(String viewName,String source,Map<String,Object> doc) {
        List<DBObject> list = new ArrayList<DBObject>();
        if(null!=doc.get(MongoBuilders.LOOKUP)){
            List<MongoLookup> mongoLookups = (List<MongoLookup>) doc.get(MongoBuilders.LOOKUP);
            if (mongoLookups.size() > 0) {
                for (MongoLookup mongoLookup : mongoLookups) {
                    DBObject lookup = new BasicDBObject();
                    lookup = BasicDBObject.parse(splicingLookupString(mongoLookup));
                    list.add(lookup);
                }
            }
        }
        if(null!=doc.get(MongoBuilders.PROJECT)){
            DBObject project = new BasicDBObject();
            project = BasicDBObject.parse(splicingProjectString((List<MongoProject>) doc.get(MongoBuilders.PROJECT)));
            list.add(project);
        }
        mongoTemplate.getDb().setWriteConcern(WriteConcern.MAJORITY);
        DBCollection dbCollection = mongoTemplate.getDb().createView(viewName,source,list);
        System.out.println(dbCollection);
    }

    @Override
    public void bulkExecute(String collection,List<Map<String, Object>> insertList) {
        BulkWriteOperation bulkWriteOperation = mongoTemplate.getCollection(collection).initializeOrderedBulkOperation();
        for (Map<String,Object> insertMap : insertList) {
            Object id = getNextId(collection);
            insertMap.put("id",id);
            //默认的字段
            insertMap.put("deleted",0);
            insertMap.put("description","");
            insertMap.put("uuid","");
            insertMap.put("sys_init_data",0);
            insertMap.put("enabled",1);
            insertMap.put("created_at",new Date());
            insertMap.put("created_by","");
            insertMap.put("updated_by","");
            insertMap.put("updated_at",new Date());
            DBObject saveObject = new BasicDBObject();
            saveObject.putAll(insertMap);
            bulkWriteOperation.insert(saveObject);
        }
        bulkWriteOperation.execute();
    }

    @Override
    public void dropIndexWithCollection(String collection, Map<String, Object> map) {
        DBObject indexObject = new BasicDBObject();
        indexObject.putAll(map);
        mongoTemplate.getCollection(collection).dropIndex(indexObject);
    }

    @Override
    public void addIndexWithCollection(String collection, Map<String,Object> map) {
        DBObject indexObject = new BasicDBObject();
        indexObject.putAll(map);
        mongoTemplate.getCollection(collection).createIndex(indexObject);
    }

    @Override
    public <T> List<T> simpleQuery(Map<String, Object> queryMap,Map<String,Object> sortMap, Class<T> tClass,String collectionName) {
        DBObject queryObject = new BasicDBObject();
        queryObject.putAll(queryMap);
        Query query = new BasicQuery(queryObject);
        return mongoTemplate.find(query,tClass,collectionName);
    }


    @Override
    public Object executeCommand(String jsonCommand,Object... params) {
        //CommandResult commandResult =  mongoTemplate.executeCommand("db.getCollection('teacher').find({})");
        //Object object = mongoTemplate.getDb().eval("db.getCollection('teacher').find({})",0);
        //Object object = mongoTemplate.getDb().eval("function (){return \"test\";}",0);
        Object object = mongoTemplate.getDb().eval(jsonCommand,params);
        return object;
    }

    @Override
    public void dropCollection(String collection) {
        mongoTemplate.getCollection(collection).drop();
    }

    @Override
    public void dynamicSoftDelete(String collection, Map<String, Object> deleteMap) {
        DBObject queryObject = new BasicDBObject();
        queryObject.putAll(deleteMap);
        String updateStr = "{$set:{\"deleted\":1}}";//做这一层处理的目的是更新fieldMap中的数据是不会影响到fieldMap中没有的数据
        DBObject updateObject = new BasicDBObject();
        updateObject = BasicDBObject.parse(updateStr);
        //upsert(为true意思是没有找到就插入) 不能为true
        mongoTemplate.getCollection(collection).update(queryObject,updateObject,false,true);//这个只要符合查询条件的都能更新
       // mongoTemplate.getCollection(collection).findAndModify(queryObject,null,null,false,updateObject,true,false);//只更新符合查询条件的第一条
    }

    @Override
    public void dynamicReallyDelete(String collection,Map<String,Object> deleteMap){
        DBObject deleteObject = new BasicDBObject();
        deleteObject.putAll(deleteMap);
        mongoTemplate.getCollection(collection).remove(deleteObject);
    }

    //id 要改变//TODO
    @Override
    public Object dynamicInsertOrUpdate(String collection,String idKey,String idValue,Map<String,Object> fieldMap){
        Object id = idValue;
        if (idValue == null || idValue.isEmpty()){
            id = getNextId(collection);
            fieldMap.put("id",id);
            //默认的字段
            fieldMap.put("deleted",0);
            fieldMap.put("description","");
            fieldMap.put("uuid","");
            fieldMap.put("sys_init_data",0);
            fieldMap.put("enabled",1);
            fieldMap.put("created_at",new Date());
            fieldMap.put("created_by","");
            fieldMap.put("updated_by","");
            fieldMap.put("updated_at",new Date());
            DBObject saveObject = new BasicDBObject();
            saveObject.putAll(fieldMap);
            mongoTemplate.getCollection(collection).save(saveObject);
        }else {
            DBObject queryObject = new BasicDBObject();
            queryObject.put(idKey,idValue);
            DBObject saveObject = new BasicDBObject();
            saveObject.putAll(fieldMap);
            String updateStr = "{$set:"+saveObject.toString()+"}";//做这一层处理的目的是更新fieldMap中的数据是不会影响到fieldMap中没有的数据
            DBObject updateObject = new BasicDBObject();
            updateObject = BasicDBObject.parse(updateStr);
            //upsert(为true意思是没有找到就插入) 不能为true
            mongoTemplate.getCollection(collection).findAndModify(queryObject,null,null,false,updateObject,true,false);
        }
        return id;
    }


    //ids,queryObject:要改变//TODO
    @Override
    public void deleteCollection(String collection){
        DBObject queryObject = new BasicDBObject();
        queryObject.put("name",collection);
        queryObject.put("deleted",0);
        String updateStr = "{$set:{\"deleted\":1}}";//做这一层处理的目的是更新fieldMap中的数据是不会影响到fieldMap中没有的数据
        DBObject updateObject = new BasicDBObject();
        updateObject = BasicDBObject.parse(updateStr);
        //upsert(为true意思是没有找到就插入) 不能为true
        mongoTemplate.getCollection("ids").findAndModify(queryObject,null,null,false,updateObject,true,false);
    }

    //"ids"，map：要改變//TODO
    @Override
    public void createCollection(String collection){
        if (!isExistCollection(collection)) {//不存在该集合是才创建
            if (!mongoTemplate.collectionExists(collection)) {//如果已经存在了某个集合那么就不用重复创建了
                mongoTemplate.createCollection(collection);
            }
            Map<String, Object> map = new HashMap<>();
            map.put("name", collection);
            map.put("id", 1);
            map.put("deleted", 0);
            DBObject idsObject = new BasicDBObject();
            idsObject.putAll(map);
            mongoTemplate.getCollection("ids").save(idsObject);
        }
    }


    //ids，collectionMap//TODO
    @Override
    public boolean isExistCollection(String collection){
        Map<String,Object> collectionMap = new HashMap<>();
        collectionMap.put("name",collection);
        collectionMap.put("deleted",0);
        DBObject queryObject = new BasicDBObject();
        queryObject.putAll(collectionMap);
        DBCursor dbCursor = mongoTemplate.getCollection("ids").find(queryObject);
        if (dbCursor.hasNext()){
            return true;
        }
        return false;
    }

    @Override
    public List<Map<String,Object>> simpleDynamicQuery(String collection,Map<String,Object> queryMap,Map<String,Object> projectMap,Map<String,Object> sortMap,MongoLimit mongoLimit){
        List<Map<String,Object>> returnList = new ArrayList<>();
        DBObject queryObject = new BasicDBObject();
        queryObject.putAll(queryMap);
        DBObject projectObject = new BasicDBObject();
        if (projectMap != null) {
            projectObject.putAll(projectMap);
        }
        DBObject sortObject = new BasicDBObject();
        if (sortMap != null) {
            sortObject.putAll(sortMap);
        }
        if (mongoLimit != null) {
            DBCursor dbCursor = mongoTemplate.getCollection(collection).find(queryObject, projectObject).sort(sortObject)
                    .limit(Math.toIntExact(mongoLimit.getLimit())).skip(Math.toIntExact(mongoLimit.getSkip()));
            while (dbCursor.hasNext()){
                returnList.add(dbCursor.next().toMap());
            }
        }else{
            DBCursor dbCursor = mongoTemplate.getCollection(collection).find(queryObject, projectObject).sort(sortObject);
            while (dbCursor.hasNext()){
                returnList.add(dbCursor.next().toMap());
            }
        }

        return  returnList;
    }

    //ids，queryMap要修改//TODO
    /*
    * 获取自增id的一种方式.前提有一个叫ids的集合 id name deleted
    * */
    @Override
    public Long getNextId(String collectionName) {
        //查询的DBObject封装
        Map<String,Object> queryMap = new HashMap<>();
        queryMap.put("name",collectionName);
        queryMap.put("deleted",0);
        DBObject  queryObject = new BasicDBObject();
        queryObject.putAll(queryMap);
        //更新的DBObject封装
        DBObject updateObject = new BasicDBObject();
        String  updateStr = "{$inc:{\"id\":1}}";
        updateObject = BasicDBObject.parse(updateStr);
        DBObject returnObject =  mongoTemplate.getCollection("ids").findAndModify(queryObject,null,null,false,updateObject,true,false);
        Double dbId = (Double) returnObject.get("id");
        Long id  =  dbId.longValue();
        return id;
    }

    //这里有个注意的点就是：list数据add进去好，在mongodb执行是有先后顺序的，先add进的先执行，所有会有数据的差
    @Override
    public List<Map<String,Object>> dynamicQuery(Map<String,Object> doc) {
        /*添加测试数据end*/
        String collection = (String) doc.get(MongoBuilders.COLLECTION);
        if (collection == null || collection.isEmpty()){
            return null;
        }
        List<DBObject> list = new ArrayList<DBObject>();
        if(null!=doc.get(MongoBuilders.LOOKUP)){
            List<MongoLookup> mongoLookups = (List<MongoLookup>) doc.get(MongoBuilders.LOOKUP);
            if (mongoLookups.size() > 0) {
                for (MongoLookup mongoLookup : mongoLookups) {
                    DBObject lookup = new BasicDBObject();
                    lookup = BasicDBObject.parse(splicingLookupString(mongoLookup));
                    list.add(lookup);
                }
            }
        }
        if (null != doc.get(MongoBuilders.GRAPHLOOKUP)){
            MongoGraphLookup mongoGraphLookup = (MongoGraphLookup) doc.get(MongoBuilders.GRAPHLOOKUP);
            DBObject graphLookup = new BasicDBObject();
            graphLookup = BasicDBObject.parse(splicingGraphLookupString(mongoGraphLookup));
            list.add(graphLookup);
        }
        if(null!=doc.get(MongoBuilders.PROJECT)){
            DBObject project = new BasicDBObject();
            project = BasicDBObject.parse(splicingProjectString((List<MongoProject>) doc.get(MongoBuilders.PROJECT)));
            list.add(project);
        }
        if(null!=doc.get(MongoBuilders.MATCH)){
            StringBuilder stringBuilder = new StringBuilder();
            DBObject match = new BasicDBObject();
            String matchStr = splicingMatchString((MongoMatch) doc.get(MongoBuilders.MATCH));
            String matchString = "{$match:"+ matchStr + "},";
            match = BasicDBObject.parse(matchString);
            list.add(match);
        }
        if(null!=doc.get(MongoBuilders.GROUP)){
            DBObject group = new BasicDBObject();
            group = BasicDBObject.parse(splicingGroupString((MongoGroup) doc.get(MongoBuilders.GROUP)));
            list.add(group);
        }
        if(null!=doc.get(MongoBuilders.LIMIT)){
            MongoLimit mongolimit = (MongoLimit) doc.get(MongoBuilders.LIMIT);
            DBObject limit = new BasicDBObject();
            limit = BasicDBObject.parse("{$limit:"+ mongolimit.getLimit()+"},");
            list.add(limit);
            DBObject skip = new BasicDBObject();
            skip = BasicDBObject.parse("{$skip:"+mongolimit.getSkip()+"},");
            list.add(skip);
        }
        if(null!=doc.get(MongoBuilders.COUNT)){
            MongoCount mongocount = (MongoCount) doc.get(MongoBuilders.COUNT);
            DBObject count = new BasicDBObject();
            count = BasicDBObject.parse(("{$count:"+mongocount.getValue()+"},"));
            list.add(count);
        }
        if(null!=doc.get(MongoBuilders.SORT)){
            List<MongoSort> mongoSorts = (List<MongoSort>) doc.get(MongoBuilders.SORT);
            DBObject sort = new BasicDBObject();
            sort = BasicDBObject.parse(splicingSortString(mongoSorts));
            list.add(sort);
        }

        AggregationOutput output = mongoTemplate.getCollection(collection).aggregate(list);

        return OtherUtil.changeToListMap(output.results());
    }

    private String splicingSortString(List<MongoSort> mongoSorts) {
        StringBuilder stringBuilder = new StringBuilder();
        if (mongoSorts != null) {
            stringBuilder.append("{$sort:{");
            for (MongoSort mongoSort : mongoSorts){
                stringBuilder.append( mongoSort.getKey() + ":" + mongoSort.getValue()+",");
            }
            stringBuilder.append("}},");
        }
        return stringBuilder.toString();
    }

    private String splicingGraphLookupString(MongoGraphLookup mongoGraphLookup) {
        StringBuilder stringBuilder = new StringBuilder();
        if (mongoGraphLookup != null) {
            stringBuilder.append("{$graphLookup:{");
            stringBuilder.append(MongoBuilders.FROM + ":" + mongoGraphLookup.getFrom() + ",");
            stringBuilder.append(MongoBuilders.STARTWITH + ":" + mongoGraphLookup.getStartWith() + ",");
            stringBuilder.append(MongoBuilders.CONNECTFROMFIELD + ":" + mongoGraphLookup.getConnectFromField() + ",");
            stringBuilder.append(MongoBuilders.CONNECTTOFIELD + ":" + mongoGraphLookup.getConnectToField() + ",");
            stringBuilder.append(MongoBuilders.AS + ":" + mongoGraphLookup.getAs() + ",");
            if (mongoGraphLookup.getMaxDepth() != null){
                stringBuilder.append(MongoBuilders.MATCH + ":" + mongoGraphLookup.getMaxDepth() + ",");
            }
            if (mongoGraphLookup.getDepthField() != null){
                stringBuilder.append(MongoBuilders.DEPTHFIELD + ":" + mongoGraphLookup.getDepthField() + ",");
            }
            if (mongoGraphLookup.getRestrictSearchWithMatch() != null){
                stringBuilder.append(MongoBuilders.RESTRICTSEARCHWITHMATCH + ":" + mongoGraphLookup.getRestrictSearchWithMatch() + ",");
            }
            stringBuilder.deleteCharAt(stringBuilder.length() - 1);
            stringBuilder.append("}}");
        }
        return stringBuilder.toString();
    }


    /*
    * 感觉这样不太好，GroupCalculate设计的不够好
    * */
    private String splicingGroupString(MongoGroup group) {
        StringBuilder groupBuilder = new StringBuilder();
        if (group != null) {
            if (group.getPrimaryValue() != null) {
                groupBuilder.append("{$group:{"+group.getPrimaryKey() + ":{" + group.getPrimaryValue() + "},");
                if (group.getGroupCalculates() != null) {
                    List<GroupCalculate> groupCalculates = group.getGroupCalculates();
                    for (GroupCalculate groupCalculate : groupCalculates) {
                        groupBuilder.append(splicingGroupCalculateString(groupCalculate));
                    }
                }
                groupBuilder.append("}},");
            }
        }
        return groupBuilder.toString();
    }

    private String splicingGroupCalculateString(GroupCalculate groupCalculate) {
        StringBuilder calculateBuilder = new StringBuilder();
        if (groupCalculate != null){
            if (groupCalculate.getGroupCalculates() != null){
                if (groupCalculate.getAlias() != null){
                    calculateBuilder.append(groupCalculate.getAlias() + ":");
                }
                if (groupCalculate.getMongoFunction() != null){
                    if (groupCalculate.getMongoSign() != null){
                        calculateBuilder.append("{" + groupCalculate.getMongoFunction() + ":{" + groupCalculate.getMongoSign() + ":[");
                    }else{
                        calculateBuilder.append("{" + groupCalculate.getMongoFunction() + ":" );
                    }
                }else {
                    if (groupCalculate.getMongoSign() != null){
                        calculateBuilder.append("{" + groupCalculate.getMongoSign() + " : [");
                    }
                }
                List<GroupCalculate> groupCalculates = groupCalculate.getGroupCalculates();
                for (GroupCalculate calculate : groupCalculates){
                    calculateBuilder.append(splicingGroupCalculateString(calculate));
                }
                if (groupCalculate.getMongoFunction() != null){
                    if (groupCalculate.getMongoSign() != null){
                        calculateBuilder.append("]}},");
                    }else{
                        calculateBuilder.append("},");
                    }
                }else {
                    if (groupCalculate.getMongoSign() != null){
                        calculateBuilder.append("]},");
                    }
                }
            }else{
                if (groupCalculate.getMongoFunction() != null){
                    if (groupCalculate.getMongoSign() != null){
                        calculateBuilder.append("{" + groupCalculate.getMongoFunction() + ":{" + groupCalculate.getMongoSign() + ":["+groupCalculate.getField()+"]}},");
                    }else{
                        calculateBuilder.append("{" + groupCalculate.getMongoFunction() + ":" + groupCalculate.getField() + "},");
                    }
                }else {
                    if (groupCalculate.getMongoSign() != null){
                        calculateBuilder.append("{" + groupCalculate.getMongoSign() + " : [" + groupCalculate.getField() + "]},");
                    }
                }
            }
        }
        return calculateBuilder.toString();
    }

    private String splicingMatchString(MongoMatch match) {
        StringBuilder matchBuilder = new StringBuilder();
        if (match!=null) {
            if (match.getMongoLogic() != null){
                if (match.getMongoLogic() == MongoLogic.AND){
                    matchBuilder.append("{$and:[");
                }
                if (match.getMongoLogic() == MongoLogic.OR){
                    matchBuilder.append("{$or:[");
                }
                List<MongoMatch> mongoMatchS = match.getMongoMatches();
                for (MongoMatch mongoMatch : mongoMatchS){
                    String matchStr = splicingMatchString(mongoMatch);
                    matchBuilder.append(matchStr);
                }
                matchBuilder.append("]},");
                return matchBuilder.toString();
            }else {
                String field = match.getField();
                Object value = match.getValue();
                return "{" + field + ":" + value + "},";
            }
        }
        return matchBuilder.toString();
    }

    public String splicingProjectString(List<MongoProject> projects){
        StringBuilder stringBuilder = new StringBuilder();
        if (projects!=null && projects.size() > 0) {
            stringBuilder.append("{$project:{");
            for (MongoProject project : projects){
                stringBuilder.append(project.getKey());
                stringBuilder.append(":");
                stringBuilder.append(project.getValue());
                stringBuilder.append(",");
            }
            stringBuilder.deleteCharAt(stringBuilder.length()-1);
            stringBuilder.append("}}");
        }
        return stringBuilder.toString();
    }

    public void splicingProjectVarchar(List<MongoProject> projects){
        StringBuilder stringBuilder = new StringBuilder();
        if(projects != null && projects.size() > 0){
            stringBuilder.append("{$project:{");
            for (MongoProject project : projects){
                stringBuilder.append(project.getKey());
                stringBuilder.append(":");
                stringBuilder.append(project.getValue());
                stringBuilder.append(",");
                stringBuilder.append(",");
            }
        }
    }

    public String splicingLookupString(MongoLookup mongoLookup){
        StringBuilder stringBuilder = new StringBuilder();
        if (mongoLookup != null) {
            if (mongoLookup.getLookup() == Lookup.UN_JOIN) {
                stringBuilder.append("{$lookup:{");
                stringBuilder.append(MongoBuilders.FROM + ":" + mongoLookup.getFrom() + ",");
                stringBuilder.append(MongoBuilders.LOCALFIELD + ":" + mongoLookup.getLocalField() + ",");
                stringBuilder.append(MongoBuilders.FOREIGNFIELD + ":" + mongoLookup.getForeignField() + ",");
                stringBuilder.append(MongoBuilders.AS + ":" + mongoLookup.getAs() + ",");
                stringBuilder.deleteCharAt(stringBuilder.length() - 1);
                stringBuilder.append("}}");
            } else if (mongoLookup.getLookup() == Lookup.JOIN) {
                stringBuilder.append("{$lookup:{");
                stringBuilder.append(MongoBuilders.FROM + ":" + mongoLookup.getFrom() + ",");
                stringBuilder.append(MongoBuilders.LET + ":" + mongoLookup.getLet() + ",");
                stringBuilder.append(MongoBuilders.PIPELINE + ":" + mongoLookup.getPipeLine() + ",");
                stringBuilder.append(MongoBuilders.AS + ":" + mongoLookup.getAs() + ",");
                stringBuilder.deleteCharAt(stringBuilder.length() - 1);
                stringBuilder.append("}}");
            }
        }
        return stringBuilder.toString();
    }
}
