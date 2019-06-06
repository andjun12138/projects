package com.common.enums;

/**
* @author caimb
* @date Created in 2019-02-16 14:53
* @modifier
 */
public enum OperateStatus implements IOperateStatus{
    SUCCESS( 200, "OK" ),
    ENCRYPT_KEYS_NOT_FOUND(303, "加密函数引过期"),
    APP_USER_EXIST(304, "账号已存在"),
    NOT_FOUND_USER(305, "用户不存在");
    private int value;
    private String detail;

    OperateStatus(int value, String detail) {
        this.value = value;
        this.detail = detail;
    }

    public int getValue() {
        return this.value;
    }

    public String getDetail() {
        return this.detail;
    }

    public String allDetail() {
        return this.name() + "(" + this.value + ", " + this.detail + ")";
    }
}
