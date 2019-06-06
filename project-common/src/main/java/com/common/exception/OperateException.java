package com.common.exception;

import com.common.enums.IOperateStatus;
import com.common.enums.OperateStatus;
import com.common.utils.ObjectUtils;

/**
* @author caimb
* @date Created in 2019-02-16 14:55
* @modifier
 */
public class OperateException extends Exception{

    private IOperateStatus status;
    private String clazz;
    private Object[] massageArgs;


    public OperateException(OperateStatus searchEngineError) {
        super();
    }

    /**
     * 报错需要使用这个，将class参数带上
     * @param status
     * @param clazz
     * @param massageArgs
     */
    public OperateException(IOperateStatus status, Class clazz, Object... massageArgs) {
        super( ObjectUtils.isNotEmpty( massageArgs ) ? String.format( status.getDetail(), massageArgs ) : status.getDetail() );
        this.status = status;
        this.clazz = clazz.getName();
        this.massageArgs = massageArgs;
    }

    public OperateException(IOperateStatus status, String message, Class clazz) {
        super( message );
        this.clazz = clazz.getName();
        this.status = status;
    }

    public OperateException(IOperateStatus status, String message, Throwable cause, Class clazz) {
        super(message, cause);
        this.status = status;
        this.clazz = clazz.getName();
    }

    public OperateException(IOperateStatus status, Throwable cause, Class clazz) {
        super(cause);
        this.status = status;
        this.clazz = clazz.getName();
    }

    protected OperateException(IOperateStatus status, String message, Throwable cause, Class clazz, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
        this.status = status;
        this.clazz = clazz.getName();
    }

    public String toString() {
        String s = getClass().getName();
        String message = getLocalizedMessage();
        return (message != null) ? (s + ": status=>" +(status == null?"haven't status":status)  +" ,message=>" + message) : s;
    }

    public IOperateStatus getStatus() {
        return this.status;
    }

    public Object[] getMassageArgs() {
        return this.massageArgs;
    }
    public String getClazz() {
        return this.clazz;
    }

    @Override
    public synchronized Throwable fillInStackTrace() {
        return null;
    }
}
