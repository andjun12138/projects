$(function () {
    var personalMainObj = window._personal_main_;

    var FuncOfModelCommon = personalMainObj._model_common_;

    function StationNews() {
        var _this = this;
        // 初始化ajax
        var _ajax = new NewAjax();
        // 获取当前模块
        var oNowModel = $('#station-news');
        // 表单模块
        var oFormNode = oNowModel.find('form.station-news-form').eq(0);
        // 消息数据
        var aNewsData = [];
        // 选中的id数组
        var aSelectIds = [];
        // 子项html
        var sNewsItemHtml = '<li class="new-item" data-id="%id%" data-index="%index%" data-status="%haveRead%">\n' +
            '                <div class="base-info-div">\n' +
            '                    <div class="info-item checkbox-module">\n' +
            '                        <input id="%id%" type="checkbox" class="new-select">\n' +
            '                        <label for="%id%" class="select-al-icon"></label>\n' +
            '                    </div>\n' +
            '                    <div class="info-item status-module">%status%</div>\n' +
            '                    <div class="info-item title-module">%title%</div>\n' +
            '                    <div class="info-item time-module">%time%</div>\n' +
            '                    <div class="info-item operate-module">\n' +
            '                        <button class="action-btn delete" data-id="%id%">删除</button>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <div class="message-detail-div">\n' +
            '                    <p class="message-content">%content%</p>\n' +
            '                </div>\n' +
            '            </li>';
        // 是否正在请求中
        var bIsLoading = false;

        /* 状态 */
        // 状态列表
        var oStatusListNode = oFormNode.find('ul.news-status-list').eq(0);
        // 子项节点
        var oStatusChildren = oStatusListNode.children();
        // 状态值
        var sStatusValue = null;

        /* 标题 */
        // 标题输入框
        var oTitleInputNode = oFormNode.find('input.new-title-input').eq(0);
        // 标题按钮
        var oTitleBtnNode = oFormNode.find('button.search-button').eq(0);
        // 标题值
        var sTitleValue = null;

        /* 按钮 */
        // 标记已读
        var oReadBtnNode = oFormNode.find('button.read').eq(0);
        // 删除
        var oDeleteBtnNode = oFormNode.find('button.delete').eq(0);


        /* 时间输入框 */
        // 时间输入节点
        var oTimeInputNode = oFormNode.find('input[class*="-time"]');
        // 起始时间
        var oStartTimeInputNode = oFormNode.find('input.start-time').eq(0);
        // 结束时间
        var oEndTimeInputNode = oFormNode.find('input.end-time').eq(0);
        // 起始时间值
        var sStartTimeValue = null;
        // 结束时间值
        var sEndTimeValue = null;

        /* 消息列表 */
        // 列表头复选框
        var oNewsAllSelectNode = oNowModel.find('#select-all');
        // 复选框父框
        var oNewsAllSelectParentNode = oNewsAllSelectNode.parent();
        // 消息列表
        var oNewsListNode = oNowModel.find('ul.news-list').eq(0);
        // 消息列表子项
        var aNewsItems = null;

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

        // 初始化时间插件
        initTimePlugin(oTimeInputNode);
        // 事件
        allEvent();

        /*=== 外部调用方法 ===*/
        // 初始化方法
        _this.init = function () {
            // 初始化表单
            initForm();
            // 获取列表数据
            getNewsData();
        };

        /*=== 工具函数 ===*/
        /**
         * 初始化时间插件
         * @param timeNode 传入时间
         */
        function initTimePlugin(timeNode) {
            if (!!timeNode.each){
                timeNode.each(function () {
                    $(this).datetimepicker({
                        format: 'yyyy-mm-dd', //显示格式
                        language: 'zh-CN',
                        todayHighlight: 1,
                        minView: 2,
                        todayBtn: true,
                        autoclose: true
                    });
                })
            } else {
                timeNode.datetimepicker({
                    format: 'yyyy-mm-dd', //显示格式
                    language: 'zh-CN',
                    todayHighlight: 1,
                    minView: 2,
                    todayBtn: true,
                    autoclose: true
                });
            }
        }

        /**
         * 错误处理函数
         * @param data 错误数据
         */
        function dealWithError(data) {
            if (!data){
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
                oTipNode = oInputDivNode.parents('.form-group').eq(0).find('.input-tip').eq(0);
                oTipNode.text(content);
                if (isShow) {
                    oTipNode.show();
                } else {
                    oTipNode.hide();
                }
            }
        }

        /**
         * 增删数组子项
         * @param arr 数组
         * @param item 子项
         * @param isAdd 是否添加
         */
        function addAndDelArrayItem(arr, item, isAdd) {
            if (isAdd === undefined) {
                isAdd = true;
            }
            var index = arr.searchArrayObj(item);
            // 添加
            if (isAdd){
                if (index < 0) {
                    arr.push(item);
                }
            } else { // 删除
                if (index > -1) {
                    arr.splice(index, 1);
                }
            }
        }

        /*=== 功能函数 ===*/
        /* 初始化 */
        // 初始化表单
        function initForm() {
            initStatusList();
            initNameSearch();
            initTimeSearch();
            initPagePlugin();
        }
        // 初始化状态列表
        function initStatusList() {
            var oNowNode = null;
            var sNowType = null;
            oStatusChildren.each(function () {
                oNowNode = $(this);
                sNowType = oNowNode.data('type');
                if (oNowNode.hasClass('active')) {
                    if (sNowType === 'all'){
                        return false;
                    } else {
                        oNowNode.removeClass('active');
                    }
                }else if (sNowType === 'all') {
                    oNowNode.addclass('active');
                }
            });
            sStatusValue = null;
        }
        // 初始化名称搜索
        function initNameSearch() {
            oTitleInputNode.val('');
            sTitleValue = null;
        }
        // 初始化时间搜索
        function initTimeSearch() {
            var oNowNode = null;
            oTimeInputNode.each(function () {
                oNowNode = $(this);
                oNowNode.val('');
            });
            sStartTimeValue = null;
            sEndTimeValue = null;
        }

        // 初始化分页
        function initPagePlugin() {
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
                                getNewsData();
                            }
                        } else {// 我是上下页
                            if (node.data('mark') === 'prev') {
                                newNumber = oldPageNumber - 1;
                                if (newNumber > 0) {
                                    nNowPageNumber = newNumber;
                                    // 重新获取数据并重写表格
                                    getNewsData();
                                }
                            } else if (node.data('mark') === 'next') {
                                newNumber = oldPageNumber + 1;
                                if (newNumber < nMaxPageNumber + 1) {
                                    nNowPageNumber = newNumber;
                                    // 重新获取数据并重写表格
                                    getNewsData();
                                }
                            }
                        }
                    } else if (labelType === 'button') {
                        // 按钮
                        if (canLift) {
                            // 重新获取数据并重写表格
                            getNewsData();
                        }
                    }
                });
        }

        // 获取列表数据
        function getNewsData(callback) {
            var config = null;
            var layerLoad = null;
            if (bIsLoading) {
                setLayerMsg('正在请求中，请勿操作！');
                return false;
            }
            config = {
                haveRead: sStatusValue,
                title: sTitleValue,
                startTime: sStartTimeValue,
                endTime: sEndTimeValue,
                pager:{
                    current: nNowPageNumber,
                    size: nPageSize
                }
            };
            Object.keys(config).forEach(function (key) {
                if (config[key] === null){
                    delete config[key];
                }
            });
            if (!(!!layerLoad)) {
                layerLoad = __layer.load(2, {shade: [0.5, '#ffffff']});
            }
            bIsLoading = true;
            _ajax.post('default',{
                url: '/messageNotice/queryMessageNotice',
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                data: JSON.stringify(config),
                success: function (res) {
                    var data = null;
                    var total = null;
                    bIsLoading = false;
                    if (res.status === 200) {
                        data = res.data;
                        setLayerMsg('获取消息列表成功');
                        layerLoad = null;
                        aNewsData = extractData(data.data_list);
                        renderData(aNewsData);
                        // 更新分页
                        total = data.total;
                        nMaxPageNumber = Math.ceil(total / nPageSize);
                        if (nMaxPageNumber > 1) {
                            oPage.showPage(true)
                                .setMaxPageNumber(nMaxPageNumber)
                                .setNowPageNumber(nNowPageNumber);
                        } else {
                            oPage.showPage(false);
                        }
                        if (callback) {
                            callback();
                        }
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
        function extractData (data) {
            var result = [];
            var obj = null;
            data.forEach(function (item) {
                obj = {};
                obj.id = item.id;
                obj.title = (!!item.title) ? item.title : '暂无数据';
                obj.haveRead = item.haveRead;
                obj.status = (obj.haveRead) ? '已读' : '未读';
                obj.content = (!!item.content) ? item.content : '暂无数据';
                obj.time = (item.createdAt) ? formatTime(new Date(item.createdAt), false, 'YYYY-MM-DD') : '暂无数据';
                result.push(obj);
            });
            return result;
        }

        // 写入数据
        function renderData (data) {
            var result = '';
            var oNowItem = null;
            var oNowCheckBox = null;
            var sNowId = null;
            data.forEach(function (item, index) {
                result += sprintf(sNewsItemHtml, item, index);
            });
            oNewsListNode.html(result);
            // 获取最新子项
            aNewsItems = oNewsListNode.find('li.new-item');
            if (aSelectIds.length > 0) {
                // 当前节点
                aNewsItems.each(function () {
                    oNowItem = $(this);
                    oNowCheckBox = oNowItem.find('input[type="checkbox"]').eq(0);
                    sNowId = oNowItem.data('id');
                    if (aSelectIds.searchArrayObj(sNowId) > -1) {
                        oNowCheckBox.prop('checked', true);
                    }
                });
            }
        }

        /* 事件 */
        function allEvent() {
            eventOfStatusListClick();
            eventOfTitleBtnClick();
            timeEvent();
            eventOfMarkedReadClick();
            eventOfDeleteClick();
            eventOfNewsAllSelectMove();
            eventOfNewsListClick();
        }
        // 状态列表事件
        function eventOfStatusListClick() {
            // 当前节点
            var oNowNode = null;
            // 状态节点
            var stSave = null;
            // tagName
            var sTagName = null;
            // 当前类型
            var sNowType = null;
            oStatusListNode.on('click', function (event) {
                oNowNode = $(event.target);
                sTagName = oNowNode.get(0).tagName.toLowerCase();
                if (sTagName === 'li') {
                    oStatusChildren.each(function () {
                        stSave = $(this);
                        if (stSave.hasClass('active')) {
                            stSave.removeClass('active');
                            return false;
                        }
                    });
                    oNowNode.addClass('active');
                    sNowType = oNowNode.data('type');
                    if (sNowType === 'all') {
                        sStatusValue = null;
                    } else if (sNowType === 'read') {
                        sStatusValue = true;
                    } else if (sNowType === 'unread') {
                        sStatusValue = false;
                    }
                    getNewsData();
                }
            });
        }
        // 标题按钮事件
        function eventOfTitleBtnClick() {
            oTitleBtnNode.on('click', function () {
                if (!!String.trim){
                    sTitleValue = oTitleInputNode.val().trim();
                } else {
                    sTitleValue = oTitleInputNode.val().replace(/^\s+|\s+$/gm,'');
                }
                if (!(!!sTitleValue)) {
                    setLayerMsg('无查询内容！');
                    setTipShow(oTitleInputNode, true, '无查询内容');
                    return false;
                }
                setTipShow(oTitleInputNode, false);
                // 页数回1
                nNowPageNumber = 1;
                getNewsData();
            })
        }

        // 时间事件
        function timeEvent() {
            eventOfStartTimeChange();
            eventOfEndTimeChange();
        }

        // 开始时间的change事件
        function eventOfStartTimeChange() {
            oStartTimeInputNode.on('change', function () {
                sStartTimeValue = $(this).val();
                // 时间测试
                if (!timeTest()){
                    return false;
                }
                setTipShow(oStartTimeInputNode, false);
                nNowPageNumber = 1;
                getNewsData();
            })
        }

        // 结束时间的change事件
        function eventOfEndTimeChange() {
            oEndTimeInputNode.on('change', function () {
                sEndTimeValue = $(this).val();
                // 时间测试
                if (!timeTest()){
                    return false;
                }
                setTipShow(oStartTimeInputNode, false);
                nNowPageNumber = 1;
                getNewsData();
            })
        }

        // 时间范围测试
        function timeTest() {
            var today = new Date().getTime();
            var start = (!!sStartTimeValue) ? new Date(sStartTimeValue).getTime() : null;
            var end = (!!sEndTimeValue) ? new Date(sEndTimeValue).getTime() : today;
            var result = true;
            if (!(!!sEndTimeValue)) {
                sEndTimeValue = formatTime(end, false, 'YYYY-MM-DD');
                oEndTimeInputNode.val(sEndTimeValue);
            }
            if (start && end) {
                if (start > today || end > today) {
                    setTipShow(oStartTimeInputNode, true, '开始/结束时间不可大于今天！');
                    result = false;
                } else if (start > end) {
                    setTipShow(oStartTimeInputNode, true, '开始时间不能大于结束时间');
                    result = false;
                }
            } else if (end) {
                if (end > today) {
                    setTipShow(oStartTimeInputNode, true, '结束时间不可大于今天');
                } else {
                    setTipShow(oStartTimeInputNode, true, '起始时间不可为空');
                }
                result = false;
            }
            return result;
        }
        
        // 标记已读事件
        function eventOfMarkedReadClick() {
            oReadBtnNode.on('click', function () {
                if (bIsLoading) {
                    setLayerMsg('正在请求中，请勿操作！');
                    return false;
                }
                markedRead(aSelectIds, function () {
                    nNowPageNumber = 1;
                    getNewsData();
                });
            })
        }
        // 标记已读
        function markedRead(aIds, callback) {
            if (aIds.length < 1) {
                setLayerMsg('无选中内容！');
                return false;
            }
            _ajax.post('default', {
                url: '/messageNotice/haveRead',
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                data: JSON.stringify(aIds),
                success: function (res) {
                    if (res.status === 200) {
                        setLayerMsg('标记已读成功');
                        if (callback) {
                            callback();
                        }
                    }
                },
                error: function (XMLResponse) {
                    var data = XMLResponse.responseJSON;
                    bIsLoading = false;
                    dealWithError(data);
                }
            })
        }
        
        // 删除消息事件
        function eventOfDeleteClick() {
            oDeleteBtnNode.on('click', function () {
                if (bIsLoading) {
                    setLayerMsg('正在请求中，请勿操作！');
                    return false;
                }
                __layer.confirm('是否删除勾选的消息？', {
                    title: '提示'
                }, function (index) {
                    __layer.close(index);
                    deleteNews(aSelectIds, function () {
                        // 清空
                        aSelectIds.splice(0, aSelectIds.length);
                        oNewsAllSelectNode.prop('checked', false);
                        nNowPageNumber = 1;
                        getNewsData();
                    });
                }, function (index) {
                    __layer.close(index);
                });

            })
        }
        // 删除消息
        function deleteNews(aIds, callback) {
            if (aIds.length < 1) {
                setLayerMsg('无选中内容！');
                return false;
            }
            _ajax.post('default', {
                url: '/messageNotice/deleteByIds',
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                data: JSON.stringify(aIds),
                success: function (res) {
                    if (res.status === 200) {
                        setLayerMsg('删除消息成功');
                        if (callback) {
                            callback();
                        }
                    }
                },
                error: function (XMLResponse) {
                    var data = XMLResponse.responseJSON;
                    bIsLoading = false;
                    dealWithError(data);
                }
            })
        }

        // 全选父框的移入移出事件
        function eventOfNewsAllSelectMove() {
            var tipIndex = null;
            oNewsAllSelectParentNode.on('mouseenter', function () {
                if (!!tipIndex) {
                    __layer.close(tipIndex);
                }
                tipIndex = __layer.tips('只能全选当前页', oNewsAllSelectParentNode, {
                    tips: 1
                });
            });
            oNewsAllSelectParentNode.on('mouseleave', function () {
                if (!!tipIndex) {
                    __layer.close(tipIndex);
                    tipIndex = null;
                }
            })
        }

        // 消息列表点击事件
        function eventOfNewsListClick() {
            eventOfNewsHeadChange();
            eventOfNewsContentClick();
        }

        // 列表头复选框的change事件
        function eventOfNewsHeadChange() {
            // 当前是否选中
            var isSelectAll = false;
            // 当前子项节点
            var oNowItem = null;
            // 子项复选框
            var oNowItemCBNode = null;
            // 当前id
            var sNowId = null;
            oNewsAllSelectNode.on('change', function () {
                setLayerMsg('全选功能未完成！');
                return false;
                /*isSelectAll = oNewsAllSelectNode.is(':checked');
                if (!(!!aNewsItems)){
                    aNewsItems = oNewsListNode.find('li.new-item');
                }
                aNewsItems.each(function () {
                    oNowItem = $(this);
                    oNowItemCBNode = oNowItem.find('input[type="checkbox"]').eq(0);
                    if (isSelectAll) {
                        oNowItemCBNode.prop('checked', true);
                        sNowId = oNowItemCBNode.get(0).id;
                        addAndDelArrayItem(aSelectIds, sNowId);
                    } else {
                        oNowItemCBNode.prop('checked', false);
                        aSelectIds = [];
                    }
                })*/
            })
        }

        // 列表内容点击事件
        function eventOfNewsContentClick() {
            // 当前节点
            var oNowNode = null;
            // dom
            var oNowDom = null;
            // 当前复选框
            var oNowCheckBox = null;
            // 选中id
            var sSelectId = null;
            // 消息模块
            var oMessageModel = null;
            // 消息项
            var oNewLiNode = null;
            // 是否已读
            var bIsHaveRead = null;
            oNewsListNode.on('click', function (event) {
                oNowNode = $(event.target);
                oNowDom = oNowNode.get(0);
                // 按钮
                if (oNowDom.tagName.toLowerCase() === 'button'){
                    // 删除按钮
                    if (oNowNode.hasClass('delete')) {
                        __layer.confirm('是否删除当前消息？', {
                            title: '提示'
                        }, function (index) {
                            __layer.close(index);
                            sSelectId = oNowNode.data('id');
                            addAndDelArrayItem(aSelectIds, sSelectId, false);
                            deleteNews([sSelectId], function () {
                                nNowPageNumber = 1;
                                getNewsData();
                            });
                        }, function (index) {
                            __layer.close(index);
                        });
                    }
                } else if (oNowNode.parents('.checkbox-module').length > 0) {// 复选框
                    oNowCheckBox = oNowNode.parents('.checkbox-module').eq(0).find('input[type="checkbox"]').eq(0);
                    sSelectId = oNowCheckBox.get(0).id;
                    // 选中
                    if (oNowCheckBox.is(':checked')) {
                        addAndDelArrayItem(aSelectIds, sSelectId);
                    } else {// 取消
                        addAndDelArrayItem(aSelectIds, sSelectId, false);
                    }
                } else if (oNowNode.parents('.new-item').length > 0){// 其他元素
                    oNewLiNode = oNowNode.parents('.new-item').eq(0);
                    bIsHaveRead = oNewLiNode.data('status');
                    if (!bIsHaveRead) {
                        sSelectId = oNewLiNode.data('id');
                        markedRead([sSelectId], function () {
                            oNewLiNode.data('status', true);
                            oNewLiNode.find('div.status-module').eq(0).text('已读');
                        })
                    }
                    oMessageModel = oNewLiNode.find('.message-detail-div').eq(0);
                    // 显示
                    if (oMessageModel.is(':visible')) {
                        oMessageModel.hide();
                    } else {// 隐藏
                        oMessageModel.show();
                    }
                }
            })
        }
    }

    StationNews.prototype = new FuncOfModelCommon();

    FuncOfModelCommon = null;

    personalMainObj.setMethodObj('stationNews', new StationNews());
});
