package com.proxy;

import com.proxy.impl.Maserati;
import com.proxy.impl.Porsche;
import com.proxy.interceptor.Cgliber;
import com.proxy.interfaces.After;
import com.proxy.interfaces.Before;
import com.proxy.interfaces.Car;
import com.proxy.manger.HandlerProxyManager;
import com.proxy.utils.ProxyUtils;

public class Main {

    public static void main(String[] args) {
        //动态代理实现(接口方式)
        Car car = new Porsche();
        Car proxy = (Car) ProxyUtils.returnProxy(car);
        proxy.doSomething("hello");

        //动态代理实现(cglib方式)
        Cgliber cgliber = new Cgliber();
        Porsche porsche = (Porsche) cgliber.getInstance(new Porsche());
        porsche.doSomething("hello world");


        After after = new After() {
            public void doSomethingAfter() {
                System.out.println("-------doSomethingAfter-------");
            }
        };

        Before before = new Before() {
            public void doSomethingBefore() {
                System.out.println("-------doSomethineBefore------");
            }
        };

        Car car1 = new Maserati();
        Car proxy1 = (Car) HandlerProxyManager.getProxyForAopHandler(car1,before,after);
        proxy1.doSomething("Maserati");

    }
}
