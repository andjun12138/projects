package com.mongodb.service;

import com.mongodb.mongo.domain.MongoLimit;

import java.util.List;
import java.util.Map;

/**
 * Created by hjf on 2018/1/4.
 */
public interface MongoDBService {

    /*
    * 复杂动态聚合查询aggregate
    * doc:聚合查询时的各种拼接内容
    * */
    public List<Map<String,Object>> dynamicQuery(Map<String, Object> doc);

    /*
    * 获取某个表的自增的id，用于该表插入记录
    * collection:集合的名称
    * */
    public Long getNextId(String collection);

    /*
    * 简单的动态查询，一般用于单个表查询数据  如果有视图的话也可以查询视图
    * collection:集合的名称
    * queryMap:查询的条件
    * projectMap：要显示或不显示某些字段
    * sortMap:排序的条件
    * mongoLimit:分页参数
    * */
    public List<Map<String,Object>> simpleDynamicQuery(String collection, Map<String, Object> queryMap, Map<String, Object> projectMap, Map<String, Object> sortMap, MongoLimit mongoLimit);


    /*
    * 简单泛型查询
    * */
    public <T> List<T> simpleQuery(Map<String, Object> queryMap, Map<String, Object> sortMap, Class<T> tClass, String collectionName);

    /*
    * 查询是否存在某个表（只是检测维护表自增id表里面是否有某个表的记录）
    * collection:集合的名称
    * */
    public boolean isExistCollection(String collection);

    /*
    * 创建集合（即是表） 同时在维护自增id的表中添加一条记录
    * collection:集合的名称
    * */
    public void createCollection(String collection);

    /*
    *  删除集合 只是把维护自增id表中的该集合的记录的deleted变成1
    * collection:集合的名称
    * */
    public void deleteCollection(String collection);

    /*
    * 动态添加或更新某个集合的记录
    * collection:集合的名称
    * idKey:查询条件的key
    * idValue:判断插入或更新的一个条件,如果为空就直接插入
    * fieldMap:要插入或更新的字段以及对应的值
    * */
    public Object dynamicInsertOrUpdate(String collection, String idKey, String idValue, Map<String, Object> fieldMap);

    /*
    * 动态删除某个表的某条记录（不是软删除）
    * collection:集合的名称
    * deleteMap:删除的条件
    * */
    public void dynamicReallyDelete(String collection, Map<String, Object> deleteMap);


    /*
    * 动态删除某个表的某条记录(软删除)
    * */
    public void dynamicSoftDelete(String collection, Map<String, Object> deleteMap);

    /*
    * 清空集合的所有记录
    * collection:集合的名称
    * */
    public void dropCollection(String collection);

    /*
    * 直接执行mongodb的js命令
    * */
    public Object executeCommand(String jsonCommand, Object... params);

    /*
    * 替某个表的字段添加上索引
    * */
    public void addIndexWithCollection(String collection, Map<String, Object> map);

    /*
    * 删除某个表的索引
    * */
    public void dropIndexWithCollection(String collection, Map<String, Object> map);

    /*
    * 批量插入操作
    * */
    public void bulkExecute(String collection, List<Map<String, Object>> insertList);


    /********************************************************新增******************************************************************/
    /*
    * 创建视图（不知道为什么创建不成功//TODO）
    * */
    public void createView(String viewName, String source, Map<String, Object> doc);


}
