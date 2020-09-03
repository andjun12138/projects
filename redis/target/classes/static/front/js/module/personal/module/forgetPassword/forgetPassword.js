$(function () {
    var personalMainObj = window._personal_main_;

    var FuncOfModelCommon = personalMainObj._model_common_;

    function ForgetPassword() {
        var _this = this;
        var _ajax = new NewAjax();
        // 获取当前模块
        var oNowModel = $('#forget-password');
        // form
        var oFormNode = oNowModel.find('.forget-password-form').eq(0);
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

        /* 账号 */
        var oAccountInput = oFormNode.find('.account-input').eq(0);
        // 父节点
        var oAccountParentNode = oAccountInput.parents('.form-group').eq(0);
        var oAccountCleanNode = oAccountParentNode.find('i.icon-error').eq(0);
        var sAccount = null;
        // 账号是否通过验证
        var bIsAccountPass = false;
        // 验证码提交按钮
        var oCodeSendBtnNode = oAccountParentNode.find('.code-btn').eq(0);
        // 是否已发送验证码
        var bIsCodeSend = false;
        // 账号类型
        var sAccountType = null;

        /* 验证码 */
        var oCodeInput = oFormNode.find('.code-input').eq(0);
        // 父节点
        var oCodeParentNode = oCodeInput.parents('.form-group').eq(0);
        var oCodeCleanNode = oCodeParentNode.find('i.icon-error').eq(0);
        var sCode = null;
        // 验证码提交按钮
        var oCodeSubmitBtnNode = oCodeParentNode.find('.code-btn').eq(0);

        /* 新密码 */
        var oNewPasswordInput = oFormNode.find('.new-password-input');
        var oNewPasswordCleanNode = oNewPasswordInput.parent().find('i.icon-error').eq(0);
        var sNewPassword = null;

        /* 确认密码 */
        var oCopyPasswordInput = oFormNode.find('.copy-password-input');
        var oCopyPasswordCleanNode = oCopyPasswordInput.parent().find('i.icon-error').eq(0);
        var sCopyPassword = null;

        /* 按钮 */
        // 提交按钮
        var oSubmitBtn = oFormNode.find('.form-active-btn[name="form-submit"]').eq(0);
        // 重置按钮
        var oResetBtn = oFormNode.find('.form-active-btn[name="form-reset"]').eq(0);

        initForm();
        updateEncrypt();
        allEvent();

        /**
         * 外部调用：初始化表单
         */
        _this.init = function () {
            initForm();
        };

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
         * 作用:检测必填项
         * @returns {boolean}
         */
        function submitItemTest() {
            var stSave = {
                account: inputTest(oAccountInput,{
                    isJudge: true,
                    callback: function () {
                        if (bIsAccountPass) {
                            setTipShow(oAccountInput, false);
                            return true;
                        } else {
                            setTipShow(oAccountInput, true, '账号未通过检验');
                            return true;
                        }
                    }
                }),
                newPassword: inputTest(oNewPasswordInput, {
                    isJudge: isRequired(oNewPasswordInput),
                    callback: function () {
                        var value = oNewPasswordInput.val();
                        var sCopyPassword = null;
                        if (value && value.length > 0) {
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
                        } else {
                            setTipShow(oNewPasswordInput, true, '密码不能为空');
                            return false;
                        }
                    }
                }),
                copyPassword: inputTest(oCopyPasswordInput, {
                    isJudge: isRequired(oCopyPasswordInput),
                    callback: function () {
                        var value = oCopyPasswordInput.val();
                        if (sNewPassword && value !== sNewPassword) {
                            return passwordCopyVerification();
                        } else {
                            setTipShow(oCopyPasswordInput, false);
                            return true;
                        }
                    }
                })
            };
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
        // 是否必填
        function isRequired(node) {
            var oTrueNode = (node.hasClass('form-group')) ? node : node.parents('.form-group').eq(0);
            var sNowType = oTrueNode.attr('type');
            return (sNowType === 'required');
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
            personalMainObj.initEncrypt();
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
                        return false;
                    }
                    if (isCodeSending) {
                        __layer.closeAll();
                        __layer.msg('发送冷却中，请勿重复操作');
                        return 0;
                    }
                    isCodeSending = true;
                    sNowAccount = oAccountInput.val();
                    if (sNowAccount.length > 0) {
                        if (oPhoneRule.test(sNowAccount)) {
                            sAccountType = 'phone';
                            sNowUrl = '/message/pc/' + sNowAccount + '/send_sms';
                            setTipShow(oAccountInput, false);
                        } else if (oEmailRule.test(sNowAccount)) {
                            sAccountType = 'email';
                            sNowUrl = '/message/pc/' + sNowAccount + '/send_mail';
                            setTipShow(oAccountInput, false);
                        } else {
                            setTipShow(oAccountInput, true, '请您输入正确的手机号/邮箱');
                            return false;
                        }
                    } else {
                        setTipShow(oAccountInput, true, '账号不能为空');
                        return false;
                    }
                    __layer.msg('发送验证码');
                    layui = __layer.load(2, {shade: [0.5, '#ffffff']});
                    _ajax.post('message', {
                        url: sNowUrl,
                        contentType: 'application/json',
                        data: '{}',
                        success: function (res) {
                            if (res.status === 200) {
                                __layer.close(layui);
                                __layer.msg('发送验证码成功');
                                bIsCodeSend = true;
                                handleOfButtonRecoveryCd(oCodeSendBtnNode, function () {
                                    isCodeSending = false;
                                });
                                if (oCodeParentNode.is(':hidden')) {
                                    // 开启验证码提交模块
                                    oCodeParentNode.show();
                                }
                            }
                        },
                        error: function (err) {
                            var data = err.responseJSON;
                            __layer.close(layui);
                            __layer.msg(data.message);
                            console.error('codeSend:', data);
                            isCodeSending = false;
                            bIsCodeSend = false;
                            if (oCodeParentNode.is(':visible')) {
                                // 开启验证码提交模块
                                oCodeParentNode.hide();
                            }
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

        /* 主体函数 */
        // 初始化
        function initForm() {
            initAccount();
            initCode();
            initNewPassword();
            initCopyPassword();
        }
        // 初始化账号
        function initAccount() {
            initNormalInput(oAccountInput);
            oAccountInput.prop({
                disabled: false
            });
            sAccount = null;
            bIsAccountPass = false;
        }
        // 初始化验证码
        function initCode() {
            initNormalInput(oCodeInput);
            oCodeInput.prop({
                disabled: false
            });
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

        // 事件
        function allEvent() {
            cleanClick();
            accountEvent();
            codeSendBtnEvent();
            codeEvent();
            codeSubmitBtnEvent();
            newPasswordEvent();
            copyPasswordEvent();
            submitEvent();
            resetEvent();
        }
        // x 点击事件
        function cleanClick() {
            var oNowNode = null;
            var oNowInput = null;
            var oParentNode = null;
            oFormNode.on('click', 'i.icon-error', function () {
                oNowNode = $(this);
                if (!oNowNode.hasClass('show')) {
                    return false;
                }
                oParentNode = oNowNode.parent();
                if (!(bIsAccountPass && (oParentNode.hasClass('account') || oParentNode.hasClass('code')))) {
                    oNowInput = oNowNode.parent().find('input').eq(0);
                    oNowInput.val('');
                    setTipShow(oNowInput, false);
                    oNowNode.removeClass('show');
                }
            })
        }
        // 账号事件
        function accountEvent() {
            eventOfInput(oAccountInput,{
                testCallback: function(){
                    var value = oAccountInput.val();
                    if (oPhoneRule.test(value) || oEmailRule.test(value)) {
                        setTipShow(oAccountInput, false);
                        return true;
                    } else {
                        setTipShow(oAccountInput, true, '请您输入正确的手机号/邮箱');
                        return false;
                    }
                },
                callback: function (res) {
                    if (res) {
                        sAccount = oAccountInput.val();
                    }
                }
            });
            eventOfInput(oAccountInput,{
                eventType: 'input',
                callback: function () {
                    var value = oAccountInput.val();
                    if (value.length > 0) {
                        if (!oAccountCleanNode.hasClass('show')) {
                            oAccountCleanNode.addClass('show')
                        }
                    } else {
                        if (oAccountCleanNode.hasClass('show')) {
                            oAccountCleanNode.removeClass('show');
                        }
                    }
                }
            });
        }
        // 验证码发送按钮事件
        function codeSendBtnEvent() {
            (createPhoneCodeBtnClickEvent())();
        }
        
        // 验证码事件
        function codeEvent() {
            eventOfInput(oCodeInput,{
                callback: function (res) {
                    if (res) {
                        sCode = oCodeInput.val();
                    }
                }
            });
            eventOfInput(oCodeInput,{
                eventType: 'input',
                callback: function () {
                    var value = oCodeInput.val();
                    if (value.length > 0) {
                        if (!oCodeCleanNode.hasClass('show')) {
                            oCodeCleanNode.addClass('show')
                        }
                    } else {
                        if (oCodeCleanNode.hasClass('show')) {
                            oCodeCleanNode.removeClass('show')
                        }
                    }
                }
            });
        }
        // 验证码提交按钮事件
        function codeSubmitBtnEvent() {
            var bIsCodeSubmitting = false;
            // 当前输入结果
            var sNowAccount = null;
            var layui = null;
            oCodeSubmitBtnNode.on('click', function () {
                var config = null;
                if (bIsAccountPass) {
                    __layer.closeAll();
                    __layer.msg('账号已通过检验');
                    return false;
                }
                if (!bIsCodeSend) {
                    __layer.closeAll();
                    __layer.msg('验证码未发送');
                    return false;
                }
                if (!bIsCodeSubmitting) {
                    __layer.closeAll();
                    __layer.msg('账号检验中，请勿重复操作');
                    return false;
                }
                bIsCodeSubmitting = true;
                sNowAccount = oAccountInput.val();
                if (sNowAccount.length > 0) {
                    if (oPhoneRule.test(sNowAccount)) {
                        sAccountType = 'phone';
                        setTipShow(oAccountInput, false);
                    } else if (oEmailRule.test(sNowAccount)) {
                        sAccountType = 'email';
                        setTipShow(oAccountInput, false);
                    } else {
                        setTipShow(oAccountInput, true, '请您输入正确的手机号/邮箱');
                        return false;
                    }
                } else {
                    setTipShow(oAccountInput, true, '账号不能空');
                    return false;
                }
                if (!inputTest(oCodeInput, {isJudge: true})) {
                    return false;
                }
                config = {
                    account: oAccountInput.val(),
                    randCode: oCodeInput.val(),
                    accountType: sAccountType
                };
                __layer.msg('账号提交检验');
                layui = __layer.load(2, {shade: [0.5, '#ffffff']});
                _ajax.post('default', {
                    url: '/forgot_password/verify_account',
                    contentType: 'application/json',
                    data: JSON.stringify(config),
                    success: function (res) {
                        bIsCodeSubmitting = false;
                        if (res.status === 200) {
                            __layer.close(layui);
                            __layer.msg('账号通过检验');
                            // 保证记录正确的验证码
                            sCode = oCodeInput.val();
                            bIsAccountPass = true;
                            if (oCodeParentNode.is(':hidden')) {
                                // 开启验证码提交模块
                                oCodeParentNode.hide();
                            }
                            oAccountInput.prop({
                                disabled: true
                            });
                            oCodeInput.prop({
                                disabled: true
                            })
                        }
                    },
                    error: function (err) {
                        var data = err.responseJSON;
                        __layer.close(layui);
                        __layer.msg(data.message);
                        console.error('phoneCodeBtnEvent:', err);
                        bIsCodeSubmitting = false;
                        bIsAccountPass = false;
                    }
                });
            });
        }
        
        // 新密码事件
        function newPasswordEvent() {
            eventOfInput(oNewPasswordInput,{
                testCallback: function () {
                    var value = oNewPasswordInput.val();
                    var sCopyPassword = null;
                    if (value && value.length > 0) {
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
                    } else {
                        setTipShow(oNewPasswordInput, true, '密码不能为空');
                        return false;
                    }
                },
                callback: function (res) {
                    if (res) {
                        sNewPassword = oNewPasswordInput.val();
                    }
                }
            });
            eventOfInput(oNewPasswordInput,{
                eventType: 'input',
                callback: function () {
                    var value = oNewPasswordInput.val();
                    if (value.length > 0) {
                        if (!oNewPasswordCleanNode.hasClass('show')) {
                            oNewPasswordCleanNode.addClass('show');
                        }
                    } else {
                        if (oNewPasswordCleanNode.hasClass('show')) {
                            oNewPasswordCleanNode.removeClass('show');
                        }
                    }
                }
            });
        }
        // 确认密码事件
        function copyPasswordEvent() {
            eventOfInput(oCopyPasswordInput,{
                testCallback: function () {
                    var value = oCopyPasswordInput.val();
                    if (sNewPassword && value !== sNewPassword) {
                        return passwordCopyVerification();
                    } else {
                        setTipShow(oCopyPasswordInput, false);
                        return true;
                    }
                },
                callback: function (res) {
                    if (res) {
                        sCopyPassword = oCopyPasswordInput.val();
                    }
                }
            });
            eventOfInput(oCopyPasswordInput,{
                eventType: 'input',
                callback: function () {
                    var value = oCopyPasswordInput.val();
                    if (value.length > 0) {
                        if (!oCopyPasswordCleanNode.hasClass('show')) {
                            oCopyPasswordCleanNode.addClass('show');
                        }
                    } else {
                        if (oCopyPasswordCleanNode.hasClass('show')) {
                            oCopyPasswordCleanNode.removeClass('show');
                        }
                    }
                }
            });
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
                if (isSubmit) {
                    return 0;
                }
                if (!submitItemTest()) {
                    __layer.msg('请先改正错误');
                    return 0;
                }
                isSubmit = true;
                config = {
                    account: oAccountInput.val(),
                    password: oNewPasswordInput.val(),
                    randCode: sCode,
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
                            __layer.msg('设置新密码成功');
                            // 初始化表单
                            initForm();
                        }
                    },
                    error: function (err) {
                        console.log(err);
                        isSubmit = false;
                        __layer.close(layui);
                    }
                })
            }
        }
        // 重置事件
        function resetEvent() {
            oResetBtn.on('click', initForm);
        }
    }

    ForgetPassword.prototype = new FuncOfModelCommon();

    FuncOfModelCommon = null;

    personalMainObj.setMethodObj('forgetPassword', new ForgetPassword());
});