$(function () {
    var _ajax = new NewAjax();
    // 注册模块
    var oRegisterModel = $('#company-user-register');
    // 非法输入正则
    var oIllegalInputENRule = /[`!#$%^&*+<>?:"{},\/;'\[\]]/im;
    var oIllegalInputCNRule = /[·！#￥：；“”‘、，|《。》？【】]/im;
    // 手机验证码
    var oPhoneRule = /^1(3|4|5|7|8)\d{9}$/;
    // 电话验证码
    var oTelPhoneRule = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;

    /* 企业名 */
    var oCompanyNameInputNode = oRegisterModel.find('#username');

    /* 手机号 */
    // 手机输入节点
    var oPhoneInputNode = oRegisterModel.find('#phone');

    /* 验证码 */
    // 验证码输入节点
    var oCodeInputNode = oRegisterModel.find('#code');
    // 获取手机号input节点
    var oRegisterPhoneInputNode = oRegisterModel.find('#phone');
    // 注册码按钮
    var oCodeBtnNode = oRegisterModel.find('.code-button').eq(0);
    // 按钮cd
    var nCodeSendCd = 30;

    /* 密码 */
    // 获取密码节点
    var oPasswordInputNode = oRegisterModel.find('#password');

    /* 确认密码 */
    // 获取确认密码节点
    var oPasswordCopyInputNode = oRegisterModel.find('#password-copy');

    /* 信用代码 */
    var oCreditCodeInputNode = oRegisterModel.find('#credit-code');

    /* 地区选项 */
    // 获取地区选项节点
    var oAddressSelectNode = oRegisterModel.find('#address-select-div');
    // 获取省select节点
    var oProvinceSelectNode = oAddressSelectNode.find('#province');
    // 获取市select节点
    var oCitySelectNode = oAddressSelectNode.find('#city');
    // 获取区select节点
    var oDistrictSelectNode = oAddressSelectNode.find('#district');
    // 获取详情地址节点
    var oAddressDetailInputNode = oRegisterModel.find('#company-address');

    /* 联系电话 */
    var oContactNumberInputNode = oRegisterModel.find('#contact-number');

    /* 联系人 */
    var oContactPeopleInputNode = oRegisterModel.find('#contact-people');

    /* 所属行业 */
    var oIndustryInputNode = oRegisterModel.find('#industry');

    /* 注册按钮 */
    // 获取注册按钮
    var oRegisterBtnNode = oRegisterModel.find('.register-button').eq(0);

    initEncrypt();
    initInputMark();
    initAddressSelect();
    // 单独的企业注册已作废
    /*inputNodeEvent();
    phoneCodeBtnEvent();
    submitBtnEvent();*/

    // 初始化加密文件
    function initEncrypt() {
        // 获取script节点
        var oScriptNode = $('#encrypt');
        // 获取父级节点
        var oParentNode = oScriptNode.parent();
        oScriptNode.remove();
        oScriptNode.attr({
            src: _ajax.getDomain('security') + '/encrypt/javascript'
        });
        oParentNode.append(oScriptNode);
    }

    // 初始化输入框标记
    function initInputMark() {
        oCompanyNameInputNode.data('name', '企业名');
        oPhoneInputNode.data('name', '手机号码');
        oCodeInputNode.data('name', '验证码');
        oPasswordInputNode.data('name', '登录密码');
        oPasswordCopyInputNode.data('name', '认证密码');
        oCreditCodeInputNode.data('name', '信用代码');
        oAddressDetailInputNode.data('name', '详细地址');
        oContactNumberInputNode.data('name', '联系电话');
        oContactPeopleInputNode.data('name', '联系人');
        oIndustryInputNode.data('name', '所属行业');
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

    // 地区选项初始化
    function initAddressSelect() {
        // 初始化
        oAddressSelectNode.distpicker();
        // 赋给初始值
        oProvinceSelectNode.val('');
        oProvinceSelectNode.trigger("change");
        oCitySelectNode.val('');
        oCitySelectNode.trigger("change");
        oDistrictSelectNode.val('');
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
            if (oIllegalInputCNRule.test(value) || oIllegalInputENRule.test(value)) {
                setTipShow(inputNode, true, '存在非法字符，请清除后继续操作');
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
    }

    /**
     * 作用:按enter执行函数
     */
    function handleOfEnter() {
        var stSave = {
            sCompanyName: oCompanyNameInputNode.val(),
            sPhone: oPhoneInputNode.val(),
            code: oCodeInputNode.val(),
            sPassword: oPasswordInputNode.val(),
            sPasswordCopy: oPasswordCopyInputNode.val(),
            sCreditCode: oCreditCodeInputNode.val(),
            sProvince: oProvinceSelectNode.val(),
            sCity: oCitySelectNode.val(),
            sDistrict: oDistrictSelectNode.val(),
            sContactNumber: oContactNumberInputNode.val(),
            sContactPeople: oContactPeopleInputNode.val(),
            sIndustry: oIndustryInputNode.val()
        };
        try {
            Object.keys(stSave).forEach(function (key) {
                if (stSave[key].length === 0) {
                    throw new Error('存在未填项"' + key + '"');
                }
            });
            submitBtnEvent.click();
        } catch (err) {
            return err;
        }
    }

    /**
     * 作用:添加change事件
     * @param inputNode:传入输入框节点
     * @param callback:传入回调函数
     */
    function eventOfInputChange(inputNode, callback) {
        inputNode.on('change', function () {
            inputTest(inputNode, {
                callback: callback
            });
        })
    }

    /**
     * 作用:添加enter事件
     * @param inputNode:传入输入框节点
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
     * 作用:手机验证码按钮事件工厂函数
     * @returns {Function}
     */
    function createPhoneCodeBtnClickEvent() {
        var isCodeSending = false;
        return function () {
            oCodeBtnNode.on('click', function () {
                var stSave = null;
                if (isCodeSending) {
                    __layer.closeAll();
                    __layer.msg('发送冷却中，请勿重复操作');
                    return 0;
                }
                stSave = inputTest(oPhoneInputNode, {
                    isJudge: true,
                    callback: function () {
                        var sPhone = oPhoneInputNode.val();
                        if (!(/\d+/.test(sPhone))) {
                            setTipShow(oPhoneInputNode, true, '手机号不能为空');
                            return false;
                        } else {
                            if (oPhoneRule.test(sPhone)) {
                                setTipShow(oPhoneInputNode, false);
                                return true;
                            } else {
                                setTipShow(oPhoneInputNode, true, '请您输入正确的手机号');
                                return false;
                            }
                        }
                    }
                });
                // 不通过测试则直接返回
                if (!stSave) {
                    return 0;
                }
                isCodeSending = true;
                __layer.msg('发送验证码');
                _ajax.post('message', {
                    url: '/message/pc/' + oRegisterPhoneInputNode.val() + '/send_sms',
                    contentType: 'application/json',
                    data: '{}',
                    success: function (res) {
                        if (res.status === 200) {
                            handleOfButtonRecoveryCd(oCodeBtnNode, function () {
                                isCodeSending = false;
                            });
                        }
                    },
                    error: function (err) {
                        console.error('phoneCodeBtnEvent:', err);
                        isCodeSending = false;
                    }
                });
            });
        }
    }

    /**
     * 作用:按钮读秒
     * @param oBtnNode
     * @param callback
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
            if (index > 0) {
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
     * 作用:检测必填项
     * @returns {boolean}
     */
    function submitItemTest() {
        var stSave = {
            companyName: inputTest(oCompanyNameInputNode, {isJudge: true}),
            phone: inputTest(oPhoneInputNode, {
                isJudge: true,
                callback: function () {
                    var value = oPhoneInputNode.val();
                    if (oPhoneRule.test(value)) {
                        setTipShow(oPhoneInputNode, false);
                        return true;
                    } else {
                        setTipShow(oPhoneInputNode, true, '请您输入正确的手机号');
                        return false;
                    }
                }
            }),
            code: inputTest(oCodeInputNode, {isJudge: true}),
            password: inputTest(oPasswordInputNode, {
                isJudge: true,
                callback: function () {
                    var stSave = oPasswordCopyInputNode.val();
                    if (stSave && stSave.length > 0) {
                        return passwordCopyVerification();
                    }
                    return true;
                }
            }),
            passwordCopy: inputTest(oPasswordCopyInputNode, {
                isJudge: true,
                callback: function () {
                    var stSave = oPasswordInputNode.val();
                    if (stSave && stSave.length > 0) {
                        return passwordCopyVerification();
                    }
                    return true;
                }
            }),
            creditCode: inputTest(oCreditCodeInputNode, {isJudge: true}),
            addressDetail: inputTest(oAddressDetailInputNode),
            contactNumber: inputTest(oContactNumberInputNode, {
                isJudge: true,
                callback: function () {
                    var value = oPhoneInputNode.val();
                    if (oPhoneRule.test(value)) {
                        setTipShow(oPhoneInputNode, false);
                        return true;
                    } else if (oTelPhoneRule.test(value)){
                        setTipShow(oPhoneInputNode, false);
                        return true;
                    } else {
                        setTipShow(oPhoneInputNode, true, '请您输入正确的联系电话');
                        return false;
                    }
                }
            }),
            contactPeople: inputTest(oContactPeopleInputNode, {isJudge: true}),
            industry: inputTest(oIndustryInputNode, {isJudge: true})
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

    /**
     * 作用:按钮提交工厂函数
     * @returns {Function}
     */
    function createBtnSubmitEvent() {
        var isSubmitting = false;
        return function () {
            oRegisterBtnNode.on('click', function () {
                var config = null,
                    province = null,
                    city = null,
                    district = null,
                    addressDetail = null,
                    layui = null;
                if (isSubmitting) {
                    return 0;
                }
                if (!submitItemTest()) {
                    return 0;
                }
                isSubmitting = true;
                // 启动loading
                layui = __layer.load(2, {
                    shade: [0.5, '#ffffff']
                });
                province = oProvinceSelectNode.val();
                city = oCitySelectNode.val();
                district = oDistrictSelectNode.val();
                addressDetail = oAddressDetailInputNode.val();
                config = {
                    // 企业名称
                    name: oCompanyNameInputNode.val(),
                    phone: oPhoneInputNode.val(),
                    password: encrypt(oPasswordInputNode.val()),
                    randCode: oCodeInputNode.val(),
                    unifiedSocialCredit: oCreditCodeInputNode.val(),
                    provinceName: province,
                    cityName: city,
                    areaName: district,
                    detailAddress: addressDetail,
                    address: province + city + district + addressDetail,
                    contact: oContactPeopleInputNode.val(),
                    contactPhone: oContactNumberInputNode.val(),
                    belongIndustry: oIndustryInputNode.val()
                };
                _ajax.post('default', {
                    url: '/enterpriseRegister',
                    contentType: 'application/json',
                    data: JSON.stringify(config),
                    success: function (res) {
                        var data = null;
                        // 关闭loading
                        __layer.close(layui);
                        if (res.status === 200) {
                            data = res.data;
                            console.log(data);
                            layui = __layer.msg('企业注册成功', {
                                time: 1500
                            }, function () {
                                __layer.close(layui);
                                layui = __layer.confirm('注册成功，是否跳转到登录页面？', function (index) {
                                    __layer.close(index);
                                    window.location.href = '/login.html';
                                }, function (index) {
                                    __layer.close(index);
                                })
                            });
                        }
                        isSubmitting = false
                    },
                    error: function (err) {
                        var data = err.responseJSON;
                        isSubmitting = false;
                        // 关闭loading
                        __layer.close(layui);
                        dealWithErrorData(data);
                    }
                });
            });
        }
    }

    // 处理错误信息
    function dealWithErrorData(data) {
        var status = data.status;
        var message = data.message;
        if (status !== 303) {
            __layer.msg(message);
        }
        // 验证码错误
        if (status === 800) {
            setTipShow(oCodeInputNode, true, message);
        } else if (status === 416){ // 用户已存在
            setTipShow(oPhoneInputNode, true, '该手机号已被注册');
        } else if (status === 303) {// 加密索引过期
            updateEncrypt();
            oRegisterBtnNode.click();
        }
    }

    /**
     * 作用: 密码，确认密码关联验证
     * @returns {boolean}
     */
    function passwordCopyVerification() {
        // 获取密码
        var sPassword = oPasswordInputNode.val();
        // 获取副本密码
        var sPasswordCopy = oPasswordCopyInputNode.val();
        if (sPassword !== sPasswordCopy) {
            setTipShow(oPasswordCopyInputNode, true, '确认密码与密码不一致');
            return false;
        } else {
            setTipShow(oPasswordCopyInputNode, false);
            return true;
        }
    }

    // 所有输入框事件
    function inputNodeEvent() {
        companyNameEvent();
        phoneEvent();
        codeEvent();
        passwordEvent();
        passwordCopyEvent();
        creditCodeEvent();
        detailAddressEvent();
        contactNumberEvent();
        contactPeopleEvent();
        industryEvent();
    }

    /* 企业名 */
    function companyNameEvent() {
        eventOfCompanyNameChange();
        eventOfCompanyNameKeyUp();
    }
    function eventOfCompanyNameChange() {
        eventOfInputChange(oCompanyNameInputNode);
    }
    function eventOfCompanyNameKeyUp() {
        eventOfInputEnter(oCompanyNameInputNode);
    }

    /* 手机号 */
    function phoneEvent() {
        eventOfPhoneChange();
        eventOfPhoneKeyUp();
    }
    function eventOfPhoneChange() {
        eventOfInputChange(oPhoneInputNode, function () {
            var value = oPhoneInputNode.val();
            if (oPhoneRule.test(value)) {
                setTipShow(oPhoneInputNode, false);
                return true;
            } else {
                setTipShow(oPhoneInputNode, true, '请您输入正确的手机号');
                return false;
            }
        })
    }
    function eventOfPhoneKeyUp() {
        eventOfInputEnter(oPhoneInputNode)
    }

    /* 验证码 */
    function codeEvent() {
        eventOfCodeChange();
        eventOfCodeKeyUp();
    }
    function eventOfCodeChange() {
        eventOfInputChange(oCodeInputNode);
    }
    function eventOfCodeKeyUp() {
        eventOfInputEnter(oCodeInputNode)
    }
    // 手机验证码事件
    function phoneCodeBtnEvent() {
        (createPhoneCodeBtnClickEvent())();
    }

    /* 密码 */
    function passwordEvent() {
        eventOfPasswordChange();
        eventOfPasswordKeyUp();
    }
    function eventOfPasswordChange() {
        eventOfInputChange(oPasswordInputNode, function () {
            var stSave = oPasswordCopyInputNode.val();
            if (stSave && stSave.length > 0) {
                return passwordCopyVerification();
            }
            return true;
        });
    }
    function eventOfPasswordKeyUp() {
        eventOfInputEnter(oPasswordInputNode)
    }

    /* 确认密码 */
    function passwordCopyEvent() {
        eventOfPasswordCopyChange();
        eventOfPasswordCopyKeyUp();
    }
    function eventOfPasswordCopyChange() {
        eventOfInputChange(oPasswordCopyInputNode, function () {
            var stSave = oPasswordInputNode.val();
            if (stSave && stSave.length > 0) {
                return passwordCopyVerification();
            }
            return true;
        });
    }
    function eventOfPasswordCopyKeyUp() {
        eventOfInputEnter(oPasswordCopyInputNode);
    }

    /* 社会信用代码 */
    function creditCodeEvent() {
        eventOfCreditCodeChange();
        eventOfCreditCodeKeyUp();
    }
    function eventOfCreditCodeChange() {
        eventOfInputChange(oCreditCodeInputNode);
    }
    function eventOfCreditCodeKeyUp() {
        eventOfInputEnter(oCreditCodeInputNode);
    }

    /* 企业地址 */
    function detailAddressEvent() {
        eventOfDetailAddressChange();
        eventOfDetailAddressKeyUp();
    }
    function eventOfDetailAddressChange() {
        eventOfInputChange(oAddressDetailInputNode);
    }
    function eventOfDetailAddressKeyUp() {
        eventOfInputEnter(oAddressDetailInputNode);
    }

    /* 联系电话 */
    function contactNumberEvent() {
        eventOfContactNumberChange();
        eventOfContactNumberKeyUp();
    }
    function eventOfContactNumberChange() {
        eventOfInputChange(oContactNumberInputNode);
    }
    function eventOfContactNumberKeyUp() {
        eventOfInputEnter(oContactNumberInputNode);
    }

    /* 联系人 */
    function contactPeopleEvent() {
        eventOfContactPeopleChange();
        eventOfContactPeopleKeyUp();
    }
    function eventOfContactPeopleChange() {
        eventOfInputChange(oContactPeopleInputNode);
    }
    function eventOfContactPeopleKeyUp() {
        eventOfInputEnter(oContactPeopleInputNode);
    }

    /* 行业 */
    function industryEvent() {
        eventOfIndustryChange();
        eventOfIndustryKeyUp();
    }
    function eventOfIndustryChange() {
        eventOfInputChange(oIndustryInputNode);
    }
    function eventOfIndustryKeyUp() {
        eventOfInputEnter(oIndustryInputNode);
    }

    /* 注册提交 */
    function submitBtnEvent() {
        (createBtnSubmitEvent())();
    }
});
