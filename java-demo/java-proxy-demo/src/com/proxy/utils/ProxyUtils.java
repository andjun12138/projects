package com.proxy.utils;

import com.proxy.handle.MyInvocationHandler;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Proxy;

public class ProxyUtils {

    public static Object returnProxy (Object obj){
        InvocationHandler invocationHandler = new MyInvocationHandler(obj);
        Object proxy = (Object) Proxy.newProxyInstance(obj.getClass().getClassLoader(), obj.getClass().getInterfaces(), invocationHandler);
        return proxy;
    }

    public static Object returnProxy (Object obj,InvocationHandler handler){
        Object proxy = (Object) Proxy.newProxyInstance(obj.getClass().getClassLoader(), obj.getClass().getInterfaces(), handler);
        return proxy;
    }

}
