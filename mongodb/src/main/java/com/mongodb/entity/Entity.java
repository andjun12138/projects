package com.mongodb.entity;

import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Created by caimb on 2017/4/25.
 */
public class Entity extends BaseEntity {
    private static final long serialVersionUID = -2616308134650024605L;
    @Field("title")
    private String title;
    @Field("collection")
    private String collection;
    @Field("module_id")
    private Long moduleId;//旧版是groupobj
    @Field("target_key")
    private String targetKey = "id";//旧版是targetkey
    @Field("storage_type")
    private Long storageType;//存储类型
    @Field("physical_table")
    private Boolean physicalTable;//是否为物理表
    /**
     * 是否存入搜素引擎
     */
    @Field("save_to_search_engine")
    private Boolean saveToSearchEngine;
    //启用自定义编码
    @Field("enabled_custom_code")
    private Boolean enabledCustomCode;
    /**
     * 布局方式
     */
    @Field("layout_type")
    private Long layoutType;//旧版是layouttype

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCollection() {
        return collection;
    }

    public void setCollection(String collection) {
        this.collection = collection;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(Long moduleId) {
        this.moduleId = moduleId;
    }

    public String getTargetKey() {
        return targetKey;
    }

    public void setTargetKey(String targetKey) {
        this.targetKey = targetKey;
    }

    public Long getLayoutType() {
        return layoutType;
    }

    public void setLayoutType(Long layoutType) {
        this.layoutType = layoutType;
    }

    public Boolean getSaveToSearchEngine() {
        return saveToSearchEngine;
    }

    public void setSaveToSearchEngine(Boolean saveToSearchEngine) {
        this.saveToSearchEngine = saveToSearchEngine;
    }

    public Long getStorageType() {
        return storageType;
    }

    public void setStorageType(Long storageType) {
        this.storageType = storageType;
    }

    public Boolean getPhysicalTable() {
        return physicalTable;
    }

    public void setPhysicalTable(Boolean physicalTable) {
        this.physicalTable = physicalTable;
    }

    public Boolean getEnabledCustomCode() {
        return enabledCustomCode;
    }

    public void setEnabledCustomCode(Boolean enabledCustomCode) {
        this.enabledCustomCode = enabledCustomCode;
    }
}
