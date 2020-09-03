package com.cloud.service;


import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

@Service
public class CacheService {


    /*
    * 之前网上说同个缓存域要在同一个类中，@CacheEvict才有效，但发现并不是这样的，就算不在同一个类中都可以有效，估计是版本的原因（不深究了）
    * */
    @CacheEvict(value="baseEntityCache",key = "#name")
    public boolean removeCache(int name ){
        return true;
    }
}
