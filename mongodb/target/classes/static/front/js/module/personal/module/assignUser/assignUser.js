$(function () {
    var personalMainObj = window._personal_main_;
    var FuncOfModelCommon = personalMainObj._model_common_;
    // 定义模块函数
    function PersonalAssignUser() {
        var _this = this;
        // 初始化ajax
        var _ajax = new NewAjax();
        // 当前功能模块名称
        var sNowFuncModelName = null;
        // 查询用户接口
        var oSearchUrl = {
            assignCompanyUser: '/invitationMessage/query',
            assignIntelligentUser: '/frontUser/queryUserMap',
            assignTechnologyUser: '/frontUser/queryUserMap',
            assignIncubatorUser: '/frontUser/queryUserMap',
            assignContractUser: '/frontUser/queryUserMap',
            viewUserOfSystemAuthority: '/thirdUser/query',
            viewUserOfAffiliatedCompany: '/invitationMessage/query'
        };
        // 标题名称
        var oTitle = {
            assignCompanyUser: '企业子成员',
            assignIntelligentUser: '分配子用户',
            assignTechnologyUser: '分配子用户',
            assignIncubatorUser: '分配子用户',
            assignContractUser: '分配子用户',
            viewUserOfSystemAuthority: '系统权限',
            viewUserOfAffiliatedCompany: '所属企业'
        };
        // 表格style配置
        var oTableStyleConfig = {
            assignCompanyUser: [
                {
                    type: 'name',
                    name: '用户名',
                    width: 142,
                    align: 'center'
                },
                {
                    type: 'phone',
                    name: '手机号',
                    width: 185,
                    align: 'left'
                },
                {
                    type: 'statusCN',
                    name: '状态',
                    width: 80,
                    align: 'left'
                },
                {
                    type: 'id',
                    name: '操作',
                    align: 'left'
                }
            ],
            assignIntelligentUser: [
                {
                    type: 'name',
                    name: '用户名',
                    width: 142,
                    align: 'center'
                },
                {
                    type: 'phone',
                    name: '手机号',
                    width: 185,
                    align: 'left'
                },
                {
                    type: 'statusPF',
                    name: '状态',
                    width: 80,
                    align: 'left'
                },
                {
                    type: 'id',
                    name: '操作',
                    align: 'left'
                }
            ],
            assignTechnologyUser: [
                {
                    type: 'name',
                    name: '用户名',
                    width: 142,
                    align: 'center'
                },
                {
                    type: 'phone',
                    name: '手机号',
                    width: 185,
                    align: 'left'
                },
                {
                    type: 'statusPF',
                    name: '状态',
                    width: 80,
                    align: 'left'
                },
                {
                    type: 'id',
                    name: '操作',
                    align: 'left'
                }
            ],
            assignIncubatorUser: [
                {
                    type: 'name',
                    name: '用户名',
                    width: 142,
                    align: 'center'
                },
                {
                    type: 'phone',
                    name: '手机号',
                    width: 185,
                    align: 'left'
                },
                {
                    type: 'statusPF',
                    name: '状态',
                    width: 80,
                    align: 'left'
                },
                {
                    type: 'id',
                    name: '操作',
                    align: 'left'
                }
            ],
            assignContractUser: [
                {
                    type: 'name',
                    name: '用户名',
                    width: 142,
                    align: 'center'
                },
                {
                    type: 'phone',
                    name: '手机号',
                    width: 185,
                    align: 'left'
                },
                {
                    type: 'statusPF',
                    name: '状态',
                    width: 80,
                    align: 'left'
                },
                {
                    type: 'id',
                    name: '操作',
                    align: 'left'
                }
            ],
            viewUserOfSystemAuthority: [
                {
                    type: 'name',
                    name: '系统名称',
                    width: 142,
                    align: 'center'
                },
                {
                    type: 'account',
                    name: '账号',
                    align: 'left'
                }
            ],
            viewUserOfAffiliatedCompany: [
                {
                    type: 'name',
                    name: '所属企业',
                    width: 200,
                    align: 'left'
                },
                {
                    type: 'concatPeople',
                    name: '企业联系人',
                    width: 162,
                    align: 'center'
                },
                {
                    type: 'concatPhone',
                    name: '企业联系电话',
                    width: 165,
                    align: 'center'
                },
                {
                    type: 'statusCN',
                    name: '状态',
                    width: 80,
                    align: 'left'
                },
                {
                    type: 'id',
                    name: '操作',
                    align: 'left'
                }
            ]
        };
        // 顺序表
        var oTableOrderConfig = {
            assignCompanyUser: ['name', 'phone', 'statusCN', 'id'],
            assignIntelligentUser: ['name', 'phone', 'statusPF', 'id'],
            assignTechnologyUser: ['name', 'phone', 'statusPF', 'id'],
            assignIncubatorUser: ['name', 'phone', 'statusPF', 'id'],
            assignContractUser: ['name', 'phone', 'statusPF', 'id'],
            viewUserOfSystemAuthority: ['name', 'account'],
            viewUserOfAffiliatedCompany: ['name', 'concatPeople', 'concatPhone', 'statusCN', 'id']
        };
        // 平台提示
        var oPlatformTips = {
            // 知网
            assignTechnologyUser: '知网',
            // 云通关
            assignIntelligentUser: '智能通关',
            // 孵化器
            assignIncubatorUser: '创业孵化',
            // 众包
            assignContractUser: '技术众包'
        };
        // 平台类型
        var oPlatformTypes = {
            // 知网
            assignTechnologyUser: 0,
            // 云通关
            assignIntelligentUser: 1,
            // 孵化器
            assignIncubatorUser: 2,
            // 众包
            assignContractUser: 3
        };
        // 状态英文表
        var oStatusOfEN = {
            'd5a3aadf-505b-11e9-b722-6c0b84ab175e': 'pass',
            'dfaf0fc5-505b-11e9-b722-6c0b84ab175e': 'reject',
            'f0a471d1-505b-11e9-b722-6c0b84ab175e': 'confirm',
            'a0b7b2f7-5b82-11e9-84e8-6c0b84ab175e': 'quit',
            // 被剔除
            '7279b3fa-fe14-43f9-adcd-0d83b9bd79bb': 'excluded'
        };
        // 状态中文表
        var oStatusOfCN = {
            'd5a3aadf-505b-11e9-b722-6c0b84ab175e': '同意',
            'dfaf0fc5-505b-11e9-b722-6c0b84ab175e': '拒绝',
            'f0a471d1-505b-11e9-b722-6c0b84ab175e': '确认中',
            'a0b7b2f7-5b82-11e9-84e8-6c0b84ab175e': '退出',
            '7279b3fa-fe14-43f9-adcd-0d83b9bd79bb': {
                user: '被剔除',
                company: '剔除'
            }
        };
        // 平台id表
        var oPlatformId = {
            '5af55fde-5138-11e9-b722-6c0b84ab175e': 'zongbao',
            'cf04449b-226e-4571-9b70-51300312c636': 'Incubator',
            'a9253ac7-1d1c-40b1-b30f-277a4e1b2ae1': 'intelligent',
            '93df4eb6-b614-463f-ba1d-42126bb20f31': 'cloud'
        };
        // 主体模块
        var oMainModel = $('#assign-user');
        // 用户类型
        var sUserType = null;
        // 功能模式
        var bIsAllFunc = false;
        // 是否是外站分配用户。ps: 当前页包含‘外站分配用户’和‘企业分配子成员’
        var bIsOtherWebAssignUser = false;
        // 空格换行正则
        var oWarpRule = />?\s+<|>\s+<?/g;
        // 外站分配用户标记
        // var aOtherWebModelMark = ['assignIntelligentUser', 'assignTechnologyUser', 'assignIncubatorUser', 'assignContractUser'];
        // 分配用户名称正则
        var oNameRuleOfAssignUser = /^assign[a-zA-Z]+User$/;

        /* 标题 */
        var oTitleNode = oMainModel.find('.assign-user-title-v').eq(0);

        /* 无子成员提示 */
        var oUserVoidTipNode = oMainModel.find('.assign-user-void-div').eq(0);


        /* 数据表格 */
        // 表格插件
        var oTable = null;
        // 父节点
        var oTableParent = oMainModel.find('#assign-user-table');
        // 表格数据
        var oTableData = null;
        // 获取表格数据
        var handleOfGetTableData = createHandleOfGetTableData();

        /* 分页 */
        // 分页插件
        var oPage = null;
        // 父节点
        var oPageParent = oMainModel.find('#assign-user-page');
        // 存储每页的条数
        var nPageSize = 10;
        // 打开go按钮功能
        var canLift = true;
        // 当前页码
        var nNowPageNumber = 1;
        // 最大页码
        var nMaxPageNumber = null;

        /* 新增按钮 */
        var oAddBtn = oMainModel.find('#add-btn');
        // 按钮父节点
        var oAddBtnParent = oAddBtn.parent();

        /* 搜索列表模块 */
        // 搜索列表模块
        var oSearchListModel = oMainModel.find('.assign-user-list-div').eq(0);
        // 关闭按钮
        var oCloseBtnNode = oSearchListModel.find('.icon-error').eq(0);
        // 搜索input
        var oSearchInput = oSearchListModel.find('#search-user-input');
        // 搜索button
        var oSearchBtn = oSearchListModel.find('#search-user-btn');
        // 用户列表
        var oUserListNode = oSearchListModel.find('#user-list');
        // 用户列表父节点
        var oUserListParent = oUserListNode.parent();
        // 确认按钮
        var oUserSubmitBtn = oSearchListModel.find('#select-user-submit');
        // 子项html
        var sUserItemHtml = '<li class="user-item">\n' +
            '                        <input class="user-checkbox" id="%id%" type="checkbox">\n' +
            '                        <label class="select-al-icon" for="%id%"></label>\n' +
            '                        <span class="user-phone">%phone%</span>\n' +
            '                        <span class="user-name">%name%</span>\n' +
            '                    </li>';
        // 当前搜索字段
        var sSearchStr = null;
        // 旧搜索字段
        var sOldSearchStr = null;
        // 用户数据源
        var aUserInfos = null;
        // 选中的用户数据
        var aUserSelect = null;
        // 选中的最大人数
        var nMaxNumOfSelect = 1;
        // 当前搜索页码
        var nSearchPageNumber = 1;
        // 每页个数
        var nSearchPageSize = 10;
        // 总数
        var nTotal = 0;
        // 是否全部请求
        var bIsRequestAll = false;
        // 是否清空列表
        var bIsCleanList = true;
        // 请求用户数据执行函数
        var handlerOfGetUserInfo = createSearchUserInfoHandler();


        /* 执行函数 */
        getUserType();
        tableMouseEvent();
        addBtnEvent();
        searchModelCloseEvent();
        searchEvent();
        searchUserListEvent();
        searchBtnEvent();
        scrollEvent();

        /*=== 对外接口 ===*/
        _this.init = function (name) {
            var stSave = oNameRuleOfAssignUser.test(name);
            // 存储模块名称
            sNowFuncModelName = name;
            // 判定当前用户是否有使用权限
            bIsAllFunc = (name === 'assignCompanyUser' && sUserType === 'company');
            // 是否是外站分配用户
            bIsOtherWebAssignUser = (stSave && sUserType === 'company');
            initTitle();
            initTable();
            initPage();
            initAddBtn();
            initUserListModel();
            handleOfGetTableData();
        };

        /*=== 工具函数 ===*/
        /**
         * 展示搜索模块
         * @param isShow：是否显示
         * @param callback：动画后执行的回调函数
         */
        function setSearchModelShow(isShow, callback) {
            var finalLeft = (isShow) ? '0' : '-100%';
            oSearchListModel.animate({
                left: finalLeft
            }, function () {
                initUserListModel();
                if (callback) {
                    callback();
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
         * 作用: 为input添加事件
         * @param inputNode:传入输入框节点
         * @param config:传入测试检验函数和回调函数的配置参数
         */
        function eventOfInput(inputNode, config) {
            var eventType = (config && config.eventType) ? config.eventType : 'change';
            var testCallback = (config && config.testCallback) ? config.testCallback : undefined;
            var callback = (config && config.callback) ? config.callback : undefined;
            var stSave = null;
            inputNode.on(eventType, function () {
                stSave = inputTest(inputNode, {
                    callback: testCallback
                });
                if (callback) {
                    callback(stSave);
                }
            })
        }

        /**
         * 查找表格对应的数据项
         * @param id
         * @returns {*}
         */
        function searchTableDataItem(id) {
            var result = null;
            var stSave = null;
            for (var index in oTableData) {
                if (oTableData.hasOwnProperty(index)) {
                    stSave = oTableData[index];
                    if (stSave.id.id === id) {
                        result = stSave;
                        break;
                    }
                }
            }
            return result;
        }

        /**
         * 创建用户查询的工厂函数
         * @returns {Function}
         */
        function createSearchUserInfoHandler() {
            var isSearch = false;
            var layerLoad = null;
            var layerMsg = null;
            var config = null;
            return function () {
                // 没有使用权限 或 已经请求了全部数据
                if (!bIsAllFunc || bIsRequestAll) {
                    return false;
                }
                if (isSearch) {
                    if (layerMsg) {
                        __layer.close(layerMsg);
                    }
                    layerMsg = __layer.msg('用户搜索中');
                    return false;
                }
                if (!sSearchStr || sSearchStr.length < 1) {
                    if (layerMsg) {
                        __layer.close(layerMsg);
                    }
                    layerMsg = __layer.msg('无搜索内容');
                    return false;
                }
                isSearch = true;
                layerLoad = __layer.load(2, {shade: [0.5, '#ffffff']});
                config = {
                    phone: sSearchStr,
                    pager: {
                        current: nSearchPageNumber,
                        size: nSearchPageSize
                    }
                };
                _ajax.post('default', {
                    url: '/frontUser/query',
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    data: JSON.stringify(config),
                    success: function (res) {
                        var data = null;
                        var list = null;
                        isSearch = false;
                        __layer.close(layerLoad);
                        if (sSearchStr !== sOldSearchStr) {
                            sOldSearchStr = sSearchStr;
                        }
                        if (res.status === 200) {
                            __layer.msg('查询用户成功');
                            data = res.data;
                            nTotal = data.total;
                            list = data.data_list;
                            if (list.length > 0 && ((data.data_list.length < nSearchPageSize) || ((nSearchPageNumber - 1) * nSearchPageSize + data.data_list.length === nTotal))) {
                                bIsRequestAll = true;
                            } else {
                                bIsRequestAll = false;
                            }
                            // 清空当前列表
                            if (bIsCleanList) {
                                oUserListNode.html('');
                            } else {
                                bIsCleanList = true;
                            }
                            extractUserInfo(list);
                            importDataOfSearchUserList(aUserInfos);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                        isSearch = false;
                        if (sSearchStr !== sOldSearchStr) {
                            sOldSearchStr = sSearchStr;
                        }
                        __layer.close(layerLoad);
                    }
                })
            }
        }

        /*=== 主体函数 ===*/

        // 获取用户类型
        function getUserType() {
            sUserType = personalMainObj.getUserType();
        }

        /* 初始化标题 */
        function initTitle() {
            oTitleNode.text(oTitle[sNowFuncModelName]);
        }

        /* 初始化表格 */
        function initTable() {
            oTableData = [];
            // 表格插件是否存在
            if (oTable) {
                // 需要重复调用
                oTable.setBaseStyle(oTableStyleConfig[sNowFuncModelName])
                    .setColOrder(oTableOrderConfig[sNowFuncModelName])
                    .setStartIndex((nNowPageNumber - 1) * nPageSize + 1)
                    .setTableData(oTableData);
            } else {
                oTable = new Table('assign-user-table');
                setTableBaseConfig();
            }
        }

        // 配置表格，ps:不需要重复调用
        function setTableBaseConfig() {
            oTable.setBaseStyle(oTableStyleConfig[sNowFuncModelName])
                .setColOrder(oTableOrderConfig[sNowFuncModelName])
                .setStartIndex((nNowPageNumber - 1) * nPageSize + 1).setOpenCheckBox(false, 2)
                .setTableLineHeight(40)
                .resetHtmlCallBack(function (type, content, label) {
                    // 获取用户状态
                    var sUserStatus = null;
                    if (label === 'td') {
                        if (type === 'name') {
                            return '<a class="user-name-link" href="javaScript:void(0);">' + content + '</a>';
                        } else if (type === 'id') {
                            sUserStatus = content.status;
                            // 收公司成员
                            if (bIsAllFunc) {
                                if (sUserStatus === 'pass') {
                                    return '<span class="active-span" type="delete" data-id="' + content.id + '">删除</span>';
                                } else if (sUserStatus === 'reject') {
                                    return '<span class="active-span" type="invite" data-id="' + content.id + '">重新邀请</span>' +
                                        '<span class="active-span" type="delete" data-id="' + content.id + '">删除</span>';
                                } else if (sUserStatus === 'excluded') {
                                    return '<span class="active-span" type="invite" data-id="' + content.id + '">重新邀请</span>' +
                                        '<span class="active-span" type="delete" data-id="' + content.id + '">删除</span>';
                                } else if (sUserStatus === 'quit') {
                                    return '<span class="active-span" type="invite" data-id="' + content.id + '">重新邀请</span>' +
                                        '<span class="active-span" type="delete" data-id="' + content.id + '">删除</span>';
                                } else {
                                    return '';
                                }
                            } else if (bIsOtherWebAssignUser) { // 分配平台
                                // 已经分配了平台
                                if (content.accountId) {
                                    return '<span class="active-span" type="cancel" data-id="' + content.id + '">取消</span>';
                                } else {// 未分配平台
                                    return '<span class="active-span" type="assign" data-id="' + content.id + '">分配</span>';
                                }
                            } else if (sNowFuncModelName === 'viewUserOfAffiliatedCompany') {// 查看用户所属企业（包括被分配的平台）
                                if (sUserStatus === 'confirm') {
                                    return '<span class="active-span" type="agree" data-id="' + content.id + '">同意</span>' +
                                        '<span class="active-span" type="reject" data-id="' + content.id + '">拒绝</span>';
                                } else if (sUserStatus === 'pass') {
                                    return '<span class="active-span" type="quit" data-id="' + content.id + '">退出</span>';
                                } else if (sUserStatus === 'reject') {
                                    return '<span class="active-span" type="delete" data-id="' + content.id + '">删除</span>';
                                } else if (sUserStatus === 'excluded') {
                                    return '<span class="active-span" type="delete" data-id="' + content.id + '">删除</span>';
                                } else if (sUserStatus === 'quit') {
                                    return '<span class="active-span" type="delete" data-id="' + content.id + '">删除</span>';
                                }
                            } else {
                                return content;
                            }
                        } else if (type === 'account') {
                            // 查看用户平台权限
                            if (sNowFuncModelName === 'viewUserOfSystemAuthority') {
                                if (!!content.account) {
                                    if (oPlatformId[content.platformId] === 'intelligent' && content.account === 'review') {
                                        if (content.account === 'review') {
                                            return '<span class="active-span" type="link" data-platform="intelligent" data-link="/personal.html#applyIntelligent">审核中</span>';
                                        } else if (content.account === 'reject') {
                                            return '<span class="active-span" type="link" style="color:#FF0000" data-platform="intelligent" data-link="/personal.html#applyIntelligent">未通过</span>';
                                        }
                                    } else {
                                        return content.account;
                                    }
                                } else {
                                    if (oPlatformId[content.platformId] === 'intelligent') {
                                        return '<span class="active-span" type="link" data-platform="intelligent" data-link="/personal.html#applyIntelligent">前往申请账号</span>';
                                    } else {
                                        return '暂无数据';
                                    }
                                }
                            }
                        }
                    } else {
                        return content;
                    }
                }).setClickCallback(function (node) {
                activeSpanEvent(node);
            });
        }

        // 表格鼠标事件
        function tableMouseEvent() {
            var layerTip = null;
            var oNowNode = null;
            var oNowDom = null;
            oTableParent.on('mouseenter', 'td', function () {
                oNowNode = $(this);
                oNowDom = oNowNode.get(0);
                if (oNowDom.scrollWidth > oNowDom.offsetWidth) {
                    layerTip = __layer.tips(oNowNode.text(), oNowNode, {
                        tips: 1
                    })
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
            // 获取当前链接
            var sLink = null;
            if (node.get(0).tagName.toLowerCase() === 'span' && node.hasClass('active-span')) {
                sNowSpanType = node.attr('type');
                sNowId = node.attr('data-id');
                switch (sNowSpanType) {
                    case 'delete':
                        handleOfInvitationDealWith(sNowId, sNowSpanType);
                        break;
                    case 'invite':
                        handleOfInviteUser(sNowId);
                        break;
                    case 'assign':
                        handleOfAssignUser(sNowId);
                        break;
                    case 'cancel':
                        handleOfCancelUser(sNowId);
                        break;
                    case 'agree':
                        handleOfInvitationDealWith(sNowId, sNowSpanType);
                        break;
                    case 'reject':
                        handleOfInvitationDealWith(sNowId, sNowSpanType);
                        break;
                    case 'quit':
                        handleOfInvitationDealWith(sNowId, sNowSpanType);
                        break;
                    case 'link':
                        handleOfLink(node);
                        break;
                    default:
                        break;
                }
            }
        }

        // 邀请执行函数
        function handleOfInviteUser(sId) {
            // 当前人员数据
            var oUserInfo = searchTableDataItem(sId);
            var layerLoad = null;
            if (oUserInfo.id.status !== 'reject' && oUserInfo.id.status !== 'excluded' && oUserInfo.id.status !== 'quit') {
                return false;
            }
            __layer.confirm('是否重新邀请当前成员？', {
                title: '提示'
            }, function (index) {
                __layer.close(index);
                // 提交数据
                var config = {
                    frontUserId: oUserInfo.id.id,
                    id: oUserInfo.id.invitationId
                };
                layerLoad = __layer.load(2, {shade: [0.5, '#ffffff']});
                _ajax.post('default', {
                    url: '/invitationMessage/invitation',
                    contentType: 'application/json',
                    data: JSON.stringify(config),
                    success: function (res) {
                        __layer.close(layerLoad);
                        var data = null;
                        if (res.status === 200) {
                            data = res.data;
                            // 重新获取数据并重写表格
                            handleOfGetTableData();
                        }
                    },
                    error: function (err) {
                        var data = err.responseJSON;
                        // 关闭加载
                        __layer.close(layerLoad);
                        __layer.msg(data.message);
                        console.error('handleOfDeleteUser:', err, data);
                    }
                });
            }, function (index) {
                __layer.close(index);
            });
        }

        // 分配执行函数
        function handleOfAssignUser(sId) {
            // 当前人员数据
            var oUserInfo = searchTableDataItem(sId);
            var layerLoad = null;
            if (oUserInfo.id.accountId) {
                return false;
            }
            __layer.confirm('是否给当前用户分配"' + oPlatformTips[sNowFuncModelName] + '"平台权限？', {
                title: '提示'
            }, function (index) {
                __layer.close(index);
                var config = [sId];
                layerLoad = __layer.load(2, {shade: [0.5, '#ffffff']});
                _ajax.post('default', {
                    url: '/thirdPlatform/registerThirdUser/' + oPlatformTypes[sNowFuncModelName],
                    contentType: 'application/json',
                    data: JSON.stringify(config),
                    success: function (res) {
                        __layer.close(layerLoad);
                        if (res.status === 200) {
                            // 重新获取数据并重写表格
                            handleOfGetTableData();
                        }
                    },
                    error: function (err) {
                        var data = err.responseJSON;
                        console.log(data);
                        // 关闭加载
                        __layer.close(layerLoad);
                        __layer.msg(data.message);
                        console.error('handleOfAssignUser:', err, data);
                    }
                });
            }, function (index) {
                __layer.close(index);
            });
        }

        // 取消执行函数
        function handleOfCancelUser(sId) {
            // 当前人员数据
            var oUserInfo = searchTableDataItem(sId);
            var layerLoad = null;
            // 没有分配过权限时不执行
            if (!oUserInfo.id.accountId) {
                return false;
            }
            __layer.confirm('是否取消当前用户的"' + oPlatformTips[sNowFuncModelName] + '"平台权限？', {
                title: '提示'
            }, function (index) {
                __layer.close(index);
                // 知网使用账号id,其他使用用户id
                var config = (sNowFuncModelName === 'assignTechnologyUser') ? [oUserInfo.id.accountId] : [sId];
                layerLoad = __layer.load(2, {shade: [0.5, '#ffffff']});
                _ajax.post('default', {
                    url: '/thirdPlatform/cutThirdUser/' + oPlatformTypes[sNowFuncModelName],
                    contentType: 'application/json',
                    data: JSON.stringify(config),
                    success: function (res) {
                        __layer.close(layerLoad);
                        if (res.status === 200) {
                            // 重新获取数据并重写表格
                            handleOfGetTableData();
                        }
                    },
                    error: function (err) {
                        var data = err.responseJSON;
                        console.log(data);
                        // 关闭加载
                        __layer.close(layerLoad);
                        __layer.msg(data.message);
                        console.error('handleOfCancelUser:', err, data);
                    }
                });
            }, function (index) {
                __layer.close(index);
            });
        }

        // 用户对于企业邀请的处理函数
        function handleOfInvitationDealWith(sId, type) {
            // 当前人员数据
            var oUserInfo = searchTableDataItem(sId);
            var layerLoad = null;
            // 动作说明
            var sAction = null;
            // 动作类型
            var sActionType = null;
            // 提交的id
            var sSubmitId = null;
            if (!oUserInfo) {
                return false;
            }
            // 状态比对：
            // 1.同意和拒绝操作 需在'等待确认'的状态下执行
            // 2.退出 需在'已同意'的状态下执行
            // 3.删除 需在'拒绝'、'被剔除'或是'同意'（ps:当前用户是企业）的状态下执行
            if (((type === 'agree' || type === 'reject') && oUserInfo.id.status !== 'confirm')
                || (type === 'quit' && oUserInfo.id.status !== 'pass')
                || (type === 'delete' && (oUserInfo.id.status !== 'reject' && oUserInfo.id.status !== 'excluded' && oUserInfo.id.status !== 'quit'
                    && (sUserType === 'company' && oUserInfo.id.status !== 'pass')))) {
                return false;
            }
            if (type === 'agree') {
                sAction = '是否同意加入该企业？';
                sActionType = 0;
            } else if (type === 'reject') {
                sAction = '是否拒绝加入该企业？';
                sActionType = 1;
            } else if (type === 'quit') {
                sAction = '是否退出该企业？';
                sActionType = 2;
            } else if (type === 'delete') {
                if (oUserInfo.id.status === 'pass') {
                    sAction = '是否删除该用户？';
                    sActionType = 4;
                } else {
                    sAction = '是否删除该记录？';
                    sActionType = 3;
                }
            }
            __layer.confirm(sAction, {
                title: '提示'
            }, function (index) {
                __layer.close(index);
                // 根据当前用户类型变化提交id
                sSubmitId = (sUserType === 'user') ? sId : oUserInfo.id.invitationId;
                layerLoad = __layer.load(2, {shade: [0.5, '#ffffff']});
                _ajax.post('default', {
                    url: '/invitationMessage/agreeOrNot/' + sActionType + '/' + sSubmitId,
                    contentType: 'application/json',
                    data: '{}',
                    success: function (res) {
                        __layer.close(layerLoad);
                        if (res.status === 200) {
                            // 重新获取数据并重写表格
                            handleOfGetTableData();
                        }
                    },
                    error: function (err) {
                        var data = err.responseJSON;
                        // 关闭加载
                        __layer.close(layerLoad);
                        __layer.msg(data.message);
                        console.error('handleOfInvitationDealWith:', err);
                    }
                });
            }, function (index) {
                __layer.close(index);
            });
        }

        // 链接处理函数
        function handleOfLink(node) {
            // 获取平台
            var sPlatform = node.data('platform');
            // 获取连接
            var slink = node.data('link');
            // 若为知网平台
            if (sPlatform === 'intelligent') {
                personalMainObj.enableApplyModel('applyIntelligent');
            }
            window.location.href = slink;
        }

        /* 初始化分页 */
        function initPage() {
            // 表格插件是否存在
            if (oPage) {
                oPage.showPage(false);
            } else {
                oPage = new PluginPagination('assign-user-page');
                setPageBaseConfig();
            }
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
                                handleOfGetTableData();
                            }
                        } else {// 我是上下页
                            if (node.data('mark') === 'prev') {
                                newNumber = oldPageNumber - 1;
                                if (newNumber > 0) {
                                    nNowPageNumber = newNumber;
                                    // 重新获取数据并重写表格
                                    handleOfGetTableData();
                                }
                            } else if (node.data('mark') === 'next') {
                                newNumber = oldPageNumber + 1;
                                if (newNumber < nMaxPageNumber + 1) {
                                    nNowPageNumber = newNumber;
                                    // 重新获取数据并重写表格
                                    handleOfGetTableData();
                                }
                            }
                        }
                    } else if (labelType === 'button') {
                        // 按钮
                        if (canLift) {
                            // 重新获取数据并重写表格
                            handleOfGetTableData();
                        }
                    }
                });
        }

        /* 初始化新增按钮 */
        function initAddBtn() {
            if (bIsAllFunc) {
                oAddBtnParent.show();
                oSearchListModel.show();
            } else {
                oAddBtnParent.hide();
                oSearchListModel.hide();
            }
        }

        // 按钮事件
        function addBtnEvent() {
            oAddBtn.on('click', function () {
                setSearchModelShow(true);
                return false;
            });
        }

        /* 初始化用户列表模块 */
        function initUserListModel() {
            initSearchInput();
            initUserList();
        }

        // 初始化input
        function initSearchInput() {
            oSearchInput.val('');
        }

        // 初始化列表
        function initUserList() {
            oUserListNode.html('');
            if (oUserListParent.hasClass('full')) {
                oUserListParent.removeClass('full');
            }
            if (oUserListParent.hasClass('no-full')) {
                oUserListParent.removeClass('no-full');
            }
            // 初始化判定变量
            bIsRequestAll = false;
            bIsCleanList = true;
            aUserInfos = [];
            aUserSelect = [];
        }

        // 关闭事件
        function searchModelCloseEvent() {
            oCloseBtnNode.on('click', function () {
                setSearchModelShow(false, function () {
                    initUserListModel();
                });
            })
        }

        // 搜索事件
        function searchEvent() {
            eventOfSearchChange();
            eventOfSearchInput();
            eventOfSearchBtnClick();
        }

        // 手机输入框change事件
        function eventOfSearchChange() {
            eventOfInput(oSearchInput, {
                callback: function (res) {
                    if (res) {
                        sSearchStr = oSearchInput.val().replace(/\s+/g, '');
                    }
                }
            });
        }

        // 手机输入框input事件
        function eventOfSearchInput() {
            var keyCode = null;
            oSearchInput.on('keypress', function (event) {
                keyCode = event.keyCode;
                if (keyCode === 13) {
                    oSearchInput.change();
                    oSearchBtn.click();
                }
            });
        }

        // 按钮点击事件
        function eventOfSearchBtnClick() {
            oSearchBtn.on('click', function () {
                // 返回1
                nSearchPageNumber = 1;
                // 当搜索的字段变化才还原变量
                if (sSearchStr !== sOldSearchStr) {
                    bIsRequestAll = false;
                }
                handlerOfGetUserInfo();
            });
        }

        // 提取数据
        function extractUserInfo(data) {
            var stSave = null;
            var obj = null;
            aUserInfos = [];
            $.each(data, function (index, item) {
                if (oTableData && oTableData.length > 0) {
                    stSave = oTableData.searchArrayObj(item.phone, 'phone');
                    if (stSave > -1) {
                        return true;
                    }
                }
                obj = {
                    id: item.id,
                    name: item.userName,
                    phone: item.phone
                };
                aUserInfos.push(obj);
            });
        }

        // 写入数据
        function importDataOfSearchUserList(data) {
            var result = '';
            oUserListNode.removeClass('full');
            // 有数据时写入
            if (data.length > 0) {
                // 已经请求了全部数据
                if (bIsRequestAll) {
                    oUserListParent.addClass('full').removeClass('no-full');
                } else {
                    oUserListParent.addClass('no-full').removeClass('full');
                }
                data.forEach(function (item) {
                    result += sprintf(sUserItemHtml, item);
                });
                oUserListNode.append($(result));
            } else {// 无数据清空列表
                oUserListNode.html(result);
                oUserListParent.removeClass('full').removeClass('no-full');
            }
        }

        // 列表事件
        function searchUserListEvent() {
            eventOfLabelClick();
            eventOfListItemClick();
            eventOfUserNameHover();
        }

        // 列表label点击事件
        function eventOfLabelClick() {
            // 阻止默认行为
            oUserListNode.on('click', 'label', function (event) {
                event.preventDefault();
            });
        }

        // 列表子项点击事件
        function eventOfListItemClick() {
            // 当前节点
            var oNowNode = null;
            // 当前复选框
            var oNowCheckBox = null;
            // 当前id
            var sNowId = null;
            var stSave = null;
            oUserListNode.on('click', 'li.user-item', function () {
                // 没有使用权限
                if (!bIsAllFunc) {
                    return 0;
                }
                oNowNode = $(this);
                oNowCheckBox = oNowNode.find('input[type="checkbox"]').eq(0);
                sNowId = oNowCheckBox.get(0).id;
                // 已经选中
                if (oNowCheckBox.is(':checked')) {
                    oNowCheckBox.prop({
                        checked: false
                    });
                    if (oUserListNode.hasClass('full')) {
                        oUserListNode.removeClass('full');
                    }
                    stSave = aUserSelect.searchArrayObj(sNowId);
                    aUserSelect.splice(stSave, 1);
                } else { // 未选中
                    if (!(aUserSelect.length < nMaxNumOfSelect)) {
                        __layer.closeAll();
                        __layer.msg('选中人数不可超过 ' + nMaxNumOfSelect + ' 人');
                        return 0;
                    } else {
                        oNowCheckBox.prop({
                            checked: true
                        });
                        aUserSelect.push(sNowId);
                        if (!(aUserSelect.length < nMaxNumOfSelect)) {
                            oUserListNode.addClass('full');
                        }
                    }
                }
            })
        }

        // 列表hover事件
        function eventOfUserNameHover() {
            // 当前节点
            var oNowNode = null;
            // 当前dom节点
            var oNowDom = null;
            // tip
            var layerTip = null;
            oUserListNode.on('mouseenter', 'span.user-name', function () {
                oNowNode = $(this);
                oNowDom = oNowNode.get(0);
                if (oNowDom.scrollWidth > oNowDom.clientWidth) {
                    if (layerTip) {
                        __layer.close(layerTip);
                        layerTip = null;
                    }
                    layerTip = __layer.tips(oNowNode.text(), oNowNode, {
                        tips: 1
                    })
                }
            }).on('mouseleave', 'span.user-name', function () {
                if (layerTip) {
                    __layer.close(layerTip);
                }
            })
        }

        // 确定按钮事件
        function searchBtnEvent() {
            var isSubmit = false;
            var config = null;
            var layerLoad = null;
            oUserSubmitBtn.on('click', function () {
                // 没有使用权限
                if (!bIsAllFunc) {
                    return 0;
                }
                if (isSubmit) {
                    return 0;
                }
                // 无选中人员
                if (aUserSelect.length < 1) {
                    __layer.closeAll();
                    __layer.msg('无选中人员');
                    return 0;
                }
                isSubmit = true;
                config = {
                    frontUserId: aUserSelect[0]
                };
                layerLoad = __layer.load(2, {shade: [0.5, '#ffffff']});
                // 进行成员邀请
                _ajax.post('default', {
                    url: '/invitationMessage/invitation',
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    data: JSON.stringify(config),
                    success: function (res) {
                        isSubmit = false;
                        __layer.close(layerLoad);
                        if (res.status === 200) {
                            __layer.msg('发出邀请成功');
                            // 关闭查询模块
                            setSearchModelShow(false, function () {
                                handleOfGetTableData();
                            });
                        }
                    },
                    error: function (err) {
                        isSubmit = false;
                        var data = err.responseJSON;
                        console.log(data);
                        __layer.close(layerLoad);
                        __layer.msg(data.message);
                    }
                })
            })
        }

        // 滚动事件
        function scrollEvent() {
            var timer = null;
            var nTop = null;
            var nListHeight = null;
            var nListParentHeight = oUserListParent.height();
            oUserListParent.on('scroll', function () {
                if (!(!!timer)) {
                    timer = setTimeout(function () {
                        nTop = oUserListParent.scrollTop();
                        nListHeight = oUserListNode.height();
                        if (nListHeight - nTop - nListParentHeight < 50 && !bIsRequestAll) {
                            // 不清空列表
                            bIsCleanList = false;
                            // +1,请求下一页
                            nSearchPageNumber += 1;
                            handlerOfGetUserInfo();
                        }
                        clearTimeout(timer);
                        timer = null;
                    }, 1000);
                }
            });

        }

        /* 获取数据 */
        // 获取表格数据工厂函数
        function createHandleOfGetTableData() {
            var isRequest = false;
            var layerMsg = null;
            var layerLoad = null;
            var config = null;
            return function (callback) {
                if (isRequest) {
                    if (layerMsg) {
                        __layer.close(layerMsg);
                    }
                    layerMsg = __layer.msg('请求数据中......');
                    return 0;
                }
                isRequest = true;
                layerLoad = __layer.load(2, {shade: [0.5, '#ffffff']});
                config = {
                    pager: {
                        current: nNowPageNumber,
                        size: nPageSize
                    }
                };
                _ajax.post('default', {
                    url: oSearchUrl[sNowFuncModelName],
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    data: JSON.stringify(config),
                    success: function (res) {
                        var data = null;
                        isRequest = false;
                        __layer.close(layerLoad);
                        if (res.status === 200) {
                            data = res.data;
                            __layer.msg('查询成功');
                            // 没用子成员且外站用户分配时
                            if (data.total === 0) {
                                oUserVoidTipNode.show();
                                if (!bIsAllFunc && bIsOtherWebAssignUser) {
                                    oUserVoidTipNode.attr({
                                        type: 'assign'
                                    });
                                } else {
                                    oUserVoidTipNode.attr({
                                        type: 'normal'
                                    });
                                }
                            } else {
                                oUserVoidTipNode.hide();
                            }
                            // 计算最大页码
                            nMaxPageNumber = Math.ceil(data.total / nPageSize);
                            if (nMaxPageNumber > 1) {
                                oPage.setMaxPageNumber(nMaxPageNumber)
                                    .setNowPageNumber((nNowPageNumber > nMaxPageNumber) ? nMaxPageNumber : nNowPageNumber)
                                    .showPage(true);
                            } else {
                                oPage.showPage(false);
                            }
                            console.log(data.data_list);
                            extractTableData(data.data_list);
                            // 部分模块需要额外处理
                            dealWidthModel(function () {
                                // 写入表格
                                oTable.setTableData(oTableData);
                                if (callback) {
                                    callback(data);
                                }
                            });
                        }
                    },
                    error: function (err) {
                        console.log(err);
                        isRequest = false;
                        __layer.close(layerLoad);
                    }
                })
            }
        }
        
        // 判定模块功能执行特定代码
        function dealWidthModel(callback) {
            // 要操作的数据项
            var oDataItem = null;
            // 当功能为查询平台账号时
            if (sNowFuncModelName === 'viewUserOfSystemAuthority') {
                $.each(oTableData, function (index, item) {
                    if (item.account.platformId === 'a9253ac7-1d1c-40b1-b30f-277a4e1b2ae1') {
                        oDataItem = item;
                        return false;
                    }
                });
                if (!(!!oDataItem.account.account)) {
                    // 获取知网账号的申请情况
                    personalMainObj.getApplyIntelligentInfo(function (data) {
                        var type = data.type;
                        var info = data.info;
                        var stSave = null;
                        var oShowData = null;
                        if (type === 'success') {
                            if (info.status === 200) {
                                stSave = info.data;
                                if (!!stSave) {
                                    $.each(oTableData, function (index, item) {
                                        // 知网
                                        if (item.account.platformId === 'a9253ac7-1d1c-40b1-b30f-277a4e1b2ae1') {
                                            if (stSave.status === '019a934e-488f-11e9-880c-20040fed244c') {
                                                item.account.account = 'review';
                                            } else if (stSave.status === '0ba408c8-488f-11e9-880c-20040fed244c') {
                                                item.account.account = 'reject';
                                            }
                                            return false;
                                        }
                                    })
                                }
                            }
                        } else {
                            console.log(info);
                        }
                        if (callback) {
                            callback();
                        }
                    });
                } else {
                    if (callback) {
                        callback();
                    }
                }
            } else {
                if (callback) {
                    callback();
                }
            }
        }

        // 提取数据
        function extractTableData(data) {
            var config = null;
            oTableData = [];
            switch (sNowFuncModelName) {
                case 'assignCompanyUser':
                    config = {
                        name: 'userName',
                        phone: 'phone',
                        statusCN: 'status',
                        id: {
                            // 用户id
                            id: 'frontUserId',
                            // 邀请id
                            invitationId: 'invitationMessageId',
                            status: 'status'
                        }
                    };
                    break;
                case 'assignIntelligentUser':
                    config = {
                        name: 'userName',
                        phone: 'userPhone',
                        statusPF: 'iCustomsId',
                        id: {
                            // 用户id
                            id: 'frontUserId',
                            // 判定是否分配了平台权限。ps:平台对应的id属性名称不一致
                            accountId: 'iCustomsId'
                        }
                    };
                    break;
                case 'assignTechnologyUser':
                    config = {
                        name: 'userName',
                        phone: 'userPhone',
                        statusPF: 'cnkiId',
                        id: {
                            // 用户id
                            id: 'frontUserId',
                            // 判定是否分配了平台权限。ps:平台对应的id属性名称不一致
                            accountId: 'cnkiId'
                        }
                    };
                    break;
                case 'assignIncubatorUser':
                    config = {
                        name: 'userName',
                        phone: 'userPhone',
                        statusPF: 'hatcheryId',
                        id: {
                            // 用户id
                            id: 'frontUserId',
                            // 判定是否分配了平台权限。ps:平台对应的id属性名称不一致
                            accountId: 'hatcheryId'
                        }
                    };
                    break;
                case 'assignContractUser':
                    config = {
                        name: 'userName',
                        phone: 'userPhone',
                        statusPF: 'ggdzhzbId',
                        id: {
                            // 用户id
                            id: 'frontUserId',
                            // 判定是否分配了平台权限。ps:平台对应的id属性名称不一致
                            accountId: 'ggdzhzbId'
                        }
                    };
                    break;
                case 'viewUserOfSystemAuthority':
                    config = {
                        name: 'name',
                        account: {
                            platformId: 'platformId',
                            account: 'account'
                        }
                    };
                    break;
                case 'viewUserOfAffiliatedCompany':
                    config = {
                        name: 'enterpriseName',
                        concatPeople: 'contact',
                        concatPhone: 'contactPhone',
                        statusCN: 'status',
                        id: {
                            // 邀请id
                            id: 'invitationMessageId',
                            status: 'status'
                        }
                    };
                    break;
                default:
                    break;
            }
            data.forEach(function (item) {
                oTableData.push(extractTableDataOfConfig(item, config));
            });
        }

        // 根据配置提取数据
        function extractTableDataOfConfig(data, config) {
            var obj = {};
            var stSave = null;
            Object.keys(config).forEach(function (key) {
                if (config.hasOwnProperty(key)) {
                    stSave = config[key];
                    if (getVariableType(stSave) === 'object') {
                        obj[key] = extractTableDataOfConfig(data, stSave);
                    } else {
                        if (key === 'status') {
                            obj[key] = oStatusOfEN[data[stSave]];
                        } else if (key === 'statusCN') {
                            if (data[stSave] === '7279b3fa-fe14-43f9-adcd-0d83b9bd79bb') {
                                obj[key] = oStatusOfCN[data[stSave]][sUserType];
                            } else {
                                obj[key] = oStatusOfCN[data[stSave]];
                            }
                        } else if (key === 'statusPF') {
                            obj[key] = (data[stSave]) ? '已分配' : '未分配'
                        } else {
                            obj[key] = data[stSave];
                        }
                    }
                }
            });
            return obj;
        }
    }
    // 函数继承
    PersonalAssignUser.prototype = new FuncOfModelCommon();
    // 引用释放
    FuncOfModelCommon = null;
    // 调用主模块的模块注册方法
    personalMainObj.setMethodObj([
        'assignCompanyUser',
        'assignIntelligentUser',
        'assignTechnologyUser',
        'assignIncubatorUser',
        'assignContractUser',
        'viewUserOfSystemAuthority',
        'viewUserOfAffiliatedCompany'
    ], new PersonalAssignUser());
});
