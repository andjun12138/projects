$(function () {
    var personalMainObj = window._personal_main_;
    var FuncOfModelCommon = personalMainObj._model_common_;


    function BindPhone() {
        var _this = this;
        var _ajax = new NewAjax();
        // 获取当前模块
        var oNowModel = $('#bind-phone');
        // form
        var oFormNode = oNowModel.find('.bind-phone-form').eq(0);
        // 英文非法字符正则
        var oIllegalInputENRule = /[`!#$%^&*()+<>?:"{},\/;'\[\]]/im;
        // 手机验证码
        var oPhoneRule = /^1(3|4|5|7|8)\d{9}$/;
        // 按钮cd秒数
        var nCodeSendCd = 30;
        // 是否存在手机
        var bIsHavePhone = false;
        // 手机号
        var sUserPhone = null;

        /* 手机号 */
        var oPhoneInput = oFormNode.find('.phone-input').eq(0);
        // 父节点
        var oPhoneParentNode = oPhoneInput.parents('.form-group').eq(0);
        var oPhoneCleanNode = oPhoneParentNode.find('i.icon-error').eq(0);
        // 账号是否通过验证
        var bIsPhonePass = false;
        // 重新绑定按钮
        var oReBindBtnNode = oPhoneParentNode.find('.rebind-btn').eq(0);

        /* 验证码 */
        var oCodeInput = oFormNode.find('.code-input').eq(0);
        // 父节点
        var oCodeParentNode = oCodeInput.parents('.form-group').eq(0);
        var oCodeCleanNode = oCodeParentNode.find('i.icon-error').eq(0);
        var sCode = null;
        // 验证发送按钮
        var oCodeSendBtnNode = oCodeParentNode.find('.code-send-btn').eq(0);

        /* 表单按钮 */
        // 表单按钮模块
        var oFormBtnModel = oFormNode.find('.btn-group').eq(0);
        // 验证码提交按钮
        var oFormSubmitBtn = oFormBtnModel.find('.form-submit').eq(0);
        // 重置按钮
        var oFormResetBtn = oFormBtnModel.find('.form-reset').eq(0);

        initForm();
        getUserPhone();
        allEvent();

        /**
         * 外部调用：初始化表单
         */
        _this.init = function () {
            initForm();
            getUserPhone();
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
                if (bIsPhonePass) {
                    return false;
                }
                stSave = inputTest(inputNode, {
                    callback: testCallback
                });
                if (callback) {
                    callback(stSave);
                }
            })
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
         * 作用:手机验证码按钮事件工厂函数
         * @returns {Function}:验证码按钮事件函数
         */
        function createPhoneCodeBtnClickEvent() {
            var isCodeSending = false;
            var layui = null;
            return function () {
                oCodeSendBtnNode.on('click', function () {
                    var stSave = null;
                    if (bIsPhonePass) {
                        __layer.closeAll();
                        __layer.msg('手机号已绑定');
                        return false;
                    }
                    if (isCodeSending) {
                        __layer.closeAll();
                        __layer.msg('发送冷却中，请勿重复操作');
                        return 0;
                    }
                    stSave = inputTest(oPhoneInput, {
                        isJudge: true,
                        callback: function () {
                            var value = oPhoneInput.val();
                            if (oPhoneRule.test(value)) {
                                setTipShow(oPhoneInput, false);
                                return true;
                            } else {
                                setTipShow(oPhoneInput, true, '请您输入正确的手机号');
                                return false;
                            }
                        }
                    });
                    // 没通过验证
                    if (!stSave) {
                        return false;
                    }
                    __layer.msg('发送验证码');
                    layui = __layer.load(2, {shade: [0.5, '#ffffff']});
                    isCodeSending = true;
                    _ajax.post('message', {
                        url: '/message/pc/' + oPhoneInput.val() + '/send_sms',
                        contentType: 'application/json',
                        data: '{}',
                        success: function (res) {
                            if (res.status === 200) {
                                __layer.close(layui);
                                __layer.msg('发送验证码成功');
                                handleOfButtonRecoveryCd(oCodeSendBtnNode, function () {
                                    isCodeSending = false;
                                });
                            }
                        },
                        error: function (err) {
                            var data = err.responseJSON;
                            __layer.close(layui);
                            isCodeSending = false;
                            dealWithErrorData(data);
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
         * 处理错误信息
         * @param data
         */
        function dealWithErrorData(data) {
            var status = data.status;
            var msg = data.message;
            if (status !== 303) {
                __layer.msg(msg);
            }
            // 手机已存在
            if (status === 806) {
                setTipShow(oPhoneInput, true, msg);
            } else if (status === 800) {// 验证码错误
                setTipShow(oCodeInput, true, msg);
            }
        }

        /*=== 主体函数 ===*/
        /* 初始化 */
        function initForm() {
            initPhone();
            initCode();
        }
        // 初始化手机号
        function initPhone() {
            initNormalInput(oPhoneInput);
            oPhoneInput.prop({
                disabled: false
            });
            if (oPhoneCleanNode.hasClass('show')) {
                oPhoneCleanNode.removeClass('show');
            }
            sUserPhone = null;
            bIsPhonePass = false;
        }
        // 初始化验证码
        function initCode() {
            initNormalInput(oCodeInput);
            oCodeInput.prop({
                disabled: false
            });
            if (oCodeCleanNode.hasClass('show')) {
                oCodeCleanNode.removeClass('show');
            }
            sCode = null;
        }
        // 获取用户手机号
        function getUserPhone() {
            sUserPhone = personalMainObj.getUserPhone();
            bIsHavePhone = (!!sUserPhone);
            changeFormStatus(bIsHavePhone, sUserPhone);
        }
        // 切换表单状态
        function changeFormStatus(isPass, sPhone) {
            bIsPhonePass = isPass;
            if (bIsPhonePass) {
                if (!oPhoneInput.prop('disabled')) {

                    oPhoneInput.val(sPhone)
                        .prop({
                            disabled: true
                        });
                }
                if (!oPhoneParentNode.hasClass('pass')) {
                    oPhoneParentNode.addClass('pass');
                }
            } else {
                if (oPhoneInput.prop('disabled')) {
                    oPhoneInput.val('')
                        .prop({
                            disabled: false
                        });
                }
                if (oPhoneParentNode.hasClass('pass')) {
                    oPhoneParentNode.removeClass('pass');
                }
            }
        }

        // 事件
        function allEvent() {
            cleanClick();
            phoneEvent();
            reBindEvent();
            codeSendBtnEvent();
            codeEvent();
            codeSubmitBtnEvent();
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
                if (!(bIsPhonePass && (oParentNode.hasClass('pass') || oParentNode.hasClass('code')))) {
                    oNowInput = oNowNode.parent().find('input').eq(0);
                    oNowInput.val('');
                    setTipShow(oNowInput, false);
                    oNowNode.removeClass('show');
                }
            })
        }
        // 手机事件
        function phoneEvent() {
            eventOfInput(oPhoneInput,{
                testCallback: function(){
                    var value = oPhoneInput.val();
                    if (oPhoneRule.test(value)) {
                        setTipShow(oPhoneInput, false);
                        return true;
                    } else {
                        setTipShow(oPhoneInput, true, '请您输入正确的手机号');
                        return false;
                    }
                },
                callback: function (res) {
                    if (res) {
                        sUserPhone = oPhoneInput.val();
                    }
                }
            });
            eventOfInput(oPhoneInput,{
                eventType: 'input',
                callback: function () {
                    var value = oPhoneInput.val();
                    if (value.length > 0) {
                        if (!oPhoneCleanNode.hasClass('show')) {
                            oPhoneCleanNode.addClass('show');
                        }
                    } else {
                        if (oPhoneCleanNode.hasClass('show')) {
                            oPhoneCleanNode.removeClass('show');
                        }
                    }
                }
            });
        }
        // 重新绑定按钮事件
        function reBindEvent() {
            // 重绑按钮事件
            oReBindBtnNode.on('click', function () {
                if (!bIsPhonePass) {
                    return false;
                }
                changeFormStatus(false);
            });
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
                            oCodeCleanNode.addClass('show');
                        }
                    } else {
                        if (oCodeCleanNode.hasClass('show')) {
                            oCodeCleanNode.removeClass('show');
                        }
                    }
                }
            });
        }
        // 验证码发送按钮事件
        function codeSendBtnEvent() {
            (createPhoneCodeBtnClickEvent())();
        }


        // 验证码提交按钮事件
        function codeSubmitBtnEvent() {
            var bIsCodeSubmitting = false;
            var layui = null;
            var oTest = null;
            var stSave = null;
            oFormSubmitBtn.on('click', function () {
                var config = null;
                if (bIsPhonePass) {
                    __layer.closeAll();
                    __layer.msg('手机号已绑定');
                    return false;
                }
                if (bIsCodeSubmitting) {
                    __layer.closeAll();
                    __layer.msg('手机号绑定中，请勿重复操作');
                    return false;
                }
                oTest = {
                    phone: inputTest(oPhoneInput,{
                        isJudge: true,
                        callback: function () {
                            var value = oPhoneInput.val();
                            if (oPhoneRule.test(value)) {
                                setTipShow(oPhoneInput, false);
                                return true;
                            } else {
                                setTipShow(oPhoneInput, true, '请您输入正确的手机号');
                                return false;
                            }
                        }
                    }),
                    code: inputTest(oCodeInput, {
                        isJudge: true
                    })
                };
                stSave = true;
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
                config = {
                    phone: oPhoneInput.val(),
                    randCode: oCodeInput.val()
                };
                __layer.msg('手机号提交绑定');
                layui = __layer.load(2, {shade: [0.5, '#ffffff']});
                bIsCodeSubmitting = true;
                _ajax.post('default', {
                    url: '/resetPhone',
                    contentType: 'application/json',
                    data: JSON.stringify(config),
                    success: function (res) {
                        bIsCodeSubmitting = false;
                        if (res.status === 200) {
                            __layer.close(layui);
                            __layer.msg('绑定手机号成功');
                            // 变化表单模式
                            changeFormStatus(true, config.phone);
                            personalMainObj.setUserPhone(config.phone);
                        }
                    },
                    error: function (err) {
                        var data = err.responseJSON;
                        __layer.close(layui);
                        bIsCodeSubmitting = false;
                        bIsPhonePass = false;
                        dealWithErrorData(data);
                    }
                });
            });
        }

        // 重置事件
        function resetEvent() {
            oFormResetBtn.on('click', initForm);
        }
    }

    BindPhone.prototype = new FuncOfModelCommon();

    FuncOfModelCommon = null;

    personalMainObj.setMethodObj('bindPhone', new BindPhone());
});