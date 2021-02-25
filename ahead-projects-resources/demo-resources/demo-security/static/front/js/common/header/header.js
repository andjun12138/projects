(function () {

    var _ajax = new NewAjax();
    // 获取头部模块
    var oHeadModel = $('#header');
    // 获取顶部功能列表
    var oTopFuncListNode = oHeadModel.find('.header-func-list').eq(0);
    // 获取搜索按钮
    var oSearchBtn = oHeadModel.find('.content-middle-part .search-btn').eq(0);
    // 获取搜索输入框
    var oSearchInput = oHeadModel.find('.content-middle-part .header-search').eq(0);
    // session计时器
    var sessionTimer = null;
    // 最大分钟（过期时间的极限值）
    var maxMinutes = 10;
    // 全显示标记
    var aShowMark = ['home', 'intelligent'];
    // 用户是否登录
    var bIsUserLogin = false;
    // layer消息弹框配置数据
    var oLayerConfig = {
        width: 340,
        height: 215
    };
    // layer 弹框的承载html
    var sLayerArea = '<div class="layer-open-div">%content%</div>';
    // layui 数组
    var aLayui = null;
    // 当前路由是否为个人中心
    var bIsPersonalModel = false;

    /* socket */
    // 获取webSocket
    var global_ws = null;

    // 写入导航栏第三方连接
    var navLinkObj = {
        technology: 'howNetUrl',
        incubation: 'incubatorUrl',
        service: 'serviceUrl',
        outsourcing: 'ggdzhzbUrl'
    };

    // 页面关闭监听
    windowBeforeUnload(function () {
        // 关闭session保护
        removeSaveSession();
    });
    // 重写导航栏
    resetNav();
    // 获取用户的登录信息
    getUserLoginInfo();
    if(!bIsUserLogin){
        window.localStorage.clear();
    }
    // 写入导航链接
    renderNavLink('technology');
    renderNavLink('outsourcing');

    /* 页面监听 */
    // 检测网页的打开状态（新开/刷新）
    windowOpenStatus(function (isOpen) {
        bIsPersonalModel = isRouterOfPersonal();
        // 激活socket
        enableSocket();
    });
    // 页面关闭前监听
    windowBeforeUnload(function (event) {
        var sTip = "系统可能不会保存您所做的更改。";
        event = event || window.event;
        // 若存在重要操作，则提示
        if (window.importantOperation) {
            event.returnValue = sTip;
            return sTip;
        }
    });
    // 页面关闭退出
    windowUnload(function () {
        set_IMPORTANTOPERATION(false);
        // 若存在socket
        if (global_ws !== null && global_ws.socketClose !== undefined && typeof global_ws.socketClose === "function") {
            // 关闭socket
            global_ws.socketClose();
        }
    });

    // 激活socket
    function enableSocket () {
        // 获取localStorage
        var localSave = null;
        // 查阅的定时器
        var checkTime = null;

        if (window.localStorage === undefined) {
            console.error('当前浏览器版本不兼容localStorage');
            return 0;
        }
        localSave = window.localStorage;

        // 页面打开时，socket初始化。ps:未登录时不连接
        initSocket();

        // 根据全局数据判定处理socket的链接
        if (localSave.getItem('user') !== null) {
            if (global_ws !== null && global_ws.socketClose !== undefined) {
                global_ws.socketClose();
            }
            // 获取用户数据
            var data = JSON.parse(localSave.getItem('user'));
            reLinkSocket(data);
        }
        // 调用localStorage监听
        storageEvent(function (key, STORAGE) {
            // 'user'数据的变化表示用户的登录情况
            if (key === 'user') {
                var data = STORAGE.getItem(key);
                // 表示退出登录
                if (data === null) {
                    if (global_ws !== null && global_ws.socketClose !== undefined && typeof global_ws.socketClose === "function") {
                        global_ws.socketClose();
                    }
                } else { // 表示登录 （不用isLogin检测，因为会导致逻辑过于混乱）
                    // 获取用户数据
                    data = JSON.parse(data);
                    // 初始化
                    reLinkSocket(data);
                }
            }
        });
    }

    // 判定是否为个人中心
    function isRouterOfPersonal () {
        var location = window.location;
        var urlArr = location.pathname.split('/');
        var modelName = urlArr.pop().split('.')[0];
        return modelName === 'personal';
    }

    // 点击搜索按钮跳转事件
    oSearchBtn.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toSearch();
    });

    // 搜索输入框回车搜索事件
    oSearchInput.on('keydown', function (e) {
        e.stopPropagation();
        if (e.keyCode === 13) {
            toSearch();
        }
    });

    function toSearch() {
        var keyWord = encodeURI(encodeURI(oSearchInput.val()));
        if (keyWord === '' || keyWord === null) {
            layer.msg('请输入搜索关键词');
        } else {
            window.open('/search.html?keyWord=' + keyWord)
        }
    }

    // 获取路由参数key值
    function getUrlSearch() {
        // 获取当前路由
        var sSearch = window.location.search.slice(1);
        // 获取参数数组
        var aSearchs = sSearch.split('&');
        // 结果
        var result = [];
        aSearchs.forEach(function (item) {
            if (item.indexOf('=') > -1) {
                result.push(item.split('=')[0]);
            } else {
                result.push(item);
            }
        });
        return result;
    }

    // 获取页面功能名称
    function getPageModuleName() {
        // 当前路由
        var sNowUrl = window.location.href;
        // 头部url（除去参数）
        var sUrlHead = (sNowUrl.indexOf('?') > -1) ? sNowUrl.split('?')[0] : sNowUrl;
        // 正常规则（功能名.html）
        var urlRule_normal = /\/\w+\.html/;
        // 其他规则 (功能名/id.html)
        var urlRule_other = /\/\w+\/\w+\.html/;
        // 作用正则
        var rule_use = (getUrlSearch().searchArrayObj('urlType') > -1) ? urlRule_other : urlRule_normal;
        // 获取截取部分
        var aCutUrl = sUrlHead.match(rule_use);
        var stSave = (aCutUrl && aCutUrl.length > 0) ? sUrlHead.match(rule_use)[0].slice(1) : null;
        return (stSave && stSave.indexOf('.html') > -1) ? stSave.slice(0, -5) : stSave;
    }

    // 重设nav
    function resetNav() {
        // 获取nav列表
        var oNavList = oHeadModel.find('.bottom-nav-list').eq(0);
        // 列表子项
        var aListItems = oNavList.children('li');
        // 获取功能页面名称
        var sPageName = getPageModuleName();
        // 当前节点
        var oNowNode = null;
        // 当前类型
        var sNowType = null;
        aListItems.each(function () {
            oNowNode = $(this);
            sNowType = oNowNode.attr('type');
            // if (sNowType === sPageName || (sNowType === 'home' && !sPageName)) {
            if (sNowType === sPageName) {
                if (!oNowNode.hasClass('active')) {
                    oNowNode.addClass('active');
                    oNowNode.find('a.nav-item-link').eq(0).removeAttr('href');
                }
            } else if (oNowNode.hasClass('active')) {
                oNowNode.removeClass('active');
            }
        })
    }

    // 设置头部的显示
    function setHeaderContentShow() {
        // 获取中部
        var oModdleModel = oHeadModel.find('.content-middle-part').eq(0);
        // 获取下部
        var oBottomModel = oHeadModel.find('.content-bottom-part').eq(0);
        // 页面名称
        var sPageName = getPageModuleName();
        if (aShowMark.searchArrayObj(sPageName) > -1) {
            oModdleModel.show();
            oBottomModel.show();
        } else {
            oModdleModel.hide();
            oBottomModel.hide();
        }
    }

    // 获取用户登录情况
    function getUserLoginInfo() {
        _ajax.post('default', {
            url: '/isLogin',
            contentType: 'application/json',
            dataType: 'json',
            data: '{}',
            async:false,
            xhrFields: {
                withCredentials: true
            },
            success: function (res) {
                var data = null;
                var stSave = null;
                if (res.status === 200) {
                    bIsUserLogin = true;
                    data = res.data;
                    stSave = extractUserInfo(data.user.frontUser);
                    window.userInfo = stSave;
                    __public.storage.saveToSessionStorage('user', JSON.stringify(stSave));
                    setLoginStatus();
                    if (!sessionTimer) {
                        // 启动session保护
                        saveSession();
                    }
                }
                oTopFuncListNode.removeAttr('style');
            },
            error: function (XMLResponse) {// 用户未登录
                var data = XMLResponse.responseJSON;
                bIsUserLogin = false;
                oTopFuncListNode.removeAttr('style');
                console.log(data);
                if (!!data) {
                    dealWithError(data);
                }
            }
        })
    }

    // 错误处理函数
    function dealWithError(data) {
        var status = data.status;
        if (!!status) {
            // 用户未登录，清空用户信息
            if (status === 403) {
                __public.storage.saveToLocalStorage('user', null);
                // 关闭session保护
                removeSaveSession();
            }
        }
    }

    // 提取用户数据
    function extractUserInfo(data) {
        var result = {};
        if (!!data) {
            result.id = data.id;
            result.avatar = (!!data.headPortrait) ? data.headPortrait : null;
            result.createdAt = data.createdAt;
            result.email = data.email;
            result.phone = data.phone;
            result.userName = data.userName;
            result.type = data.type;
        }
        return result;
    }

    // 登陆状态
    function setLoginStatus() {
        // 获取功能子项
        var oFuncItemNode = oTopFuncListNode.children();
        // 获取个人中心子项
        var oPersonalNode = null;
        // 获取退出子项
        var oSignOutNode = null;
        // 当前类型
        var sNowType = null;
        // 当前节点
        var oNowNode = null;
        // 要移除的子项类型
        var aDeleteType = ['login', 'registered'];
        // 绑定手机节点
        var oBindPhoneNode = null;
        oFuncItemNode.each(function () {
            oNowNode = $(this);
            sNowType = oNowNode.attr('type');
            if (aDeleteType.searchArrayObj(sNowType) > -1) {
                oNowNode.remove();
                if (sNowType === 'login') {
                    oPersonalNode = oNowNode;
                } else if (sNowType === 'registered') {
                    oSignOutNode = oNowNode;
                }
            }
        });
        // 登出
        oSignOutNode.find('a.header-func-item-link').eq(0).attr({
            href: 'javascript:void(0)'
        }).click(function () {
            $.ajax({
                url: '/logout',
                type: 'post',
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (res) {
                    // 获取hash
                    var sHash = null;
                    if (res.status === 200) {
                        // 若是个人中心
                        if (bIsPersonalModel) {
                            sHash = window.location.hash;
                            if (!!sHash && sHash.length > 1) {
                                sHash = sHash.slice(1);
                            } else {
                                sHash = 'personalHome';
                            }
                            __public.cookie.set('plmodel', encodeURI(sHash));
                        }
                        window.localStorage.clear();
                        window.location.href = '/login.html';
                    }
                },
                error: function (err) {
                    console.log('logout:', err);
                    __layer.msg('系统内部错误', {icon: 2})
                }
            });
        });
        oSignOutNode.find('i.header-func-item-icon').eq(0).removeClass('icon-register').addClass('icon-sign-out');
        oSignOutNode.find('span.header-func-item-content').eq(0).text('退出');
        oTopFuncListNode.prepend(oSignOutNode);
        // 若用户未绑定手机
        if (!window.userInfo.phone) {
            oBindPhoneNode = $(oSignOutNode.prop('outerHTML'));
            oBindPhoneNode.find('a.header-func-item-link').eq(0).attr({
                href: '/personal.html#bindPhone'
            });
            oBindPhoneNode.find('i.header-func-item-icon').eq(0).removeClass('icon-sign-out').addClass('icon-bind-phone');
            oBindPhoneNode.find('span.header-func-item-content').eq(0).text('绑定手机');
            oTopFuncListNode.prepend(oBindPhoneNode);
        }
        // 个人中心
        oPersonalNode.find('a.header-func-item-link').eq(0).attr({
            href: '/personal.html'
        });
        oPersonalNode.find('span.header-func-item-content').eq(0).text(window.userInfo.userName);
        oTopFuncListNode.prepend(oPersonalNode);
    }

    // 写入导航链接
    function renderNavLink(type) {
        // 获取导航栏知网按钮
        var oNavItemNode = oHeadModel.find('.nav-item[type="' + type + '"]').eq(0);
        var thirdPlatformInfo = getLocalStorage('thirdPlatformInfo');
        if (thirdPlatformInfo && thirdPlatformInfo[navLinkObj[type]]) {
            oNavItemNode.find('a.nav-item-link').eq(0).attr({
                href: thirdPlatformInfo[navLinkObj[type]]
            });
        }
    }

    // 定时请求，防止session过期
    function saveSession() {
        sessionTimer = setInterval(function () {
            getUserLoginInfo();
        }, 60 * 1000 * maxMinutes)
    }

    // 取消session保护
    function removeSaveSession() {
        if (sessionTimer) {
            clearInterval(sessionTimer);
            sessionTimer = null;
        }
    }


    /* 页面监听 */

    // 初始化socket
    function initSocket() {
        if (global_ws === null) {
            global_ws = new SOCKET();
            // 监听 open
            global_ws.setSocketOpenCallback(function () {});
            // 监听 message
            global_ws.setSocketMessageCallback(function (data) {
                // 获取服务器返回信息
                var info = (!!data) ? JSON.parse(data) : null;
                var message = (!!info) ? JSON.parse(info.content) : null;
                // 获取el
                var el = document.documentElement;
                var left = el.offsetWidth - (oLayerConfig.width + 10);
                var top = el.offsetHeight - (oLayerConfig.height + 10);
                var layui = null;
                // 初始化
                if (!(!!aLayui)) {
                    aLayui = [];
                } else {
                    // 超过 3 个, 主动销毁最前
                    if (aLayui.length > 3) {
                        __layer.close(aLayui.shift());
                    }
                }
                // 弹窗打开
                layui = __layer.open({
                    type: 1,
                    title: message.title,
                    // 显示关闭按钮
                    closeBtn: 1,
                    shade: false,
                    area: [oLayerConfig.width + 'px', oLayerConfig.height + 'px'],
                    // 右下角弹出
                    offset: [top + 'px', left + 'px'],
                    // 5秒后自动关闭
                    time: 5000,
                    // 底向上划入动画
                    anim: 2,
                    // 弹出的内容
                    content: sprintf(sLayerArea, message.content),
                    // 图层销毁回调
                    end: function () {
                        // 图层销毁后要清除数组中的标记
                        var index = aLayui.searchArrayObj(layui);
                        if (index > -1) {
                            aLayui.splice(index, 1);
                        }
                    }
                });
                // 记录弹出层标记
                aLayui.push(layui);
            }, 'data');
            // 关闭 监听
            global_ws.setSocketCloseCallback(function () {})
        }
    }

    // 重连socket
    function reLinkSocket(data) {
        if (global_ws !== null) {
            // 切换用户链接
            global_ws.setSocketNewUrl(data.id);
            // 重启socket
            global_ws.restartSocket();
        }
    }
})();

$(function () {
    // 获取头部模块
    var oHeadModel = $('#header');
    // 获取nav列表
    var oNavList = oHeadModel.find('.bottom-nav-list').eq(0);
    // 需要登录类型
    var oNavTypeConfig = {
        home: {
            isNeedLogin: false,
            isOpen:true
        },
        intelligent: {
            isNeedLogin: false,
            isOpen:true
        },
        technology: {
            isNeedLogin: false,
            isOpen:true
        },
        incubation: {
            isNeedLogin: false,
            isOpen:true
        },
        service: {
            isNeedLogin: false,
            isOpen: true
        },
        outsourcing: {
            isNeedLogin: false,
            isOpen: true
        }
    };
    // body
    var oDomNode = $(document).eq(0);
    // 获取layout 背景图
    var oLayoutBgNode = $('.layout-content-container-bg').eq(0);
    // 获取头部的实际高度
    var nHeaderOffsetHeight = oHeadModel.get(0).offsetHeight;

    //todo 现在用不到这个方法（这个方法也有BUG）
    eventOfNavListClick();
    eventOfDomScroll();
    setContentHeight();

    // nav事件
    //todo  这个方法需要修改  会出现同时打开两个页面问题
    function eventOfNavListClick() {
        var oNowLinkNode = null;
        var oNowLiNode = null;
        var sNowNavType = null;
        var sNowLink = null;
        var layui = null;
        var oType;
        oNavList.on('click', 'a.nav-item-link', function (event) {
            oNowLinkNode = $(this);
            oNowLiNode = oNowLinkNode.parent();
            sNowNavType = oNowLiNode.attr('type');
            sNowLink = oNowLinkNode.attr('href');
            oType = oNowLinkNode.attr('data-type');
            if (!oNavTypeConfig[sNowNavType].isOpen){
                event.preventDefault();
                layer.msg('平台未开放，请稍后重试');
                return false;
            }
           /* if (oNavTypeConfig[sNowNavType].isNeedLogin) {
                event.preventDefault();
                if (window.userInfo) {
                    if (sNowLink !== 'javaScript:void(0)') {
                        window.open(sNowLink, (oNavTypeConfig[sNowNavType].target) ? oNavTypeConfig[sNowNavType].target : '_self');
                    } else {
                        if (layui) {
                            __layer.close(layui);
                            layui = null;
                        }
                        layui = __layer.msg('暂时没有权限访问该系统！');
                    }
                } else {
                    __layer.confirm('需登录访问，是否跳转登录界面？',function (index) {
                        __layer.close(index);
                        window.location.href = '/login.html';
                    }, function (index) {
                        __layer.close(index);
                    })
                }
            } else {
                if (sNowLink !== 'javaScript:void(0)') {
                    window.open(sNowLink, (oNavTypeConfig[sNowNavType].target) ? oNavTypeConfig[sNowNavType].target : '_self');
                } else {
                    if (layui) {
                        __layer.close(layui);
                        layui = null;
                    }
                    layui = __layer.msg('平台未开放，请稍后重试');
                }
            }*/
        })
    }

    // 初始化背景图
    function initLayoutBg(height) {
        oLayoutBgNode.css({
            height: height,
            backgroundImage: 'url(' + oLayoutBgNode.data('src') + ')'
        }).removeAttr('data-src');
    }

    // 滚动监听, 作用：滚动改变全局背景图的定位
    function eventOfDomScroll() {
        var nScrollTop = null;
        var sPosition = 'absolute';
        var timer = null;
        oDomNode.on('scroll', function () {
            if (!(!!timer)) {
                timer = setTimeout(function () {
                    nScrollTop = oDomNode.scrollTop();
                    if (nScrollTop > nHeaderOffsetHeight) {
                        if (sPosition === 'absolute') {
                            sPosition = 'fixed';
                            oLayoutBgNode.css({
                                position: sPosition
                            });
                        }
                    } else {
                        if (sPosition === 'fixed') {
                            sPosition = 'absolute';
                            oLayoutBgNode.css({
                                position: sPosition
                            });
                        }
                    }
                    clearTimeout(timer);
                    timer = null;
                }, 10)
            }
        })
    }
    // 设置主内容高度
    function setContentHeight() {
        var htmlHeight = document.body.offsetHeight;
        // 获取模板内容区域
        var layoutContainer = $('.layout-content-container').eq(0);
        // 最终高度
        var fHeight = htmlHeight - oHeadModel.height();
        layoutContainer.css({
            minHeight: fHeight + 'px'
        });
        initLayoutBg(fHeight);
    }
});
