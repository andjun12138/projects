function CreateDeviceForm(oNode) {
    if (oNode.find('.device-form-div').length < 0) {
        console.log('仪器表单不存在');
        return false;
    }
    var _this = this;
    // 初始化ajax
    var _ajax = new NewAjax();
    // 表单节点
    var oFormNode = oNode.find('.device-form').eq(0);
    // 是否为编辑模式
    var bIsEdit = false;
    // 空格换行正则
    var oWarpRule = />?\s+<|>\s+<?/g;
    // 验证回调函数
    var oTestCallbacks = {};
    // mark数据
    var oMarkData = {
        name: '仪器名称',
        model: '仪器型号',
        belongUnit: '所属单位',
        country: '国别',
        manufacturerName: '制造商名称',
        buyTime: '购置时间',
        placementPlace: '放置地点',
        status: '仪器状态',
        bigType: '仪器大类',
        smallType: '仪器小类',
        reserveWay: '预约方式',
        contact: '联系人',
        phoneNum: '联系方式',
        servicePrice: '服务价格',
        remarks: '备注',
        picture: '设备图片'
    };
    // 设备仪器记录id
    var sDeviceId = null;
    // 是否正在上传
    var isUpload = false;
    // 展示数据
    var oShowData = null;

    /* input & select */
    // 所有input数据
    var oInputDatas = null;
    // 所有select数据
    var oSelectDatas = null;
    // 手机号正则
    var oPhoneRule = /^1(3|4|5|7|8)\d{9}$/;
    // 固话正则
    var oTelephoneRule = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
    // 邮箱正则
    var oEmailRule = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    // 价格正则
    var oPriceRule = /^([1-9]\d*|0)(\.\d{0,2})?$/;
    // 非数值正则
    var oUnNumberRule = /[^\d.]/;

    /* 设备图片 */
    // 设备图片列表
    var oDeviceImageListNode = oFormNode.find('ul.device-image-list').eq(0);
    // 列表父节点，作用：设置width 隐藏滚动条
    var oDeviceImageListParent = oDeviceImageListNode.parent();
    // 设备图片input节点
    var oImageUploadInputNode = oDeviceImageListNode.find('.device-image-file-input').eq(0);
    // input父节点
    var oImageUploadInputParent = oImageUploadInputNode.parent();
    // 列表展示子节点
    var sImageShowItemHtml = '<li class="device-image-item" type="show" percent="0">\n' +
        // '                            <img class="device-image" src="" alt="">\n' +
        '                            <i class="icon-error"></i>\n' +
        '                        </li>';
    // 列表新增子节点
    var sImageAddItemHtml = '<li class="device-image-item add-al-icon" type="add">\n' +
        '                            <input class="device-image-file-input" type="file" multiple="multiple">\n' +
        '                        </li>';
    // 图片列表id
    var aDeviceImageIds = [];
    // li正则
    var oImageItemLiRule = /<li class="device-image-item[^>]+>/;

    /* 按钮 */
    // 按钮模块
    var oFormBtnModel = oFormNode.find('.form-btn-div').eq(0);
    // 发布按钮
    var oSubmitBtnNode = oFormBtnModel.find('button.submit').eq(0);
    // 重置按钮
    var oResetBtnNode = oFormBtnModel.find('button.reset').eq(0);

    // 获取节点
    getAllInputAndSelect();
    // 设置检查数据
    setTestCallback();
    // 执行事件
    allEvent();
    // 初始化所有节点
    initAllNode();
    // 初始化标记
    initMark();

    /*=== 外部调用方法 ===*/
    // 初始化
    _this.init = function () {
        initAllNode();
        sDeviceId = null;
        // 是否正在上传
        isUpload = false;
        return _this;
    };
    // 设置展示模式
    _this.setShowModel = function (isShow) {
        var stSave = oFormNode.hasClass('show-model');
        bIsEdit = !isShow;
        if (isShow) {
            if (!stSave) {
                oFormNode.addClass('show-model');
            }
        } else {
            if (stSave) {
                oFormNode.removeClass('show-model');
            }
        }
        return _this;
    };
    // 设置是否窄模式
    _this.setZoomModel = function (isSmall) {
        var stSave = oFormNode.hasClass('small-width');
        if (isSmall) {
            if (!stSave) {
                oFormNode.addClass('small-width');
            }
        } else {
            if (stSave) {
                oFormNode.removeClass('small-width');
            }
        }
        return _this;
    };
    // 写入数据
    _this.setFormData = function (data) {
        oShowData = JSON.parse(JSON.stringify(data));
        sDeviceId = oShowData.id;
        importFormData();
    };
    // 冻结输入框
    _this.setFormInputEnable = function (isEnable) {

    };


    /*=== 工具函数 ===*/

    /**
     * 导入对应的数据
     * @param oNodeData
     */
    function importDataToNodeData(oNodeData) {
        var oNowItem = null;
        var oNowData = null;
        Object.keys(oNodeData).forEach(function (key) {
            if (oNodeData.hasOwnProperty(key)) {
                oNowItem = oNodeData[key];
                oNowData = oShowData[key];
                if (key === 'picture') {
                    aDeviceImageIds = [];
                    if (oNowData.length > 0) {
                        oNowData.forEach(function (item) {
                            aDeviceImageIds.push(item.id);
                        });
                    }
                } else {
                    if (getVariableType(oNowData) === 'object') {
                        oNowItem.node.val(oNowData.id);
                        oNowItem.value = oNowData.id;
                        if (oNowItem.showNode) {
                            oNowItem.showNode.text(oNowData.title);
                        }
                    } else {
                        console.log(oNowItem);
                        oNowItem.node.val(oNowData);
                        oNowItem.value = oNowData;
                        if (oNowItem.showNode) {
                            oNowItem.showNode.text(oNowData);
                        }
                    }
                }
            }
        })
    }

    /**
     * 用于提取指定类型节点数据
     * @param nodeType
     * @returns {boolean}
     */
    function getInputSelectDatas(nodeType) {
        if (!(!!nodeType)) {
            console.log('nodeType 不能为空');
            return false;
        }
        var result = {};
        var aNodes = oFormNode.find(nodeType + '[class*="-' + nodeType + '"]');
        var oNowNode = null;
        var sNowName = null;
        var oNowParent = null;
        var oNameRule = /-[a-zA-Z]/g;
        var sNowTitle = null;
        aNodes.each(function () {
            var obj = {};
            oNowNode = $(this);
            sNowName = oNowNode.attr('name').replace(oNameRule, function (nameStr) {
                return nameStr.slice(-1).toUpperCase();
            });
            oNowParent = oNowNode.parents('.form-group').eq(0);
            sNowTitle = oNowParent.attr('title');
            obj.title = sNowTitle;
            obj.node = oNowNode;
            obj.value = oNowNode.val();
            obj.isRequired = (oNowParent.attr('type') === 'required');
            if (nodeType !== 'input') {
                obj.showNode = oNowParent.find('p[class*="-show"]').eq(0);
            }
            result[sNowName] = obj;
        });
        return result;
    }

    /**
     * 获取提交数据
     * @param nodeNodes
     */
    function extractNodeSubmitData(nodeNodes) {
        var result = {};
        Object.keys(nodeNodes).forEach(function (key) {
            if (nodeNodes.hasOwnProperty(key)) {
                result[key] = nodeNodes[key].value;
            }
        });
        return result;
    }

    /**
     * 作用: 用于展开提示和显示对错
     * @param inputNode:输入框
     * @param isShow:提示是否显示
     * @param content:提示内容
     */
    // 设置提示展示
    function setTipShow(inputNode, isShow, content) {
        var stSave = null;
        var oTipNode = null;
        var oInputDivNode = null;
        if (inputNode === undefined) {
            return 0;
        }
        if (isShow === undefined || getVariableType(isShow) !== 'boolean') {
            isShow = false;
        }
        stSave = getVariableType(content);
        if (content === undefined || (stSave !== 'number' && stSave !== 'string')) {
            content = '';
        }
        oInputDivNode = inputNode.parent();
        stSave = oInputDivNode.find('.input-tip');
        if (stSave.length > 0) {
            oTipNode = stSave.eq(0);
            oTipNode.text(content);
            if (isShow) {
                oTipNode.show();
            } else {
                oTipNode.hide();
            }
        } else {
            oTipNode = inputNode.parents('.form-group').eq(0).find('.input-tip').eq(0);
            oTipNode.text(content);
            if (isShow) {
                oTipNode.show();
            } else {
                oTipNode.hide();
            }
        }
    }

    /**
     * 功能:输入验证
     * isJudge: 是否进行判空
     * */
    function inputTest(inputNode, config) {
        var isJudge = (config) ? config.isJudge : undefined;
        var callback = null;
        var value = null;
        var sInputName = null;
        var stSave = null;
        if (isJudge === undefined) {
            isJudge = false
        }
        callback = (config) ? config.callback : undefined;
        // 获取输入内容
        value = inputNode.val();
        // 获取input标记
        sInputName = inputNode.data('name');
        if (value !== '') {
            if (callback) {
                stSave = callback();
                if (stSave) {
                    setTipShow(inputNode, false);
                }
                return (getVariableType(stSave) === 'boolean' && stSave) ? 1 : 0;
            } else {
                setTipShow(inputNode, false);
                return 1;
            }
        } else if (isJudge) {
            setTipShow(inputNode, true, sInputName + '不能为空');
            return 0;
        }
        setTipShow(inputNode, false);
        return 1;
    }

    /**
     * 作用:添加change事件
     * @param inputNode:传入输入框节点
     * @param config:传入测试检验函数和回调函数的配置参数
     * @param key: 属性名
     */
    function eventOfInputChange(inputNode, config, key) {
        var isJudge = (config && config.isJudge) ? config.isJudge : true;
        var testCallback = (config && config.testCallback) ? config.testCallback : undefined;
        var callback = (config && config.callback) ? config.callback : undefined;
        var stSave = null;
        inputNode.on('change', function () {
            // 不是编辑模式不执行
            if (!bIsEdit) {
                return false;
            }
            stSave = inputTest(inputNode, {
                isJudge: isJudge,
                callback: testCallback
            });
            if (callback) {
                callback(stSave, key);
            }
        })
    }

    /**
     * 绑定节点数据中节点的change事件
     * @param nodeDatas
     * @param config: [disableKey]:禁用项, [key]:指定设置；
     * eg: config :{disableKey:['name'], type: {
     *      isJudge: true,
     *      testCallback: function () {},
     *      callback: function() {}
     * }}
     */
    function bindInputAndSelectChangeEvent(nodeDatas, config) {
        var stSave = null;
        var stType = null;
        var oNowNode = null;
        var aDisableKey = [];
        var changeConfig = null;
        var oTestData = null;
        // 是否存在禁用项
        if (config && config.disableKey) {
            stSave = config.disableKey;
            stType = getVariableType(stSave);
            if (stType === 'array') {
                aDisableKey = stSave;
            } else if (stType === 'string') {
                aDisableKey.push(stSave);
            }
        }
        Object.keys(nodeDatas).forEach(function (key) {
            if (nodeDatas.hasOwnProperty(key)) {
                // 跳过禁用项
                if (!(aDisableKey.length > 0 && aDisableKey.searchArrayObj(key) > -1)) {
                    stSave = nodeDatas[key];
                    oNowNode = stSave.node;
                    // 获取对应的检验参数
                    oTestData = oTestCallbacks[key];
                    // 初始化changeConfig
                    changeConfig = {
                        isJudge: oTestData.isJudge,
                        testCallback: oTestData.callback,
                        callback: function (res, attrName) {
                            var nodeDataItem = (oInputDatas[attrName]) ? oInputDatas[attrName] : oSelectDatas[attrName];
                            var node = nodeDataItem.node;
                            var value = node.val();
                            if (res) {
                                nodeDataItem.value = value;
                                // 若有展示节点则写入数据
                                if (nodeDataItem.showNode) {
                                    nodeDataItem.showNode.text(value);
                                }
                            }
                        }
                    };
                    // 若有指定的设置就进行覆盖
                    if (config && config[key]) {
                        stSave = config[key];
                        if (stSave.isJudge !== undefined) {
                            changeConfig.isJudge = stSave.isJudge
                        }
                        if (stSave.testCallback !== undefined) {
                            changeConfig.testCallback = stSave.testCallback;
                        }
                        if (stSave.callback !== undefined) {
                            changeConfig.callback = stSave.callback;
                        }
                    }
                    eventOfInputChange(oNowNode, changeConfig, key);
                }
            }
        });
    }

    /**
     * 作用：提交文件
     * @param files 上传文件
     * @param config 配置数据
     */
    function uploadFile(files, config) {
        var xhr = (config && config.xhr) ? config.xhr : null;
        var success = (config && config.success) ? config.success : null;
        var error = (config && config.error) ? config.error : null;
        _ajax.post('file', {
            url: "/adjuncts/file_upload",
            data: files,
            async: true,
            processData: false,
            contentType: false,
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                if (xhr) {
                    xhr(myXhr);
                }
                return myXhr;
            },
            success: function (res) {
                if (success) {
                    success(res);
                }
            },
            error: function (err) {
                if (error) {
                    error(err);
                }
            }
        });
    }

    /**
     * 初始化普通输入框
     * @param inputNode：输入节点
     */
    function initNormalInput(inputNode) {
        inputNode.val('');
        setTipShow(inputNode, false);
    }

    /**
     * 初始化普通select
     * @param selectNode
     * @returns {*}
     */
    function initNormalSelect(selectNode) {
        var options = selectNode.children();
        var value = null;
        if (options.length > 0) {
            value = options.eq(0).val();
            selectNode.val(value);
        } else {
            selectNode.val('');
        }
        return value;
    }

    /**
     * 用户初始化时间插件
     * @param timeNode: 时间节点
     */
    function initDateTimePicker(timeNode) {
        timeNode.datetimepicker({
            format: 'yyyy-mm-dd', //显示格式
            language: 'zh-CN',
            todayHighlight: 1,
            minView: 2,
            todayBtn: true,
            autoclose: true
        });
    }

    /**
     * 处理错误信息
     * @param data
     */
    function dealWithErrorData(data, callback) {
        var status = data.status;
        var msg = data.message;
        if (status !== 303) {
            __layer.closeAll('dialog');
            __layer.msg(msg);
        }
        if (callback) {
            callback();
        } else {
            // 账号密码错误
            if (status === 405) {
            }
        }
    }

    /**
     * layer.msg 函数
     * @param message
     */
    function layerMsg(message) {
        __layer.closeAll('dialog');
        __layer.msg(message);
    }

    /**
     * 作用:检测必填项
     * @returns {boolean}
     */
    function submitItemTest() {
        var stSave = {};
        var oNowNode = null;
        Object.keys(oTestCallbacks).forEach(function (key) {
            if (oTestCallbacks.hasOwnProperty(key)) {
                if (key !== 'picture') {
                    oNowNode = (oInputDatas[key]) ? oInputDatas[key].node : oSelectDatas[key].node;
                    stSave[key] = inputTest(oNowNode, oTestCallbacks[key]);
                } else {
                    stSave[key] = oTestCallbacks[key].callback();
                }
            }
        });
        try {
            Object.keys(stSave).forEach(function (key) {
                if (!stSave[key]) {
                    throw new Error(key + ' 未通过检测');
                }
            });
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * 通过配置数据设置节点数据的验证方法
     * @param nodeDatas
     * @param config
     */
    function setNodeDatasTestConfig(nodeDatas, config) {
        var result = {};
        Object.keys(nodeDatas).forEach(function (key) {
            var obj = null;
            if (nodeDatas.hasOwnProperty(key)) {
                obj = {};
                if (config && config[key]) {
                    if (config[key].isJudge !== undefined) {
                        obj.isJudge = config[key].isJudge;
                    } else {
                        obj.isJudge = true;
                    }
                    if (config[key].callback) {
                        obj.callback = config[key].callback;
                    }
                } else {
                    obj.isJudge = true;
                }
                result[key] = obj;
            }
        });
        return result;
    }

    // 初始化 input & select
    /**
     * 初始化节点数据
     * @param nodeDatas
     * @param type
     * @returns {boolean}
     */
    function initInputAndSelect(nodeDatas, type) {
        if (!(!!type)) {
            return false;
        }
        var stSave = null;
        var timeRule = /[a-zA-Z]+time/i;
        Object.keys(nodeDatas).forEach(function (key) {
            if (nodeDatas.hasOwnProperty(key)) {
                stSave = nodeDatas[key];
                if (type === 'input') {
                    stSave.value = null;
                    // 初始化节点
                    initNormalInput(stSave.node);
                    if (timeRule.test(key)) {
                        initDateTimePicker(stSave.node);
                    }
                } else if (type === 'select') {
                    // 初始化select
                    stSave.value = initNormalSelect(stSave.node);
                }
            }
        })
    }


    /*=== 主体函数 ===*/
    /* 初始化 */
    // 获取所有input & select
    function getAllInputAndSelect() {
        oInputDatas = getInputSelectDatas('input');
        oSelectDatas = getInputSelectDatas('select');
    }
    // 初始化所有节点
    function initAllNode() {
        // 初始化所有input
        initInputAndSelect(oInputDatas, 'input');
        // 初始化所有select
        initInputAndSelect(oSelectDatas, 'select');
        // 初始化imageList
        initImageList();
    }
    // 初始化标记
    function initMark() {
        setInputAndSelectMark(oInputDatas);
        setInputAndSelectMark(oSelectDatas);
    }
    // 设置标记
    function setInputAndSelectMark(oNodeData) {
        Object.keys(oNodeData).forEach(function (key) {
            if (oNodeData.hasOwnProperty(key)) {
                oNodeData[key].node.data('name', oMarkData[key]);
            }
        })
    }
    // 初始化图片列表
    function initImageList() {
        oImageUploadInputParent.detach();
        oDeviceImageListNode.html('').append(oImageUploadInputParent);
    }
    // 设置验证回调函数
    function setTestCallback() {
        var inputTest = setNodeDatasTestConfig(oInputDatas, {
            phoneNum: {
                callback: function () {
                    var oNowNode = oInputDatas.phoneNum.node;
                    var value = oNowNode.val();
                    if (oPhoneRule.test(value) || oEmailRule.test(value) || oTelephoneRule.test(value)) {
                        setTipShow(oNowNode, false);
                        return true;
                    } else {
                        setTipShow(oNowNode, true, '请输入正确的联系方式');
                        return false;
                    }
                }
            },
            servicePrice: {
                callback: function () {
                    var oNowNode = oInputDatas.servicePrice.node;
                    var value = oNowNode.val();
                    if (oUnNumberRule.test(value)) {
                        setTipShow(oNowNode, true, '此处只允许输入数字与小数点');
                        return false;
                    } else {
                        if (oPriceRule.test(value)) {
                            setTipShow(oNowNode, false);
                            return true;
                        } else {
                            setTipShow(oNowNode, true, '请输入小数点后至多两位的价格');
                            return false;
                        }
                    }
                }
            },
            picture: {
                isJudge: false,
                callback: function () {
                    var oNowNode = oInputDatas.picture.node;
                    if (aDeviceImageIds.length > 0) {
                        setTipShow(oNowNode, false);
                        return true;
                    } else {
                        setTipShow(oNowNode, true, '设备仪器图片不能为空');
                        return false;
                    }
                }
            }
        });
        var selectTest = setNodeDatasTestConfig(oSelectDatas);
        oTestCallbacks = Object.assign(oTestCallbacks, inputTest, selectTest);
    }

    /*=== 事件 ===*/
    function allEvent() {
        inputAndSelectEvent();
        // 设备图片事件
        deviceImageEvent();
        // 按钮事件
        btnEvent();
    }
    // input & select 事件
    function inputAndSelectEvent() {
        bindInputAndSelectChangeEvent(oInputDatas, {
            disableKey: ['picture']
        });
        bindInputAndSelectChangeEvent(oSelectDatas);
    }

    /* 设备图片事件 */
    function deviceImageEvent() {
        eventOfDeviceImageDeleteClick();
        eventOfDeviceImageZoom();
        eventOfDeviceImageUpload();
    }
    // 设备图片删除事件
    function eventOfDeviceImageDeleteClick() {
        var oNowNode = null;
        // 当前item节点
        var oDeviceImageItemNode = null;
        // 当前图片id
        var oNowImageId = null;
        // id下标
        var nIdIndex = null;
        oDeviceImageListNode.on('click', 'i.icon-error', function () {
            // 不是编辑模式不执行
            if (!bIsEdit) {
                return false;
            }
            // 当前删除节点
            oNowNode = $(this);
            __layer.confirm('是否删除当前图片？', {
                title: '提示'
            }, function (index) {
                __layer.close(index);
                oDeviceImageItemNode = oNowNode.parent();
                oNowImageId = oDeviceImageItemNode.data('id');
                nIdIndex = aDeviceImageIds.searchArrayObj(oNowImageId);
                if (nIdIndex > -1) {
                    aDeviceImageIds.splice(nIdIndex, 1);
                }
                oDeviceImageItemNode.remove();
            }, function (index) {
                __layer.close(index);
            });
            // 防止冒泡 和 阻止默认行为
            return false;
        })
    }
    // 图片双击查看事件
    function eventOfDeviceImageZoom() {
        var oNowNode = null;
        var imageHtml = null;
        oDeviceImageListNode.on('dblclick', '.device-image-item[type="show"]', function () {
            oNowNode = $(this);
            imageHtml = oNowNode.find('img.device-image').eq(0).prop('outerHTML');
            __layer.closeAll();
            __layer.open({
                title: false,
                type: 1,
                area: '800px',
                offset: '200px;',
                content: imageHtml,
                move: '.layui-layer-content',
                shadeClose: true
            });
        });
    }
    // 图片上传事件
    function eventOfDeviceImageUpload() {
        // 是否已经新增了节点
        var isAddDom = false;
        var files = null;
        var formData = null;
        var imgFile = null;
        // 新节点数据
        var aNewImageNodes = null;
        oImageUploadInputNode.on('click', function () {
            if (isUpload) {
                layerMsg('上传图片中...');
                // 阻止默认行为
                return false;
            }
        });
        oImageUploadInputNode.on('change', function () {
            // 是否存在非图片文件
            var isOtherFile = false;
            // 不是编辑模式不执行
            if (!bIsEdit || isUpload) {
                // 清空file input，防止再上传时出现不触发change的bug
                oImageUploadInputNode.val('');
                return false;
            }
            files = oImageUploadInputNode.get(0).files;
            formData = new FormData();
            imgFile = [];
            for (var f in files) {
                if (files.hasOwnProperty(f)) {
                    if (files[f].type.split("/")[0] === "image") {
                        imgFile.push(files[f]);
                    } else {
                        isOtherFile = true;
                        break;
                    }
                }
            }
            // 清空file input，防止再上传时出现不触发change的bug
            oImageUploadInputNode.val('');
            if (isOtherFile) {
                layerMsg("只能上传图片");
                return false;
            }
            if (imgFile.length === 0) {
                layerMsg('无可上传的图片');
                return false;
            }
            imgFile.forEach(function (item) {
                formData.append('files', item);
            });
            aNewImageNodes = [];
            isUpload = true;
            uploadFile(formData, {
                xhr: function (myXhr) {
                    if (myXhr.upload) {
                        myXhr.upload.addEventListener('progress', function (event) {
                            // 已经上传大小情况
                            var loaded = event.loaded;
                            // 附件总大小
                            var total = event.total;
                            // 已经上传的百分比
                            var percent = Math.floor(100 * loaded / total);
                            // 是否已经添加了节点
                            if (isAddDom) {
                                // 写入百分比
                                aNewImageNodes.forEach(function (item) {
                                    item.node.attr({
                                        percent: percent
                                    });
                                })
                            } else {
                                imgFile.forEach(function (item, index) {
                                    var obj = {};
                                    var oNewImageNode = $(sImageShowItemHtml);
                                    oNewImageNode.attr({
                                        percent: percent
                                    }).insertBefore(oImageUploadInputParent);
                                    obj.node = oNewImageNode;
                                    obj.src = window.URL.createObjectURL(item);
                                    aNewImageNodes.push(obj);
                                });
                                isAddDom = true;
                            }
                        }, false);
                    }
                },
                success: function (res) {
                    isAddDom = false;
                    isUpload = false;
                    if (res.status === 200) {
                        var list = res.data.data_list;
                        aNewImageNodes.forEach(function (item) {
                            item.node.find('img.device-image').eq(0).attr({
                                src: item.src
                            });
                        });
                        // 提取数据
                        list.forEach(function (item) {
                            aDeviceImageIds.push(item.id);
                        });
                        // 去除错误信息
                        setTipShow(oImageUploadInputNode, false);
                    }
                },
                error: function (res) {
                    var data = err.responseJSON;
                    isAddDom = false;
                    isUpload = false;
                    dealWithErrorData(data, function () {
                        aNewImageNodes.forEach(function (item) {
                            item.node.remove();
                        });
                        layerMsg('上传图片失败，请稍后重试');
                    });
                }
            });
        })
    }

    /* 按钮事件 */
    function btnEvent() {
        eventOfSubmitBtnClick();
        eventOfResetBtnClick();
    }
    // 提交按钮事件
    function eventOfSubmitBtnClick() {
        var config = null;
        var isSubmitting = false;
        var layerLoad = null;
        oSubmitBtnNode.on('click', function () {
            // 不是编辑模式不执行
            if (!bIsEdit || isSubmitting) {
                return false;
            }
            if (isUpload) {
                layerMsg('图片上传中，请稍后');
                return false;
            }
            // 数据检验
            if (!submitItemTest()) {
                layerMsg('请修正错误！');
                return false;
            }
            config = getDeviceSubmitInfo();
            config.id = sDeviceId;
            // 启动loading
            layerLoad = __layer.load(2, {
                shade: [0.5, '#ffffff']
            });
            _ajax.post('default', {
                url: '/equipment/create_update',
                contentType: 'application/json',
                data: JSON.stringify(config),
                success: function (res) {
                    isSubmitting = false;
                    // 关闭loading
                    __layer.close(layerLoad);
                    if (res.status === 200) {
                        layerMsg('新增设备成功,请等待工作人员审核！');
                        _this.init();
                    }
                },
                error: function (XMLResponse) {
                    var data = XMLResponse.responseJSON;
                    isSubmitting = false;
                    // 关闭loading
                    __layer.close(layerLoad);
                    dealWithErrorData(data);
                }
            });

        });
    }
    // 获取提交数据
    function getDeviceSubmitInfo() {
        var result = {};
        result = Object.assign(result, extractNodeSubmitData(oInputDatas));
        result = Object.assign(result, extractNodeSubmitData(oSelectDatas));
        result.picture = aDeviceImageIds.join(',');
        return result;
    }
    // 重置按钮事件
    function eventOfResetBtnClick() {
        oResetBtnNode.on('click', function () {
            // 不是编辑模式不执行
            if (!bIsEdit || isUpload) {
                // 清空file input，防止再上传时出现不触发change的bug
                oImageUploadInputNode.val('');
                return false;
            }
            initAllNode();
        })
    }


    /*=== 写入数据 ===*/
    /* 表单 */
    // 写入表单数据
    function importFormData() {
        // 写入所有的input标签
        importDataToNodeData(oInputDatas);
        // 写入所有的select标签
        importDataToNodeData(oSelectDatas);
        // 写入图片数据
        importDeviceImage(aDeviceImageIds);
    }

    /* 设备图片 */
    // 写入图片
    function importDeviceImage(data) {
        var result = '';
        // 临时空格换行正则
        var oStRule = /\s+/g;
        // 临时百分比正则
        var oStPercentRule = /percent="\d+"/;
        var sOldHtml = oDeviceImageListNode.html();
        data.forEach(function (item) {
            result += sImageShowItemHtml.replace(oWarpRule, function (warpStr) {
                return warpStr.replace(oStRule, '');
            }).replace(oImageItemLiRule, function (liStr) {
                return liStr.replace(oStPercentRule, 'percent="100"')
                    .slice(0, -1) + '><img class="device-image" src="' + _ajax.getDomain('file') + '/adjuncts/file_download/' + item + '" alt="">';
            });
        });
        oDeviceImageListNode.html(result + sOldHtml);
    }
}
