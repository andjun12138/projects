package com.jsp.thread;

import java.util.concurrent.TimeUnit;

public class CalculatorThread implements Runnable {
    private int number;
    CalculatorThread(int number){
        this.number = number;
    }

    public void run() {
        for (int i = 1;i <= 10;i++){
            System.out.printf("%s : %d * %d = %d\n",Thread.currentThread().getName(),number,i,i * number);
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

}
