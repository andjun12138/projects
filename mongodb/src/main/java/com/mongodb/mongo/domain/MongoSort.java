package com.mongodb.mongo.domain;

/**
 * Created by hjf on 2017/12/16.
 */
public class MongoSort {
    private String key;
    private Object value = 1;

    public MongoSort(String key, Object value) {
        this.key = key;
        this.value = value;
    }

    public MongoSort(String key) {
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
