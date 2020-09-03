/*
package com.jsp.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BrainteasersUtils {

*/
/*
* 题目：爱因斯坦说世界上有98％的人答不出来
* 1、在一条街上，有5座房子，喷了5种颜色。
* 2、每个房里住着不同国籍的人
* 3、每个人喝不同的饮料，抽不同品牌的香烟，养不同的宠物
* 问题是：谁养鱼？
* 提示：   
* 1、英国人住红色房子                2、瑞典人养狗
* 3、丹麦人喝茶                      4、绿色房子在白色房子左面
* 5、绿色房子主人喝咖啡              6、抽Pall Mall 香烟的人养鸟
* 9、 挪威人住第一间房               10、抽Blends香烟的人住在养猫的人隔壁
* 11、养马的人住抽Dunhill 香烟的人隔壁     12、抽Blue Master的人喝啤酒
* 13、德国人抽Prince香烟                  14、挪威人住蓝色房子隔壁
* 15、抽Blends香烟的人有一个喝水的邻居
* 以上是爱因斯坦在20世纪初出的这个谜语。他说世界上有98％的人答不出来
* 答案:
*   黄色          蓝色          红色          绿色          白色
*   挪威          丹麦          英国          德国          瑞典
*   水            茶            牛奶          咖啡          啤酒
*   Dunhill       blends        pallmall      Prince        Blue master
*   猫            马            鸟            鱼            狗
*   所以是德国人在养鱼
* *//*


    public static Map<String,Object> colorsParams = new HashMap<>();
    public static Map<String,Object>  nationParams = new HashMap<>();
    public static Map<String,Object>  drinksParams = new HashMap<>();
    public static Map<String,Object>  petsParams = new HashMap<>();
    public static Map<String,Object>  smokeParams = new HashMap<>();
    */
/*
     *   颜色 ： 1 红色 2 绿色 3 白色 4 蓝色 5 黄色
     *   国籍 ： 1 英国 2 德国 3 丹麦 4 瑞典 5 挪威人
     *   饮料 ： 1 矿泉水 2 牛奶 3 咖啡 4 啤酒 5 茶
     *   烟   ： 1 PALLMALL 2 DUNHILL 3 PRINCE 4 BLUEMASTER 5 混合烟
     *   宠物 ： 1 马 2 鸟 3 鱼 4 狗 5 猫
     * *//*

    //TODO 未解答
    public void cal(){
        int[] colors = new int[]{};
        int[] nation = new int[]{};
        int[] drinks = new int[]{};
        int[] pets = new int[]{};
        int[] smoke = new int[]{};
        List<int[]> list = new ArrayList<int[]>();
        initParam();
        initList(list);
        calList(list);
    }
    public boolean matchs(int[] col1,int[] col2,int[] col3,int[] col4,int[] col5){
        //条件8
        if(col3[2] != 2) {
            return false;
        }
        //条件9
        if(col1[1] != 5){
            return false;
        }
        return true;
    }

    public void printList(int[] col1,int[] col2,int[] col3,int[] col4,int[] col5){
        for(int i = 0;i < 5;i++){
            System.out.println(colorsParams.get(col1[i]) + " "+ nationParams.get(col2[i]) + " " + drinksParams.get(col3[i]) + " " + petsParams.get(col4[i]) + " " + smokeParams.get(col5[i]));
        }
    }


    public void calList(List<int[]> list){
        for (int col1 = 0; col1 < list.size();col1++){
            for (int col2 = 0; col2 < list.size();col2++){
                for (int col3 = 0; col3 < list.size();col3++){
                    for (int col4 = 0; col4 < list.size();col4++){
                        for (int col5 = 0; col5 < list.size();col5++){
                            if (matchs(list.get(col1),list.get(col2),list.get(col3),list.get(col4),list.get(col5))){
                                printList(list.get(col1),list.get(col2),list.get(col3),list.get(col4),list.get(col5));
                            }
                        }
                    }
                }
            }
        }
    }

    public void initParam(){
        colorsParams.put("1","红色");
        colorsParams.put("2","绿色");
        colorsParams.put("3","白色");
        colorsParams.put("4","蓝色");
        colorsParams.put("5","黄色");

        nationParams.put("1","英国");
        nationParams.put("2","德国");
        nationParams.put("3","丹麦");
        nationParams.put("4","瑞典");
        nationParams.put("5","挪威人");

        drinksParams.put("1","矿泉水");
        drinksParams.put("2","牛奶");
        drinksParams.put("3","咖啡");
        drinksParams.put("4","啤酒");
        drinksParams.put("5","茶");

        petsParams.put("1","PALLMALL");
        petsParams.put("2","DUNHILL");
        petsParams.put("3","PRINCE");
        petsParams.put("4","BLUEMASTER");
        petsParams.put("5","混合烟");

        smokeParams.put("1","马");
        smokeParams.put("2","鸟");
        smokeParams.put("3","鱼");
        smokeParams.put("4","狗");
        smokeParams.put("5","猫");
    }



    public void initList(List<int[]> list){
        for (int colorsIndex = 1; colorsIndex <= 5;colorsIndex++){
            int[] col = new int[]{};
            col[0] = colorsIndex;
            for (int nationIndex = 1; nationIndex <= 5; nationIndex++){
                col[1] = nationIndex;
                for (int drinksIndex = 1; drinksIndex <= 5; drinksIndex++){
                    col[2] = drinksIndex;
                    for (int petsIndex = 1; petsIndex <= 5; petsIndex++) {
                        col[3] = petsIndex;
                        for (int smokeIndex = 1; smokeIndex <= 5; smokeIndex++) {
                            col[4] = smokeIndex;
                            list.add(col);
                        }
                    }
                }
            }
        }
    }

}
*/
