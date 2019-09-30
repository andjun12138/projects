package com.mongodb.mongo.domain;

import java.util.List;

/**
 * Created by hjf on 2017/12/16.
 */
public class MongoGroup {
    private String primaryKey = "_id";
    private String primaryValue;
    private List<GroupCalculate> groupCalculates;

    public MongoGroup(String primaryValue) {
        this.primaryValue = primaryValue;
    }

    public MongoGroup(String primaryValue, List<GroupCalculate> groupCalculates) {
        this.primaryValue = primaryValue;
        this.groupCalculates = groupCalculates;
    }

    public String getPrimaryKey() {
        return primaryKey;
    }

    public void setPrimaryKey(String primaryKey) {
        this.primaryKey = primaryKey;
    }

    public String getPrimaryValue() {
        return primaryValue;
    }

    public void setPrimaryValue(String primaryValue) {
        this.primaryValue = primaryValue;
    }

    public List<GroupCalculate> getGroupCalculates() {
        return groupCalculates;
    }

    public void setGroupCalculates(List<GroupCalculate> groupCalculates) {
        this.groupCalculates = groupCalculates;
    }


}
