package com.mongodb.mongo.domain;


import com.mongodb.mongo.enumeration.Lookup;
import com.mongodb.mongo.enumeration.MongoFunction;
import com.mongodb.mongo.enumeration.MongoLogic;
import com.mongodb.mongo.enumeration.MongoSign;
import com.mongodb.util.ArrayUtil;

/**
 * Created by hjf on 2017/5/15.
 */
public class MongoBuilders {
    public static String COLLECTION = "collection";

    /*mongo关键字*/
    public static String PROJECT = "project";
    public static String LOOKUP = "lookup";
    public static String GROUP = "group";
    public static String LIMIT = "limit";
    public static String MATCH = "match";
    public static String COUNT = "count";
    public static String SORT = "sort";
    public static String GRAPHLOOKUP = "graphLookup";
    /*
    * Lookup中关键字
    * */
    public static String FROM = "from";
    public static String LOCALFIELD = "localField";
    public static String FOREIGNFIELD = "foreignField";
    public static String AS = "as";
    public static String LET = "let";
    public static String PIPELINE = "pipeline";
    /*
    * graphLookup中的关键字
    * */
    public static String STARTWITH = "startWith";
    public static String CONNECTFROMFIELD = "connectFromField";
    public static String CONNECTTOFIELD = "connectToField";
    public static String MAXDEPTH = "maxDepth";
    public static String DEPTHFIELD = "depthField";
    public static String RESTRICTSEARCHWITHMATCH = "restrictSearchWithMatch";


    public static MongoProject project (String key,Object value){
        return new MongoProject(key,value);
    }

    public static MongoProject project (String key){
        return new MongoProject(key);
    }

    public static MongoLookup lookupJoin(String from,String let,String pipeLine,String as){
        return new MongoLookup(from,let,pipeLine,as, Lookup.JOIN);
    }
    public static MongoLookup lookupUnJoin(String from,String localField,String foreignField,String as){
        return new MongoLookup(from,localField,foreignField,as, Lookup.UN_JOIN);
    }


    public static MongoMatch match(MongoLogic mongoLogic, MongoMatch... mongoMatches){
        return new MongoMatch(mongoLogic, ArrayUtil.array2ArrayList(mongoMatches) );
    }

    public static MongoMatch match(String field, Object value){
        return new MongoMatch(field,value);
    }


    public static MongoLimit limit(){
        return new MongoLimit();
    }

    public static MongoLimit limit(Long currentPage,Long pageSize){
        return new MongoLimit(currentPage,pageSize);
    }

    public static MongoCount count(String value){
        return  new MongoCount(value);
    }


    public static MongoGroup group(String primaryValue,GroupCalculate... groupCalculates){
        return new MongoGroup(primaryValue,ArrayUtil.array2ArrayList(groupCalculates));
    }

    public static GroupCalculate groupCalculate(String field, MongoFunction mongoFunction, MongoSign mongoSign, GroupCalculate... groupCalculates){
        return new GroupCalculate(field,mongoFunction,mongoSign,ArrayUtil.array2ArrayList(groupCalculates));
    }

    public static GroupCalculate groupCalculate(String alias,GroupCalculate... groupCalculates){
        return new GroupCalculate(alias,ArrayUtil.array2ArrayList(groupCalculates));
    }

    public static MongoGraphLookup mongoGraphLookup(String from, String startWith, String connectFromField, String connectToField, String as){
        return new MongoGraphLookup(from,startWith,connectFromField,connectToField,as);
    }

    public static MongoGraphLookup mongoGraphLookup(String from, String startWith, String connectFromField, String connectToField, String as, String maxDepth, String depthField, String restrictSearchWithMatch){
        return new MongoGraphLookup(from,startWith,connectFromField,connectToField,as,maxDepth,depthField,restrictSearchWithMatch);
    }



    public static MongoSort sort(String key){
        return new MongoSort(key);
    }
    public static MongoSort sort(String key,Object value){
        return new MongoSort(key,value);
    }


}
