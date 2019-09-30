package com.mongodb.mongo.domain;

/**
 * Created by hjf on 2017/12/16.
 */
public class MongoLimit {
    private Long limit;
    private Long skip;

    private Long currentPage = 1L;
    private Long pageSize = 20L;

    public MongoLimit(Long currentPage, Long pageSize) {
        if (currentPage > 0) {
            this.currentPage = currentPage;
        }
        if (pageSize > 0) {
            this.pageSize = pageSize;
        }
    }

    public MongoLimit() {
    }

    public Long getLimit() {
        return limit = currentPage * pageSize ;
    }

    public Long getSkip() {
        return skip = (currentPage-1)*pageSize;
    }

}
