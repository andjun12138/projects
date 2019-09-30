package com.jsp.config;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

@Component
@Configurable
@EnableScheduling
public class TestTask {
    public static String contains = "五大高手围攻";
    public volatile int time = 9300;
    public volatile long nd = 1000*24*60*60;
    public volatile String endTime = "2020-04-01";



   @Scheduled(cron = "0/3 * * * * ?")
    private void calTask(){
        time = time - 3;
        System.out.println(time);
    }


    public void readTXT(){
        String fileName = "D:/test5.txt";
        readFileByLines(fileName);
    }

    public static void readFileByLines(String fileName) {
        File file = new File(fileName);
        BufferedReader reader = null;
        int min = 5000;
        int max = 30000;
        try {
            boolean flag = false;
            System.out.println("以行为单位读取文件内容，一次读一整行：");
            reader = new BufferedReader((new FileReader(file)));
            String tempString;
            int line = 1;
            while ((tempString = reader.readLine()) != null) {
                if (tempString.equals("")){
                    continue;
                }
                if (tempString.contains(contains)) {
                    flag = true;
                }
                if (flag){
                    System.out.println(tempString);
                    if (line >= max){
                        break;
                    }
                }
                line++;
            }
            reader.close();
        }catch (IOException e) {
            e.printStackTrace();
        }finally {
            if (reader != null) {
                try {
                    reader.close();
                }catch (IOException e) {
                }
            }
        }
    }


/*    @Scheduled(cron = "0/3 * * * * ?")
    private void calTotalTask() throws ParseException {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-mm-dd");
        Date endDate = formatter.parse(endTime);
        Date startDate = new Date();
        System.out.println(endDate);
        long diff = endDate.getTime() - startDate.getTime();

        System.out.println(new SimpleDateFormat("yyyy-mm-dd").format(startDate));
        System.out.println(diff/1000 + "("+diff/nd+")");
    }*/

/*    public void otherTask() throws InterruptedException {
        FutureTask<String> futureTask =
                new FutureTask<String>("name");
        ExecutorService executor =
                Executors.newFixedThreadPool(1); //使用线程池
        //执行FutureTask，相当于上例中的client.request("name")发送请求
        executor.submit(futureTask);
        //这里可以用一个sleep代替对其他业务逻辑的处理
        //在处理这些业务逻辑过程中，RealData也正在创建，从而充分了利用等待时间
        Thread.sleep(2000);
        //使用真实数据
        //如果call()没有执行完成依然会等待
        System.out.println("数据=" + futureTask.get());
    }*/

}
