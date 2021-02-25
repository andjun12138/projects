package com.security.mapper;

import com.security.entity.MyUserDetails;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface MyUserDetailsMapper {


    //根据userID查询用户信息
    MyUserDetails findByUserName(@Param("username") String username);

    //根据userID查询用户角色列表
    List<String> findRoleByUserName(@Param("username") String username);

    //根据用户角色查询用户权限

    List<String> findAuthorityByRoleCodes(@Param("roleCodes")List<String> roleCodes);

    List<String> findUrlsByUserName(@Param("username") String username);
}
