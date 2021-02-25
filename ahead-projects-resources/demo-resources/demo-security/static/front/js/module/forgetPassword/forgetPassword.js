$(function () {
    var _ajax = new NewAjax();
    // 获取当前模块
    var oNowModel = $('#forget-password');
    // form
    var oContentNode = oNowModel.find('.content-div').eq(0);
    // 英文非法字符正则
    var oIllegalInputENRule = /[`!#$%^&*()+<>?:"{},\/;'\[\]]/im;
    // 密码正则
    var oPasswordRule = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^0-9a-zA-Z])+$)[\x00-\xff_@]{2,}$/;
    // 手机验证码
    var oPhoneRule = /^1(3|4|5|7|8)\d{9}$/;
    // 邮箱正则
    var oEmailRule = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    // 按钮cd秒数
    var nCodeSendCd = 30;
    // 验证回调函数
    var oTestCallbacks = {};
    // 模块名称对应
    var oAttrToModelName = {
        account: '账号',
        code: '验证',
        newPassword: '新密码',
        copyPassword: '确定密码'
    };

    /* 账号 */
    var oAccountInput = oContentNode.find('#account');
    // 父节点
    var oAccountParentNode = oAccountInput.parents('.forget-password-input-model').eq(0);
    // var oAccountCleanNode = oAccountParentNode.find('i.icon-error').eq(0);
    var sAccount = null;
    // 账号是否通过验证
    var bIsAccountPass = false;
    // 验证码提交按钮
    var oCodeSendBtnNode = oAccountParentNode.find('.active-button').eq(0);
    // 是否已发送验证码
    var bIsCodeSend = false;
    // 账号类型
    var sAccountType = null;

    /* 验证码 */
    var oCodeInput = oContentNode.find('#code');
    // 父节点
    var oCodeParentNode = oCodeInput.parents('.forget-password-input-model').eq(0);
    // var oCodeCleanNode = oCodeParentNode.find('i.icon-error').eq(0);
    var sCode = null;
    // 验证码提交按钮
    var oCodeSubmitBtnNode = oCodeParentNode.find('.active-button').eq(0);

    /* 新密码 */
    var oNewPasswordInput = oContentNode.find('#password');
    // var oNewPasswordCleanNode = oNewPasswordInput.parent().find('i.icon-error').eq(0);
    var sNewPassword = null;

    /* 确认密码 */
    var oCopyPasswordInput = oContentNode.find('#copy-password');
    // var oCopyPasswordCleanNode = oCopyPasswordInput.parent().find('i.icon-error').eq(0);
    var sCopyPassword = null;

    /* 按钮 */
    // 按钮模块
    var oBtnDivNode = oContentNode.find('.forget-password-button-model').eq(0);
    // 提交按钮
    var oSubmitBtn = oBtnDivNode.find('.active-button[type="submit"]').eq(0);
    // 重置按钮
    var oResetBtn = oBtnDivNode.find('.active-button[type="reset"]').eq(0);

    setTestCallback();
    allEvent();
    initMainContent();
    updateEncrypt();

    /* 工具函数 */
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
            if (oIllegalInputENRule.test(value)) {
                setTipShow(inputNode, true, '您输入的内容存在非法字符');
                return 0;
            } else if (callback) {
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
     */
    function eventOfInput(inputNode, config) {
        var eventType = (config && config.eventType) ? config.eventType : 'change';
        var isJudge = (config && config.isJudge) ? config.isJudge : false;
        var testCallback = (config && config.testCallback) ? config.testCallback : undefined;
        var callback = (config && config.callback) ? config.callback : undefined;
        var stSave = null;
        inputNode.on(eventType, function () {
            stSave = inputTest(inputNode, {
                isJudge: isJudge,
                callback: testCallback
            });
            if (callback) {
                callback(stSave);
            }
        })
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
     * 作用:检测必填项
     * @returns {boolean}
     */
    function submitItemTest() {
        var aKeys = null;
        var errKey = null;
        var index = null;
        var stSave = {
            account: inputTest(oAccountInput,oTestCallbacks.account),
            code: inputTest(oCodeInput, oTestCallbacks.code),
            newPassword: inputTest(oNewPasswordInput, oTestCallbacks.newPassword),
            copyPassword: inputTest(oCopyPasswordInput, oTestCallbacks.copyPassword)
        };
        aKeys = Object.keys(stSave);
        for (index in aKeys){
            if (!isNaN(index) && !stSave[aKeys[index]]){
                errKey = aKeys[index];
                break;
            }
        }
        if (!!errKey){
            setLayerMsg(oAttrToModelName[errKey] +  '模块错误，请改正！');
            return false;
        } else {
            return true;
        }
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
     * 初始化加密文件
     * ps：索引过期调用
     */
    function updateEncrypt() {
        // 获取script节点
        var oScriptNode = $('#encrypt');
        // 获取父级节点
        var oParentNode = oScriptNode.parent();
        oScriptNode.remove();
        oScriptNode.attr({
            src: _ajax.getDomain('security') + '/encrypt/javascript?timestamp=' + new Date().getTime()
        });
        oParentNode.append(oScriptNode);
    }

    /**
     * 作用:手机验证码按钮事件工厂函数
     * @returns {Function}:验证码按钮事件函数
     */
    function createPhoneCodeBtnClickEvent() {
        var isCodeSending = false;
        // 当前url
        var sNowUrl = null;
        // 当前输入结果
        var sNowAccount = null;
        var layui = null;
        return function () {
            oCodeSendBtnNode.on('click', function () {
                var stSave = null;
                if (bIsAccountPass) {
                    setLayerMsg('该号码已通过检验');
                    return false;
                }
                if (isCodeSending) {
                    setLayerMsg('发送冷却中，请勿重复操作');
                    return 0;
                }
                stSave = inputTest(oAccountInput, oTestCallbacks.account);
                if (!stSave) {
                    return false;
                }
                sNowAccount = oAccountInput.val();
                if (oPhoneRule.test(sNowAccount)) {
                    sAccountType = 'phone';
                    sNowUrl = '/message/pc/' + sNowAccount + '/send_sms';
                    setTipShow(oAccountInput, false);
                } else if (oEmailRule.test(sNowAccount)) {
                    sAccountType = 'email';
                    sNowUrl = '/message/pc/' + sNowAccount + '/send_mail';
                    setTipShow(oAccountInput, false);
                }
                setLayerMsg('发送验证码');
                layui = __layer.load(2, {shade: [0.5, '#ffffff']});
                _ajax.post('message', {
                    url: sNowUrl,
                    contentType: 'application/json',
                    data: '{}',
                    success: function (res) {
                        isCodeSending = true;
                        if (res.status === 200) {
                            setLayerMsg('发送验证码成功');
                            bIsCodeSend = true;
                            handleOfButtonRecoveryCd(oCodeSendBtnNode, function () {
                                isCodeSending = false;
                            });
                        }
                    },
                    error: function (err) {
                        var data = err.responseJSON;
                        setLayerMsg(data.message);
                        console.error('codeSend:', data);
                        isCodeSending = false;
                        bIsCodeSend = false;
                    }
                });
            });
        }
    }

    /**
     * 作用:按钮读秒
     * @param oBtnNode:按钮节点
     * @param callback:读秒结束后执行的回调函数
     */
    function handleOfButtonRecoveryCd(oBtnNode, callback) {
        var timer = null;
        var index = nCodeSendCd;
        oBtnNode.css({
            cursor: 'not-allowed',
            color: '#a0a0a0',
            background: '#e5e5e5'
        }).text(index);
        timer = setInterval(function () {
            if (index > 1) {
                oBtnNode.text(--index);
            } else {
                oBtnNode.removeAttr('style').text('发送验证');
                if (callback) {
                    callback();
                }
                clearInterval(timer);
            }
        }, 1000)
    }

    /**
     * 作用: 密码，确认密码关联验证
     * @returns {boolean}
     */
    function passwordCopyVerification() {
        console.log('密码校验');
        // 获取密码
        var sPassword = oNewPasswordInput.val();
        // 获取副本密码
        var sPasswordCopy = oCopyPasswordInput.val();
        if (sPassword !== sPasswordCopy) {
            setTipShow(oCopyPasswordInput, true, '确认密码与密码不一致');
            return false;
        } else {
            setTipShow(oCopyPasswordInput, false);
            return true;
        }
    }

    /**
     * 作用：获取config
     * @param attrName
     * @param eventCallback
     * @returns {{isJudge: undefined, testCallback: undefined, callback: *}}
     */
    function getEventConfig(attrName, eventCallback) {
        var stSave = oTestCallbacks[attrName];
        return {
            isJudge: (stSave && stSave.isJudge) ? stSave.isJudge : undefined,
            testCallback: (stSave && stSave.callback) ? stSave.callback: undefined,
            callback: eventCallback
        };
    }

    /**
     * 处理错误信息
     * @param data
     */
    function dealWithErrorData(data) {
        var status = data.status;
        var message = data.message;
        if (status !== 303) {
            setLayerMsg(message);
        }
        // 加密索引过期
        if (status === 303) {
            updateEncrypt();
            oSubmitBtn.click();
        } else if (status === 305) {
            setTipShow(oAccountInput, true, message);
            bIsAccountPass = false;
        } else if (status === 800) {
            setTipShow(oCodeInput, true, '验证码错误');
        }
    }

    /* 主体函数 */
    // 初始化
    function initMainContent() {
        initAccount();
        initCode();
        initNewPassword();
        initCopyPassword();
        initInputMark();
    }
    // 初始化账号
    function initAccount() {
        initNormalInput(oAccountInput);
        oAccountInput.prop({
            disabled: false
        });
        if (oAccountParentNode.hasClass('disabled')) {
            oAccountParentNode.removeClass('disabled');
        }
        sAccount = null;
        bIsAccountPass = false;
    }
    // 初始化验证码
    function initCode() {
        initNormalInput(oCodeInput);
        oCodeInput.prop({
            disabled: false
        });
        if (oCodeParentNode.hasClass('disabled')) {
            oCodeParentNode.removeClass('disabled');
        }
        sCode = null;
    }
    // 初始化新密码
    function initNewPassword() {
        initNormalInput(oNewPasswordInput);
        sNewPassword = null;
    }
    // 初始化确认密码
    function initCopyPassword() {
        initNormalInput(oCopyPasswordInput);
        sCopyPassword = null;
    }
    // 初始化输入框标记
    function initInputMark() {
        oAccountInput.data('name', '账号');
        oCodeInput.data('name', '验证码');
        oNewPasswordInput.data('name', '新密码');
        oCopyPasswordInput.data('name', '确定密码');
    }
    // 设置验证回调函数
    function setTestCallback() {
        oTestCallbacks = {
            account: {
                isJudge: true,
                callback: function () {
                    var value = oAccountInput.val();
                    if (oPhoneRule.test(value) || oEmailRule.test(value)) {
                        setTipShow(oAccountInput, false);
                        return true;
                    } else {
                        setTipShow(oAccountInput, true, '请您输入正确的手机号/邮箱');
                        return false;
                    }
                }
            },
            code: {
                isJudge: true
            },
            newPassword:{
                isJudge: true,
                callback: function () {
                    var value = oNewPasswordInput.val();
                    var sCopyPassword = null;
                    if (oPasswordRule.test(value)) {
                        if (value.length < 6 || value.length > 18) {
                            setTipShow(oNewPasswordInput, true, '密码长度需在6-18个字符之间');
                            return false;
                        } else {
                            sCopyPassword = oCopyPasswordInput.val();
                            if (sCopyPassword.length > 0) {
                                return passwordCopyVerification();
                            } else {
                                setTipShow(oNewPasswordInput, false);
                                return true;
                            }
                        }
                    } else {
                        setTipShow(oNewPasswordInput, true, '密码由6-18位字母、数字和符号组成');
                        return false;
                    }
                }
            },
            copyPassword: {
                isJudge: true,
                callback: function () {
                    var value = oCopyPasswordInput.val();
                    if (sNewPassword && value !== sNewPassword) {
                        return passwordCopyVerification();
                    } else {
                        setTipShow(oCopyPasswordInput, false);
                        return true;
                    }
                }
            }
        };
    }

    // 事件
    function allEvent() {
        accountEvent();
        codeSendBtnEvent();
        codeEvent();
        codeSubmitBtnEvent();
        newPasswordEvent();
        copyPasswordEvent();
        submitEvent();
        resetEvent();
    }
    // 账号事件
    function accountEvent() {
        var config = getEventConfig('account', function (res) {
            if (res) {
                sAccount = oAccountInput.val();
            }
        });
        eventOfInput(oAccountInput, config);
    }
    // 验证码发送按钮事件
    function codeSendBtnEvent() {
        (createPhoneCodeBtnClickEvent())();
    }

    // 验证码事件
    function codeEvent() {
        var config = getEventConfig('code', function (res) {
            if (res) {
                sCode = oCodeInput.val();
            }
        });
        eventOfInput(oCodeInput,config);
    }
    // 验证码提交按钮事件
    function codeSubmitBtnEvent() {
        var bIsCodeSubmitting = false;
        // 当前输入结果
        var sNowAccount = null;
        var layui = null;
        oCodeSubmitBtnNode.on('click', function () {
            var config = null;
            var oTest = null;
            var stSave = null;
            if (bIsAccountPass) {
                setLayerMsg('账号已通过检验');
                return false;
            }
            if (!bIsCodeSend) {
                setLayerMsg('验证码未发送');
                return false;
            }
            if (bIsCodeSubmitting) {
                setLayerMsg('账号检验中，请勿重复操作');
                return false;
            }
            stSave = true;
            oTest = {
                account: inputTest(oAccountInput, oTestCallbacks.account),
                code: inputTest(oCodeInput, oTestCallbacks.code)
            };
            $.each(Object.keys(oTest), function (index, key) {
                if (oTest.hasOwnProperty(key) && !oTest[key]) {
                    stSave = false;
                    return false;
                }
            });
            // 没通过验证
            if (!stSave) {
                return false;
            }
            sNowAccount = oAccountInput.val();
            if (oPhoneRule.test(sNowAccount)) {
                sAccountType = 'phone';
            } else if (oEmailRule.test(sNowAccount)) {
                sAccountType = 'email';
            }
            config = {
                account: oAccountInput.val(),
                randCode: oCodeInput.val(),
                accountType: sAccountType
            };
            bIsCodeSubmitting = true;
            setLayerMsg('账号提交检验');
            layui = __layer.load(2, {shade: [0.5, '#ffffff']});
            _ajax.post('default', {
                url: '/forgot_password/verify_account',
                contentType: 'application/json',
                data: JSON.stringify(config),
                success: function (res) {
                    bIsCodeSubmitting = false;
                    if (res.status === 200) {
                        setLayerMsg('账号通过检验');
                        // 保证记录正确的验证码
                        sCode = oCodeInput.val();
                        bIsAccountPass = true;
                        oAccountInput.prop({
                            disabled: true
                        });
                        if (!oAccountParentNode.hasClass('disabled')) {
                            oAccountParentNode.addClass('disabled');
                        }
                        oCodeInput.prop({
                            disabled: true
                        });
                        if (!oCodeParentNode.hasClass('disabled')) {
                            oCodeParentNode.addClass('disabled');
                        }
                    }
                },
                error: function (err) {
                    var data = err.responseJSON;
                    __layer.close(layui);
                    bIsCodeSubmitting = false;
                    bIsAccountPass = false;
                    dealWithErrorData(data);
                    console.error('phoneCodeBtnEvent:', err);
                }
            });
        });
    }

    // 新密码事件
    function newPasswordEvent() {
        var config = getEventConfig('newPassword', function (res) {
            if (res) {
                sNewPassword = oNewPasswordInput.val();
            }
        });
        eventOfInput(oNewPasswordInput,config);
    }
    // 确认密码事件
    function copyPasswordEvent() {
        var config = getEventConfig('copyPassword', function (res) {
            if (res) {
                sCopyPassword = oNewPasswordInput.val();
            }
        });
        eventOfInput(oCopyPasswordInput, config);
    }
    // 提交事件
    function submitEvent() {
        eventOfSubmitBtnClick();
    }
    // 提交按钮点击事件
    function eventOfSubmitBtnClick() {
        oSubmitBtn.on('click', createSubmitHandler());
    }
    // 提交工厂函数
    function createSubmitHandler() {
        var isSubmit = false;
        return function () {
            var config = null;
            var layui = null;
            var stSave = null;
            var sAccountValue = null;
            if (isSubmit) {
                return false;
            }
            if (!submitItemTest()) {
                return false;
            }
            sAccountValue = oAccountInput.val();
            if (oPhoneRule.test(sAccountValue)) {
                sAccountType = 'phone';
            } else if (oEmailRule.test(sAccountValue)) {
                sAccountType = 'email';
            }
            isSubmit = true;
            config = {
                account: sAccountValue,
                password: encrypt(oNewPasswordInput.val()),
                randCode: oCodeInput.val(),
                accountType: sAccountType
            };
            layui = __layer.load(2, {shade: [0.5, '#ffffff']});
            _ajax.post('default', {
                url: '/forgot_password/reset_password',
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                data: JSON.stringify(config),
                success: function (res) {
                    isSubmit = false;
                    __layer.close(layui);
                    if (res.status === 200) {
                        // 初始化表单
                        initMainContent();
                        layui = __layer.msg('设置新密码成功', {
                            time: 1500
                        }, function () {
                            __layer.close(layui);
                            layui = __layer.confirm('修改密码成功，是否跳转到登录页面？',function (index) {
                                __layer.close(index);
                                window.location.href = '/login.html';
                            }, function (index) {
                                __layer.close(index);
                            })
                        });

                    }
                },
                error: function (err) {
                    var data = err.responseJSON;
                    __layer.close(layui);
                    isSubmit = false;
                    dealWithErrorData(data);
                    console.error('eventOfSubmitBtnClick:', data);
                }
            })
        }
    }
    // 重置事件
    function resetEvent() {
        oResetBtn.on('click', initMainContent);
    }
});