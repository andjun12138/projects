package com.proxy.manger;

import com.proxy.handle.AopHandler;
import com.proxy.interfaces.After;
import com.proxy.interfaces.Before;

/*
* 管理的类，根据不同的handler来生成相对应的proxy实例，这样实例调用方法时可以执行与handler相对应的invoker
* */
public class HandlerProxyManager {

    public HandlerProxyManager(){}

    public static Object getProxyForAopHandler(Object obj, Before before) {
        return getProxyForAopHandler(obj, before, null);
    }

    public static Object getProxyForAopHandler(Object obj, After after) {
        return getProxyForAopHandler(obj, null, after);
    }

    /*
    * 生成AopHandler,并且生成对应的proxy实例
    * */
    public static Object getProxyForAopHandler(Object obj, Before before, After after) {

        AopHandler handler = new AopHandler();
        if(before != null) {
            handler.setBefore(before);
        }
        if(after != null) {
            handler.setAfter(after);
        }
        //把对象绑定到handler中去
        return handler.bind(obj);
    }
}
