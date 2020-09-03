$(function () {
    window.localStorage.clear();
    var _ajax = new NewAjax();
    // 登录模块节点
    var oLoginModel = $('#login').find('.content-div').eq(0);
    // 账号
    var oUsernameInputNode = oLoginModel.find('#username');
    // 密码
    var oPasswordInputNode = oLoginModel.find('#password');
    // 验证码
    var oCodeInputNode = oLoginModel.find('#code');
    // 验证码图片
    var oCodeImageNode = oLoginModel.find('#code-image');
    // 按钮节点
    var ologinButtonNode = oLoginModel.find('.login-button').eq(0);
    // 非法输入正则
    var oIllegalInputENRule = /[`!#$%^&*+<>?:"{},\/;'\[\]]/im;
    var oIllegalInputCNRule = /[·！#￥：；“”‘、，|《。》？【】]/im;
    // 手机验证码
    var oPhoneRule = /^1(3|4|5|7|8)\d{9}$/;
    // 邮箱正则
    var oEmailRule = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    // 加密文件是否加载完成
    var bIsEncryptLoad = false;

    var oOldUrl = null;

    var _ggdzhzbToken = null;

    initEncrypt();
    initInputMark();
    eventOfCodeImageClick();
    loginInputEvent();
    loginBtnClick();

    // 初始化加密文件
    function initEncrypt() {
        // 获取script节点
        var oScriptNode = $('#encrypt');
        // 获取父级节点
        var oParentNode = oScriptNode.parent();
        // 会移除说有事件
        oScriptNode.remove();
        bIsEncryptLoad = false;
        oScriptNode.attr({
            src: _ajax.getDomain('security') + '/encrypt/javascript'
        });
        oParentNode.append(oScriptNode);
        // eventOfEncrypt(oScriptNode);
    }

    // 为script节点添加监听事件
    function eventOfEncrypt(node) {
        node.on('load', function () {
            setLayerMsg('资源加载完毕');
            bIsEncryptLoad = true;
        });
        node.on('error', function () {
            setLayerMsg('资源加载失败');
            bIsEncryptLoad = false;
            __layer.confirm('ScreenshotPlugin插件引入失败，是否重新引入?', {
                title: '资源引入失败'
            }, function (index) {
                // 确定
                initEncrypt();
                __layer.close(index);
            }, function (index) {
                // 取消
                __layer.close(index);
            });
        });
    }

    // 初始化输入框标记
    function initInputMark() {
        oUsernameInputNode.data('name', '用户名');
        oPasswordInputNode.data('name', '登录密码');
        oCodeInputNode.data('name', '验证码');
    }

    // 更新加密文件
    function updateEncrypt() {
        // 获取script节点
        var oScriptNode = $('#encrypt');
        // 父级节点
        var oParentNode = oScriptNode.parent();
        // 获取链接
        var sScriptLink = oScriptNode.attr('src');
        if (sScriptLink.indexOf('?index=') > -1) {
            sScriptLink = sScriptLink.replace(/index=.+$/, 'index=' + new Date().getTime());
        } else {
            sScriptLink += '?index=' + new Date().getTime();
        }
        oScriptNode.remove();
        oScriptNode.attr({
            src: sScriptLink
        });
        oParentNode.append(oScriptNode);
    }

    /**
     * 更新验证码
     */
    function updateCode() {
        var sCodeUrl = oCodeImageNode.attr('src');
        if (sCodeUrl.indexOf('?index=') > -1) {
            sCodeUrl = sCodeUrl.replace(/index=.+$/, 'index=' + new Date().getTime());
        } else {
            sCodeUrl += '?index=' + new Date().getTime();
        }
        oCodeImageNode.attr({
            src: sCodeUrl
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
                if (!oInputDivNode.hasClass('error-al-icon')) {
                    oInputDivNode.addClass('error-al-icon');
                }
            } else {
                oTipNode.hide();
                if (oInputDivNode.hasClass('error-al-icon')) {
                    oInputDivNode.removeClass('error-al-icon');
                }
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
            // if (oIllegalInputCNRule.test(value) || oIllegalInputENRule.test(value)) {
            //     setTipShow(inputNode, true, '存在非法字符，请清除后继续操作');
            //     return 0;
            // } else
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
    }

    /**
     * 作用:按enter执行函数
     */
    function handleOfEnter() {
        var stSave = {
            sUsername: oUsernameInputNode.val(),
            sPassword: oPasswordInputNode.val(),
            sCode: oCodeInputNode.val()
        };
        try {
            Object.keys(stSave).forEach(function (key) {
                if (stSave[key].length === 0) {
                    throw new Error('存在未填项"' + key + '"');
                }
            });
            ologinButtonNode.click();
        } catch (err) {
            return err;
        }
    }

    /**
     * 作用:判别账号类型
     */
    function getUsernameType(str) {
        if (oPhoneRule.test(str)) {
            return 'phone';
        } else if (oEmailRule.test(str)) {
            return 'email';
        } else {
            return 'other';
        }
    }

    /**
     * 作用:添加change事件
     * @param inputNode
     */
    function eventOfInputChange(inputNode) {
        inputNode.on('change', function () {
            inputTest(inputNode);
        })
    }

    /**
     * 作用:添加enter处理
     * @param inputNode
     */
    function eventOfInputEnter(inputNode) {
        // 当前按键码
        var keyCode = null;
        inputNode.on('keyup', function (event) {
            keyCode = event.keyCode;
            if (keyCode === 13) {
                handleOfEnter();
            }
        });
    }

    /**
     * 作用:检测必填项
     * @returns {boolean}
     */
    function submitItemTest() {
        var stSave = {
            username: inputTest(oUsernameInputNode, {isJudge: true}),
            password: inputTest(oPasswordInputNode, {isJudge: true}),
            code: inputTest(oCodeInputNode, {isJudge: true})
        };
        try {
            Object.keys(stSave).forEach(function (key) {
                if (!stSave[key]) {
                    throw new Error('未通过检测');
                }
            });
            return true;
        } catch (err) {
            return false;
        }
    }

    // 同步请求状态
    var synchronizedLinkObj = {
        howNetRquestStatus: false,
        incubatorRequestStatus: false,
        zhzbRequestStatus: false,
        customsRequestStatus: false
    };
    /**
     * 作用:创建登录按钮的工厂函数
     * @returns {Function}
     */
    function createLoginBtnEvent() {
        // 创建闭包防抖变量
        var isLogining = false;
        return function () {
            ologinButtonNode.on('click', function () {
                var account = null,
                    password = null,
                    config = null,
                    layui = null;
                if (isLogining) {
                    return false;
                }
                if (bIsEncryptLoad) {
                    setLayerMsg('资源未加载完成，请稍后操作！');
                    return false;
                }
                if (!submitItemTest()) {
                    return false;
                }
                isLogining = true;
                // 启动loading
                layui = __layer.load(2, {
                    shade: [0.5, '#ffffff']
                });
                account = oUsernameInputNode.val();
                password = oPasswordInputNode.val();
                config = {
                    account: account,
                    password: hex_md5(encrypt(password)),
                    captcha: oCodeInputNode.val(),
                    accountType: getUsernameType(account)
                };
                _ajax.post('default', {
                    url: '/login',
                    contentType: 'application/json',
                    data: JSON.stringify(config),
                    success: function (res) {
                        var data = null;
                        var userInfo = null;
                        // 关闭加载
                        __layer.close(layui);
                        if (res.status === 200) {
                            data = res.data;
                            oOldUrl = data.referer;
                            userInfo = extractUserInfo(data.user);
                            __public.storage.saveToLocalStorage('user', JSON.stringify(userInfo));
                            //第三方平台登录信息
                            getHowNetLink(handlerOfFourLink);
                            getIncubatorLink(handlerOfFourLink);
                            getGgdzhzbLink(handlerOfFourLink);
                            getDataOfCloudPassFunc(handlerOfFourLink);
                        }
                        isLogining = false;
                    },
                    error: function (err) {
                        var data = err.responseJSON;
                        // 关闭加载
                        __layer.close(layui);
                        isLogining = false;
                        dealWithErrorData(data);
                    }
                });
            })
        }
    }

    /**
     * 判定是否为个人中心
     * @returns {boolean}
     */
    function isRouterOfPersonal (url) {
        var data = url.split('?');
        var urlArr = data[0].split('/');
        var modelName = urlArr.pop().split('.')[0];
        return modelName === 'personal';
    }

    /**
     * 提取用户数据
     */
    function extractUserInfo(data) {
        var result = {};
        result.id = data.id;
        result.avatar = (data.headPortrait) ? JSON.parse(data.headPortrait).id : null;
        result.createdAt = data.createdAt;
        result.email = data.email;
        result.phone = data.phone;
        result.userName = data.userName;
        result.type = data.type;
        return result;
    }

    // 四函数处理函数
    function handlerOfFourLink() {
        var modelMark = null;
        var stSave = null;
        var sHash = null;
        // 个人中心路由模块参数正则
        var oPlModelRule = null;
        //等待第三方平台所有请求完成才跳转
        if(synchronizedLinkObj.howNetRquestStatus && synchronizedLinkObj.incubatorRequestStatus && synchronizedLinkObj.zhzbRequestStatus
            && synchronizedLinkObj.customsRequestStatus){
            var layui = __layer.msg('登录成功！即将返回页面',{time:500}, function () {
                __layer.close(layui);
                if (!!oOldUrl) {
                    //localstorage里面获取众包token
                    /*var thirdPlatformInfo = getLocalStorage('thirdPlatformInfo');
                    thirdPlatformInfo.ggdzhzbToken = getUrlParams(thirdPlatformInfo.ggdzhzbUrl,'token');*/
                    // 若旧链接是注册页面，则返回首页
                    if (oOldUrl.indexOf('register') > -1 || oOldUrl.indexOf('login') > -1) {
                        window.location.href = '/home.html';
                    } else {

                        window.location.href = oOldUrl.indexOf('?') > -1 ? oOldUrl+'&token='+_ggdzhzbToken : oOldUrl+'?token='+_ggdzhzbToken;
                        //处理众包链接
                        // if(oOldUrl.indexOf('ggdzhzb') > -1){
                        //     window.location.href = oOldUrl.indexOf('?') > -1 ? oOldUrl+'&token='+_ggdzhzbToken : oOldUrl+'?token='+_ggdzhzbToken;
                        // }else {
                        //     // 若是个人中心,则需要做以下处理
                        //     if (isRouterOfPersonal(oOldUrl)) {
                        //         oPlModelRule = /&?plmodel=[^&]*/;
                        //         // 自带模块参数
                        //         if (oPlModelRule.test(oOldUrl)) {
                        //             oOldUrl = oOldUrl.replace(oPlModelRule, function (str) {
                        //                 stSave = str.replace(/&?plmodel=/, '#');
                        //                 return '';
                        //             });
                        //             oOldUrl += stSave;
                        //             if (oOldUrl.indexOf('?#') > -1) {
                        //                 oOldUrl = oOldUrl.replace('?#', '#');
                        //             }
                        //         } else { // 不带参数
                        //             modelMark = __public.cookie.get('plmodel');
                        //             if (!!modelMark) {
                        //                 stSave = modelMark.replace(/[\s;]/g, '').split('=');
                        //                 sHash = decodeURI(stSave.pop());
                        //                 oOldUrl += '#' + sHash;
                        //                 __public.cookie.set('plmodel', encodeURI(sHash), -1);
                        //             }
                        //         }
                        //     }
                        //     window.location.href = oOldUrl;
                        // }
                    }
                } else {
                    window.location.href = '/home.html';
                }
            });
        }
    }

    // 处理错误信息
    function dealWithErrorData(data) {
        var status = data.status;
        var msg = data.message;
        if (status !== 303) {
            __layer.msg(msg);
        }
        // 账号密码错误
        if (status === 405) {
            setTipShow(oUsernameInputNode, true, msg);
            setTipShow(oPasswordInputNode, true, msg);
        } else if (status === 310) {// 验证码错误
            oCodeInputNode.val('');
            setTipShow(oCodeInputNode, true, msg);
            updateCode();
        } else if (status === 303) {
            updateEncrypt();
            ologinButtonNode.click();
        } else if (status === 305) {
            setTipShow(oUsernameInputNode, true, msg);
        }
    }


    /**
     * 第三方平台相关接口   ajax需要使用同步请求
     */
    var otherWebConfig = {
        cnki: "a9253ac7-1d1c-40b1-b30f-277a4e1b2ae1",
        hatchery: "cf04449b-226e-4571-9b70-51300312c636",
        ggdzhzb: "5af55fde-5138-11e9-b722-6c0b84ab175e",
        iCustoms: "93df4eb6-b614-463f-ba1d-42126bb20f31"
    };
    /**
     * 获取知网连接
     */
    function getHowNetLink(callback) {
        $.ajax({
            url: '/thirdPlatform/getUrl/' + otherWebConfig.cnki,
            type: 'get',
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.status === 200) {
                    var thirdPlatformInfo = getLocalStorage('thirdPlatformInfo') || {};
                    thirdPlatformInfo.howNetUrl = (res.data && res.data.url) ? res.data.url : null;
                    requestHowNetLink(thirdPlatformInfo.howNetUrl);
                    saveToLocalStorage('thirdPlatformInfo',thirdPlatformInfo);
                }
            },
            error: function (err) {
                console.log('知网获取 err:', err);
            },
            complete:function(XMLHttpRequest, textStatus) {
                //请求完成，更新状态
                synchronizedLinkObj.howNetRquestStatus = true;
                if (!!callback) {
                    callback();
                }
            }
        });
    }

    /**
     * 获取孵化器连接
     */
    function getIncubatorLink(callback) {
        $.ajax({
            url:'/thirdPlatform/getUrl/' + otherWebConfig.hatchery,
            type: 'get',
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.status === 200) {
                    var thirdPlatformInfo = getLocalStorage('thirdPlatformInfo') || {};
                    thirdPlatformInfo.incubatorUrl = (res.data && res.data.url) ? res.data.url : null;
                    //不需要，可直接获取孵化器连接后面的token
                    // getIncubationToken();
                    if(thirdPlatformInfo.incubatorUrl){
                        thirdPlatformInfo.incubatorToken = getUrlParams(thirdPlatformInfo.incubatorUrl,'token');
                    }
                    saveToLocalStorage('thirdPlatformInfo',thirdPlatformInfo);
                }
            },
            error: function (err) {
                console.log('孵化器 err:', err);
            },
            complete:function(XMLHttpRequest, textStatus) {
                //请求完成，更新状态
                synchronizedLinkObj.incubatorRequestStatus = true;
                if (!!callback) {
                    callback();
                }
            }
        });
    }
    // 获取运通关链接
    function getDataOfCloudPassFunc(callback) {
        $.ajax({
            url: '/thirdPlatform/getUrl/' + otherWebConfig.iCustoms,
            type: 'get',
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.status === 200) {
                    var thirdPlatformInfo = getLocalStorage('thirdPlatformInfo') || {};
                    thirdPlatformInfo.customsUrl = (res.data && res.data.url) ? res.data.url : null;
                    saveToLocalStorage('thirdPlatformInfo',thirdPlatformInfo);
                }
            },
            error: function (err) {
                console.log('getDataOfCloudPassFunc:', err);
            },
            complete:function(XMLHttpRequest, textStatus) {
                //请求完成，更新状态
                synchronizedLinkObj.customsRequestStatus = true;
                if (!!callback) {
                    callback();
                }
            }
        });
    }

    /**
     * 获取智惠+链接
     */
    function getGgdzhzbLink(callback) {
        $.ajax({
            url:'/thirdPlatform/getUrl/' + otherWebConfig.ggdzhzb,
            type: 'get',
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (res) {
                if (res.status === 200) {
                    var thirdPlatformInfo = getLocalStorage('thirdPlatformInfo') || {};
                    thirdPlatformInfo.ggdzhzbUrl = (res.data && res.data.url) ? res.data.url : null;
                    if(thirdPlatformInfo.ggdzhzbUrl){
                        thirdPlatformInfo.ggdzhzbToken = getUrlParams(thirdPlatformInfo.ggdzhzbUrl,'token');
                        _ggdzhzbToken = thirdPlatformInfo.ggdzhzbToken;
                    }
                    saveToLocalStorage('thirdPlatformInfo',thirdPlatformInfo);

                }
            },
            error: function (err) {
                console.log('智惠+ err:', err);
            },
            complete:function(XMLHttpRequest, textStatus) {
                //请求完成，更新状态
                synchronizedLinkObj.zhzbRequestStatus = true;
                if (!!callback) {
                    callback();
                }
            }
        });
    }
    function requestHowNetLink(url){
        if(url){
            $.ajax({
                url:url,
                type: 'get',
                xhrFields: {
                    withCredentials: true
                },
                async:false,//同步请求
                success: function (res) {

                },
                error: function (err) {
                    console.log('requestHowNetLink err:', err);
                }
            });
        }

    }
    /**
     * 获取孵化器连接token（不需要，直接获取孵化器连接后面的token）
     */
    function getIncubationToken(){
        $.ajax({
            url: '/thirdPlatform/hatchery/getToken',
            contentType: 'application/json',
            type:'GET',
            async:false,//同步请求
            xhrFields:{
                withCredentials:true
            },
            success: function (res) {
                if(res.status === 200){
                    var thirdPlatformInfo = getLocalStorage('thirdPlatformInfo') || {};
                    thirdPlatformInfo.incubatorToken = res.data;
                    saveToLocalStorage('thirdPlatformInfo',thirdPlatformInfo);
                }
            },
            error: function (err) {
                console.error('getIncubationToken:', err);
            }
        });
    }




    // 输入框事件
    function loginInputEvent() {
        usernameInputEvent();
        passwordInputEvent();
        codeInputEvent();
    }

    /* 账号input */

    // 账号input事件
    function usernameInputEvent() {
        eventOfUsernameChange();
        eventOfUsernameKeyUp();
    }

    // 账号change事件
    function eventOfUsernameChange() {
        eventOfInputChange(oUsernameInputNode);
    }

    // 账号keyup事件
    function eventOfUsernameKeyUp() {
        eventOfInputEnter(oUsernameInputNode);
    }

    /* 密码input */

    // 密码input事件
    function passwordInputEvent() {
        eventOfPasswordChange();
        eventOfPasswordKeyUp();
    }

    // 账号change事件
    function eventOfPasswordChange() {
        eventOfInputChange(oPasswordInputNode);
    }

    // 账号keyup事件
    function eventOfPasswordKeyUp() {
        eventOfInputEnter(oPasswordInputNode);
    }

    /* 验证码input */
    // 验证码input事件
    function codeInputEvent() {
        eventOfCodeChange();
        eventOfCodeKeyUp();
    }

    // 验证码change事件
    function eventOfCodeChange() {
        eventOfInputChange(oCodeInputNode);
    }

    // 验证码keyup事件
    function eventOfCodeKeyUp() {
        eventOfInputEnter(oCodeInputNode);
    }

    // 验证码点击事件
    function eventOfCodeImageClick() {
        oCodeImageNode.parent().on('click', handleOfCodeImageUpdate)
    }

    // 验证码更新
    function handleOfCodeImageUpdate() {
        // 获取链接
        var codeLink = oCodeImageNode.attr('src');
        if (codeLink.indexOf('?index=') > -1) {
            codeLink = codeLink.replace(/index=.+$/, 'index=' + new Date().getTime());
        } else {
            codeLink += '?index=' + new Date().getTime();
        }
        oCodeImageNode.attr({
            src: codeLink
        })
    }


    /* 点击登录按钮 */
    function loginBtnClick() {
        (createLoginBtnEvent())();
    }
});
