package com.mongodb.mongo.domain;


import com.mongodb.mongo.enumeration.MongoLogic;

import java.util.List;

/**
 * Created by hjf on 2017/12/16.
 */
public class MongoMatch {
    private String field;
    //private MongoSign mongoSign;
    private MongoLogic mongoLogic;
    private Object value;
    private List<MongoMatch> mongoMatches;

/*
    public MongoMatch(String field, MongoLogic mongoLogic, String value, List<MongoMatch> mongoMatches) {
        this.field = field;
        //this.mongoSign = mongoSign;
        this.mongoLogic = mongoLogic;
        this.value = value;
        this.mongoMatches = mongoMatches;
    }
*/

    public MongoMatch(String field,Object value) {
        this.field = field;
       //this.mongoSign = mongoSign;
        this.value = value;
    }


    public MongoMatch( MongoLogic mongoLogic,List<MongoMatch> mongoMatches) {
        this.mongoLogic = mongoLogic;
        this.mongoMatches = mongoMatches;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public MongoLogic getMongoLogic() {
        return mongoLogic;
    }

    public void setMongoLogic(MongoLogic mongoLogic) {
        this.mongoLogic = mongoLogic;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public List<MongoMatch> getMongoMatches() {
        return mongoMatches;
    }

    public void setMongoMatches(List<MongoMatch> mongoMatches) {
        this.mongoMatches = mongoMatches;
    }
}
