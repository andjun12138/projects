$(function () {
    var personalMainObj = window._personal_main_;

    var FuncOfModelCommon = personalMainObj._model_common_;


    function PersonalResetPassword() {
        var _this = this;
        var _ajax = new NewAjax();
        // 获取当前模块
        var oNowModel = $('#reset-password');
        // form
        var oFormNode = oNowModel.find('.reset-password-form').eq(0);
        // 英文非法字符正则
        var oIllegalInputENRule = /[`!#$%^&*()+<>?:"{},\/;'\[\]]/im;

        /* 旧密码 */
        var oOldPasswordInput = oFormNode.find('.old-password-input').eq(0);
        var oOldPasswordCleanNode = oOldPasswordInput.parents('.form-group').eq(0).find('i.icon-error').eq(0);
        var sOldPassword = null;

        /* 新密码 */
        var oNewPasswordInput = oFormNode.find('.new-password-input').eq(0);
        var oNewPasswordCleanNode = oNewPasswordInput.parents('.form-group').eq(0).find('i.icon-error').eq(0);
        var sNewPassword = null;

        /* 确认密码 */
        var oCopyPasswordInput = oFormNode.find('.copy-password-input').eq(0);
        var oCopyPasswordCleanNode = oCopyPasswordInput.parents('.form-group').eq(0).find('i.icon-error').eq(0);
        var sCopyPassword = null;

        /* 忘记密码 */
        var oForgetPasswordNode = oFormNode.find('.forget-password').eq(0);

        /* 按钮 */
        // 提交按钮
        var oSubmitBtn = oFormNode.find('.reset-password-submit').eq(0);
        // 重置按钮
        var oResetBtn = oFormNode.find('.reset-password-reset').eq(0);

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
                oldPassword: inputTest(oOldPasswordInput,{isJudge: isRequired(oOldPasswordInput)}),
                newPassword: inputTest(oNewPasswordInput, {
                    isJudge: isRequired(oNewPasswordInput),
                    callback: function () {
                        var value = oNewPasswordInput.val();
                        if (sCopyPassword && value !== sCopyPassword) {
                            setTipShow(oCopyPasswordInput, true, '两次输入的密码不一致');
                            return false;
                        } else {
                            setTipShow(oCopyPasswordInput, false);
                            return true;
                        }
                    }
                }),
                copyPassword: inputTest(oCopyPasswordInput, {
                    isJudge: isRequired(oCopyPasswordInput),
                    callback: function () {
                        var value = oCopyPasswordInput.val();
                        if (sNewPassword && value !== sNewPassword) {
                            setTipShow(oCopyPasswordInput, true, '两次输入的密码不一致');
                            return false;
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

        /* 主体函数 */
        // 初始化
        function initForm() {
            initOldPassword();
            initNewPassword();
            initCopyPassword();
        }
        // 初始化旧密码
        function initOldPassword() {
            initNormalInput(oOldPasswordInput);
            sOldPassword = null;
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
            oldPasswordEvent();
            newPasswordEvent();
            copyPasswordEvent();
            forgetPasswordEvent();
            submitEvent();
            resetEvent();
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
        // 旧密码事件
        function oldPasswordEvent() {
            eventOfInput(oOldPasswordInput,{
                callback: function (res) {
                    if (res) {
                        sOldPassword = oOldPasswordInput.val();
                    }
                }
            });
            eventOfInput(oOldPasswordInput,{
                eventType: 'input',
                callback: function () {
                    var value = oOldPasswordInput.val();
                    if (value.length > 0) {
                        if (!oOldPasswordCleanNode.hasClass('show')) {
                            oOldPasswordCleanNode.addClass('show');
                        }
                    } else {
                        if (oOldPasswordCleanNode.hasClass('show')) {
                            oOldPasswordCleanNode.removeClass('show');
                        }
                    }
                }
            });
        }
        // 新密码事件
        function newPasswordEvent() {
            eventOfInput(oNewPasswordInput,{
                testCallback: function () {
                    var value = oNewPasswordInput.val();
                    if (sCopyPassword && value !== sCopyPassword) {
                        setTipShow(oCopyPasswordInput, true, '两次输入的密码不一致');
                        return false;
                    } else {
                        setTipShow(oCopyPasswordInput, false);
                        return true;
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
                        setTipShow(oCopyPasswordInput, true, '两次输入的密码不一致');
                        return false;
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
        // 忘记密码事件
        function forgetPasswordEvent() {
            oForgetPasswordNode.on('click', function () {
                personalMainObj.devTip();
                return false;
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
                    oldPassword: hex_md5(encrypt(sOldPassword)),
                    newPassword: encrypt(sNewPassword)
                };
                layui = __layer.load(2, {shade: [0.5, '#ffffff']});
                _ajax.post('default', {
                    url: '/frontUser/updatePasswordByOld',
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    data: JSON.stringify(config),
                    success: function (res) {
                        isSubmit = false;
                        __layer.close(layui);
                        if (res.status === 200) {
                            __layer.msg('修改密码成功');
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

    PersonalResetPassword.prototype = new FuncOfModelCommon();

    FuncOfModelCommon = null;

    personalMainObj.setMethodObj('resetPassword', new PersonalResetPassword());

});