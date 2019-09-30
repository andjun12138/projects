package com.mongodb.mongo;


import com.mongodb.mongo.domain.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by caimb on 2017/5/12.
 */
public class MongoQueryBuilder implements Serializable {
    private String collection;
    private String alias;

    private List<MongoProject> projects;
    private List<MongoLookup> mongoLookups;
    private MongoMatch mongoMatch;
    private MongoLimit mongoLimit;
    private MongoCount mongoCount;
    private MongoGroup mongoGroup;
    private List<MongoSort> mongoSorts;

    public MongoQueryBuilder(String collection) {
        this.collection = collection;
    }

    public Map<String, Object> build() {
        HashMap<String, Object> doc = new HashMap<>();
        if(this.collection != null) {
            doc.put(MongoBuilders.COLLECTION, this.collection );
        }
        if (this.projects != null) {
            doc.put(MongoBuilders.PROJECT, this.projects);
        }
        if (this.mongoLookups != null) {
            doc.put(MongoBuilders.LOOKUP, mongoLookups);
        }
        if (this.mongoMatch != null) {
            doc.put(MongoBuilders.MATCH, this.mongoMatch);
        }
        if (this.mongoLimit != null) {
            doc.put(MongoBuilders.LIMIT, this.mongoLimit);
        }
        if (this.mongoCount != null) {
            doc.put(MongoBuilders.COUNT, this.mongoCount);
        }
        if (this.mongoGroup != null) {
            doc.put(MongoBuilders.GROUP, this.mongoGroup);
        }
        if (this.mongoSorts != null) {
            doc.put(MongoBuilders.SORT, this.mongoSorts);
        }
        return doc;
    }

    public MongoQueryBuilder withCollection(String collection) {
        this.collection = collection;
        return this;
    }

    public MongoQueryBuilder withProject(MongoProject mongoProject) {
        if(projects==null){
            projects = new ArrayList<>();
        }
        this.projects.add(mongoProject);
        return this;
    }

    public MongoQueryBuilder withMongoLookup(MongoLookup mongoLookup) {
        if(mongoLookups==null){
            mongoLookups = new ArrayList<>();
        }
        this.mongoLookups.add(mongoLookup);
        return this;
    }

    public MongoQueryBuilder withMongoMatch(MongoMatch mongoMatch) {
        this.mongoMatch = mongoMatch;
        return this;
    }

    public MongoQueryBuilder withMongoLimit(MongoLimit mongoLimit) {
        this.mongoLimit = mongoLimit;
        return this;
    }

    public MongoQueryBuilder withMongoCount(MongoCount mongoCount) {
        this.mongoCount = mongoCount;
        return this;
    }

    public MongoQueryBuilder withMongoGroup(MongoGroup mongoGroup) {
        this.mongoGroup = mongoGroup;
        return this;
    }

    public MongoQueryBuilder withMongoSort(List<MongoSort> mongoSorts){
        this.mongoSorts = mongoSorts;
        return this;
    }


    public List<MongoSort> getMongoSort() {
        return mongoSorts;
    }

    public void setMongoSort(List<MongoSort> mongoSorts) {
        this.mongoSorts = mongoSorts;
    }

    public String getCollection() {
        return collection;
    }

    public void setCollection(String collection) {
        this.collection = collection;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public List<MongoProject> getProjects() {
        return projects;
    }

    public void setProjects(List<MongoProject> projects) {
        this.projects = projects;
    }

    public List<MongoLookup> getMongoLookups() {
        return mongoLookups;
    }

    public void setMongoLookups(List<MongoLookup> mongoLookups) {
        this.mongoLookups = mongoLookups;
    }

    public MongoMatch getMongoMatch() {
        return mongoMatch;
    }

    public void setMongoMatch(MongoMatch mongoMatch) {
        this.mongoMatch = mongoMatch;
    }

    public MongoLimit getMongoLimit() {
        return mongoLimit;
    }

    public void setMongoLimit(MongoLimit mongoLimit) {
        this.mongoLimit = mongoLimit;
    }

    public MongoCount getMongoCount() {
        return mongoCount;
    }

    public void setMongoCount(MongoCount mongoCount) {
        this.mongoCount = mongoCount;
    }

    public MongoGroup getMongoGroup() {
        return mongoGroup;
    }

    public void setMongoGroup(MongoGroup mongoGroup) {
        this.mongoGroup = mongoGroup;
    }



}
