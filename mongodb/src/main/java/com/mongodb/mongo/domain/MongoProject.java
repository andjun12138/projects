package com.mongodb.mongo.domain;

/**
 * Created by hjf on 2017/12/16.
 */
public class MongoProject {
    private String key;
    private Object value = 1;

    public MongoProject(String key, Object value) {
        this.key = key;
        this.value = value;
    }

    public MongoProject(String key) {
        this.key = key;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }
}
