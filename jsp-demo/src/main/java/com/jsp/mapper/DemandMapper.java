package com.jsp.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

/**
 * @author system
 * @date Created in 2018/8/3 17:08
 * @modifier
 */
@Mapper
public interface DemandMapper {

    /**
     * 通过id获取Demand对象
     * @param id
     * @return
     */
    public Map<String,Object> getByIdForMap(long id);

}