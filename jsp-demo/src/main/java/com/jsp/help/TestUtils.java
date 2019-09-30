package com.jsp.help;

public class TestUtils {

    public void min(){
        float total = 0;
        float now = -9000;
        float gongZhi = 9300*7+2000*6+8000;
        float chiZhu = 2200*7;
        float other = 1500*7;
        float home = 3000;
        float finalMoney = total+ now + gongZhi -(chiZhu+other+home);
        System.out.println(finalMoney);
    }

    public void middle(){
        float total = 0;
        float now = -9000;
        float gongZhi = 9300*7+2000*6+8000;
        float chiZhu = 2200*7;
        float other = 800*7;
        float home = 3000;
        float finalMoney = total+ now + gongZhi -(chiZhu+other+home);
        System.out.println(finalMoney);
    }

    public void max(){
        float total =  13000;
        float now = 10000;
        float gongZhi = 9300*7+2000*6+8000;
        float chiZhu = 2100*7;
        float other = 500*7;
        float home = 3000;
        float finalMoney = total+ now + gongZhi -(chiZhu+other+home);
        System.out.println(finalMoney);
    }

    public void hope(){
        float total =  12000;
        float now = 10000;
        float gongZhi = 9300*7+2000*6+3000+8500;
        float chiZhu = 2000*7;
        float other = 500*7;
        float home = 3000;
        float finalMoney = total+ now + gongZhi -(chiZhu+other+home);
        System.out.println(finalMoney);
    }

    public void  cal(){
        min();
        middle();
        max();
        hope();
    }
}
