package com.mongodb.mongo.enumeration;

/**
 * Created by hjf on 2017/5/16.
 */
public enum MongoLogic {
    AND("and"),
    OR("or");

    private String value;

    MongoLogic(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }

    public String toString() {
        return this.value;
    }
}
