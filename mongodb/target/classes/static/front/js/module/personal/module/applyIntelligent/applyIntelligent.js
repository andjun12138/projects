$(function () {
    var personalMainObj = window._personal_main_;
    var FuncOfModelCommon = personalMainObj._model_common_;
    // 定义模块函数
    function ApplyIntelligent() {
        var _this = this;
        // 初始化ajax
        var _ajax = new NewAjax();
        // 主体模块
        var oMainModel = $('#apply-intelligent');
        // 表单节点
        var oFormNode = oMainModel.find('.apply-intelligent-form').eq(0);
        // 是否为编辑模式
        var bIsEdit = true;
        // 空格换行正则
        var oWarpRule = />?\s+<|>\s+<?/g;
        // 验证回调函数
        var oTestCallbacks = {};
        // 申请记录的id
        var sApplyId = null;
        // 展示数据
        var oShowData = null;
        // 提交属性名映射
        var oAttrNameData = {
            name: 'name',
            company: 'companyName',
            position: 'position',
            phone: 'contact',
            applyReason: 'applyReason'
        };
        // 状态码
        var oStatusData = {
            '019a934e-488f-11e9-880c-20040fed244c': 'wait',
            '0ba408c8-488f-11e9-880c-20040fed244c': 'reject',
            '15d90aa6-488f-11e9-880c-20040fed244c': 'pass'
        };
        // 审核状态
        var sReviewStatus = null;
        // 需要事件节流的事件
        var oNeedControlEvent = ['input', 'scroll'];

        /* 状态 */
        // 状态节点
        var oStatusNode = oMainModel.find('.review-status').eq(0);

        /* 用户要填写操作的节点 */
        // 可以操作的节点（input/select等）
        var oOperateNodeDatas = null;
        // 类型正则
        var oClassNameRule = /\s?[\w-]+(input|select)(|$)/;
        // 手机号正则
        var oPhoneRule = /^1(3|4|5|7|8)\d{9}$/;
        // 固话正则
        var oTelephoneRule = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
        // 邮箱正则
        var oEmailRule = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        // 非数值正则
        var oUnNumberRule = /[^\d.]/;

        /* 拒绝理由 */
        // 拒绝理由父节点
        var oRejectReasonParentNode = oStatusNode.find('.reject-reason').eq(0);
        // 拒绝理由节点
        var oRejectReasonNode = oRejectReasonParentNode.find('.content').eq(0);

        /* 按钮 */
        // 按钮模块
        var oFormBtnModel = oFormNode.find('.form-group[class*="button-model"]').eq(0);
        // 发布按钮
        var oSubmitBtnNode = oFormBtnModel.find('.submit').eq(0);
        // 重置按钮
        var oResetBtnNode = oFormBtnModel.find('.reset').eq(0);
        // 修改按钮
        var oReWriteBtnNode = oFormBtnModel.find('.rewrite').eq(0);


        /*=== 外部接口 ===*/
        _this.init = function () {
            // 初始化所有操作节点
            initOperateNode(oOperateNodeDatas);
            // 获取数据
            getData();
        };

        /*=== 工具函数 ===*/
        /**
         * 导入对应的数据
         * @param oNodeData
         */
        function renderDataToNodeData(oNodeData) {
            var oNowItem = null;
            var oNowData = null;
            Object.keys(oNodeData).forEach(function (key) {
                if (oNodeData.hasOwnProperty(key)) {
                    oNowItem = oNodeData[key];
                    oNowData = oShowData[key];
                    if (getVariableType(oNowData) === 'object') {
                        oNowItem.node.val(oNowData.id);
                        oNowItem.value = oNowData.id;
                        if (oNowItem.showNode) {
                            oNowItem.showNode.text(oNowData.title);
                        }
                    } else {
                        oNowItem.node.val(oNowData);
                        oNowItem.value = oNowData;
                        if (oNowItem.showNode) {
                            oNowItem.showNode.text(oNowData);
                        }
                    }
                }
            })
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
        function setNodeEvent (inputNode, config, key) {
            var eventType = (config && config.eventType) ? config.eventType : 'change';
            var isJudge = (config && config.isJudge) ? config.isJudge : true;
            var testCallback = (config && config.testCallback) ? config.testCallback : undefined;
            var callback = (config && config.callback) ? config.callback : undefined;
            var stSave = null;
            var timer = null;
            var handler = function () {
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
            };
            if (oNeedControlEvent.searchArrayObj(eventType) > -1) {
                inputNode.on(eventType, function () {
                    if (!(!!timer)) {
                        timer = setTimeout(function () {
                            handler();
                            clearTimeout(timer);
                            timer = null;
                        }, 200);
                    }
                });
            } else { // 不需要节流
                inputNode.on(eventType, handler);
            }

        }

        /**
         * 绑定节点数据中节点的change事件
         * @param nodeDatas
         * @param config: [disableKey]:禁用项, [key]:指定设置；
         * eg: config :{disableKey:['name'], [key]: {
         *      change:{
         *          isJudge: true,
         *          testCallback: function () {},
         *          callback: function() {}
         *      },
         *      input:{
         *          callback: function() {}
         *      }
         *
         * }}
         */
        function bindOperateNodeChangeEvent(nodeDatas, config) {
            var stSave = null;
            var stType = null;
            var oNowNode = null;
            var aDisableKey = [];
            // change事件配置
            var changeConfig = null;
            // input 事件配置
            var inputConfig = null;
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
            // 遍历操作节点数据
            Object.keys(nodeDatas).forEach(function (key) {
                // 要非继承属性
                if (nodeDatas.hasOwnProperty(key)) {
                    // 跳过禁用项
                    if (!(aDisableKey.length > 0 && aDisableKey.searchArrayObj(key) > -1)) {
                        // 获取数据子项
                        stSave = nodeDatas[key];
                        // 获取jq节点
                        oNowNode = stSave.node;
                        // 获取对应的检验参数
                        oTestData = oTestCallbacks[key];
                        // 初始化changeConfig
                        changeConfig = {
                            eventType: 'change',
                            isJudge: oTestData.isJudge,
                            testCallback: oTestData.callback,
                            callback: function (res, modelKey) {
                                var nodeDataItem = nodeDatas[modelKey];
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
                        inputConfig = {
                            eventType: 'input',
                            callback: function (res, modelKey) {
                                setCleanIcon(nodeDatas[modelKey].node);
                            }
                        };
                        // 若有指定的设置就进行覆盖
                        if (!!config && config[key]) {
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
                        // 绑定change
                        setNodeEvent(oNowNode, changeConfig, key);
                        // 绑定input
                        setNodeEvent(oNowNode, inputConfig, key);
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
         * 处理错误信息
         * @param data
         * @param callback
         */
        function dealWithErrorData(data, callback) {
            var status = data.status;
            var msg = data.message;
            if (status !== 303) {
                __layer.closeAll('dialog');
                __layer.msg(msg);
            }
            if (callback) {
                callback(status);
            } else {}
        }

        /**
         * layer.msg 函数
         * @param message
         */
        function setLayerMsg(message) {
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
                    oNowNode = oOperateNodeDatas[key].node;
                    stSave[key] = inputTest(oNowNode, oTestCallbacks[key]);
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
        function initOperateNode(nodeDatas, type) {
            var stSave = null;
            // 节点类型
            var sNodeType = null;
            Object.keys(nodeDatas).forEach(function (key) {
                if (nodeDatas.hasOwnProperty(key)) {
                    stSave = nodeDatas[key];
                    sNodeType = stSave.nodeType;
                    if (sNodeType === 'input') {
                        stSave.value = null;
                        // 初始化节点
                        initNormalInput(stSave.node);
                    } else if (sNodeType === 'select') {
                        // 初始化select
                        stSave.value = initNormalSelect(stSave.node);
                    }
                }
            })
        }

        /**
         * 判定是否通过正常渠道进入模块，防止通过输入路由或修改dom节点进入功能模块
         */
        function bIsEnterModelByTrueWay() {
            var stSave = _this.bIsLeaveModel;
            if (stSave) {
                setLayerMsg('请通过正常途径进入功能模块');
            }
            return !stSave;
        }

        /**
         * 作用：用于开启关闭input的清除按钮
         * @param inputNode
         */
        function setCleanIcon(inputNode) {
            // 不是编辑模式不执行
            if (!bIsEdit) {
                return false;
            }
            var value = inputNode.val();
            var oCleanNode = inputNode.parents('.form-group').eq(0).find('.icon-error').eq(0);
            if (value.length > 0) {
                if (!oCleanNode.hasClass('show')) {
                    oCleanNode.addClass('show');
                }
            } else {
                if (oCleanNode.hasClass('show')) {
                    oCleanNode.removeClass('show');
                }
            }
        }


        /*=== 主体函数 ===*/
        /* 初始化 */
        // 用于提取所有操作节点的数据
        function getOperateNodeDatas() {
            var aNodes = oFormNode.find('.operate-item');
            // 当前jq节点
            var oNowNode_jq = null;
            // 当前原生节点
            var oNowNode_dom = null;
            // 当前类名
            var oNowClassName = null;
            // 当前节点类型
            var sNowNodeType = null;
            // 当前节点的属性名称
            var sNowAttrName = null;
            var oNowParent = null;
            var oNameRule = /-[a-zA-Z]/g;
            var sNowTitle = null;
            var stSave = null;
            var rule = /\s+/g;
            // 初始化数据集合
            oOperateNodeDatas = {};
            // 节点循环
            aNodes.each(function () {
                var obj = {};
                oNowNode_jq = $(this);
                oNowNode_dom = oNowNode_jq.get(0);
                // 获取节点类型。ps: input/select等
                sNowNodeType = oNowNode_dom.tagName.toLowerCase();
                // 获取类名
                stSave = oNowNode_dom.className.match(oClassNameRule);
                if (stSave.length > 0) {
                    oNowClassName = stSave[0].replace(rule, '');
                    oNowClassName = oNowClassName.slice(0, oNowClassName.lastIndexOf('-'));
                }
                // 提取属性名
                sNowAttrName = oNowClassName.replace(oNameRule, function (nameStr) {
                    return nameStr.slice(-1).toUpperCase();
                });
                oNowParent = oNowNode_jq.parents('.form-group').eq(0);
                // 获取title
                sNowTitle = oNowParent.attr('title');
                // 标记name
                oNowNode_jq.data('name', sNowTitle);
                // 标题
                obj.title = sNowTitle;
                // 记录节点
                obj.node = oNowNode_jq;
                // 记录节点数据
                obj.value = oNowNode_jq.val();
                // 是否必填
                obj.isRequired = (oNowParent.data('required') === 'true');
                // 节点类型
                obj.nodeType = sNowNodeType;
                // 若是input外的节点，需要记录对应的展示节点
                if (sNowNodeType !== 'input') {
                    obj.showNode = oNowParent.find('p[class*="-show"]').eq(0);
                }
                // 存储提取的数据
                oOperateNodeDatas[sNowAttrName] = obj;
            });
        }
        // 设置验证回调函数
        function setTestCallback() {
            var oNodeTest = setNodeDatasTestConfig(oOperateNodeDatas, {
                contact: {
                    callback: function () {
                        var oNowNode = oOperateNodeDatas.contact.node;
                        var value = oNowNode.val();
                        if (oPhoneRule.test(value) || oEmailRule.test(value) || oTelephoneRule.test(value)) {
                            setTipShow(oNowNode, false);
                            return true;
                        } else {
                            setTipShow(oNowNode, true, '请输入正确的联系方式');
                            return false;
                        }
                    }
                }
            });
            oTestCallbacks = Object.assign(oTestCallbacks, oNodeTest);
        }

        /* 事件 */
        // 所有事件
        function allEvent() {
            // 所有操作节点事件
            OperateNodeEvent();
            // 清空事件
            cleanClick();
            // 按钮事件
            btnEvent();
        }
        // 所有操作节点事件
        function OperateNodeEvent() {
            bindOperateNodeChangeEvent(oOperateNodeDatas, {
                disableKey: []
            });
        }
        // x 点击事件
        function cleanClick() {
            var oNowNode = null;
            var oNowInput = null;
            oFormNode.on('click', 'i.icon-error', function () {
                oNowNode = $(this);
                if (!oNowNode.hasClass('show')) {
                    return false;
                }
                oNowInput = oNowNode.parent().find('input').eq(0);
                oNowInput.val('');
                setTipShow(oNowInput, false);
                oNowNode.removeClass('show');
            })
        }
        // 按钮事件
        function btnEvent() {
            eventOfSubmitBtnClick();
            eventOfResetBtnClick();
            eventOfReWriteBtnClick();
        }
        // 获取提交数据
        function getDeviceSubmitInfo() {
            var result = {};
            Object.keys(oAttrNameData).forEach(function (key) {
                if (oAttrNameData.hasOwnProperty(key)) {
                    result[key] = oOperateNodeDatas[oAttrNameData[key]].value;
                }
            });
            return result;
        }
        // 提交按钮事件
        function eventOfSubmitBtnClick() {
            var config = null;
            var isSubmitting = false;
            var layerLoad = null;
            oSubmitBtnNode.on('click', function () {
                // 是否通过正常途径进入功能模块
                if (!bIsEnterModelByTrueWay()) {
                    return false;
                }
                // 不是编辑模式不执行
                if (!bIsEdit || isSubmitting || (!!sReviewStatus && sReviewStatus === 'wait')) {
                    return false;
                }
                // 数据检验
                if (!submitItemTest()) {
                    setLayerMsg('请修正错误！');
                    return false;
                }
                config = getDeviceSubmitInfo();
                config.id = sApplyId;
                // 启动loading
                layerLoad = __layer.load(2, {
                    shade: [0.5, '#ffffff']
                });
                _ajax.post('default', {
                    url: '/cnkiApply/apply',
                    contentType: 'application/json',
                    data: JSON.stringify(config),
                    success: function (res) {
                        isSubmitting = false;
                        // 关闭loading
                        __layer.close(layerLoad);
                        if (res.status === 200) {
                            setLayerMsg('提交申请成功！请等待工作人员审核');
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
        // 重置按钮事件
        function eventOfResetBtnClick() {
            oResetBtnNode.on('click', function () {
                // 是否通过正常途径进入功能模块
                if (!bIsEnterModelByTrueWay()) {
                    return false;
                }
                // 不是编辑模式不执行
                if (!bIsEdit || (!!sReviewStatus && sReviewStatus === 'wait')) {
                    return false;
                }
                // 初始化所有操作节点
                initOperateNode(oOperateNodeDatas);
            })
        }
        // 修改按钮事件
        function eventOfReWriteBtnClick() {
            oReWriteBtnNode.on('click', function () {
                // 是否通过正常途径进入功能模块
                if (!bIsEnterModelByTrueWay()) {
                    return false;
                }
                // 编辑模式不执行
                if (bIsEdit || (!!sReviewStatus && sReviewStatus === 'wait')) {
                    return false;
                }
                // 修改为编辑状态
                setFormShowMode(false);
            })
        }

        /* 获取写入数据 */
        // 获取数据
        function getData() {
            personalMainObj.getApplyIntelligentInfo(function (data) {
                var type = data.type;
                var info = data.info;
                var stSave = null;
                if (type === 'success') {
                    if (info.status === 200) {
                        stSave = (info.data) ? info.data : {};
                        oShowData = extractData(stSave);
                        renderData();
                        if (!!oShowData.id) {
                            setFormShowMode(true);
                        } else {
                            setFormShowMode(false);
                        }
                    }
                } else {
                    console.log(info);
                }
            });
        }


        // 提取数据
        function extractData(data) {
            var result = {};
            result.id = data.id;
            result.name = data.name;
            result.companyName = data.company;
            result.position = data.position;
            result.contact = data.phone;
            result.applyReason = data.applyReason;
            result.rejectReason = data.refuseReason;
            result.status = data.status;
            return result;
        }
        // 写入数据
        function renderData() {
            // 写入所有的输入类型的标签
            renderDataToNodeData(oOperateNodeDatas);
            // 写入拒绝理由
            renderRejectReason();
            // 写入审核状态
            renderStatus();
        }
        // 写入拒绝理由
        function renderRejectReason() {
            var content = oShowData.rejectReason;
            if (!!content) {
                oRejectReasonNode.text(content);
                oRejectReasonParentNode.show();
            } else {
                oRejectReasonParentNode.hide();
            }
        }
        // 写入审核状态
        function renderStatus() {
            sReviewStatus = oStatusData[oShowData.status];
            if (sReviewStatus === 'wait') {
                oStatusNode.css({
                    borderColor: '#808080',
                    color: '#808080'
                }).text('审核中');
            } else if (sReviewStatus === 'reject') {
                oStatusNode.css({
                    borderColor: '#ff0000',
                    color: '#ff0000'
                }).text('不通过');
            } else if (sReviewStatus === 'pass') {
                oStatusNode.css({
                    borderColor: '#00ff00',
                    color: '#00ff00'
                }).text('通过');
            }
        }

        /* 切换表单状态 */
        // 切换表单状态
        function setFormShowMode(bIsShow) {
            bIsEdit = !bIsShow;
            changeReviewNodeShowStatus(bIsShow);
            changeOperateNodeShowStatus(bIsShow);
            changeButtonShowStatus(bIsShow);
        }
        // 切换状态节点
        function changeReviewNodeShowStatus (bIsShow) {
            if (bIsShow && !!sReviewStatus) {
                oStatusNode.show();
            } else {
                oStatusNode.hide();
            }
        }
        // 切换所有输入节点
        function changeOperateNodeShowStatus(bIsShow) {
            var oNode = null;
            var oParentNode = null;
            var oCleanNode = null;
            Object.keys(oOperateNodeDatas).forEach(function (key) {
                if (oOperateNodeDatas.hasOwnProperty(key)) {
                    oNode = oOperateNodeDatas[key].node;
                    oParentNode = oNode.parents('div.form-group').eq(0);
                    oCleanNode = oParentNode.find('i.icon-error').eq(0);
                    // 冻结
                    if (bIsShow) {
                        oNode.prop({
                            disabled: true
                        });
                        oCleanNode.hide();
                    } else { // 可操作
                        oNode.prop({
                            disabled: false
                        });
                        oCleanNode.show();
                    }
                }
            })
        }
        // 按钮状态切换
        function changeButtonShowStatus (bIsShow) {
            var oBtnModel = oSubmitBtnNode.parent();
            oBtnModel.show();
            // 展示状态
            if (bIsShow) {
                oSubmitBtnNode.hide();
                oResetBtnNode.hide();
                if (!!sReviewStatus){
                    if(sReviewStatus !== 'wait') {
                        oReWriteBtnNode.show();
                    } else {
                        oReWriteBtnNode.hide();
                        oBtnModel.hide();
                    }
                }
            } else { // 编辑状态
                oSubmitBtnNode.show();
                oResetBtnNode.show();
                oReWriteBtnNode.hide();
            }
        }

        /*=== 调用函数 ===*/
        getOperateNodeDatas();
        setTestCallback();
        allEvent();
    }
    // 函数继承
    ApplyIntelligent.prototype = new FuncOfModelCommon();
    // 引用释放
    FuncOfModelCommon = null;
    // 调用主模块的模块注册方法
    personalMainObj.setMethodObj('applyIntelligent', new ApplyIntelligent());
});
