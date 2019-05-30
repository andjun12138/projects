package com.proxy.impl;

import com.proxy.interfaces.Car;

public class Maserati implements Car {

    public void doSomething(String string) {
        System.out.println("Maserati doSomeThing : "+string);
    }
}
