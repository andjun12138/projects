package com.mongodb.mongo.enumeration;

/**
 * Created by hjf on 2017/12/16.
 */
public enum MongoFunction {
    SUM("$sum"),
    AVG("$avg"),
    PUSH("$push")
    ;

    private String value;

    MongoFunction(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }

    public String toString() {
        return this.value;
    }
}