package com.mongodb.mongo.enumeration;

/**
 * Created by hjf on 2017/12/16.
 */
public enum MongoSign {
    //group中可以使用
    MULTIPLY("$multiply"),
    //match中可以使用
    REGEX("$regex"),//正则表达式匹配，因为mongodb中没有像mysql中的like关键字，所以用这个来代替
    EQUAL("$eq"),
    NOT_EQUAL("$ne"),
    IN("$in"),
    NIN("$nin"),
    IS_NULL("{$exists: false }"),
    NOT_NULL("{$exists: true }"),
    BETWEEN(""),
    GREATER("$gt"),
    GREATER_CONTAIN("$gte"),
    LESS("$lt"),
    LESS_CONTAIN("$lte")
    ;

    private String value;

    MongoSign(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }

    public String toString() {
        return this.value;
    }
}
