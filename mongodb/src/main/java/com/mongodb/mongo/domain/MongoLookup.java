package com.mongodb.mongo.domain;


import com.mongodb.mongo.enumeration.Lookup;

/**
 * Created by hjf on 2017/12/16.
 */
public class MongoLookup {
    private String from;
    private String localField;
    private String foreignField;
    private String as;
    private String let;
    private String pipeLine;
    private Lookup lookup;


    protected MongoLookup(String from, String localField, String foreignField, String as, Lookup lookup) {
        this.from = from;
        this.as = as;
        this.lookup = lookup;
        if (lookup == Lookup.JOIN){
            this.let = localField;
            this.pipeLine = foreignField;
        }else if (lookup == Lookup.UN_JOIN){
            this.localField = localField;
            this.foreignField = foreignField;
        }
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getLocalField() {
        return localField;
    }

    public void setLocalField(String localField) {
        this.localField = localField;
    }

    public String getForeignField() {
        return foreignField;
    }

    public void setForeignField(String foreignField) {
        this.foreignField = foreignField;
    }

    public String getAs() {
        return as;
    }

    public void setAs(String as) {
        this.as = as;
    }

    public String getLet() {
        return let;
    }

    public void setLet(String let) {
        this.let = let;
    }

    public String getPipeLine() {
        return pipeLine;
    }

    public void setPipeLine(String pipeLine) {
        this.pipeLine = pipeLine;
    }

    public Lookup getLookup() {
        return lookup;
    }

    public void setLookup(Lookup lookup) {
        this.lookup = lookup;
    }
}
