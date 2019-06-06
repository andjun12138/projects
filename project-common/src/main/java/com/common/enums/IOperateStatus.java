package com.common.enums;

import java.io.Serializable;

/**
 * @author caimb
 * @date Created at 2019-02-16 15:17
 * @modefier
 */
public interface IOperateStatus extends Serializable {
    int getValue();

    String getDetail();

    String allDetail();
}
