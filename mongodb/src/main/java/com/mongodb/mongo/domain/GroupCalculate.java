package com.mongodb.mongo.domain;


import com.mongodb.mongo.enumeration.MongoFunction;
import com.mongodb.mongo.enumeration.MongoSign;

import java.util.List;

/**
 * Created by hjf on 2017/12/16.
 */
public class GroupCalculate {
    private String field;
    private MongoFunction mongoFunction;
    private MongoSign mongoSign;
    private String alias;
    private List<GroupCalculate> groupCalculates;

    public GroupCalculate(String alias, List<GroupCalculate> groupCalculates) {
        this.alias = alias;
        this.groupCalculates = groupCalculates;
    }

    public GroupCalculate(String field, MongoFunction mongoFunction, MongoSign mongoSign, List<GroupCalculate> groupCalculates) {
        this.field = field;
        this.mongoFunction = mongoFunction;
        this.mongoSign = mongoSign;
        this.groupCalculates = groupCalculates;
    }


    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public MongoFunction getMongoFunction() {
        return mongoFunction;
    }

    public void setMongoFunction(MongoFunction mongoFunction) {
        this.mongoFunction = mongoFunction;
    }

    public MongoSign getMongoSign() {
        return mongoSign;
    }

    public void setMongoSign(MongoSign mongoSign) {
        this.mongoSign = mongoSign;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public List<GroupCalculate> getGroupCalculates() {
        return groupCalculates;
    }

    public void setGroupCalculates(List<GroupCalculate> groupCalculates) {
        this.groupCalculates = groupCalculates;
    }
}
