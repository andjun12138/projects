$(function () {
    function PersonalMain() {
        var _this = this;
        // 初始化ajax
        var _ajax = new NewAjax();
        // 个人中心模块
        var oMainModel = $('#personal-center');
        // body 模块
        var oBodyModel = document.body;
        // 空格正则
        var oWarpRule = />\s+<?|>?\s+</g;
        // 当前模块
        var sOldModelName = null;

        /* 用户类型 */
        // ps: company 企业； user 用户
        var sUserType = null;

        /* 用户手机 */
        var sUserPhone = null;

        /* 面包屑导航 */
        var oBreadcrumbsNode = oMainModel.find('.breadcrumbs-list').eq(0);
        // 子项html
        var sBreadcrumbsItemHtml = '<li class="breadcrumbs-item">\n' +
            '                    <a class="breadcrumbs-link" href=""></a>\n' +
            '                </li>';
        // link正则
        var oBreadcrumbsLinkRule = /<a class="breadcrumbs-link((?!<\/a>).)+<\/a>/;
        // 路径节点
        var aPathData = [
            {
                home: {
                    title: '首页',
                    parent: null,
                    link: '/home.html'
                }
            },
            {
                personalHome: {
                    title: '个人中心',
                    parent: 'home',
                    link: '#personalHome'
                }
            },
            {
                resetPassword: {
                    title: '修改密码',
                    parent: 'personalHome',
                    link: '#resetPassword'
                },
                resetCompanyInfo: {
                    title: '修改企业信息',
                    parent: 'personalHome',
                    link: '#resetCompanyInfo'
                },
                assignCompanyUser: {
                    title: '企业子成员',
                    parent: 'personalHome',
                    link: '#assignCompanyUser'
                },
                assignIntelligentUser: {
                    title: '分配子用户',
                    parent: 'personalHome',
                    link: '#assignIntelligentUser'
                },
                assignTechnologyUser: {
                    title: '分配子用户',
                    parent: 'personalHome',
                    link: '#assignTechnologyUser'
                },
                bindPhone: {
                    title: '绑定手机',
                    parent: 'personalHome',
                    link: '#bindPhone'
                },
                releaseEmployment:{
                    title: '发布招聘',
                    parent: 'personalHome',
                    link: '#releaseEmployment'
                },
                employment:{
                    title: '我的招聘',
                    parent: 'personalHome',
                    link: '#employment'
                },
                stationNews:{
                    title: '站内消息',
                    parent: 'personalHome',
                    link: '#stationNews'
                },
                myDevice:{
                    title: '我发布的设备',
                    parent: 'personalHome',
                    link: '#myDevice'
                },
                deviceList:{
                    title: '预约设备列表',
                    parent: 'personalHome',
                    link: '#deviceList'
                }
            }
        ];

        /* 左侧菜单 */
        // 是否已经初始化
        var bIsMenuInit = false;
        // 获取菜单列表
        var oMenuNode = oMainModel.find('.menu-model-list').eq(0);
        // 菜单栏数据
        var oMenuData = {
            base: [
                {
                    type: 1,
                    title: '平台管理',
                    func: [
                        {
                            title: '首页',
                            link: '#personalHome'
                        },
                        {
                            title: '密码修改',
                            link: '#resetPassword'
                        },
                        {
                            title: '绑定手机',
                            link: '#bindPhone'
                        },
                        {
                            title: '企业信息修改',
                            link: '#resetCompanyInfo'
                        },
                        {
                            title: '站内消息',
                            link: '#stationNews'
                        },
                        {
                            title: '我发布的设备列表',
                            link: '#myDevice'
                        },
                        {
                            title: '我预约的设备列表',
                            link: '#deviceList'
                        }
                    ]
                }
            ],
            user: [
                {
                    type: 1,
                    title: '平台管理',
                    func: [
                        {
                            title: '系统权限',
                            link: '#viewUserOfSystemAuthority'
                        },
                        {
                            title: '所属企业',
                            link: '#viewUserOfAffiliatedCompany'
                        }
                    ]
                }
            ],
            company: [
                {
                    type: 1,
                    title: '平台管理',
                    func: [
                        {
                            title: '企业子成员',
                            link: '#assignCompanyUser'
                        }
                    ]
                },
                {
                    type: 2,
                    title: '智能通关',
                    func: [
                        {
                            title: '分配子用户',
                            link: '#assignIntelligentUser'
                        }
                    ]
                },
                {
                    type: 3,
                    title: '科技资源',
                    func: [
                        {
                            title: '分配子用户',
                            link: '#assignTechnologyUser'
                        }
                    ]
                },
                {
                    type: 4,
                    title: '创业孵化',
                    func: [
                        {
                            title: '分配子用户',
                            link: '#assignIncubatorUser'
                        }
                    ]
                },
                {
                    type: 5,
                    title: '技术众包',
                    func: [
                        {
                            title: '分配子用户',
                            link: '#assignContractUser'
                        }
                    ]
                }
                // {
                //     type: 6,
                //     title: '招聘管理',
                //     func: [
                //         {
                //             title: '发布招聘',
                //             link: '#releaseEmployment'
                //         },
                //         {
                //             title: '我的招聘',
                //             link: '#employment'
                //         }
                //     ]
                // }
            ]
        };
        // 模块项html
        var sMenuModelHtml = '<li class="menu-model-item">\n' +
            '                            <p class="menu-model-title" type="hide"></p>\n' +
            '                            <ul class="child-menu-list">\n' +
            '                            </ul>\n' +
            '                        </li>';
        // 功能项html
        var sMenuFuncHtml = '<li class="child-menu-item">\n' +
            '                                    <a class="child-menu-link" href="">\n' +
            '                                    </a>\n' +
            '                                </li>';
        // 模块名称正则
        var oMenuModelNameRule = /<p class="menu-model-title((?!<\/p>).)+<\/p>/;
        // 模块功能列表正则
        var oMenuFuncListRule = /<ul class="child-menu-list((?!<\/ul>).)+<\/ul>/;
        // 功能项link正则
        var oMenuFuncLinkRule = /<a class="child-menu-link((?!<\/a>).)+<\/a>/;

        /* 右侧功能模块 */
        // 右侧区域
        var oRightModelNode = oMainModel.find('.right-model').eq(0);
        // 等待模块加载load
        var oWaitModelLoadNode = oRightModelNode.find('.model-load-div').eq(0);
        // 模块数组
        var aModels = oRightModelNode.find('.model-item-div');
        // 分配用户模块
        var oAssignUserModel = oRightModelNode.find('#assign-user');
        // 模块节点 ps:此处记录模块（注册）才能调用模块
        var oModels = {
            personalHome: oRightModelNode.find('#personal-home'),
            resetPassword: oRightModelNode.find('#reset-password'),
            resetCompanyInfo: oRightModelNode.find('#reset-company-info'),
            assignCompanyUser: oAssignUserModel,
            assignIntelligentUser: oAssignUserModel,
            assignTechnologyUser: oAssignUserModel,
            assignIncubatorUser: oAssignUserModel,
            assignContractUser: oAssignUserModel,
            viewUserOfSystemAuthority: oAssignUserModel,
            viewUserOfAffiliatedCompany: oAssignUserModel,
            bindPhone: oRightModelNode.find('#bind-phone'),
            applyIntelligent: oRightModelNode.find('#apply-intelligent'),
            releaseEmployment: oRightModelNode.find('#release-employment'),
            employment: oRightModelNode.find('#employment'),
            stationNews: oRightModelNode.find('#station-news'),
            deviceList: oRightModelNode.find('#device-list'),
            myDevice: oRightModelNode.find('#my-device')
        };
        // 对应的方法对象
        var oMethodObjs = {};
        // 用于注册需要激活的模块，一般用于检测是否通过已知正常方式进入模块
        var oEnableApply = {
            // 知网
            applyIntelligent: false
        };

        /* 加密 */
        // 获取script节点
        var oEncryptNode = $('#encrypt');
        var oEncryptParentNode = oEncryptNode.parent();

        /* 记录公共插件 */
        var oRecordPlugin = {};
        // 插件加载回调记录
        var oPluginLoadCallbacks = {};

        /* 资源加载记录 */
        // 用户判别loading何时关闭
        var oResourceLoad = {
            model: [],
            plugin: []
        };

        // 功能未开放名称数据
        var aDevFuncNames = [''];

        /* 开放接口 */
        /**
         * 用于每个模块公共继承构造函数
         * @private
         */
        _this._model_common_ = function () {
            // 是否为离开状态
            this.bIsLeaveModel = true;
            this.enterModel = function () {
                this.bIsLeaveModel = false;
            };
            this.leaveModel = function () {
                this.bIsLeaveModel = true;
            };
            this.init = function () {
                // 用于保证其他子模块没有定义init函数的时候不会报错
                console.log('我是公共方法的init,请定义模块的init方法');
                return 0;
            }
        };

        /**
         * 写入保存方法对象
         * @param methodObjName: 方法对象对应的属性名 需为：array/string
         * @param methodObj：方法对象
         * @returns {boolean}
         */
        _this.setMethodObj = function (methodObjName, methodObj) {
            var sType = getVariableType(methodObjName);
            var aAttrNames = null;
            var oNowMethodObj = null;
            if (sType === 'string') {
                aAttrNames = [methodObjName];
            } else if (sType === 'array') {
                aAttrNames = [].concat(methodObjName);
            } else {
                return false;
            }
            aAttrNames.forEach(function (item) {
                oMethodObjs[item] = methodObj;
            });
            // 判定所有模块是否加载完毕，若是去除全局变量中的"_personal_main_"
            if (isAllModelLoad()) {
                window._personal_main_ = null;
                delete window._personal_main_;
            }
            // 这里保证模块方法对象（ps:指当前要显示的模块和非显示模块）已经构建
            // 这里使用‘sOldModelName’，而非‘methodObjName’是因为其他模块都是未展示模块，等展示时在进行初始化操作
            oNowMethodObj = oMethodObjs[sOldModelName];
            // sameModelName 是防止其他模块注册时重复调用当前显示模块的初始化。ps: 这里只执行一次
            if (!!oNowMethodObj && oNowMethodObj.init && sameModelName(methodObjName)) {
                // 清除加载记录
                changeRecordOfResourceLoad('model', sOldModelName, false);
                // 初始化申请开启的数据(这里传入) ps:使用sOldModelName是为防止其他模块加载时做出多余的初始化操作（未显示的不触发初始化）
                initEnableApply(sOldModelName);
                // 若loading页面未隐藏，则隐藏并展示提示
                setLoadingShow(false, '模块资源加载完毕');
                // 模块切换
                handlerOfModelChange(sOldModelName);
            }
        };

        /**
         * 激活模块（解除指定模块锁）
         * @param sApplyModelName 模块名称
         */
        _this.enableApplyModel = function (sApplyModelName) {
            if (oEnableApply[sApplyModelName] !== undefined) {
                oEnableApply[sApplyModelName] = true;
            } else {
                return false;
            }
        };

        /**
         * 初始化（更新加密文件）
         */
        _this.initEncrypt = function () {
            oEncryptNode.remove();
            oEncryptNode.attr({
                src: _ajax.getDomain('security') + '/encrypt/javascript?time=' + new Date().getTime()
            });
            oEncryptParentNode.append(oEncryptNode);
        };

        /**
         * 功能开发中提示
         */
        _this.devTip = function () {
            setLayerMsg('功能开发中...');
        };

        /**
         * 获取企业信息
         * @param callback
         */
        _this.getCompanyInfo = function (callback) {
            oMethodObjs.personalHome.getUserInfo(function (res) {
                var data = null;
                if (res.status === 200) {
                    if (sUserType === 'user') {
                        data = res.data.enterCertification;
                    } else if (sUserType === 'company') {
                        data = res.data.enterprise;
                    }
                }
                if (callback) {
                    callback(data);
                }
            })
        };

        /**
         * 设置用户类型
         * @param sType
         */
        _this.setUserType = function (sType) {
            sUserType = sType;
            if (!bIsMenuInit) {
                initMenu();
                bIsMenuInit = true;
            }
        };

        /**
         * 获取用户类型
         * @returns {*}
         */
        _this.getUserType = function () {
            return sUserType;
        };

        /**
         * 设置用户手机
         * @param sPhone
         */
        _this.setUserPhone = function (sPhone) {
            sUserPhone = sPhone;
        };

        /**
         * 获取用户手机
         * @returns {*}
         */
        _this.getUserPhone = function () {
            return sUserPhone;
        };

        /**
         * 获取知网账号申请信息
         */
        _this.getApplyIntelligentInfo = function (callback) {
            _ajax.post('default', {
                url: '/cnkiApply/getNewRecord',
                contentType: 'application/json',
                success: function (res) {
                    var data = {};
                    data.type = 'success';
                    data.info = res;
                    if (callback) {
                        callback(data)
                    }
                },
                error: function (err) {
                    console.log(err);
                    var data = {};
                    data.type = 'error';
                    data.info = err;
                    if (callback) {
                        callback(data)
                    }
                }
            });
        };

        /**
         * 异步加载资源文件
         * @config: {
         *      pluginName: 插件的构造函数名
         *      moduleName: 模块名称
         *      vNode: 节点的配置信息
         *      parentNode: 要插入的父节点
         *      callback: 加载成功/失败的回调函数
         * }
         */
        _this.loadResource = function (config) {
            if (!(!!config) || !(!!config.vNode)) {
                return false;
            }
            // 节点配置
            var vNode = {
                tag: 'script',
                type: 'application/javascript',
                defer: true
            };
            // 插件构造函数名
            var pluginName = config.pluginName;
            // 模块名称
            var moduleName = (!!config.moduleName) ? config.moduleName : null;
            // 若插件
            if (!pluginName || !moduleName) {
                console.log('loadResource方法config参数中的pluginName或moduleName不能为空');
                return false;
            }
            // 父节点
            var parentNode = config.parentNode || oBodyModel;
            // 回调函数
            var cb = config.callback;
            // script 标签
            var oNewScript = null;
            // 插件名称对应下标
            var pluginIndex = null;
            // 合并配置数据
            vNode = Object.assign(vNode, config.vNode);
            pluginIndex = oResourceLoad.plugin.searchArrayObj(pluginName);
            changeRecordOfResourceLoad('plugin', pluginName, true);
            if (!(!!oPluginLoadCallbacks[pluginName])) {
                oPluginLoadCallbacks[pluginName] = {};
            }
            if (!!cb) {
                oPluginLoadCallbacks[pluginName][moduleName] = cb;
            }
            try {
                if (pluginIndex < 0) {
                    oNewScript = document.createElement(vNode.tag);
                    delete vNode.tag;
                    if (!!oNewScript) {
                        Object.keys(vNode).forEach(function (key) {
                            if (vNode.hasOwnProperty(key)) {
                                oNewScript[key] = vNode[key];
                            }
                        });
                        parentNode.appendChild(oNewScript);
                        // 设置资源加载监听
                        setEventOfResourceLoad(oNewScript, pluginName);
                        oRecordPlugin[pluginName] = null;
                        setLoadingShow(true, '插件加载中...');
                    } else {
                        return false;
                    }
                }
            } catch (e) {
                console.error(e);
            }
        };

        /* 共用函数 */
        /**
         * 开启layer.message
         * @param message 要提示的字符串
         */
        function setLayerMsg(message) {
            __layer.closeAll();
            __layer.msg(message);
        }

        /**
         * 判定是否通过正常通道进入模块
         * @param sModelName 跳转的模块名
         * @returns {boolean}
         */
        function IsNormalWayInModel(sModelName) {
            // 不属于需激活模块
            if (oEnableApply[sModelName] === undefined) {
                return true;
            } else {
                return oEnableApply[sModelName];
            }
        }

        /**
         * 跳转模块执行函数
         * @param sModelName 传入跳转的模块名
         */
        function handlerOfModelChange(sModelName) {
            // 更新导航
            setBreadcrumbs(sModelName);
            // 改变模块展示
            setModelShow(sModelName);
            // 进入模块并进行模块内部解锁
            noticeModelEnter(sModelName);
        }

        /**
         * 初始化模块申请（ps:从申请模块跳到其他模块时需要重新上锁）
         * @param sNowModelName
         */
        function initEnableApply(sNowModelName) {
            var stSave = null;
            Object.keys(oEnableApply).forEach(function (key) {
                if (oEnableApply.hasOwnProperty(key) && key !== sNowModelName) {
                    // 除当前模块，需激活的模块全上锁
                    oEnableApply[key] = false;
                    stSave = oMethodObjs[key];
                    // 除当前模块，需激活的模块内部上锁
                    if (!!stSave && stSave.leaveModel) {
                        stSave.leaveModel();
                    }
                }
            })
        }

        /**
         * 判定当前模块名称是否与nowModelName相同或存在于nowModelName之中
         * @param nowModelName
         * @returns {*}
         */
        function sameModelName (nowModelName) {
            var sType = null;
            var result = null;
            if (!(!!nowModelName)) {
                return false;
            }
            sType = getVariableType(nowModelName);
            if (sType === 'string') {
                result = (nowModelName === sOldModelName);
            } else if (sType === 'array') {
                result = (nowModelName.searchArrayObj(sOldModelName) > -1);
            }
            return result;
        }

        /**
         * 判定当前模块是否全部加载完毕
         * @returns {boolean}
         */
        function isAllModelLoad() {
            var result = true;
            $.each(Object.keys(oModels), function (index, key) {
                if (oModels.hasOwnProperty(key)) {
                    if (oMethodObjs[key] === undefined) {
                        result = false;
                        return false;
                    }
                }
            });
            return result;
        }

        /**
         * 返回上一个链接
         */
        function backOldUrl(sUrl, sNewModelName) {
            var hash = null;
            // 若是申请知网表格则返回列表页
            if (sNewModelName === 'applyIntelligent') {
                hash = (sUserType === 'user') ? 'viewUserOfSystemAuthority' : 'personalHome';
            } else{
                hash = (!!sOldModelName) ? sOldModelName : 'personalHome';
            }
            window.location.href = sUrl + '#' + hash;
        }

        /**
         * 设置资源的加载监听
         * @param dom 资源加载的dom节点
         * @param pluginName 插件名称
         * @param resourceType 资源类型
         */
        function setEventOfResourceLoad(dom, pluginName, resourceType) {
            var data = {};
            var oCallbacks = oPluginLoadCallbacks[pluginName];
            var callback = null;
            var oNowCallback = null;
            if (resourceType === undefined) {
                resourceType = 'plugin'
            }
            if (!(!!dom.onload)) {
                // 加载方法
                dom.onload = function () {
                    // 只需执行当前展示模块的回调函数（其他模块在切换时会进行初始化）
                    callback = oCallbacks[sOldModelName];
                    changeRecordOfResourceLoad(resourceType, pluginName, false);
                    setLoadingShow(false, '插件加载完毕');
                    data.type = 'success';
                    data.node = dom;
                    if (!!callback) {
                        callback(data);
                    }
                    oPluginLoadCallbacks[pluginName] = {};
                };
            }
            if (!(!!dom.onerror)) {
                // 报错方法
                dom.onerror = function () {
                    // 只需执行当前展示模块的回调函数（其他模块在切换时会进行初始化）
                    callback = oCallbacks[sOldModelName];
                    changeRecordOfResourceLoad(resourceType, pluginName, false);
                    setLoadingShow(false, '插件加载失败');
                    data.type = 'error';
                    data.node = dom;
                    if (!!callback) {
                        callback(data);
                    }
                    oPluginLoadCallbacks[pluginName] = {};
                };
            }
        }

        /**
         * 设置加载框展示隐藏
         * @param isShow 显示和隐藏
         * @param tip 提示文本
         */
        function setLoadingShow(isShow, tip) {
            // 展示
            if (isShow) {
                if (oWaitModelLoadNode.is(':hidden')) {
                    oWaitModelLoadNode.show();
                }
            } else { // 隐藏
                if (oWaitModelLoadNode.is(':visible') && canCloseLoading()) {
                    oWaitModelLoadNode.hide();
                }
            }
            if (!!tip) {
                setLayerMsg(tip);
            }
        }

        /**
         * 是否关闭loading
         * @returns {boolean}
         */
        function canCloseLoading() {
            var result = true;
            var aKeys = Object.keys(oResourceLoad);
            $.each(aKeys, function (index, key) {
                if (oResourceLoad.hasOwnProperty(key) && oResourceLoad[key].length > 0) {
                    result = false;
                    return result;
                }
            });
            return result
        }

        /**
         * 增减loading记录,ps: 同样的插件资源只记1个
         * @param attrName 属性名
         * @param modelName 模块名
         * @param isAdd 是否增加
         */
        function changeRecordOfResourceLoad(attrName, modelName, isAdd) {
            var arr = oResourceLoad[attrName];
            var index = arr.searchArrayObj(modelName);
            // 增加
            if (isAdd && index < 0) {
                arr.push(modelName);
            } else if (!isAdd && index > -1){ // 减少
                arr.splice(index, 1);
            }
        }

        /* 主模块 */
        // hash监听
        function hashEvent() {
            window.addEventListener('hashchange', handleOfHashChange);
        }

        // hash的执行函数
        function handleOfHashChange() {
            // location
            var oLocation = window.location;
            var sHref = oLocation.href;
            var sHash = oLocation.hash;
            var sNewModelName = null;
            var stSave = null;
            // url
            var sUrl = sHref.split('#')[0];
            // 主要执行函数
            var mainFunc = function () {
                if (sNewModelName !== sOldModelName) {
                    sOldModelName = sNewModelName;
                    initEnableApply(sOldModelName);
                    // 当模块js 加载完毕并执行后才触发模块切换
                    if (oMethodObjs[sOldModelName]) {
                        handlerOfModelChange(sOldModelName);
                    } else { // 资源文件还在加载的时候展示loading页面
                        changeRecordOfResourceLoad('model', sOldModelName, true);
                        setLoadingShow(true, '模块资源正在加载，请耐心等候');
                    }
                }
            };
            if (!!sHash && sHash.length > 1) {
                sNewModelName = sHash.slice(1);
            } else {
                sNewModelName = 'personalHome';
            }
            stSave = Object.keys(oModels).searchArrayObj(sNewModelName);
            // 没有模块的情况
            if (stSave < 0) {
                setLayerMsg('功能模块: ' + sNewModelName + ' 未注册');
                backOldUrl(sUrl);
                return false;
            }
            // 开发中的模块
            if (aDevFuncNames.searchArrayObj(sNewModelName) > -1) {
                _this.devTip();
                backOldUrl(sUrl);
                return false;
            }
            // 需要激活且没通过正常途径进入的模块
            if (oEnableApply[sNewModelName] !== undefined && !IsNormalWayInModel(sNewModelName)) {
                // 是否满足条件可以直接进入被锁模块
                canEnterNeedEnableModule(sNewModelName, function (bCanEnter) {
                    // 可以直接进入
                    if (bCanEnter) {
                        oEnableApply[sNewModelName] = true;
                        mainFunc();
                    } else {// 不可直接进入
                        oEnableApply[sNewModelName] = false;
                        setLayerMsg('请通过正常操作进入 ' + sNewModelName + ' 功能模块！');
                        backOldUrl(sUrl, sNewModelName);
                    }
                });
            } else { // 不需要激活模块
                mainFunc();
            }
        }

        // 是否满足条件可以直接进入被锁模块
        function canEnterNeedEnableModule(moduleName, callback) {
            // 申请知网模块
            if (moduleName === 'applyIntelligent') {
                // 企业用户没有申请知网账号权限
                if (sUserType === 'company'){
                    callback(false);
                } else { // 个人用户有
                    _this.getApplyIntelligentInfo(function (data) {
                        var type = data.type;
                        var info = data.info;
                        var stSave = null;
                        var bCanEnter = false;
                        if (type === 'success') {
                            if (info.status === 200) {
                                stSave = info.data;
                                if (!!stSave) {
                                    // 审核中
                                    if (stSave.status === '019a934e-488f-11e9-880c-20040fed244c') {
                                        bCanEnter = false;
                                    } else if (stSave.status === '0ba408c8-488f-11e9-880c-20040fed244c') { // 被拒绝
                                        bCanEnter = true;
                                    } else if (stSave.status === '15d90aa6-488f-11e9-880c-20040fed244c') { // 通过
                                        bCanEnter = false;
                                    }
                                } else { // 未申请
                                    bCanEnter = true;
                                }
                            }
                        } else {
                            console.log(info);
                        }
                        if (callback) {
                            callback(bCanEnter);
                        }
                    });
                }
            } else {// 其他模块
                callback(false);
            }
        }

        // 进入模块并进行模块内部解锁
        function noticeModelEnter(sModelName) {
            // 只有非需激活模块和正确激活模块才可以解除模块内部锁
            if (oEnableApply[sModelName] === undefined || !!oEnableApply[sModelName]) {
                oMethodObjs[sModelName].enterModel();
            }
        }

        /* 面包屑导航 */
        // 设置面包屑导航
        function setBreadcrumbs(sPathName) {
            var result = '';
            var aPathData = getBreadcrumbsPath(sPathName);
            if (aPathData.length > 0) {
                aPathData.forEach(function (item, index) {
                    result += sBreadcrumbsItemHtml.replace(oWarpRule, function (warpStr) {
                        return warpStr.replace(/\s+/g, '');
                    }).replace(oBreadcrumbsLinkRule, function (linkStr) {
                        return linkStr.replace('href=""', 'href="' + ((index === aPathData.length - 1) ? 'javaScript:void(0)' : item.link) + '"')
                            .slice(0, -4) + item.title + '</a>';
                    })
                });
                oBreadcrumbsNode.html(result);
            }
        }

        // 获取连接数据
        function getBreadcrumbsPath(sPathName, nDataIndex) {
            // 解决调用函数名被替换的问题
            return (function getPath(name, index) {
                var stSave = null;
                var result = [];
                if (index === undefined) {
                    index = aPathData.length - 1;
                }
                do {
                    stSave = aPathData[index][name];
                    if (stSave) {
                        result.push(JSON.parse(JSON.stringify(stSave)));
                        if (stSave.parent && index > 0) {
                            result = getPath(stSave.parent, index - 1).concat(result);
                        }
                        // 跳出
                        break;
                    }
                    --index;
                } while (index !== 0);
                return result;
            })(sPathName, nDataIndex);
        }

        /* 菜单栏模块 */

        // 初始化菜单栏
        function initMenu() {
            var finalMenuData = extractMenuData();
            importMenu(finalMenuData);
        }

        // 提取菜单栏数据
        function extractMenuData() {
            var result = [];
            var baseData = JSON.parse(JSON.stringify(oMenuData.base));
            var otherData = null;
            var stSave = null;
            // 普通用户
            if (sUserType === 'user') {
                otherData = oMenuData.user;
            } else if (sUserType === 'company') {// 企业用户
                otherData = oMenuData.company;
            }
            otherData.forEach(function (item) {
                if (baseData.length > 0) {
                    stSave = parseInt(baseData.searchArrayObj(item.type, 'type'));
                } else {
                    stSave = -1;
                }
                if (stSave > -1) {
                    stSave = baseData.splice(stSave, 1)[0];
                    stSave.func = stSave.func.concat(item.func);
                    result.push(stSave);
                } else {
                    result.push(item);
                }
            });
            return result;
        }

        // 写入菜单栏
        function importMenu(data) {
            var modelHtml = '';
            var stRule = /\s+/g;
            var stTypeRule = /type="[^"]+"/;
            var stClassRule = /class="[^"]+"/;
            var stSave = null;
            data.forEach(function (item, index) {
                modelHtml += sMenuModelHtml.replace(oWarpRule, function (warpStr) {
                    return warpStr.replace(stRule, '');
                }).replace(oMenuModelNameRule, function (nameStr) {
                    if (sOldModelName) {
                        stSave = item.func.searchArrayObj('#' + sOldModelName, 'link');
                        if (stSave > -1) {
                            nameStr = nameStr.replace(stTypeRule, 'type="show"');
                        }
                    } else if (index === 0) {
                        nameStr = nameStr.replace(stTypeRule, 'type="show"');
                    }
                    return nameStr.slice(0, -4) + item.title + '</p>';
                }).replace(oMenuFuncListRule, function (listStr) {
                    var funcHtml = '';
                    item.func.forEach(function (funcItem) {
                        funcHtml += sMenuFuncHtml.replace(oWarpRule, function (warpStr) {
                            return warpStr.replace(stRule, '');
                        }).replace(oMenuFuncLinkRule, function (linkStr) {
                            if ('#' + sOldModelName === funcItem.link) {
                                linkStr = linkStr.replace(stClassRule, function (classStr) {
                                    return classStr.slice(0, -1) + ' active"'
                                })
                            }
                            return linkStr.replace('href=""', 'href="' + funcItem.link + '"')
                                .slice(0, -4) + funcItem.title + '</a>';
                        })
                    });
                    return listStr.slice(0, -5) + funcHtml + '</ul>';
                })
            });
            oMenuNode.html(modelHtml);
        }

        // 菜单栏事件
        function menuEvent() {
            eventOfMenuTitleClick();
            eventOfMenuLinkClick();
        }

        // 标题点击事件
        function eventOfMenuTitleClick() {
            // 当前节点
            var oNowNode_jq = null;
            // 当前dom节点
            var oNowNode_dom = null;
            // 节点类型
            var sNowNodeType = null;
            // 当前的模块名称
            var sModelName = null;
            oMenuNode.on('click', function (event) {
                oNowNode_jq = $(event.target);
                oNowNode_dom = oNowNode_jq.get(0);
                sNowNodeType = oNowNode_dom.tagName.toLowerCase();
                if (sNowNodeType === 'p') {
                    if (oNowNode_jq.hasClass('menu-model-title')) {
                        handlerOfModelTitleClick(oNowNode_jq);
                    }
                } else if (sNowNodeType === 'a') {
                    sModelName = oNowNode_jq.attr('href').slice(1);
                    if (!IsNormalWayInModel(sModelName)) {
                        setLayerMsg('请通过正常操作进入 '+ sModelName +' 功能模块！');
                        return false;
                    }
                }
            });
        }

        // 模块title的执行函数
        function handlerOfModelTitleClick(oNowNode) {
            var aTitles = null;
            var sShowType = oNowNode.attr('type');
            if (sShowType === 'show') {
                oNowNode.attr({
                    type: 'hide'
                });
            } else if (sShowType === 'hide') {
                aTitles = oMenuNode.find('p.menu-model-title');
                aTitles.each(function (index) {
                    var stSave = aTitles.eq(index);
                    if (stSave.attr('type') === 'show') {
                        stSave.attr({
                            type: 'hide'
                        });
                    }
                });
                oNowNode.attr({
                    type: 'show'
                });
            }
            return false;
        }

        // 点击事件
        function eventOfMenuLinkClick() {
            var oNowNode = null;
            var sModelName = null;
            var aLinkNodes = null;
            var oNowLinkNode = null;
            oMenuNode.on('click', 'a.child-menu-link', function () {
                oNowNode = $(this);
                sModelName = oNowNode.attr('href').slice(1);
                aLinkNodes = oNowNode.parents('.menu-model-list').eq(0).find('a.child-menu-link');
                aLinkNodes.each(function () {
                    oNowLinkNode = $(this);
                    if (oNowLinkNode.hasClass('active')) {
                        oNowLinkNode.removeClass('active');
                        return false;
                    }
                });
                oNowNode.addClass('active');
                if (aDevFuncNames.searchArrayObj(sModelName) > -1) {
                    _this.devTip();
                    return false;
                }
            });
        }

        /* 内容模块 */
        function setModelShow(sModelName) {
            var oNowNode = null;
            var oShowModel = null;
            var stSave = null;
            if (sModelName === undefined) {
                sModelName = 'personalHome'
            }
            aModels.each(function () {
                oNowNode = $(this);
                if (oNowNode.is(':visible')) {
                    oNowNode.hide();
                    return false;
                }
            });
            oShowModel = oModels[sModelName];
            oShowModel.show();
            stSave = oMethodObjs[sModelName];
            if (!!stSave && stSave.init) {
                stSave.init(sModelName);
            }
        }

        /* 主函数调用 */
        // 链接事件
        hashEvent();
        // 菜单栏事件
        menuEvent();
        // 第一次自动调用一次
        handleOfHashChange();
    }
    window._personal_main_ = new PersonalMain();
});
