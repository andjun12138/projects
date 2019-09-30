package com.mongodb.controller;

import com.mongodb.entity.Entity;
import com.mongodb.service.MongoDBService;
import com.mongodb.service.impl.MongoDBEntityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.UUID;

/**
 * Created by liuxh on 2017/12/6.
 */
@Controller
@RequestMapping(value = {"/entity", "*/entity"})
public class EntityController {

    @Autowired
    private MongoDBService mongoDBService;
    @Autowired
    private MongoDBEntityService mongoDBEntityService;

    @Autowired
    private MongoTemplate mongoTemplate;

    @RequestMapping("/create")
    @ResponseBody
    public Object create(){
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        Entity entity = new Entity();
        entity.setUuid(uuid);
        entity.setCollection("s_base_entity");
        entity.setTitle("教师人员概况");
        entity.setDescription("教师人员概况");
        entity.setPhysicalTable(false);
        entity.setSaveToSearchEngine(false);
        entity.setModuleId(11L);
        entity.setDeleted(false);
        return mongoDBEntityService.create(entity,null);
    }

    @RequestMapping("/getById/{id}")
    @ResponseBody
    public Object getById(@PathVariable("id") Long id){

        return mongoDBEntityService.getById(id);
    }
    @RequestMapping("/getByUUID")
    @ResponseBody
    public Object getByUUID(){

        return mongoDBEntityService.getByUUID("5742f9c9790a4150ac0f61fb2dc954f3");
    }
    @RequestMapping("/getByCollection/{collection}")
    @ResponseBody
    public Object getByCollection(@PathVariable("collection") String collection){
        return mongoDBEntityService.getByCollection(collection);
    }

    @RequestMapping("/getByModuleId")
    @ResponseBody
    public Object getByModuleId(){
        return mongoDBEntityService.getByModuleId(11L);
    }

    @RequestMapping("/delete")
    @ResponseBody
    public Object delete(){
        return mongoDBEntityService.delete(8L);
    }

    @RequestMapping("/update")
    @ResponseBody
    public Object update(){
        Entity entity = new Entity();
        entity.setId(9L);
        entity.setCollection("teacher");
        entity.setTitle("教师人员概况1111");
        entity.setDescription("教师人员概况1111");
        entity.setPhysicalTable(false);
        entity.setSaveToSearchEngine(false);
        entity.setModuleId(11L);
        entity.setDeleted(false);
        mongoDBEntityService.update(entity,"");
        return null;
    }



































}
