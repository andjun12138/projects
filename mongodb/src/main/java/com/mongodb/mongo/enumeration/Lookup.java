package com.mongodb.mongo.enumeration;

/**
 * Created by hjf on 2017/12/16.
 */
public enum Lookup {
    JOIN("join"),
    UN_JOIN("un_join");

    private String value;

    Lookup(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }

    public String toString() {
        return this.value;
    }

}
