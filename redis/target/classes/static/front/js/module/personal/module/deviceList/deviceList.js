$(function () {
    var personalMainObj = window._personal_main_;
    var FuncOfModelCommon = personalMainObj._model_common_;
    // 定义模块函数
    function DeviceList() {
        var _this = this;
        // 初始化ajax
        var _ajax = new NewAjax();
        // 当前模块
        var oNowModel = $('#device-list');
        // 是否正在请求数据
        var bIsLoading = false;
        // 加载标志
        var layerLoad = null;
        // body节点
        var oBodyNode = $('body').eq(0);
        // 判定是否为json字符串
        var oJsonRule = /^\[.*\]$|^{.*}$/;

        /* 暂无数据 */
        // 提示节点
        var oVoidNode = oNowModel.find('div.device-list-void-div').eq(0);


        /* 设备表格 */
        // 设备表格
        var oTable = new Table('device-list-table');
        // 父节点
        var oTableParent = oNowModel.find('#device-list-table');
        // 设备数据
        var aDeviceData = null;
        // 表格基础样式
        var aTableBaseStyle = [
            {
                type: 'device',
                name: '仪器名称',
                width: 336,
                align: 'center'
            },
            {
                type: 'deviceModel',
                name: '仪器型号',
                width: 136,
                align: 'center'
            },
            {
                type: 'userName',
                name: '预约人',
                width: 117,
                align: 'center'
            },
            {
                type: 'time',
                name: '预约时间',
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
        var aTableOrder = ['device', 'deviceModel', 'userName', 'time', 'id'];
        // 设备名html
        var sDeviceTableNameHtml = '<a id="%id%" class="device-name-link" href="javaScript:void(0);">%name%</a>';
        // 活动span Html
        var sDeviceTableActiveSpanHtml = '<span class="active-span" data-type="cancelReserve" data-id="%id%">取消预约</span>';
        // 是否正在取消预约
        var isCancelReserve = false;

        /* 设备分页 */
        // 分页插件
        var oPage = new PluginPagination('news-page');
        // 父节点
        var oPageParent = oNowModel.find('#news-page');
        // 存储每页的条数
        var nPageSize = 10;
        // 打开go按钮功能
        var canLift = true;
        // 当前页码
        var nNowPageNumber = 1;
        // 最大页码
        var nMaxPageNumber = null;

        /* 设备信息卡(详情表单) */
        // 信息卡
        var oDeviceInfoCardNode = oNowModel.find('.device-info-global-div').eq(0);
        // 内容区域
        var oDeviceInfoContainerNode = oDeviceInfoCardNode.find('.device-info-div').eq(0);
        // 关闭按钮
        var oDeviceInfoCloseNode = oDeviceInfoContainerNode.find('.device-info-title').eq(0).find('.icon-error').eq(0);
        // 引入设备信息卡
        var oDeviceInfoCard = null;

        initDeviceTable();
        tableMouseEvent();
        deviceInfoClick();

        /*=== 外部调用方法 ===*/
        // 初始化
        _this.init = function () {
            initDeviceInfoCard();
            getDeviceData();
        };

        /*=== 工具函数 ===*/
        /**
         * 错误处理函数
         * @param data 错误数据
         */
        function dealWithError(data) {
            if (!data) {
                setLayerMsg('获取数据失败！');
                return false;
            }
            var status = data.status;
            setLayerMsg(data.message);
            if (!!status) {
                // 用户未登录，清空用户信息
                if (status === 403) {
                    __public.storage.saveToLocalStorage('user', null);
                }
            }
        }

        /**
         * 开启layer.message
         * @param message 要提示的字符串
         */
        function setLayerMsg(message) {
            __layer.closeAll();
            __layer.msg(message);
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

        /*=== 功能函数 ===*/

        // 获取预约设备信息
        function getDeviceData() {
            var config = null;
            var layerLoad = null;
            if (bIsLoading) {
                setLayerMsg('正在请求中，请勿操作！');
                return false;
            }
            config = {
                pager: {
                    current: nNowPageNumber,
                    size: nPageSize
                },
                sortPointer: {
                    filed: "created_at",
                    order: "DESC"
                }
            };
            if (!(!!layerLoad)) {
                layerLoad = __layer.load(2, {shade: [0.5, '#ffffff']});
            }
            bIsLoading = true;
            _ajax.post('default', {
                url: '/equipmentReserve/query',
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                data: JSON.stringify(config),
                success: function (res) {
                    var data = null;
                    var total = null;
                    bIsLoading = false;
                    if (res.status === 200) {
                        data = res.data;
                        setLayerMsg('获取预约设备列表成功');
                        layerLoad = null;
                        // 更新分页
                        total = data.total;
                        if (total > 0) {
                            oVoidNode.hide();
                        } else {
                            oVoidNode.show();
                        }
                        nMaxPageNumber = Math.ceil(total / nPageSize);
                        if (nMaxPageNumber > 1) {
                            oPage.showPage(true)
                                .setMaxPageNumber(nMaxPageNumber)
                                .setNowPageNumber(nNowPageNumber);
                        } else {
                            oPage.showPage(false);
                        }
                        aDeviceData = extractDeviceListData(data.data_list);
                        renderData(aDeviceData);
                    }
                },
                error: function (XMLResponse) {
                    var data = XMLResponse.responseJSON;
                    bIsLoading = false;
                    dealWithError(data);
                    layerLoad = null;
                }
            })
        }

        // 提取数据
        function extractDeviceListData(data) {
            var result = [];
            var stSave = null;
            data.forEach(function (item) {
                var obj = {};
                obj.id = item.id;
                stSave = (!!item.equipmentId) ? JSON.parse(item.equipmentId) : null;
                if (stSave) {
                    obj.device = {};
                    obj.device.id = stSave.id;
                    obj.device.name = stSave.name;
                    obj.deviceModel = stSave.model;
                }
                obj.time = (!!item.createdAt) ? formatTime(new Date(item.createdAt), false, 'YYYY-MM-DD') : null;
                stSave = (!!item.userId) ? JSON.parse(item.userId) : null;
                if (stSave) {
                    obj.userName = stSave.userName;
                }
                result.push(obj);
            });
            return result;
        }

        // 写入数据
        function renderData(data) {
            console.log(data)
            oTable.setStartIndex((nNowPageNumber - 1) * nPageSize + 1)
                .setTableData(data);
        }

        // 初始化表格
        function initDeviceTable() {
            // 获取用户状态
            var sUserStatus = null;
            var stSave = null;
            oTable.setBaseStyle(aTableBaseStyle)
                .setColOrder(aTableOrder)
                .setStartIndex((nNowPageNumber - 1) * nPageSize + 1)
                .setOpenCheckBox(false, 2)
                .setTableLineHeight(40)
                .resetHtmlCallBack(function (type, content, label) {
                    if (label === 'td') {
                        if (type === 'device') {
                            return sprintf(sDeviceTableNameHtml, content);
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
                    case 'cancelReserve':
                        __layer.confirm('是否取消当前设备的预约?', {
                            title: '取消预约'
                        }, function (index) {
                            __layer.close(index);
                            handlerOfCancelReserve(sNowId);
                        }, function (index) {
                            // 取消
                            __layer.close(index);
                        });
                        break;
                    default:
                        break;
                }
            } else if (sNowNodeName === 'a' && node.hasClass('device-name-link')) {
                // 获取设备id
                sNowId = node.get(0).id;
                // 加载设备表单资源文件
                loadDeviceForm(function () {
                    // 设备请求
                    getDeviceDetailData(sNowId);
                });
            }
        }

        // 加载设备表单资源
        function loadDeviceForm(callback) {
            // 插件已加载
            if (!!window.CreateDeviceForm) {
                if (!!callback) {
                    callback();
                }
            } else {
                // 加载设备表单的js文件
                personalMainObj.loadResource({
                    moduleName: 'deviceList',
                    pluginName: 'CreateDeviceForm',
                    vNode:{
                        src: '/static/front/js/module/device/module/deviceForm.js?time=' + new Date().getTime()
                    },
                    callback: function (data) {
                        var type = data.type;
                        var node = data.node;
                        // 加载成功
                        if (type === 'success') {
                            if (!!callback) {
                                callback();
                            }
                        } else {// 加载失败
                            __layer.confirm('仪器表单资源加载失败，是否重新加载？', {
                                title: '提示'
                            }, function (index) {
                                __layer.close(index);
                                // 删除dom节点
                                node.remove();
                                node = null;
                                // 重新加载
                                loadDeviceForm(callback);
                            }, function (index) {
                                __layer.close(index);
                            });
                        }
                    }
                })
            }
        }

        // 请求设备详情
        function getDeviceDetailData(deviceId) {
            if (bIsLoading) {
                setLayerMsg('正在请求数据，请稍后操作');
                return false;
            }
            bIsLoading = true;
            if (!(!!layerLoad)) {
                layerLoad = __layer.load(2, {shade: [0.5, '#ffffff']});
            }
            _ajax.post('default', {
                url: '/equipment/get_by_id/' + deviceId,
                contentType: "application/json;charset=UTF-8",
                success: function (res) {
                    var data = null;
                    bIsLoading = false;
                    __layer.close(layerLoad);
                    layerLoad = null;
                    if (res.status === 200) {
                        data = res.data.data_object;
                        extractDeviceDetailData(data);
                        // 开启信息卡，并写入数据
                        setDeviceInfoCardShow(true, data);
                    }
                },
                error: function (err) {
                    console.log(err);
                    bIsLoading = false;
                    __layer.close(layerLoad);
                    layerLoad = null;
                }
            })
        }

        // 提取数据
        function extractDeviceDetailData(data) {
            var stSave = null;
            var dataSource = null;
            if (getVariableType(data) !== 'array') {
                dataSource = [data];
            }
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
        }

        // 取消预约
        function handlerOfCancelReserve(deviceId) {
            var config = [];
            if (isCancelReserve) {
                setLayerMsg('预约取消中，请勿操作');
                return false;
            }
            isCancelReserve = true;
            layerLoad = __layer.load(2, {shade: [0.5, '#ffffff']});
            if (getVariableType(deviceId) === 'array') {
                config = config.concat(deviceId);
            } else {
                config.push(deviceId);
            }
            _ajax.post('default', {
                url: '/equipmentReserve/batch_delete',
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                data: JSON.stringify(config),
                success: function (res) {
                    var data = null;
                    var list = null;
                    var total = null;
                    isCancelReserve = false;
                    __layer.close(layerLoad);
                    if (res.status === 200) {
                        setLayerMsg('取消预约成功');
                        // 重新请求数据
                        getDeviceData();
                    }
                },
                error: function (err) {
                    var data = err.responseJSON;
                    // 关闭加载
                    __layer.close(layerLoad);
                    isCancelReserve = false;
                    dealWithErrorData(data);
                }
            })
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

    }
    // 函数继承
    DeviceList.prototype = new FuncOfModelCommon();
    // 引用释放
    FuncOfModelCommon = null;
    // 调用主模块的模块注册方法
    personalMainObj.setMethodObj('deviceList', new DeviceList());
});
