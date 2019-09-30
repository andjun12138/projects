package com.jsp.mapper;

import com.jsp.entiy.BaseEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author system
 * @date Created in 2018/8/3 17:08
 * @modifier
 */
@Mapper
public interface BaseEntityMapper {

    List<BaseEntity> getByTableName(@Param("tableName") String tableName);

    List<BaseEntity> lastBugRecord(@Param("tableName")String tableName);

    List<BaseEntity> lastSaleRecord(@Param("tableName")String tableName);

}