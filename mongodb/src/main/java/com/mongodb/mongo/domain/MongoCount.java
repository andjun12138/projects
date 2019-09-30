package com.mongodb.mongo.domain;

/**
 * Created by hjf on 2017/12/16.
 */
public class MongoCount {
    private String value;

    public MongoCount(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
