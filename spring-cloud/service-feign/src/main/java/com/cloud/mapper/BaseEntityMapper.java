package com.cloud.mapper;

import com.cloud.entity.BaseEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author system
 * @date Created in 2018/8/3 17:08
 * @modifier
 */
public interface BaseEntityMapper {

    List<BaseEntity> getByTableName(@Param("tableName") String tableName);

    List<BaseEntity> lastBugRecord(@Param("tableName") String tableName);

    List<BaseEntity> lastSaleRecord(@Param("tableName") String tableName);

    List<BaseEntity> getRecords(@Param("tableName") String tableName, @Param("type") Integer type, @Param("times") int times);

    int create(BaseEntity baseEntity);

    int update(BaseEntity baseEntity);

    BaseEntity selectById(@Param("id") int id);

}