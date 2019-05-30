package com.proxy.handle;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

public class MyInvocationHandler implements InvocationHandler{

    private Object target;

    public MyInvocationHandler(){
        super();
    }

    public MyInvocationHandler(Object target){
        super();
        this.target = target;
    }

    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        return method.invoke(target, args);
    }
}
