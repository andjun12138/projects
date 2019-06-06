package com.common.enums;

/**
 * @author caimb
 * @date Created at 2019-03-25 19:58
 * @modefier
 */
public class SimpleOperateStatus implements IOperateStatus {
    private static final long serialVersionUID = 4890763501575907340L;

    private int value;
    private String detail;

    public SimpleOperateStatus() {
    }

    public SimpleOperateStatus(int value, String detail) {
        this.value = value;
        this.detail = detail;
    }
    @Override
    public int getValue() {
        return this.value;
    }

    @Override
    public String getDetail() {
        return this.detail;
    }

    @Override
    public String allDetail() {
        return this.value + " : " + this.detail;
    }

}
