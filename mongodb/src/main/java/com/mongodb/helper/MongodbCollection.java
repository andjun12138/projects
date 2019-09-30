package com.mongodb.helper;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

/**
 * Created by liuxh on 2017/12/7.
 */
public class MongodbCollection {

    public static MongoCollection getMongoCollection(MongoClient mongoClient,String database,String collection){
        MongoDatabase base = mongoClient.getDatabase(database);
        MongoCollection coll = base.getCollection(collection);
        return  coll;
    }
}
