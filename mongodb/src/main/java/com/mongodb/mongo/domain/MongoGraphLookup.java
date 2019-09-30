package com.mongodb.mongo.domain;


/**
 * Created by hjf on 2017/12/16.
 */
public class MongoGraphLookup {
    private String from;
    private String startWith;
    private String connectFromField;
    private String connectToField;
    private String as;
    private String maxDepth;
    private String depthField;
    private String restrictSearchWithMatch;


    protected MongoGraphLookup(String from, String startWith, String connectFromField, String connectToField, String as, String maxDepth, String depthField, String restrictSearchWithMatch) {
        this.from = from;
        this.startWith = startWith;
        this.connectFromField = connectFromField;
        this.connectToField = connectToField;
        this.as = as;
        this.maxDepth = maxDepth;
        this.depthField = depthField;
        this.restrictSearchWithMatch = restrictSearchWithMatch;
    }

    public MongoGraphLookup(String from, String startWith, String connectFromField, String connectToField, String as) {
        this.from = from;
        this.startWith = startWith;
        this.connectFromField = connectFromField;
        this.connectToField = connectToField;
        this.as = as;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getStartWith() {
        return startWith;
    }

    public void setStartWith(String startWith) {
        this.startWith = startWith;
    }

    public String getConnectFromField() {
        return connectFromField;
    }

    public void setConnectFromField(String connectFromField) {
        this.connectFromField = connectFromField;
    }

    public String getConnectToField() {
        return connectToField;
    }

    public void setConnectToField(String connectToField) {
        this.connectToField = connectToField;
    }

    public String getAs() {
        return as;
    }

    public void setAs(String as) {
        this.as = as;
    }

    public String getMaxDepth() {
        return maxDepth;
    }

    public void setMaxDepth(String maxDepth) {
        this.maxDepth = maxDepth;
    }

    public String getDepthField() {
        return depthField;
    }

    public void setDepthField(String depthField) {
        this.depthField = depthField;
    }

    public String getRestrictSearchWithMatch() {
        return restrictSearchWithMatch;
    }

    public void setRestrictSearchWithMatch(String restrictSearchWithMatch) {
        this.restrictSearchWithMatch = restrictSearchWithMatch;
    }
}
