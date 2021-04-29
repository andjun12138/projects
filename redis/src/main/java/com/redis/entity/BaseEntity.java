package com.redis.entity;

import java.io.Serializable;

public class BaseEntity implements Serializable {
    private int id;
    private int type;
    private String account;
    private String many;
    private String total;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getMany() {
        return many;
    }

    public void setMany(String many) {
        this.many = many;
    }

    public String getTotal() {
        return total;
    }

    public void setTotal(String total) {
        this.total = total;
    }
}
