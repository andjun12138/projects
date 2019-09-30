package com.redis.help;

public class TestUtils {


    public void min(){
        float total = 0;
        float now = 9000-1500;
        float gongZhi = 9300*7+2000*6+3000+8000;
        float chiZhu = 2000*7;
        float other = 1500*7;
        float finalMoney = total+ now + gongZhi -(chiZhu+other);
        System.out.println(finalMoney);
    }


    public void max(){
        float total = 15000;
        float now = 2500+10000;
        float gongZhi = 9300*7+2000*6+3000+8000;
        float chiZhu = 2000*7;
        float other = 1000*7;
        float finalMoney = total+ now + gongZhi -(chiZhu+other);
        System.out.println(finalMoney);
    }
}
