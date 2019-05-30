package com.proxy.interceptor;

import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

public class Cgliber implements MethodInterceptor{

    private Object target;//这个target指的就是被代理类的实例

     public Object getInstance(Object target){
        this.target = target;
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(this.target.getClass());//设置被继承类(超类)
        enhancer.setCallback(this);//设置回调
        return enhancer.create();
     }

     public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
         proxy.invokeSuper(obj, args);
         return null;
     }
}
