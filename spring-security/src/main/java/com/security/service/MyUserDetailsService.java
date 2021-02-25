package com.security.service;

import com.security.entity.MyUserDetails;
import com.security.mapper.MyUserDetailsMapper;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class MyUserDetailsService implements UserDetailsService{
    @Resource
    private MyUserDetailsMapper mapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        //加载基础用户信息
        MyUserDetails myUserDetails = mapper.findByUserName(username);

        //加载用户角色列表
        List<String> roleCodes = mapper.findRoleByUserName(username);

        //通过用户角色列表加载用户资源权限列表
        List<String> authorities = mapper.findAuthorityByRoleCodes(roleCodes);

        //角色是一个特殊的权限，ROLE_前缀
        roleCodes = roleCodes.stream()
                .map(rc -> "ROLE_" +rc) //每个对象前加前缀
                .collect(Collectors.toList()); //再转换回List
        authorities.addAll(roleCodes); //添加修改好前缀的角色前缀的角色权限

        //把权限类型的权限给UserDetails
        myUserDetails.setAuthorities(
                //逗号分隔的字符串转换成权限类型列表
                AuthorityUtils.commaSeparatedStringToAuthorityList(
                        //List转字符串,逗号分隔
                        String.join(",",authorities)
                )
        );

        return myUserDetails;
    }
}
