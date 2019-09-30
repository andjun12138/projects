package com.mongodb.entity;

import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by caimb on 2017/4/27.
 */
public class BaseEntity implements Serializable {
    private static final long serialVersionUID = -8668855393531379578L;
    @Field("id")
    private Long id;//主键
    @Field("uuid")
    private String uuid;//全局id
    @Field("custom_code")
    private String customCode;//自定义编码
    @Field("description")
    private String description;//备注
    @Field("deleted")
    private Boolean deleted;//旧版是isdelete；是否删除（系统列表上不可显示）
    @Field("enabled")
    private Boolean enabled;//是否启用（系统列表上可显示）
    /**
     * 是否为系统初始数据，在初始化应用时默认备份到新应用数据库
     */
    @Field("sys_init_data")
    private Boolean sysInitData;
    @Field("created_by")
    private Long createdBy;//旧版是creator
    @Field("update_by")
    private Long updatedBy;
    @Field("created_at")
    private Date createdAt;//旧版是createdate
    @Field("update_at")
    private Date updatedAt;//旧版没有本字段

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Boolean getSysInitData() {
        return sysInitData;
    }

    public void setSysInitData(Boolean sysInitData) {
        this.sysInitData = sysInitData;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Long getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Long updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCustomCode() {
        return customCode;
    }

    public void setCustomCode(String customCode) {
        this.customCode = customCode;
    }
}
