package com.proxy.impl;

import com.proxy.interfaces.Car;

public class Porsche implements Car{

    public void doSomething(String string) {
        System.out.println("Porsche doSomeThing : "+string);
    }
}
