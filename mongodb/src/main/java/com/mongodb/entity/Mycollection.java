package com.mongodb.entity;

/**
 * Created by hjf on 2017/12/6.
 */
public class Mycollection {
    private String title;
    private String by;
    private String like;

    public String getBy() {
        return by;
    }

    public void setBy(String by) {
        this.by = by;
    }

    public String getLike() {
        return like;
    }

    public void setLike(String like) {
        this.like = like;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
