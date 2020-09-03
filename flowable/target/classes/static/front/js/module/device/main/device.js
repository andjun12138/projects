$(function () {
    // 当前模块
    var oNowModel = $('#device');
    // 初始化ajax
    var _ajax = new NewAjax();
    // 存储数据源
    var dataSource = null;
    // 判定是否为json字符串
    var oJsonRule = /^\[.*\]$|^{.*}$/;
    // body节点
    var oBodyNode = $('body').eq(0);

    /* 导航栏 */
    // 导航栏列表
    var oNavListNode = oNowModel.find('ul.nav-list').eq(0);
    // 模块节点
    var aModelNodes = oNowModel.find('div.model-content-div');

    /* 类型多选 */
    var oSearchListNode = oNowModel.find('ul.search-list').eq(0);
    // 获取类型多选模块中所有的input数据
    var oSearchInputDatas = null;
    // 获取类型多选模块中所有的select数据
    var oSearchSelectDatas = null;
    // 查询按钮
    var oSearchBtnNode = oSearchListNode.find('#search-submit');
    // 重置按钮
    var oSearchResetBtnNode = oSearchListNode.find('#search-reset');
    // 搜索数据
    var oSearchConfig = {
        pager: {
            current: 1,
            size: 10
        },
        sortPointer: {
            filed: "created_at",
            order: "DESC"
        }
    };
    // 搜索设备数据执行函数
    var handleOfSearchDeviceData = createHandleOfSearchDevice();

    /* 设备展示 */
    // 展示区域
    var oDeviceShowArea = oNowModel.find('.search-show-div').eq(0);
    // 设备表格
    var oTable = new Table('device-table');
    // 父节点
    var oTableParent = oNowModel.find('#device-table');
    // 表格数据
    var aTableData = null;
    // 获取表格数据
    var handleOfGetTableData = null;
    // 表格基础样式
    var aTableBaseStyle = [
        {
            type: 'picture',
            name: '仪器图片',
            width: 161,
            align: 'center'
        },
        {
            type: 'name',
            name: '仪器名称',
            width: 336,
            align: 'center'
        },
        {
            type: 'model',
            name: '仪器型号',
            width: 136,
            align: 'center'
        },
        {
            type: 'reserveType',
            name: '预约类型',
            width: 117,
            align: 'center'
        },
        {
            type: 'reserveWay',
            name: '预约方式',
            width: 117,
            align: 'center'
        },
        {
            type: 'status',
            name: '仪器状态',
            width: 117,
            align: 'center'
        },
        {
            type: 'id',
            name: '操作',
            align: 'center'
        }
    ];
    // 顺序表
    var aTableOrder = ['picture', 'name', 'model', 'reserveType', 'reserveWay', 'status', 'id'];
    // 设备名html
    var sDeviceTableNameHtml = '<a id="%id%" class="device-name-link" href="javaScript:void(0);">%name%</a>';
    // 设备图片html
    var sDeviceTableImageHtml = '<div class="device-image-div"><img class="device-image" src="%src%" alt="%name%"></div>';
    // 活动span Html
    var sDeviceTableActiveSpanHtml = '<span class="active-span" data-type="reserve" data-id="%id%">预约</span>';
    // 是否正在预约
    var isReserve = false;

    /* 设备分页 */
    // 分页插件
    var oPage = new PluginPagination('device-page');
    // 父节点
    var oPageParent = oNowModel.find('#device-page');
    // 存储每页的条数
    var nPageSize = 10;
    // 打开go按钮功能
    var canLift = true;
    // 当前页码
    var nNowPageNumber = 1;
    // 最大页码
    var nMaxPageNumber = null;

    /* 发布设备仪器 */
    // 发布设备仪器模块
    var oPublishModel = oNowModel.find('.model-content-div[class*="publish"]').eq(0);
    // 引入发布设备仪器
    var oPublishDevice = null;

    /* 设备信息卡 */
    // 信息卡
    var oDeviceInfoCardNode = oNowModel.find('.device-info-global-div').eq(0);
    // 内容区域
    var oDeviceInfoContainerNode = oDeviceInfoCardNode.find('.device-info-div').eq(0);
    // 关闭按钮
    var oDeviceInfoCloseNode = oDeviceInfoContainerNode.find('.device-info-title').eq(0).find('.icon-error').eq(0);
    // 引入设备信息卡
    var oDeviceInfoCard = null;
    //

    baseFunc();
    allEvent();
    initDevice();

    /*=== 工具函数 ===*/
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
        var aNodes = oSearchListNode.find(nodeType + '[class*="-' + nodeType + '"]');
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
            oNowParent = oNowNode.parents('.search-item').eq(0);
            sNowTitle = oNowParent.attr('title');
            obj.title = sNowTitle;
            obj.node = oNowNode;
            obj.value = oNowNode.val();
            result[sNowName] = obj;
        });
        return result;
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
     * 初始化 input & select
     * @param nodeDatas
     * @param type
     * @returns {boolean}
     */
    function initInputAndSelect(nodeDatas, type) {
        if (!(!!type)) {
            return false;
        }
        var stSave = null;
        Object.keys(nodeDatas).forEach(function (key) {
            if (nodeDatas.hasOwnProperty(key)) {
                stSave = nodeDatas[key];
                if (type === 'input') {
                    stSave.value = null;
                    initNormalInput(stSave.node);
                } else if (type === 'select') {
                    stSave.value = initNormalSelect(stSave.node);
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
            oTipNode = oInputDivNode.parent().find('.input-tip').eq(0);
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
     * @param attrName: 属性名
     */
    function eventOfInputChange(inputNode, config, attrName) {
        var testCallback = (config && config.testCallback) ? config.testCallback : undefined;
        var callback = (config && config.callback) ? config.callback : undefined;
        var stSave = null;
        inputNode.on('change', function () {
            stSave = inputTest(inputNode, {
                callback: testCallback
            });
            if (callback) {
                callback(stSave, attrName);
            }
        })
    }

    /**
     * 绑定节点数据中节点的change事件
     * @param nodeDatas
     */
    function bindInputAndSelectChangeEvent(nodeDatas) {
        var stSave = null;
        var oNowNode = null;
        Object.keys(nodeDatas).forEach(function (key) {
            if (nodeDatas.hasOwnProperty(key)) {
                stSave = nodeDatas[key];
                oNowNode = stSave.node;
                eventOfInputChange(oNowNode, {
                    callback: function (res, attrName) {
                        var oNodeDataItem = null;
                        if (res) {
                            oNodeDataItem = nodeDatas[attrName];
                            oNodeDataItem.value = oNodeDataItem.node.val();
                        }
                    }
                }, key);
            }
        })
    }

    /**
     * 提取节点数据的value
     * @param nodeDatas
     */
    function extractNodeDatasValue(nodeDatas) {
        var result = {};
        var stSave = null;
        Object.keys(nodeDatas).forEach(function (key) {
            stSave = nodeDatas[key].value;
            if (stSave) {
                result[key] = stSave;
            } else {
                result[key] = null;
            }
        });
        return result;
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
     * 搜索设备仪器的工厂函数
     * @returns {Function}
     */
    function createHandleOfSearchDevice() {
        var config = null;
        var isSearching = false;
        var layerLoad = null;
        return function () {
            if (isSearching) {
                setLayerMsg('搜索中，请勿稍后');
                return false;
            }
            // 获取请去提交数据
            config = getSearchData();
            layerLoad = __layer.load(2, {shade: [0.5, '#ffffff']});
            isSearching = true;
            // 发起请求
            _ajax.post('default', {
                url: '/equipment/query',
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                data: JSON.stringify(config),
                success: function (res) {
                    var data = null;
                    var total = null;
                    isSearching = false;
                    __layer.close(layerLoad);
                    if (res.status === 200) {
                        data = res.data;
                        setLayerMsg('请求设备数据成功');
                        total = data.total;
                        nMaxPageNumber = Math.ceil(total / nPageSize);
                        if (nMaxPageNumber > 1) {
                            oPage.showPage(true)
                                .setMaxPageNumber(nMaxPageNumber)
                                .setNowPageNumber(nNowPageNumber);
                        } else {
                            oPage.showPage(false);
                        }
                        extractDeviceData(data.data_list);
                        // 写入表格
                        importTableData();
                        // 当数据length大于0
                        if (data.data_list.length > 0) {
                            if (oDeviceShowArea.hasClass('void')) {
                                oDeviceShowArea.removeClass('void');
                            }
                        } else {
                            if (!oDeviceShowArea.hasClass('void')) {
                                oDeviceShowArea.addClass('void');
                            }
                        }
                    }
                },
                error: function (err) {
                    var data = err.responseJSON;
                    // 关闭加载
                    __layer.close(layerLoad);
                    isSearching = false;
                    dealWithErrorData(data);
                }
            })
        }
    }

    /**
     * 处理错误信息
     * @param data
     */
    function dealWithErrorData(data) {
        var status = data.status;
        var msg = data.message;
        if (status !== 303) {
            __layer.msg(msg);
        }
        // 账号密码错误
        if (status === 405) {
        }
    }

    /*=== 主体函数 ===*/

    // 基础功能函数（ps:优先执行）
    function baseFunc() {
        getInputAndSelect();
    }

    // 所有事件
    function allEvent() {
        navListEvent();
        searchTypeEvent();
        deviceInfoClick();
        tableMouseEvent();
    }

    // 初始化函数
    function initDevice() {
        initSearchModel();
        initDeviceTable();
        initDevicePage();
        initDeviceInfoCard();
        getDeviceShowData();
    }

    /* 导航栏 */

    // 点击事件
    function navListEvent() {
        var oNowNode = null;
        var sNowModelType = null;
        var stSave = null;
        var isLogin = false;
        oNavListNode.on('click', 'li.nav-item', function () {
            oNowNode = $(this);
            if (oNowNode.hasClass('active')) {
                return false;
            }
            sNowModelType = oNowNode.attr('type');
            isLogin = getLocalStorage('user') ? true : false;
            if (sNowModelType === 'publish' && isLogin === false) {
                layer.msg('请先登录！');
                window.open('/login.html', '_self');
                return;
            }
            oNowNode.siblings().each(function () {
                stSave = $(this);
                if (stSave.hasClass('active')) {
                    stSave.removeClass('active');
                    return false;
                }
            });
            oNowNode.addClass('active');
            aModelNodes.each(function () {
                stSave = $(this);
                if (stSave.hasClass(sNowModelType)) {
                    stSave.show();
                } else if (stSave.is(':visible')) {
                    stSave.hide();
                }
            });
            if (sNowModelType === 'publish' && oPublishDevice === null) {
                oPublishDevice = new CreateDeviceForm(oPublishModel);
                initPublishDeviceModel();
            } else if (sNowModelType === 'search') {
                initSearchModel();
                getDeviceShowData();
            }
        })
    }

    /* 类型多选模块 */

    // 获取 input & select 数据
    function getInputAndSelect() {
        oSearchInputDatas = getInputSelectDatas('input');
        oSearchSelectDatas = getInputSelectDatas('select');
    }

    // 初始化
    function initSearchModel() {
        initInputAndSelect(oSearchInputDatas, 'input');
        initInputAndSelect(oSearchSelectDatas, 'select');
    }

    // 多类型搜索事件
    function searchTypeEvent() {
        searchInputEvent();
        searchSelectEvent();
        searchBtnEvent();
    }

    // input节点的事件
    function searchInputEvent() {
        bindInputAndSelectChangeEvent(oSearchInputDatas);
    }

    // select节点的事件
    function searchSelectEvent() {
        bindInputAndSelectChangeEvent(oSearchSelectDatas);
    }

    // 按钮事件
    function searchBtnEvent() {
        eventOfSearchBtnClick();
        eventOfResetBtnClick();
    }

    // 查询按钮事件
    function eventOfSearchBtnClick() {
        oSearchBtnNode.on('click', handleOfSearchDeviceData);
    }

    // 重置按钮事件
    function eventOfResetBtnClick() {
        oSearchResetBtnNode.on('click', initSearchModel);
    }

    // 获取查询数据参数
    function getSearchData() {
        var config = oSearchConfig;
        config = Object.assign(config, extractNodeDatasValue(oSearchInputDatas));
        config = Object.assign(config, extractNodeDatasValue(oSearchSelectDatas));
        config.pager.current = nNowPageNumber;
        config.pager.size = nPageSize;
        return config;
    }

    /* 获取数据与写入表格 */

    // 获取数据
    function getDeviceShowData() {
        handleOfSearchDeviceData();
    }

    // 提取数据
    function extractDeviceData(data) {
        var obj = null;
        var stSave = null;
        aTableData = [];
        console.log(data);
        dataSource = data;
        /* 将所有的json字符串转为json格式 */
        dataSource.forEach(function (dataItem) {
            Object.keys(dataItem).forEach(function (key) {
                if (dataItem.hasOwnProperty(key)) {
                    stSave = dataItem[key];
                    if (getVariableType(stSave) === 'string' && oJsonRule.test(stSave)) {
                        dataItem[key] = JSON.parse(stSave);
                    }
                }
            });
        });
        dataSource.forEach(function (dataItem) {
            obj = {};
            aTableOrder.forEach(function (key) {
                obj[key] = dataItem[key];
            });
            if (obj.name) {
                obj.name = {
                    id: obj.id,
                    name: obj.name
                };
            } else {
                obj.name = {
                    id: obj.id,
                    name: '暂无数据'
                };
            }
            if (obj.picture && obj.picture.length > 0) {
                obj.picture = {
                    picture: obj.picture[0].id,
                    name: obj.picture[0].title
                };
            } else {
                obj.picture = {
                    picture: null,
                    name: null
                };
            }
            aTableData.push(obj);
        });
    }

    // 写入表格
    function importTableData() {
        oTable.setStartIndex((nNowPageNumber - 1) * nPageSize + 1)
            .setTableData(aTableData);
    }

    // 初始化表格
    function initDeviceTable() {
        oTable.setBaseStyle(aTableBaseStyle)
            .setColOrder(aTableOrder)
            .setStartIndex((nNowPageNumber - 1) * nPageSize + 1)
            .setOpenCheckBox(false, 2)
            .setTableLineHeight(40)
            .resetHtmlCallBack(function (type, content, label) {
                //['picture', 'name', 'model', 'reserveType', 'reserveWay', 'status', 'id']
                // 获取用户状态
                var sUserStatus = null;
                var stSave = null;
                if (label === 'td') {
                    if (type === 'name') {
                        return sprintf(sDeviceTableNameHtml, content);
                    } else if (type === 'picture') {
                        if (content.picture) {
                            stSave = sprintf(sDeviceTableImageHtml, {
                                src: _ajax.getDomain('file') + '/adjuncts/file_download/' + content.picture,
                                name: content.name
                            });
                        } else {
                            stSave = '暂无数据';
                        }
                        return stSave;
                    } else if (type === 'model') {
                        return valueFilter(content, '暂无数据');
                    } else if (type === 'reserveType') {
                        if (content) {
                            stSave = content.title;
                        } else {
                            stSave = '暂无数据';
                        }
                        return stSave;
                    } else if (type === 'reserveWay') {
                        if (content) {
                            stSave = content.title;
                        } else {
                            stSave = '暂无数据';
                        }
                        return stSave;
                    } else if (type === 'status') {
                        if (content) {
                            stSave = content.title;
                        } else {
                            stSave = '暂无数据';
                        }
                        return stSave;
                    } else if (type === 'id') {
                        return sprintf(sDeviceTableActiveSpanHtml, {
                            id: content
                        });
                    }
                } else {
                    return content;
                }
            })
            .setClickCallback(function (node) {
                activeSpanEvent(node);
            });
    }

    // 表格鼠标事件
    function tableMouseEvent() {
        var layerTip = null;
        var oNowNode = null;
        var oNowDom = null;
        var stSave = null;
        oTableParent.on('mouseenter', 'td', function () {
            oNowNode = $(this);
            oNowDom = oNowNode.get(0);
            if (oNowDom.scrollWidth > oNowDom.offsetWidth) {
                stSave = oNowNode.text();
                if (!!stSave) {
                    layerTip = __layer.tips(stSave, oNowNode, {
                        tips: 1
                    });
                }
            }
        }).on('mouseleave', 'td', function () {
            if (layerTip) {
                __layer.close(layerTip);
                layerTip = null;
            }
        })
    }

    // 活动span的执行函数
    function activeSpanEvent(node) {
        // 当前span类型
        var sNowSpanType = null;
        // 当前id
        var sNowId = null;
        // 当前标签名
        var sNowNodeName = node.get(0).tagName.toLowerCase();
        // 获取设备数据
        var oDeviceItemData = null;
        // 操作
        if (sNowNodeName === 'span' && node.hasClass('active-span')) {
            sNowSpanType = node.attr('data-type');
            sNowId = node.attr('data-id');
            switch (sNowSpanType) {
                case 'reserve':
                    __layer.confirm('是否预约当前设备?', {
                        title: '预约'
                    }, function (index) {
                        __layer.close(index);
                        reserveDevice(sNowId);
                    }, function (index) {
                        // 取消
                        __layer.close(index);
                    });
                    break;
                default:
                    break;
            }
        } else if (sNowNodeName === 'a' && node.hasClass('device-name-link')) {
            sNowId = node.get(0).id;
            // 获取对应的设备数据
            oDeviceItemData = dataSource.searchArrayObj(sNowId, 'id', true);
            // 开启信息卡，并写入数据
            setDeviceInfoCardShow(true, oDeviceItemData);
        }
    }

    // 预约设备
    function reserveDevice (sId) {
        var config = null;
        if(isReserve) {
            setLayerMsg('正在预约中，请勿操作！');
            return false;
        }
        if (sId === undefined) {
            setLayerMsg('reserveDevice的sId不能为空');
            return false;
        }
        config = {
            equipmentId: sId
        };
        __layer.load(2, {shade: [0.5, '#ffffff']});
        isReserve = true;
        _ajax.post('default', {
            url: '/equipmentReserve/create_update',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(config),
            success:function (res) {
                // 预约成功后返回的是预约消息的数据
                __layer.closeAll();
                isReserve = false;
                if (res.status === 200) {
                    setLayerMsg('预约设备成功！');
                }
            },
            error:function (err) {
                var data = err.responseJSON;
                // 关闭加载
                __layer.closeAll();
                isReserve = false;
                dealWithErrorData(data);
            }
        })
    }

    /* 设备展示分页 */
    function initDevicePage() {
        nNowPageNumber = 1;
        setPageBaseConfig();
    }

    // 配置分页
    function setPageBaseConfig() {
        // 测试分页
        oPage.openFirstEndModel(false)
        // 打开跳转
            .openLift(true)
            // 获取输入框
            .setGetInputNodeCallback(function (number) {
                if (number !== null) {
                    nNowPageNumber = number;
                    canLift = true;
                } else {
                    canLift = false;
                }
            })
            // 点击回调
            .setClickCallback(function (node, oldPageNumber) {
                var _this = this;
                var labelType = node.get(0).tagName.toLowerCase();
                var newNumber = 0;
                if (labelType === 'li') {
                    // 页码按钮
                    if (node.data('status') !== undefined) {
                        newNumber = parseInt(node.data('mark'));
                        if (node.data('status') !== 'active' && newNumber !== oldPageNumber) {
                            nNowPageNumber = newNumber;
                            // 重新获取数据并重写表格
                            getDeviceShowData();
                        }
                    } else {// 我是上下页
                        if (node.data('mark') === 'prev') {
                            newNumber = oldPageNumber - 1;
                            if (newNumber > 0) {
                                nNowPageNumber = newNumber;
                                // 重新获取数据并重写表格
                                getDeviceShowData();
                            }
                        } else if (node.data('mark') === 'next') {
                            newNumber = oldPageNumber + 1;
                            if (newNumber < nMaxPageNumber + 1) {
                                nNowPageNumber = newNumber;
                                // 重新获取数据并重写表格
                                getDeviceShowData();
                            }
                        }
                    }
                } else if (labelType === 'button') {
                    // 按钮
                    if (canLift) {
                        // 重新获取数据并重写表格
                        getDeviceShowData();
                    }
                }
            });
    }

    /* 发布设备仪器 */
    function initPublishDeviceModel() {
        // 设置编辑模式
        oPublishDevice.setShowModel(false);
    }


    /* 设备信息卡 */

    // 初始化设备信息卡,ps：将信息卡插入到body下
    function initDeviceInfoCard() {
        oDeviceInfoCardNode.detach();
        oBodyNode.append(oDeviceInfoCardNode);
    }

    // 展示信息卡
    function setDeviceInfoCardShow(isShow, data) {
        var bodyHeight = null;
        if (isShow) {
            importDeviceInfoCard(data);
            if (oDeviceInfoCardNode.is(':hidden')) {
                oDeviceInfoCardNode.show();
            }
            bodyHeight = oBodyNode.height();
            if (oDeviceInfoCardNode.height() < bodyHeight) {
                oDeviceInfoCardNode.css({
                    height: bodyHeight + 'px'
                })
            }
        } else {
            // 关闭页面就初始化
            initFormOfInfoCard();
            if (oDeviceInfoCardNode.is(':visible')) {
                oDeviceInfoCardNode.hide();
            }
        }
    }

    // 初始化信息卡
    function initFormOfInfoCard() {
        if (!oDeviceInfoCard) {
            oDeviceInfoCard = new CreateDeviceForm(oDeviceInfoContainerNode);
            oDeviceInfoCard.setShowModel(true)
                .setZoomModel(true);
        } else {
            oDeviceInfoCard.setShowModel(true)
                .setZoomModel(true)
                .init();
        }

    }

    // 写入数据
    function importDeviceInfoCard(data) {
        if (!oDeviceInfoCard) {
            initFormOfInfoCard();
        }
        oDeviceInfoCard.setFormData(data);
    }

    // 点击事件
    function deviceInfoClick() {
        eventOfDeviceInfoCloseClick();
    }

    // 关闭点击事件
    function eventOfDeviceInfoCloseClick() {
        oDeviceInfoCloseNode.on('click', function () {
            if (oDeviceInfoCardNode.is(':visible')) {
                setDeviceInfoCardShow(false);
            }
        })
    }
});
