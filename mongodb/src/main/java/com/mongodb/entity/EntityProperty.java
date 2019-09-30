package com.mongodb.entity;

import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Created by caimb on 2017/4/25.
 */
public class EntityProperty extends BaseEntity{
    private static final long serialVersionUID = -8608968063949167905L;
    /**
     * 字段标题
     */
    @Field("title")
    private String title;

    /**
     * 字段单位
     */
    @Field("property_unit")
    private String propertyUnit;
    /**
     * 字段名称
     */
    @Field("property_name")
    private String propertyName;
    /**
     * 所属实体
     */
    @Field("entity_id")
    private Long entityId;//旧版本的formid
    /**
     * 字段类型
     */
    @Field("property_type")
    private Long propertyType;
    /**
     * 展示类型
     */
    @Field("show_type")
    private Long showType;
    /**
     * 目标ID
     */
    @Field("target_id")
    private Long targetId;//旧版本的targetobj和relevanceobj

    /**
     * 排序
     */
    @Field("sort")
    private Integer sort;
    /**
     * 是否必填
     */
    @Field("required")
    private Boolean required;
    /**
     * 默认值
     */
    @Field("default_value")
    private String defaultValue;
    /**
     * 是否隐藏
     */
    @Field("hidden")
    private Boolean hidden;//旧版本的ishidden
    /**
     * 是否只读
     */
    @Field("readonly")
    private Boolean readonly;//旧版本的isreadonly
    /**
     * sql取数
     */
    @Field("js_handle")
    private String jsHandle;//旧版本的jshandle
    /**
     * 附件个数
     */
    @Field("attach_num")
    private Integer attachNum = 1;//旧版本的attachnum
    /**
     * 字段长度，只有文本类型需要填写
     */
    @Field("length")
    private Integer length;
    /**
     * 是否存入搜素引擎
     */
    @Field("save_to_search_engine")
    private Boolean saveToSearchEngine;

    /**
     * 系统默认字段
     */
    @Field("sys_default_flag")
    private Long sysDefaultFlag;
    /**
     * 字段限制
     */
    @Field("property_constraint")
    private String propertyConstraint;

    /**
     * 页面输入组件
     */
    @Field("page_component_input")
    private Long pageComponentInput;
    /**
     * 页面输出组件
     */
    @Field("page_component_output")
    private Long pageComponentOutput;
    @Field("value")
    private String value;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPropertyName() {
        return propertyName;
    }

    public void setPropertyName(String propertyName) {
        this.propertyName = propertyName;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Integer getSort() {
        return sort;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Long getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(Long propertyType) {
        this.propertyType = propertyType;
    }

    public Long getTargetId() {
        return targetId;
    }

    public void setTargetId(Long targetId) {
        this.targetId = targetId;
    }

    public Boolean getRequired() {
        return required;
    }

    public void setRequired(Boolean required) {
        this.required = required;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }

    public Boolean getHidden() {
        return hidden;
    }

    public void setHidden(Boolean hidden) {
        this.hidden = hidden;
    }

    public Boolean getReadonly() {
        return readonly;
    }

    public void setReadonly(Boolean readonly) {
        this.readonly = readonly;
    }

    public String getJsHandle() {
        return jsHandle;
    }

    public void setJsHandle(String jsHandle) {
        this.jsHandle = jsHandle;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public Integer getAttachNum() {
        return attachNum;
    }

    public void setAttachNum(Integer attachNum) {
        this.attachNum = attachNum;
    }

    public Boolean getSaveToSearchEngine() {
        return saveToSearchEngine;
    }

    public void setSaveToSearchEngine(Boolean saveToSearchEngine) {
        this.saveToSearchEngine = saveToSearchEngine;
    }

    public Long getShowType() {
        return showType;
    }

    public void setShowType(Long showType) {
        this.showType = showType;
    }

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
    }

    public String getPropertyConstraint() {
        return propertyConstraint;
    }

    public void setPropertyConstraint(String propertyConstraint) {
        this.propertyConstraint = propertyConstraint;
    }

    public Long getPageComponentInput() {
        return pageComponentInput;
    }

    public void setPageComponentInput(Long pageComponentInput) {
        this.pageComponentInput = pageComponentInput;
    }

    public Long getPageComponentOutput() {
        return pageComponentOutput;
    }

    public void setPageComponentOutput(Long pageComponentOutput) {
        this.pageComponentOutput = pageComponentOutput;
    }

    public Long getSysDefaultFlag() {
        return sysDefaultFlag;
    }

    public void setSysDefaultFlag(Long sysDefaultFlag) {
        this.sysDefaultFlag = sysDefaultFlag;
    }

    public String getPropertyUnit() {
        return propertyUnit;
    }

    public void setPropertyUnit(String propertyUnit) {
        this.propertyUnit = propertyUnit;
    }
}
