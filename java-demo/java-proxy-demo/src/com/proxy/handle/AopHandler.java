package com.proxy.handle;

import com.proxy.interfaces.After;
import com.proxy.interfaces.Before;
import com.proxy.utils.ProxyUtils;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

public class AopHandler implements InvocationHandler {

    private Object target;

    private Before before = null;
    private After after = null;

    /*
    * 执行方法时会调用该方法，进行动态代理
    * */
    public Object invoke(Object object, Method method, Object[] args) throws Throwable {

        if(before != null) {
            before.doSomethingBefore();
        }

        Object obj = method.invoke(target, args);

        if(after != null) {
            after.doSomethingAfter();
        }
        return obj;
    }

    /*
    * 与 具体InvocationHandler 进行绑定，以获得代理类的实例
    * */
    public Object bind(Object object) {
        //这个不能少,不然没有代理实例
        this.target = object;
        //创建实例并返回
        return ProxyUtils.returnProxy(object,this);
    }

    public void setAfter(After after) {
        this.after = after;
    }

    public void setBefore(Before before) {
        this.before = before;
    }
}
