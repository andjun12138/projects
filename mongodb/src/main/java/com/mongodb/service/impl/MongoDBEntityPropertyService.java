package com.mongodb.service.impl;

import com.mongodb.BasicDBObject;
import com.mongodb.BulkWriteOperation;
import com.mongodb.DBObject;
import com.mongodb.WriteResult;
import com.mongodb.entity.EntityProperty;
import com.mongodb.mongo.domain.*;
import com.mongodb.mongo.enumeration.MongoLogic;
import com.mongodb.service.MongoDBService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by lihp on 2018/1/8.
 */
@Service
public class MongoDBEntityPropertyService {

    @Autowired
    private MongoDBService mongoDBService;

    private MongoTemplate mongoTemplate;

    public MongoDBEntityPropertyService(MongoTemplate mongoTemplate){
        this.mongoTemplate = mongoTemplate;
    }


    public void update(EntityProperty entityProperty, String transactionId) {
        String collection = "s_base_entity";
        Long entityId = entityProperty.getId();
        Map<String,Object> updateMap = new HashMap<>();
        updateMap = entityPropertyToMapByBasic(entityProperty,updateMap);
        updateMap = entityPropertyToMapByOther(entityProperty,updateMap);

        DBObject queryObject = new BasicDBObject();
        queryObject.put("id",entityId);

        DBObject saveObject = new BasicDBObject();
        saveObject.putAll(updateMap);
        String updateStr = "{$set:"+saveObject.toString()+"}";//做这一层处理的目的是更新fieldMap中的数据是不会影响到fieldMap中没有的数据
        DBObject updateObject = new BasicDBObject();
        updateObject = BasicDBObject.parse(updateStr);
        //upsert(为true意思是没有找到就插入) 不能为true
        mongoTemplate.getCollection(collection).findAndModify(queryObject,null,null,false,updateObject,true,false);
    }

    public EntityProperty getByTableNameAndPropertyName(String tableName, String propertyName){
        Map<String, Object> doc = new HashMap<>();
        doc.put(MongoBuilders.COLLECTION,"s_base_entity_property");
        //lookup
        List<MongoLookup> mongoLookupList = new ArrayList<>();
        MongoLookup mongoLookup = MongoBuilders.lookupUnJoin("\"s_base_entity\"","\"entityId\"","\"id\"","\"entities\"");
        mongoLookupList.add(mongoLookup);
        doc.put(MongoBuilders.LOOKUP,mongoLookupList);
        //project
        List<MongoProject> mongoProjectList = new ArrayList<>();
        MongoProject mongoProject = MongoBuilders.project("entities",0);
        mongoProjectList.add(mongoProject);
        doc.put(MongoBuilders.PROJECT,mongoProjectList);
        //match
        MongoMatch mongoMatch = MongoBuilders.match( MongoLogic.AND,
                MongoBuilders.match("property_name",propertyName),
                MongoBuilders.match("entities.collection",tableName));
        doc.put(MongoBuilders.MATCH,mongoMatch);
        List<Map<String,Object>> list = mongoDBService.dynamicQuery(doc);
        if (list.size()>0){
            return mapToEntityProperty(list.get(0));
        }
        return null;
    }

    public EntityProperty getByEntityUUID(String entityUUID) {
        Map<String, Object> doc = new HashMap<>();
        doc.put(MongoBuilders.COLLECTION,"s_base_entity_property");
        //lookup
        List<MongoLookup> mongoLookupList = new ArrayList<>();
        MongoLookup mongoLookup = MongoBuilders.lookupUnJoin("\"s_base_entity\"","\"entityId\"","\"id\"","\"entities\"");
        mongoLookupList.add(mongoLookup);
        doc.put(MongoBuilders.LOOKUP,mongoLookupList);
        //project
        List<MongoProject> mongoProjectList = new ArrayList<>();
        MongoProject mongoProject = MongoBuilders.project("entities",0);
        mongoProjectList.add(mongoProject);
        doc.put(MongoBuilders.PROJECT,mongoProjectList);
        //match
        MongoMatch mongoMatch = MongoBuilders.match( MongoLogic.AND,
                MongoBuilders.match("entities.uuid",entityUUID),
                MongoBuilders.match("deleted",0));
        doc.put(MongoBuilders.MATCH,mongoMatch);
        List<Map<String,Object>> list = mongoDBService.dynamicQuery(doc);
        if (list.size()>0){
            return mapToEntityProperty(list.get(0));
        }
        return null;
    }
    public EntityProperty getSimpleByEntityUUID(String entityUUID)  {
        return getByEntityUUID(entityUUID);
    }

    public EntityProperty getLastPropertyByEntityUUID(String entityUUID) {
        Map<String, Object> doc = new HashMap<>();
        doc.put(MongoBuilders.COLLECTION,"s_base_entity_property");
        //lookup
        List<MongoLookup> mongoLookupList = new ArrayList<>();
        MongoLookup mongoLookup = MongoBuilders.lookupUnJoin("\"s_base_entity\"","\"entityId\"","\"id\"","\"entities\"");
        mongoLookupList.add(mongoLookup);
        doc.put(MongoBuilders.LOOKUP,mongoLookupList);
        //project
        List<MongoProject> mongoProjectList = new ArrayList<>();
        MongoProject mongoProject = MongoBuilders.project("entities",0);
        mongoProjectList.add(mongoProject);
        doc.put(MongoBuilders.PROJECT,mongoProjectList);
        //match
        MongoMatch mongoMatch = MongoBuilders.match( MongoLogic.AND,
                MongoBuilders.match("entities.uuid",entityUUID),
                MongoBuilders.match("deleted",0));
        doc.put(MongoBuilders.MATCH,mongoMatch);
        //sort
        MongoSort mongoSort = MongoBuilders.sort("id",-1);
        List<MongoSort> mongoSorts = new ArrayList<>();
        mongoSorts.add(mongoSort);
        doc.put(MongoBuilders.SORT,mongoSorts);
        List<Map<String,Object>> list = mongoDBService.dynamicQuery(doc);
        if (list.size()>0){
            return mapToEntityProperty(list.get(0));
        }
        return null;
    }


    public EntityProperty getById(Long id) {
        String collection = "s_base_entity_property";
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(id));
        List<EntityProperty> entityList = mongoTemplate.find(query,EntityProperty.class,collection);
        if (entityList.size() > 0){
            return entityList.get(0);
        }
        return null;
    }

    public EntityProperty getByUUID(String uuid) {
        String collection = "s_base_entity_property";
        Query query = new Query();
        query.addCriteria(Criteria.where("uuid").is(uuid));
        List<EntityProperty> entityList = mongoTemplate.find(query,EntityProperty.class,collection);
        if (entityList.size() > 0){
            return entityList.get(0);
        }
        return null;
    }

    public EntityProperty getSimpleByUUID(String uuid) {
        return getByUUID(uuid);
    }


    public EntityProperty getSimpleById(Long id) {
        //TODO
        return getById(id);
    }

    public List<EntityProperty> getByEntityId(Long entityId) {
        String collection = "s_base_entity_property";
        Query query = new Query();
        query.addCriteria(Criteria.where("entity_id").is(entityId));
        query.addCriteria(Criteria.where("deleted").is(0));
        Sort sorts = new Sort(new Sort.Order(Sort.Direction.DESC,"sort"));
        query.with(sorts);
        return mongoTemplate.find(query,EntityProperty.class,collection);
    }

    public List<EntityProperty> getSimpleByEntityId(Long entityId) {
        return getByEntityId(entityId);
    }

    public Long create(EntityProperty entityProperty, String transactionId){
        String collection = "s_base_entity_property";
        Long entityId = mongoDBService.getNextId(collection);
        entityProperty.setId(entityId);
        mongoTemplate.insert(entityProperty,collection);
        return Long.valueOf(entityId);
    }

    public int delete(Long id) {
        String collection = "s_base_entity_property";
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(id));
        WriteResult wr = mongoTemplate.remove(query,collection);
        return wr.getN();
    }

    public EntityProperty getLastPropertyByEntityId(Long id)  {
        String collection = "s_base_entity_property";
        Query query = new Query();
        query.addCriteria(Criteria.where("entity_id").is(id));
        Sort sorts = new Sort(new Sort.Order(Sort.Direction.DESC,"id"));
        query.with(sorts);
        query.limit(1);
        List<EntityProperty> entityList = mongoTemplate.find(query,EntityProperty.class,collection);
        if (entityList.size() > 0){
            return entityList.get(0);
        }
        return null;
    }
    public List<EntityProperty> queryEntityPropertiesWithExample(EntityProperty entityProperty, int offset, int size, Map<String,Object> sort)  {
        String collection = "s_base_entity_property";
        Query query = new Query();
        query = entityToQueryByBasic(entityProperty,query,0);
        query = entityToQueryByOther(entityProperty,query);
        query.skip(offset);
        query.limit(size);
        Sort sorts = buildQuerySortByMap(sort);
        if (sorts != null) {
            query.with(sorts);
        }
        return mongoTemplate.find(query,EntityProperty.class,collection);
    }

    public List<EntityProperty> queryEntityPropertiesWithExampleNotDeleted(EntityProperty entityProperty, int offset, int size, Map<String,Object> sort) {
        String collection = "s_base_entity_property";
        Query query = new Query();
        query = entityToQueryByBasic(entityProperty,query,1);
        query = entityToQueryByOther(entityProperty,query);
        query.skip(offset);
        query.limit(size);
        Sort sorts = buildQuerySortByMap(sort);
        if (sorts != null) {
            query.with(sorts);
        }
        return mongoTemplate.find(query,EntityProperty.class,collection);
    }

    public Long countEntitiesWithExample( EntityProperty entityProperty) {
        String collection = "s_base_entity_property";
        Query query = new Query();
        query = entityToQueryByBasic(entityProperty,query,0);
        query = entityToQueryByOther(entityProperty,query);
        return  mongoTemplate.count(query,collection);
    }

    public Long countEntitiesWithExampleNoDeleted( EntityProperty entityProperty) {
        String collection = "s_base_entity_property";
        Query query = new Query();
        query = entityToQueryByBasic(entityProperty,query,1);
        query = entityToQueryByOther(entityProperty,query);
        return mongoTemplate.count(query,collection);
    }

    public Sort buildQuerySortByMap(Map<String,Object> sort){
        Sort sorts = null;
        boolean flag = true;
        Iterator iterator = sort.entrySet().iterator();
        while (iterator.hasNext()){
            Map.Entry entry = (Map.Entry) iterator.next();
            String key = (String) entry.getKey();
            Object value = entry.getValue();
            if (flag){
                flag = false;
                if (value == Sort.Direction.DESC) {
                    sorts = new Sort(new Sort.Order(Sort.Direction.DESC,key));
                } else {
                    sorts = new Sort(new Sort.Order(Sort.Direction.ASC,key));
                }
            }else {
                if (value == Sort.Direction.DESC) {
                    sorts = sorts.and(new Sort(Sort.Direction.DESC,"ct"));
                } else {
                    sorts = sorts.and(new Sort(Sort.Direction.ASC,"ct"));
                }
            }
        }
        return sorts;
    }



    private EntityProperty mapToEntityProperty(Map<String, Object> map) {
        EntityProperty entity = new EntityProperty();
        if (map.containsKey("id")) {
            entity.setId(Long.valueOf((Integer)map.get("id")));
        }
        if (map.containsKey("description")) {
            entity.setDescription((String) map.get("description"));
        }
        if (map.containsKey("uuid")) {
            entity.setUuid((String) map.get("uuid"));
        }
        if (map.containsKey("custom_code")) {
            entity.setCustomCode((String) map.get("custom_code"));
        }
        if (map.containsKey("deleted")) {
            entity.setDeleted((Boolean) map.get("deleted"));
        }
        if (map.containsKey("enabled")) {
            entity.setEnabled((Boolean) map.get("enabled"));
        }
        if (map.containsKey("sys_init_data")) {
            entity.setSysInitData((Boolean) map.get("sys_init_data"));
        }
        if (map.containsKey("created_by")) {
            entity.setCreatedBy(Long.valueOf((Integer)map.get("created_by")));
        }
        if (map.containsKey("updated_by")) {
            entity.setUpdatedBy(Long.valueOf((Integer)map.get("updated_by")));
        }
        if (map.containsKey("created_at")) {
            entity.setCreatedAt((Date) map.get("created_at"));
        }
        if (map.containsKey("updated_at")) {
            entity.setUpdatedAt((Date) map.get("updated_at"));
        }



        if (map.containsKey("title")) {
            entity.setTitle((String) map.get("title"));
        }
        if (map.containsKey("property_unit")) {
            entity.setPropertyUnit((String) map.get("property_unit"));
        }
        if (map.containsKey("property_name")) {
            entity.setPropertyName((String) map.get("property_name"));
        }
        if (map.containsKey("entity_id")) {
            entity.setEntityId(Long.valueOf((Integer)map.get("entity_id")));
        }
        if (map.containsKey("property_type")) {
            entity.setPropertyType(Long.valueOf((Integer)map.get("property_type")));
        }
        if (map.containsKey("show_type")) {
            entity.setShowType(Long.valueOf((Integer)map.get("show_type")));
        }
        if (map.containsKey("target_id")) {
            entity.setTargetId(Long.valueOf((Integer)map.get("target_id")));
        }
        if (map.containsKey("sort")) {
            entity.setSort((Integer)map.get("id"));
        }
        if (map.containsKey("required")) {
            entity.setRequired((Boolean) map.get("required"));
        }
        if (map.containsKey("default_value")) {
            entity.setDefaultValue((String) map.get("default_value"));
        }
        if (map.containsKey("hidden")) {
            entity.setHidden((Boolean) map.get("hidden"));
        }
        if (map.containsKey("readonly")) {
            entity.setReadonly((Boolean) map.get("readonly"));
        }
        if (map.containsKey("js_handle")) {
            entity.setJsHandle((String) map.get("js_handle"));
        }
        if (map.containsKey("attachNum")) {
            entity.setAttachNum((Integer)map.get("attachNum"));
        }
        if (map.containsKey("length")) {
            entity.setLength((Integer)map.get("length"));
        }
        if (map.containsKey("save_to_search_engine")) {
            entity.setSaveToSearchEngine((Boolean) map.get("save_to_search_engine"));
        }
        if (map.containsKey("sys_default_flag")) {
            entity.setSysDefaultFlag(Long.valueOf((Integer)map.get("sys_default_flag")));
        }
        if (map.containsKey("property_constraint")) {
            entity.setPropertyConstraint((String) map.get("property_constraint"));
        }
        if (map.containsKey("page_component_input")) {
            entity.setPageComponentInput(Long.valueOf((Integer)map.get("page_component_input")));
        }
        if (map.containsKey("page_component_output")) {
            entity.setPageComponentOutput(Long.valueOf((Integer)map.get("page_component_output")));
        }
        if (map.containsKey("value")) {
            entity.setValue((String) map.get("value"));
        }
        return  entity;
    }


    public void createBaseProperty(Long entityId,Boolean sysInitData,String transactionId) {
        String collection = "s_base_entity_property";
        List<Map<String,Object>> basePropertyList = makeBaseProperty(collection,sysInitData);
        BulkWriteOperation bulkWriteOperation = mongoTemplate.getCollection(collection).initializeOrderedBulkOperation();
        for(Map<String,Object> baseProperty : basePropertyList){
            DBObject saveObject = new BasicDBObject();
            saveObject.putAll(baseProperty);
            bulkWriteOperation.insert(saveObject);
        }
        bulkWriteOperation.execute();
    }

    public Query entityToQueryByOther(EntityProperty entityProperty, Query query){
        if (entityProperty.getEntityId() != null){
            query.addCriteria(Criteria.where("entity_id").is(entityProperty.getEntityId()));
        }
        if (entityProperty.getTitle() != null){
            query.addCriteria(Criteria.where("title").regex(entityProperty.getTitle()));
        }
        if (entityProperty.getPropertyName() != null){
            query.addCriteria(Criteria.where("property_name").regex(entityProperty.getPropertyName()));
        }
        if (entityProperty.getPropertyType() != null){
            query.addCriteria(Criteria.where("property_type").is(entityProperty.getPropertyType()));
        }
        if (entityProperty.getShowType() != null){
            query.addCriteria(Criteria.where("show_type").is(entityProperty.getShowType()));
        }
        if (entityProperty.getTargetId() != null){
            query.addCriteria(Criteria.where("target_id").is(entityProperty.getTargetId()));
        }
        if (entityProperty.getSort() != null){
            query.addCriteria(Criteria.where("sort").is(entityProperty.getSort()));
        }
        if (entityProperty.getRequired() != null){
            query.addCriteria(Criteria.where("required").is(entityProperty.getRequired()));
        }
        if (entityProperty.getDefaultValue() != null){
            query.addCriteria(Criteria.where("default_value").is(entityProperty.getDefaultValue()));
        }
        if (entityProperty.getHidden() != null){
            query.addCriteria(Criteria.where("hidden").is(entityProperty.getHidden()));
        }
        if (entityProperty.getReadonly() != null){
            query.addCriteria(Criteria.where("readonly").is(entityProperty.getReadonly()));
        }
        if (entityProperty.getJsHandle() != null){
            query.addCriteria(Criteria.where("js_handle").is(entityProperty.getJsHandle()));
        }
        if (entityProperty.getAttachNum() != null){
            query.addCriteria(Criteria.where("attach_num").is(entityProperty.getAttachNum()));
        }
        if (entityProperty.getLength() != null){
            query.addCriteria(Criteria.where("length").is(entityProperty.getLength()));
        }
        if (entityProperty.getSaveToSearchEngine() != null){
            query.addCriteria(Criteria.where("save_to_search_engine").is(entityProperty.getSaveToSearchEngine()));
        }
        if (entityProperty.getSysDefaultFlag() != null){
            query.addCriteria(Criteria.where("sys_default_flag").is(entityProperty.getSysDefaultFlag()));
        }
        if (entityProperty.getPropertyConstraint() != null){
            query.addCriteria(Criteria.where("property_constraint").is(entityProperty.getPropertyConstraint()));
        }
        if (entityProperty.getPageComponentInput() != null){
            query.addCriteria(Criteria.where("page_component_input").is(entityProperty.getPageComponentInput()));
        }
        if (entityProperty.getPageComponentOutput() != null) {
            query.addCriteria(Criteria.where("page_component_output").is(entityProperty.getPageComponentOutput()));
        }
        if (entityProperty.getPropertyUnit() != null) {
            query.addCriteria(Criteria.where("property_unit").is(entityProperty.getPropertyUnit()));
        }
        return query;
    }


    public Query entityToQueryByBasic(EntityProperty entityProperty, Query query, int type){
        if (entityProperty.getId() != null){
            query.addCriteria(Criteria.where("id").is(entityProperty.getId()));
        }
        if (entityProperty.getUuid() != null){
            query.addCriteria(Criteria.where("uuid").is(entityProperty.getUuid()));
        }
        if (entityProperty.getCustomCode() != null){
            query.addCriteria(Criteria.where("custom_code").is(entityProperty.getCustomCode()));
        }
        if (entityProperty.getDescription() != null){
            query.addCriteria(Criteria.where("description").is(entityProperty.getDescription()));
        }
        if (entityProperty.getSysInitData() != null){
            query.addCriteria(Criteria.where("sys_init_data").is(entityProperty.getSysInitData()));
        }
        if (type == 0){//说明是要加deleted的
            if (entityProperty.getDeleted() != null){
                query.addCriteria(Criteria.where("deleted").is(entityProperty.getDeleted()));
            }
        }
        if (entityProperty.getEnabled() != null){
            query.addCriteria(Criteria.where("enabled").is(entityProperty.getEnabled()));
        }
        if (entityProperty.getCreatedBy() != null){
            query.addCriteria(Criteria.where("created_by").is(entityProperty.getCreatedBy()));
        }
        if (entityProperty.getUpdatedBy() != null){
            query.addCriteria(Criteria.where("updated_by").is(entityProperty.getUpdatedBy()));
        }
        if (entityProperty.getCreatedAt() != null){
            query.addCriteria(Criteria.where("created_at").is(entityProperty.getCreatedAt()));
        }
        if (entityProperty.getUpdatedAt() != null){
            query.addCriteria(Criteria.where("updated_at").is(entityProperty.getUpdatedAt()));
        }
        return  query;
    }

    public List<Map<String,Object>> makeBaseProperty(String collection,Boolean sysInitData)  {
        List<Map<String,Object>> basePropertyList = new ArrayList<>();
        Map<String,Object> baseProperty = new HashMap<>();
        Long entityId = mongoDBService.getNextId(collection);
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        baseProperty.put("uuid",uuid);
        baseProperty.put("entity_id",entityId);
        baseProperty.put("title","全局id");
        baseProperty.put("description","全局id");
        baseProperty.put("property_name","uuid");
        baseProperty.put("property_type",1006);
        baseProperty.put("show_type",1104);
        baseProperty.put("sort",0);
        baseProperty.put("required",0);
        //baseProperty.put("default_value",);
        baseProperty.put("hidden",0);
        baseProperty.put("readonly",0);
        //baseProperty.put("js_handle",tt);
        baseProperty.put("attach_num",1);
        baseProperty.put("save_to_search_engine",0);
        baseProperty.put("sys_default_flag",10401);
        baseProperty.put("sys_init_data",sysInitData);
        baseProperty.put("length",32);
        baseProperty.put("page_component_input",1);
        baseProperty.put("page_component_output",1);
        basePropertyList.add(baseProperty);
        /************************************/
        entityId = mongoDBService.getNextId(collection);
        uuid = UUID.randomUUID().toString().replaceAll("-", "");
        baseProperty.put("uuid",uuid);
        baseProperty.put("entity_id",entityId);
        baseProperty.put("title","自定义编码");
        baseProperty.put("description","自定义编码");
        baseProperty.put("property_name","custom_code");
        baseProperty.put("property_type",1006);
        baseProperty.put("show_type",1104);
        baseProperty.put("sort",101);
        baseProperty.put("required",0);
        //baseProperty.put("default_value",);
        baseProperty.put("hidden",0);
        baseProperty.put("readonly",0);
        //baseProperty.put("js_handle",tt);
        baseProperty.put("attach_num",1);
        baseProperty.put("save_to_search_engine",0);
        baseProperty.put("sys_default_flag",10402);
        baseProperty.put("sys_init_data",sysInitData);
        baseProperty.put("length",256);
        baseProperty.put("page_component_input",1);
        baseProperty.put("page_component_output",1);
        basePropertyList.add(baseProperty);
        /************************************/
        entityId = mongoDBService.getNextId(collection);
        uuid = UUID.randomUUID().toString().replaceAll("-", "");
        baseProperty.put("uuid",uuid);
        baseProperty.put("entity_id",entityId);
        baseProperty.put("title","备注");
        baseProperty.put("description","备注");
        baseProperty.put("property_name","description");
        baseProperty.put("property_type",1006);
        baseProperty.put("show_type",1104);
        baseProperty.put("sort",102);
        baseProperty.put("required",0);
        //baseProperty.put("default_value",);
        baseProperty.put("hidden",0);
        baseProperty.put("readonly",0);
        //baseProperty.put("js_handle",tt);
        baseProperty.put("attach_num",1);
        baseProperty.put("save_to_search_engine",0);
        baseProperty.put("sys_default_flag",10403);
        baseProperty.put("sys_init_data",sysInitData);
        baseProperty.put("length",1024);
        baseProperty.put("page_component_input",4);
        baseProperty.put("page_component_output",4);
        basePropertyList.add(baseProperty);
        /************************************/
        entityId =  mongoDBService.getNextId(collection);
        uuid = UUID.randomUUID().toString().replaceAll("-", "");
        baseProperty.put("uuid",uuid);
        baseProperty.put("entity_id",entityId);
        baseProperty.put("title","是否系统初始数据");
        baseProperty.put("description","是否系统初始数据");
        baseProperty.put("property_name","sys_init_data");
        baseProperty.put("property_type",1003);
        baseProperty.put("show_type",1103);
        baseProperty.put("sort",103);
        baseProperty.put("required",0);
        baseProperty.put("default_value",0);
        baseProperty.put("hidden",0);
        baseProperty.put("readonly",0);
        //baseProperty.put("js_handle",tt);
        baseProperty.put("attach_num",1);
        baseProperty.put("save_to_search_engine",0);
        baseProperty.put("sys_default_flag",10404);
        baseProperty.put("sys_init_data",sysInitData);
        baseProperty.put("length",1024);
        baseProperty.put("page_component_input",13);
        baseProperty.put("page_component_output",13);
        basePropertyList.add(baseProperty);
        /************************************/
        entityId =  mongoDBService.getNextId(collection);
        uuid = UUID.randomUUID().toString().replaceAll("-", "");
        baseProperty.put("uuid",uuid);
        baseProperty.put("entity_id",entityId);
        baseProperty.put("title","是否已删除");
        baseProperty.put("description","是否已删除");
        baseProperty.put("property_name","deleted");
        baseProperty.put("property_type",1003);
        baseProperty.put("show_type",1103);
        baseProperty.put("sort",104);
        baseProperty.put("required",0);
        baseProperty.put("default_value",0);
        baseProperty.put("hidden",0);
        baseProperty.put("readonly",0);
        //baseProperty.put("js_handle",tt);
        baseProperty.put("attach_num",1);
        baseProperty.put("save_to_search_engine",0);
        baseProperty.put("sys_default_flag",10405);
        baseProperty.put("sys_init_data",sysInitData);
        //baseProperty.put("length",1024);
        baseProperty.put("page_component_input",13);
        baseProperty.put("page_component_output",13);
        basePropertyList.add(baseProperty);
        /************************************/
        entityId = mongoDBService.getNextId(collection);
        uuid = UUID.randomUUID().toString().replaceAll("-", "");
        baseProperty.put("uuid",uuid);
        baseProperty.put("entity_id",entityId);
        baseProperty.put("title","是否启用");
        baseProperty.put("description","是否启用");
        baseProperty.put("property_name","enabled");
        baseProperty.put("property_type",1003);
        baseProperty.put("show_type",1103);
        baseProperty.put("sort",105);
        baseProperty.put("required",0);
        baseProperty.put("default_value",1);
        baseProperty.put("hidden",0);
        baseProperty.put("readonly",0);
        //baseProperty.put("js_handle",tt);
        baseProperty.put("attach_num",1);
        baseProperty.put("save_to_search_engine",0);
        baseProperty.put("sys_default_flag",10406);
        baseProperty.put("sys_init_data",sysInitData);
        //baseProperty.put("length",1024);
        baseProperty.put("page_component_input",13);
        baseProperty.put("page_component_output",13);
        basePropertyList.add(baseProperty);
        /************************************/
        entityId = mongoDBService.getNextId(collection);
        uuid = UUID.randomUUID().toString().replaceAll("-", "");
        baseProperty.put("uuid",uuid);
        baseProperty.put("entity_id",entityId);
        baseProperty.put("title","创建人");
        baseProperty.put("description","创建人");
        baseProperty.put("property_name","created_by");
        baseProperty.put("property_type",1011);
        baseProperty.put("show_type",1107);
        baseProperty.put("sort",106);
        baseProperty.put("required",0);
        //baseProperty.put("default_value",1);
        baseProperty.put("hidden",0);
        baseProperty.put("readonly",0);
        //baseProperty.put("js_handle",tt);
        baseProperty.put("attach_num",1);
        baseProperty.put("save_to_search_engine",0);
        baseProperty.put("sys_default_flag",10407);
        baseProperty.put("sys_init_data",sysInitData);
        //baseProperty.put("length",1024);
        baseProperty.put("page_component_input",6);
        baseProperty.put("page_component_output",6);
        basePropertyList.add(baseProperty);
        /************************************/
        entityId = mongoDBService.getNextId(collection);
        uuid = UUID.randomUUID().toString().replaceAll("-", "");
        baseProperty.put("uuid",uuid);
        baseProperty.put("entity_id",entityId);
        baseProperty.put("title","创建时间");
        baseProperty.put("description","创建时间");
        baseProperty.put("property_name","created_at");
        baseProperty.put("property_type",1010);
        baseProperty.put("show_type",1105);
        baseProperty.put("sort",107);
        baseProperty.put("required",0);
        baseProperty.put("default_value","CURRENT_TIMESTAMP");
        baseProperty.put("hidden",0);
        baseProperty.put("readonly",0);
        //baseProperty.put("js_handle",tt);
        baseProperty.put("attach_num",1);
        baseProperty.put("save_to_search_engine",0);
        baseProperty.put("sys_default_flag",10408);
        baseProperty.put("sys_init_data",sysInitData);
        //baseProperty.put("length",1024);
        baseProperty.put("page_component_input",7);
        baseProperty.put("page_component_output",7);
        basePropertyList.add(baseProperty);
        /************************************/
        entityId = mongoDBService.getNextId(collection);
        uuid = UUID.randomUUID().toString().replaceAll("-", "");
        baseProperty.put("uuid",uuid);
        baseProperty.put("entity_id",entityId);
        baseProperty.put("title","更新人");
        baseProperty.put("description","更新人");
        baseProperty.put("property_name","updated_by");
        baseProperty.put("property_type",1011);
        baseProperty.put("show_type",1107);
        baseProperty.put("sort",108);
        baseProperty.put("required",0);
        //baseProperty.put("default_value","CURRENT_TIMESTAMP");
        baseProperty.put("hidden",0);
        baseProperty.put("readonly",0);
        //baseProperty.put("js_handle",tt);
        baseProperty.put("attach_num",1);
        baseProperty.put("save_to_search_engine",0);
        baseProperty.put("sys_default_flag",10409);
        baseProperty.put("sys_init_data",sysInitData);
        //baseProperty.put("length",1024);
        baseProperty.put("page_component_input",6);
        baseProperty.put("page_component_output",6);
        basePropertyList.add(baseProperty);
        /************************************/
        entityId = mongoDBService.getNextId(collection);
        uuid = UUID.randomUUID().toString().replaceAll("-", "");
        baseProperty.put("uuid",uuid);
        baseProperty.put("entity_id",entityId);
        baseProperty.put("title","更新时间");
        baseProperty.put("description","更新时间");
        baseProperty.put("property_name","updated_at");
        baseProperty.put("property_type",1010);
        baseProperty.put("show_type",1105);
        baseProperty.put("sort",109);
        baseProperty.put("required",0);
        baseProperty.put("default_value","CURRENT_TIMESTAMP");
        baseProperty.put("hidden",0);
        baseProperty.put("readonly",0);
        //baseProperty.put("js_handle",tt);
        baseProperty.put("attach_num",1);
        baseProperty.put("save_to_search_engine",0);
        baseProperty.put("sys_default_flag",10410);
        baseProperty.put("sys_init_data",sysInitData);
        //baseProperty.put("length",1024);
        baseProperty.put("page_component_input",7);
        baseProperty.put("page_component_output",7);
        basePropertyList.add(baseProperty);
        return  basePropertyList;
    }

    public Map<String,Object> entityPropertyToMapByBasic(EntityProperty entityProperty, Map<String,Object> map){
        if (entityProperty.getUuid() != null){
            map.put("uuid",entityProperty.getUuid());
        }
        if (entityProperty.getCustomCode() != null){
            map.put("custom_code",entityProperty.getCustomCode());
        }
        if (entityProperty.getDescription() != null){
            map.put("description",entityProperty.getDescription());
        }
        if (entityProperty.getSysInitData() != null){
            map.put("sys_init_data",entityProperty.getSysInitData());
        }
        if (entityProperty.getDeleted() != null){
            map.put("deleted",entityProperty.getDeleted());
        }
        if (entityProperty.getEnabled() != null){
            map.put("enabled",entityProperty.getEnabled());
        }
        if (entityProperty.getCreatedBy() != null){
            map.put("created_by",entityProperty.getCreatedBy());
        }
        if (entityProperty.getUpdatedBy() != null){
            map.put("updated_by",entityProperty.getUpdatedBy());
        }
        if (entityProperty.getCreatedAt() != null){
            map.put("created_at",entityProperty.getCreatedAt());
        }
        if (entityProperty.getUpdatedAt() != null){
            map.put("updated_at",entityProperty.getUpdatedAt());
        }
        return map;
    }

    public Map<String,Object> entityPropertyToMapByOther(EntityProperty entityProperty, Map<String,Object> map){

        if (entityProperty.getEntityId() != null){
            map.put("entity_id",entityProperty.getEntityId());
        }
        if (entityProperty.getTitle() != null){
            map.put("title",entityProperty.getTitle());
        }
        if (entityProperty.getPropertyName() != null){
            map.put("property_name",entityProperty.getPropertyName());
        }
        if (entityProperty.getPropertyType() != null){
            map.put("property_type",entityProperty.getPropertyType());
        }
        if (entityProperty.getShowType() != null){
            map.put("show_type",entityProperty.getShowType());
        }
        if (entityProperty.getTargetId() != null){
            map.put("target_id",entityProperty.getTargetId());
        }
        if (entityProperty.getSort() != null){
            map.put("sort",entityProperty.getSort());
        }
        if (entityProperty.getRequired() != null){
            map.put("required",entityProperty.getRequired());
        }
        if (entityProperty.getDefaultValue() != null){
            map.put("default_value",entityProperty.getDefaultValue());
        }
        if (entityProperty.getHidden() != null) {
            map.put("hidden", entityProperty.getHidden());
        }
        if (entityProperty.getReadonly() != null) {
            map.put("readonly", entityProperty.getReadonly());
        }
        if (entityProperty.getJsHandle() != null) {
            map.put("js_handle", entityProperty.getJsHandle());
        }
        if (entityProperty.getAttachNum() != null) {
            map.put("attach_num", entityProperty.getAttachNum());
        }
        if (entityProperty.getLength() != null) {
            map.put("length", entityProperty.getLength());
        }
        if (entityProperty.getSaveToSearchEngine() != null) {
            map.put("save_to_search_engine", entityProperty.getSaveToSearchEngine());
        }
        if (entityProperty.getSysDefaultFlag() != null) {
            map.put("sys_default_flag", entityProperty.getSysDefaultFlag());
        }
        if (entityProperty.getPropertyConstraint() != null) {
            map.put("property_constraint", entityProperty.getPropertyConstraint());
        }
        if (entityProperty.getPageComponentInput() != null) {
            map.put("page_component_input", entityProperty.getPageComponentInput());
        }
        if (entityProperty.getPageComponentOutput() != null) {
            map.put("page_component_output", entityProperty.getPageComponentOutput());
        }
        if (entityProperty.getPropertyUnit() != null) {
            map.put("property_unit", entityProperty.getPropertyUnit());
        }
        return map;
    }













}
