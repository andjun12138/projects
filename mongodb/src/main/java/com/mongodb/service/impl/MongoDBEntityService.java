package com.mongodb.service.impl;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.WriteResult;
import com.mongodb.entity.Entity;
import com.mongodb.service.MongoDBService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.Map.Entry;

/**
 * Created by lihp on 2018/1/8.
 */
@Service
public class MongoDBEntityService{

    @Autowired
    private MongoDBService mongoDBService;

    private MongoTemplate mongoTemplate;

    public MongoDBEntityService(MongoTemplate mongoTemplate){
        this.mongoTemplate = mongoTemplate;
    }


    public Long create(Entity entity, String transactionId) {
        String collection = "s_base_entity";
        Long entityId = mongoDBService.getNextId(collection);
        entity.setId(entityId);
        mongoTemplate.insert(entity,collection);
        return Long.valueOf(entityId);
    }

    public Entity getById(Long entityId) {
        String collection = "s_base_entity";
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(entityId));
        List<Entity> entityList = mongoTemplate.find(query,Entity.class,collection);
        if (entityList.size() > 0){
            return entityList.get(0);
        }
        return null;
    }

    //TODO
    public Entity getSimpleById(Long id) {
        return getById(id);
    }
    public Entity getByUUID( String uuid)  {
        String collection = "s_base_entity";
        Query query = new Query();
        query.addCriteria(Criteria.where("uuid").is(uuid));
        List<Entity> entityList = mongoTemplate.find(query,Entity.class,collection);
        if (entityList.size() > 0){
            return entityList.get(0);
        }
        return null;
    }
    public Entity getSimpleByUUID(String uuid){
        return getByUUID(uuid);
    }

    public Entity getByCollection(String col) {
        String collection = "s_base_entity";
        Query query = new Query();
        query.addCriteria(Criteria.where("collection").is(col));
        List<Entity> entityList = mongoTemplate.find(query,Entity.class,collection);
        if (entityList.size() > 0){
            return entityList.get(0);
        }
        return null;
    }

    public List<Entity> getByModuleId(Long group) {
        String collection = "s_base_entity";
        Query query = new Query();
        query.addCriteria(Criteria.where("module_id").is(group));
        query.addCriteria(Criteria.where("deleted").is(false));
        List<Entity> entityList = mongoTemplate.find(query,Entity.class,collection);
        return entityList;
    }

    public int delete(Long id){
        String collection = "s_base_entity";
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(id));
        WriteResult wr = mongoTemplate.remove(query,collection);
        return wr.getN();
    }


    public void update(Entity entity,String transactionId) {
        String collection = "s_base_entity";
        Long entityId = entity.getId();
        Map<String,Object> updateMap = new HashMap<>();
        updateMap = entityToMapByBasic(entity,updateMap);
        updateMap = entityToMapByOther(entity,updateMap);

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

    /**
     * 分页查询所有实体
     */
    public List<Entity> queryEntitiesWithExample(Entity entity,int offset,int size,Map<String,Object> sort) {
        String collection = "s_base_entity";
        Query query = new Query();
        query = entityToQueryByBasic(entity,query,0);
        query = entityToQueryByOther(entity,query);
        query.skip(offset);
        query.limit(size);
        Sort sorts = buildQuerySortByMap(sort);
        if (sorts != null) {
            query.with(sorts);
        }
        return mongoTemplate.find(query,Entity.class,collection);
    }

    /**
     * 分页查询未被删除的实体
     */
    public List<Entity> queryEntitiesWithExampleNotDeleted(Entity entity,int offset,int size,Map<String,Object> sort) {
        String collection = "s_base_entity";
        Query query = new Query();
        query = entityToQueryByBasic(entity,query,1);
        query = entityToQueryByOther(entity,query);
        query.skip(offset);
        query.limit(size);
        Sort sorts = buildQuerySortByMap(sort);
        if (sorts != null) {
            query.with(sorts);
        }
        return mongoTemplate.find(query,Entity.class,collection);
    }

    public Long countEntitiesWithExample(Entity entity){
        String collection = "s_base_entity";
        Query query = new Query();
        query = entityToQueryByBasic(entity,query,0);
        query = entityToQueryByOther(entity,query);
        return  mongoTemplate.count(query,collection);
    }

    public Long countEntitiesWithExampleNoDeleted(Entity entity) {
        String collection = "s_base_entity";
        Query query = new Query();
        query = entityToQueryByBasic(entity,query,1);
        query = entityToQueryByOther(entity,query);
        return mongoTemplate.count(query,collection);
    }


    public Sort buildQuerySortByMap(Map<String,Object> sort){
        Sort sorts = null;
        boolean flag = true;
        Iterator iterator = sort.entrySet().iterator();
        while (iterator.hasNext()){
            Entry entry = (Entry) iterator.next();
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


    public Entity mapToEntity(Map<String,Object> map){
        Entity entity = new Entity();
        entity.setTitle((String) map.get("title"));
        entity.setCollection((String) map.get("collection"));
        entity.setModuleId(Long.valueOf((Integer)map.get("module_id")));
        entity.setStorageType(Long.valueOf((Integer) map.get("storage_type")));
        entity.setPhysicalTable((Boolean) map.get("physical_table"));
        entity.setSaveToSearchEngine((Boolean) map.get("save_to_search_engine"));
        entity.setEnabledCustomCode((Boolean) map.get("enabled_custom_code"));
        entity.setLayoutType(Long.valueOf((Integer) map.get("layout_type")));

        entity.setId(Long.valueOf((Integer)map.get("id")));
        entity.setDescription((String) map.get("description"));
        entity.setUuid((String) map.get("uuid"));
        entity.setCustomCode((String) map.get("custom_code"));
        entity.setDeleted((Boolean) map.get("deleted"));
        entity.setEnabled((Boolean) map.get("enabled"));
        entity.setSysInitData((Boolean) map.get("sys_init_data"));
        entity.setCreatedBy(Long.valueOf((Integer)map.get("created_by")));
        entity.setUpdatedBy(Long.valueOf((Integer)map.get("updated_by")));
        entity.setCreatedAt((Date) map.get("created_at"));
        entity.setUpdatedAt((Date) map.get("updated_at"));
        return entity;
    }

    public Query entityToQueryByOther(Entity entity,Query query){
        if (entity.getTitle() != null){
            query.addCriteria(Criteria.where("title").regex(entity.getTitle()));
        }
        if (entity.getCollection() != null){
            query.addCriteria(Criteria.where("collection").regex(entity.getCollection()));
        }
        if (entity.getModuleId() != null){
            query.addCriteria(Criteria.where("module_id").is(entity.getModuleId()));
        }
        if (entity.getTargetKey() != null){
            query.addCriteria(Criteria.where("target_key").is(entity.getTargetKey()));
        }
        if (entity.getSaveToSearchEngine() != null){
            query.addCriteria(Criteria.where("save_to_search_engine").is(entity.getSaveToSearchEngine()));
        }
        if (entity.getLayoutType() != null){
            query.addCriteria(Criteria.where("layout_type").is(entity.getLayoutType()));
        }
        if (entity.getStorageType() != null){
            query.addCriteria(Criteria.where("storage_type").is(entity.getStorageType()));
        }
        if (entity.getEnabledCustomCode() != null){
            query.addCriteria(Criteria.where("enabled_custom_code").is(entity.getEnabledCustomCode()));
        }
        if (entity.getPhysicalTable() != null) {
            query.addCriteria(Criteria.where("physical_table").is(entity.getEnabledCustomCode()));
        }
        return query;
    }



    public Query entityToQueryByBasic(Entity entity,Query query,int type){
        if (entity.getId() != null){
            query.addCriteria(Criteria.where("id").is(entity.getId()));
        }
        if (entity.getUuid() != null){
            query.addCriteria(Criteria.where("uuid").is(entity.getUuid()));
        }
        if (entity.getCustomCode() != null){
            query.addCriteria(Criteria.where("custom_code").is(entity.getCustomCode()));
        }
        if (entity.getDescription() != null){
            query.addCriteria(Criteria.where("description").is(entity.getDescription()));
        }
        if (entity.getSysInitData() != null){
            query.addCriteria(Criteria.where("sys_init_data").is(entity.getSysInitData()));
        }
        if (type == 0){//说明是要加deleted的
            if (entity.getDeleted() != null){
                query.addCriteria(Criteria.where("deleted").is(entity.getDeleted()));
            }
        }
        if (entity.getEnabled() != null){
            query.addCriteria(Criteria.where("enabled").is(entity.getEnabled()));
        }
        if (entity.getCreatedBy() != null){
            query.addCriteria(Criteria.where("created_by").is(entity.getCreatedBy()));
        }
        if (entity.getUpdatedBy() != null){
            query.addCriteria(Criteria.where("updated_by").is(entity.getUpdatedBy()));
        }
        if (entity.getCreatedAt() != null){
            query.addCriteria(Criteria.where("created_at").is(entity.getCreatedAt()));
        }
        if (entity.getUpdatedAt() != null){
            query.addCriteria(Criteria.where("updated_at").is(entity.getUpdatedAt()));
        }
        return  query;
    }

    public Map<String,Object> entityToMapByBasic(Entity entity,Map<String,Object> map){
        if (entity.getUuid() != null){
            map.put("uuid",entity.getUuid());
        }
        if (entity.getCustomCode() != null){
            map.put("custom_code",entity.getCustomCode());
        }
        if (entity.getDescription() != null){
            map.put("description",entity.getDescription());
        }
        if (entity.getSysInitData() != null){
            map.put("sys_init_data",entity.getSysInitData());
        }
        if (entity.getDeleted() != null){
            map.put("deleted",entity.getDeleted());
        }
        if (entity.getEnabled() != null){
            map.put("enabled",entity.getEnabled());
        }
        if (entity.getCreatedBy() != null){
            map.put("created_by",entity.getCreatedBy());
        }
        if (entity.getUpdatedBy() != null){
            map.put("updated_by",entity.getUpdatedBy());
        }
        if (entity.getCreatedAt() != null){
            map.put("created_at",entity.getCreatedAt());
        }
        if (entity.getUpdatedAt() != null){
            map.put("updated_at",entity.getUpdatedAt());
        }
        return map;
    }

    public Map<String,Object> entityToMapByOther(Entity entity,Map<String,Object> map){

        if (entity.getTitle() != null){
            map.put("title",entity.getTitle());
        }
        if (entity.getCollection() != null){
            map.put("collection",entity.getCollection());
        }
        if (entity.getModuleId() != null){
            map.put("module_id",entity.getModuleId());
        }
        if (entity.getTargetKey() != null){
            map.put("target_key",entity.getTargetKey());
        }
        if (entity.getSaveToSearchEngine() != null){
            map.put("save_to_search_engine",entity.getSaveToSearchEngine());
        }
        if (entity.getLayoutType() != null){
            map.put("layout_type",entity.getLayoutType());
        }
        if (entity.getStorageType() != null){
            map.put("storage_type",entity.getStorageType());
        }
        if (entity.getEnabledCustomCode() != null){
            map.put("enabled_custom_code",entity.getEnabledCustomCode());
        }
        if (entity.getPhysicalTable() != null) {
            map.put("physical_table", entity.getPhysicalTable());
        }
        return map;
    }
}
