package com.security.service;

import com.security.mapper.MyUserDetailsMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Component("rbacService")
public class MyRBACService {
    @Resource
    private MyUserDetailsMapper mapper;

    /**
     *判断用户是否具有该请求资源的访问权限
     */
    public boolean hasPermission(HttpServletRequest request, Authentication authentication){

        //从security中拿出用户主体,实际上是我们之前封装的UserDetails,但是又被封了一层
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails){
            String username = ((UserDetails) principal).getUsername();
            List<String> urls = mapper.findUrlsByUserName(username);
            for (String url : urls){
                if (url.equals(request.getRequestURI())){
                    return true;
                }
            }
        }
        return false;
    }
}
