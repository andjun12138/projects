$(function () {
    // 获取ajax模块
    var _ajax = new NewAjax();
    // 获取注册模块
    var oRegisterModel = $('#normal-user-register');
    // 非法输入正则
    var oIllegalInputENRule = /[`!#$%^&*+<>?:"{},\/;'\[\]]/im;
    //var oIllegalInputENRule = /[`!#$%^&*()+<>?:"{},\/;'\[\]]/im;
    // var oIllegalInputCNRule = /[·！#￥：；“”‘、，|《。》？【】]/im;
    // 空格换行正则
    var oWarpRule = />?\s+<|>\s+<?/g;
    // 名称正则
    var oNameRule = /^[\(\)\（\）\u4E00-\u9FA5]+$/;
    // 密码正则
    var oPasswordRule = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^0-9a-zA-Z])+$)[\x00-\xff_@]{2,}$/;
    // 手机验证码
    var oPhoneRule = /^1(3|4|5|7|8)\d{9}$/;
    // 邮箱正则
    var oEmailRule = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    // 电话验证码
    var oTelPhoneRule = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
    // 当前注册模块: user / company
    var sRegisterModel = 'user';
    // 名称是否通过验证
    var bIsNamePass = false;
    // 账号是否通过验证
    var bIsAccountPass = false;
    // 账号类型： phone / email
    var sAccountType = null;
    // 模块名称对应
    var oAttrToModelName = {
        username: '用户名',
        phoneEmail: '手机号/邮箱',
        code: '验证码',
        password: '密码',
        passwordCopy: '确认密码',
        protocol: '协议',
        companyName: '企业名',
        phone: '手机号',
        creditCode: '统一社会信用代码',
        addressDetail: '企业地址',
        contactNumber: '联系电话',
        contactPeople: '联系人'
    };

    /* 模块切换 */
    // 模块切换列表
    var oModelNavList = oRegisterModel.find('.model-nav-list').eq(0);

    /* 用户名 */
    var oUsernameInputNode = oRegisterModel.find('#username');

    /* 企业名 */
    var oCompanyNameInputNode = oRegisterModel.find('#company-name');

    /* 手机邮箱 */
    var oPhoneEmailInputNode = oRegisterModel.find('#phone-email');
    // 是否已存在
    var bIsPhoneEmailHave = false;

    /* 手机号码 */
    var oPhoneInputNode = oRegisterModel.find('#phone');

    /* 验证码 */
    var oCodeInputNode = oRegisterModel.find('#code');
    // 验证码按钮
    var oCodeBtnNode = oRegisterModel.find('.code-button').eq(0);
    // 按钮cd秒数
    var nCodeSendCd = 120;

    /* 密码 */
    var oPasswordInputNode = oRegisterModel.find('#password');

    /* 确认密码 */
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

    /* 职务 */
    var oPositionInputNode = oRegisterModel.find('#position');

    /* 所属行业 */
    var oIndustrySelectNode = oRegisterModel.find('#industry');

    /* 协议 */
    // 协议复选框
    var oProtocolCheckBoxNode = oRegisterModel.find('#protocol');
    // 父节点
    var oProtocolParentNode = oProtocolCheckBoxNode.parent();
    // label节点
    var oProtocolLabelNode = oProtocolParentNode.find('label');
    // a标签
    var oProtocolLinkNode = oProtocolParentNode.find('a.protocol-link');
    // 是否同意协议
    var bIsAgreeProtocol = false;
    // 协议html
    var sProtocolHtml = '<div class="protocol-container">\n' +
        '                <div class="protocol-cover">\n' +
        '                   <div class="protocol-content">%agreements%</div>\n' +
        '                </div>\n' +
        '            </div>';
    // 滚动div正则
    var oProtocolScrollRule = /<div class="protocol-content((?!<\/div>).)+<\/div>/;

    /* 注册按钮 */
    var oSubmitBtnNode = oRegisterModel.find('.register-button').eq(0);

    modelNavEvent();
    inputNodeEvent();
    submitBtnEvent();
    initAddressSelect();
    initEncrypt();
    initInputMark();


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
            oTipNode = oInputDivNode.parents('div.register-input-model').eq(0).find('.input-tip').eq(0);
            oTipNode.text(content);
            if (isShow) {
                oTipNode.show();
            } else {
                oTipNode.hide();
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
        var stSave = null;
        if (sRegisterModel === 'user'){
            stSave = {
                sUsername: oUsernameInputNode.val(),
                sPhoneEmail: oPhoneEmailInputNode.val(),
                sPassword: oPasswordInputNode.val(),
                sPasswordCopy: oPasswordCopyInputNode.val(),
                code: oCodeInputNode.val()
            };
        } else if (sRegisterModel === 'company'){
            stSave = {
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
                sPosition: oPositionInputNode.val(),
                sIndustry: oIndustrySelectNode.val()
            };
        }
        try {
            Object.keys(stSave).forEach(function (key) {
                if (stSave[key].length === 0) {
                    throw new Error('存在未填项"' + key + '"');
                }
            });
            oSubmitBtnNode.click();
        } catch (err) {
            return err;
        }
    }

    /**
     * 作用:添加change事件
     * @param inputNode:传入输入框节点
     * @param config:传入测试检验函数和回调函数的配置参数
     */
    function eventOfInputChange(inputNode, config) {
        var sBelongModel = (config && config.belongModel) ? config.belongModel : undefined;
        var testCallback = (config && config.testCallback) ? config.testCallback : undefined;
        var callback = (config && config.callback) ? config.callback : undefined;
        var stSave = null;
        inputNode.on('change', function () {
            if (sBelongModel && sBelongModel !== sRegisterModel) {
                return 0;
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
     * 作用:添加enter事件
     * @param inputNode:传入输入框节点
     * @param config:传入特殊判定条件
     */
    function eventOfInputEnter(inputNode, config) {
        // 当前按键码
        var keyCode = null;
        var sBelongModel = (config && config.belongModel) ? config.belongModel : undefined;
        inputNode.on('keyup', function (event) {
            if (sBelongModel && sBelongModel !== sRegisterModel) {
                return 0;
            }
            keyCode = event.keyCode;
            if (keyCode === 13) {
                handleOfEnter();
            }
        });
    }

    /**
     * 作用：判断邮箱、手机号、用户名是否存在
     * @param account：邮箱、手机号、用户名
     * @param callback：回调函数
     */
    function accountCheck(account, callback) {
        var sAccountType = null;
        var config = null;
        var layerLoad = null;
        if (oPhoneRule.test(account)) {
            sAccountType = 'phone';
        } else if (oEmailRule.test(account)) {
            sAccountType = 'email';
        } else {
            sAccountType = 'name';
        }
        config = {
            account: account,
            accountType: sAccountType
        };
        // 启动loading
        layerLoad = __layer.load(2, {
            shade: [0.5, '#ffffff']
        });
        _ajax.post('default', {
            url: '/isExist',
            contentType: 'application/json',
            // 必须同步检测
            async: false,
            data: JSON.stringify(config),
            success: function (res) {
                __layer.close(layerLoad);
                if (res.status === 200) {
                    if (callback) {
                        callback('success', res.data);
                    }
                }
            },
            error: function (err) {
                __layer.close(layerLoad);
                var data = err.responseJSON;
                if (callback) {
                    callback('error', data);
                }
            }
        });
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
        // input 的值
        var value = null;
        return function () {
            oCodeBtnNode.on('click', function () {
                if (!bIsAccountPass) {
                    if (sRegisterModel === 'user') {
                        if (!bIsPhoneEmailHave){
                            setTipShow(oPhoneEmailInputNode, true, '手机/邮箱未通过检验');
                        }
                    } else if (sRegisterModel === 'company'){
                        setTipShow(oPhoneInputNode, true, '手机未通过检验');
                    }
                    setLayerMsg('手机/邮箱未通过检验');
                    return false;
                }
                var stSave = null;
                if (isCodeSending) {
                    setLayerMsg('发送冷却中，请勿重复操作');
                    return 0;
                }
                // 根据注册类型分配数据
                if (sRegisterModel === 'user') {
                    value = oPhoneEmailInputNode.val();
                    if (oPhoneRule.test(value)) {
                        sAccountType = 'phone';
                        sNowAccount = value;
                        setTipShow(oPhoneEmailInputNode, false);
                    } else if (oEmailRule.test(value)) {
                        sAccountType = 'email';
                        sNowAccount = value;
                        setTipShow(oPhoneEmailInputNode, false);
                    }
                } else if (sRegisterModel === 'company') {
                    value = oPhoneInputNode.val();
                    sAccountType = 'phone';
                    sNowAccount = value;
                    setTipShow(oPhoneInputNode, false);
                }
                isCodeSending = true;
                if (sAccountType === 'phone') {
                    sNowUrl = '/message/pc/' + sNowAccount + '/send_sms';
                } else if (sAccountType === 'email') {
                    sNowUrl = '/message/pc/' + sNowAccount + '/send_mail';
                }
                setLayerMsg('发送验证码');
                _ajax.post('message', {
                    url: sNowUrl,
                    contentType: 'application/json',
                    data: '{}',
                    success: function (res) {
                        if (res.status === 200) {
                            setLayerMsg('发送验证码成功');
                            handleOfButtonRecoveryCd(oCodeBtnNode, function () {
                                isCodeSending = false;
                            });
                        }
                    },
                    error: function (err) {
                        var data = err.responseJSON;
                        setLayerMsg(data.message);
                        console.error('phoneCodeBtnEvent:', data);
                        isCodeSending = false;
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
     * 作用:检测必填项
     * @returns {boolean}
     */
    function submitItemTest() {
        var stSave = null;
        var aKeys = null;
        var errKey = null;
        var index = null;
        if (sRegisterModel === 'user') {
            stSave = {
                username: inputTest(oUsernameInputNode, {
                    isJudge: true,
                    callback: function () {
                        if (bIsNamePass) {
                            setTipShow(oUsernameInputNode, false);
                            return true
                        } else {
                            setTipShow(oUsernameInputNode, true, '用户名未通过检验');
                            return false
                        }
                    }
                }),
                phoneEmail: inputTest(oPhoneEmailInputNode, {
                    isJudge: true,
                    callback: function () {
                        if (bIsAccountPass) {
                            setTipShow(oPhoneEmailInputNode, false);
                            return true
                        } else {
                            if (!bIsPhoneEmailHave) {
                                setTipShow(oPhoneEmailInputNode, true, '手机/邮箱未通过检验');
                            }
                            return false
                        }
                    }
                }),
                code: inputTest(oCodeInputNode, {isJudge: true}),
                password: inputTest(oPasswordInputNode, {
                    isJudge: true,
                    callback: function () {
                        var value = oPasswordInputNode.val();
                        var sCopyPassword = null;
                        // if (oPasswordRule.test(value)) {
                            if (value.length < 6 || value.length > 18) {
                                setTipShow(oPasswordInputNode, true, '密码长度需在6-18个字符之间');
                                return false;
                            } else {
                                sCopyPassword = oPasswordCopyInputNode.val();
                                if (sCopyPassword.length > 0) {
                                    return passwordCopyVerification();
                                } else {
                                    setTipShow(oPasswordInputNode, false);
                                    return true;
                                }
                            }
                        // } else {
                        //     setTipShow(oPasswordInputNode, true, '密码由6-18位字母、数字和符号组成');
                        //     return false;
                        // }
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
                protocol: inputTest(oProtocolCheckBoxNode, {
                    callback: function () {
                        if (bIsAgreeProtocol) {
                            setTipShow(oProtocolCheckBoxNode, false);
                            return true;
                        } else {
                            setTipShow(oProtocolCheckBoxNode, true, '需勾选协议');
                            return false;
                        }
                    }
                })
            };
        } else if (sRegisterModel === 'company') {
            stSave = {
                companyName: inputTest(oCompanyNameInputNode, {
                    isJudge: true,
                    callback: function () {
                        if (bIsNamePass) {
                            setTipShow(oCompanyNameInputNode, false);
                            return true
                        } else {
                            setTipShow(oCompanyNameInputNode, true, '企业名未通过检验');
                            return false
                        }
                    }
                }),
                phone: inputTest(oPhoneInputNode, {
                    isJudge: true,
                    callback: function () {
                        if (bIsAccountPass) {
                            setTipShow(oPhoneInputNode, false);
                            return true
                        } else {
                            setTipShow(oPhoneInputNode, true, '手机号未通过检验');
                            return false
                        }
                    }
                }),
                code: inputTest(oCodeInputNode, {isJudge: true}),
                password: inputTest(oPasswordInputNode, {
                    isJudge: true,
                    callback: function () {
                        var value = oPasswordInputNode.val();
                        var sCopyPassword = null;
                        // if (oPasswordRule.test(value)) {
                            if (value.length < 6 || value.length > 18) {
                                setTipShow(oPasswordInputNode, true, '密码长度需在6-18个字符之间');
                                return false;
                            } else {
                                sCopyPassword = oPasswordCopyInputNode.val();
                                if (sCopyPassword.length > 0) {
                                    return passwordCopyVerification();
                                } else {
                                    setTipShow(oPasswordInputNode, false);
                                    return true;
                                }
                            }
                        // } else {
                        //     setTipShow(oPasswordInputNode, true, '密码由6-18位字母、数字和符号组成');
                        //     return false;
                        // }
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
                address: addressSelectTest(),
                // addressDetail: inputTest(oAddressDetailInputNode),
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
                protocol: inputTest(oProtocolCheckBoxNode, {
                    callback: function () {
                        if (bIsAgreeProtocol) {
                            setTipShow(oProtocolCheckBoxNode, false);
                            return true;
                        } else {
                            setTipShow(oProtocolCheckBoxNode, true, '需勾选协议');
                            return false;
                        }
                    }
                })
            };
        }
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

    // 地址选项检测
    function addressSelectTest() {
        var province = oProvinceSelectNode.val();
        var city = oCitySelectNode.val();
        if (!!province && !!city) {
            setTipShow(oAddressDetailInputNode, false);
            return true;
        } else {
            setTipShow(oAddressDetailInputNode, true, '省市选项不能为空');
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
            oSubmitBtnNode.on('click', function () {
                var config = null,
                    layui = null,
                    province = null,
                    city = null,
                    district = null,
                    addressDetail = null,
                    sUrl = null;
                if (isSubmitting) {
                    setLayerMsg('注册中...');
                    return false;
                }
                if (!submitItemTest()) {
                    return false;
                }
                if (!bIsAccountPass) {
                    setLayerMsg('请先同意协议');
                    return false;
                }
                isSubmitting = true;
                if (sRegisterModel === 'user') {
                    config = {
                        userName: oUsernameInputNode.val(),
                        account: oPhoneEmailInputNode.val(),
                        password: encrypt(oPasswordInputNode.val()),
                        randCode: oCodeInputNode.val(),
                        accountType: sAccountType
                    };
                    sUrl = '/ordinaryRegister';
                } else if (sRegisterModel === 'company'){
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
                        positions: oPositionInputNode.val(),
                        contactPhone: oContactNumberInputNode.val(),
                        belongIndustry: oIndustrySelectNode.val()
                    };
                    sUrl = '/enterpriseRegister';
                }
                // 启动loading
                layui = __layer.load(2, {
                    shade: [0.5, '#ffffff']
                });
                _ajax.post('default', {
                    url: sUrl,
                    contentType: 'application/json',
                    data: JSON.stringify(config),
                    success: function (res) {
                        var data = null;
                        var msg = (sRegisterModel === 'user') ? '用户注册成功' : '企业注册成功';
                        // 关闭loading
                        __layer.close(layui);
                        if (res.status === 200) {
                            data = res.data;
                            layui = __layer.msg(msg, {
                                time: 1500
                            }, function () {
                                __layer.close(layui);
                                layui = __layer.confirm('注册成功，是否跳转到登录页面？',function (index) {
                                    __layer.close(index);
                                    window.location.href = '/login.html';
                                }, function (index) {
                                    __layer.close(index);
                                })
                            });
                        }
                        isSubmitting = false
                    },
                    error: function (XMLResponse) {
                        var data = XMLResponse.responseJSON;
                        // 关闭loading
                        __layer.close(layui);
                        dealWithErrorData(data);
                        isSubmitting = false;
                    }
                });
            });
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

    // 处理错误信息
    function dealWithErrorData(data) {
        var status = data.status;
        var message = data.message;
        if (status !== 303) {
            setLayerMsg(message);
        }
        // 加密索引过期
        if (status === 303) {
            updateEncrypt();
            oSubmitBtnNode.click();
        } else {
            setTipShow(oCodeInputNode, true, message);
        }
    }

    /* 全体初始化 */
    function initForm() {
        // 名称是否通过验证
        bIsNamePass = false;
        // 账号是否通过验证
        bIsAccountPass = false;
        // 账号类型： phone / email
        sAccountType = null;
        initInput();
        initSelect();
        // 消除协议的错误提示
        setTipShow(oProtocolCheckBoxNode, false);
    }
    function initInput() {
        initNormalInput(oUsernameInputNode);
        initNormalInput(oCompanyNameInputNode);
        initNormalInput(oPhoneEmailInputNode);
        initNormalInput(oPhoneInputNode);
        initNormalInput(oPasswordInputNode);
        initNormalInput(oPasswordCopyInputNode);
        initNormalInput(oCodeInputNode);
        initNormalInput(oCodeInputNode);
        initNormalInput(oCreditCodeInputNode);
        initNormalInput(oAddressDetailInputNode);
        initNormalInput(oContactPeopleInputNode);
        initNormalInput(oPositionInputNode);
        initNormalInput(oContactNumberInputNode);
        /* 协议 */
        oProtocolCheckBoxNode.prop({
            checked: false
        });
        bIsAgreeProtocol = false;
    }
    function initSelect() {
        initAddressSelect();
        initNormalInput(oIndustrySelectNode);
        // 赋值
        oIndustrySelectNode.val(oIndustrySelectNode.children().eq(0).val());
    }

    // 初始化输入框标记
    function initInputMark() {
        oUsernameInputNode.data('name', '用户名');
        oCompanyNameInputNode.data('name', '企业名');
        oPhoneEmailInputNode.data('name', '手机/邮箱');
        oPhoneInputNode.data('name', '手机号码');
        oCodeInputNode.data('name', '验证码');
        oPasswordInputNode.data('name', '密码');
        oPasswordCopyInputNode.data('name', '确认密码');
        oCreditCodeInputNode.data('name', '信用代码');
        oAddressDetailInputNode.data('name', '详细地址');
        oContactNumberInputNode.data('name', '联系电话');
        oContactPeopleInputNode.data('name', '联系人');
        oPositionInputNode.data('name', '职务');
        oIndustrySelectNode.data('name', '所属行业');
        oProtocolCheckBoxNode.data('name', '协议');
    }

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
        oProvinceSelectNode.val('广东省');
        oProvinceSelectNode.trigger("change");
        oCitySelectNode.val('惠州市');
        oCitySelectNode.trigger("change");
        // oDistrictSelectNode.val('');
    }


    /*=== 事件 ===*/
    // 所有输入框事件
    function inputNodeEvent() {
        usernameEvent();
        companyNameEvent();
        phoneEmailEvent();
        phoneEvent();
        codeEvent();
        passwordEvent();
        passwordCopyEvent();
        creditCodeEvent();
        addressEvent();
        // detailAddressEvent();
        contactNumberEvent();
        contactPeopleEvent();
        positionsEvent();
        industryEvent();
        protocolEvent();
    }

    /* 模块切换 */
    // 点击事件
    function modelNavEvent() {
        // 当前节点
        var oNowNode = null;
        var sNowType = null;
        var stSave = null;
        oModelNavList.on('click', 'li.model-nav-item', function () {
            oNowNode = $(this);
            if (oNowNode.hasClass('active')) {
                return false;
            }
            sNowType = oNowNode.data('type');
            oNowNode.siblings().each(function () {
                stSave = $(this);
                if (stSave.hasClass('active')) {
                    stSave.removeClass('active');
                    return false;
                }
            });
            oNowNode.addClass('active');
            oModelNavList.attr('data-type', sNowType);
            // 更改注册模式
            sRegisterModel = sNowType;
            // 初始化表单
            initForm();
        })
    }

    /* 用户名 */
    // 用户名事件
    function usernameEvent() {
        eventOfUsernameChange();
        eventOfUsernameKeyUp();
    }
    // change事件
    function eventOfUsernameChange() {
        eventOfInputChange(oUsernameInputNode, {
            belongModel: 'user',
            testCallback: function () {
                var result = null;
                var value = oUsernameInputNode.val();
                // console.log(oNameRule.test(value));
                // if (oNameRule.test(value)) {
                    if (value.length < 2 || value.length > 18) {
                        setTipShow(oUsernameInputNode, true, '用户名长度需在2-18个字符之间');
                        return false;
                    } else {
                        accountCheck(oUsernameInputNode.val(), function (status, data) {
                            // 成功
                            if (status === 'success') {
                                bIsNamePass = true;
                                setTipShow(oUsernameInputNode, false);
                                result = true;
                            } else {// 失败
                                bIsNamePass = false;
                                setTipShow(oUsernameInputNode, true, data.message);
                                result = false;
                            }
                        });
                        return result;
                    }
                // } else {
                //     bIsNamePass = false;
                //     setTipShow(oUsernameInputNode, true, '请您输入正确的用户名（可包含中文、字母、数字、下划线）');
                //     return false;
                // }
            }
        });
    }
    // keyup事件
    function eventOfUsernameKeyUp() {
        eventOfInputEnter(oUsernameInputNode, {
            belongModel: 'user'
        });
    }

    /* 企业名 */
    function companyNameEvent() {
        eventOfCompanyNameChange();
        eventOfCompanyNameKeyUp();
    }
    function eventOfCompanyNameChange() {
        eventOfInputChange(oCompanyNameInputNode, {
            belongModel: 'company',
            testCallback: function () {
                var result = null;
                var value = oCompanyNameInputNode.val();
                console.log(value);
                // console.log('企业：', oNameRule.test(value))
                // if (oNameRule.test(value)) {
                    if (value.length < 2) {
                        setTipShow(oCompanyNameInputNode, true, '企业名长度需在2个字符以上');
                        return false;
                    } else {
                        accountCheck(oCompanyNameInputNode.val(), function (status, data) {
                            // 成功
                            if (status === 'success') {
                                bIsNamePass = true;
                                setTipShow(oCompanyNameInputNode, false);
                                result = true;
                            } else {// 失败
                                bIsNamePass = false;
                                setTipShow(oCompanyNameInputNode, true, data.message);
                                result = false;
                            }
                        });
                        return result;
                    }
                // } else {
                //     bIsNamePass = false;
                //     setTipShow(oCompanyNameInputNode, true, '请您输入正确的企业名（可包含中文、字母、数字、下划线）');
                //     return false;
                // }

            }
        });
    }
    function eventOfCompanyNameKeyUp() {
        eventOfInputEnter(oCompanyNameInputNode, {
            belongModel: 'company'
        });
    }

    /* 手机邮箱 */
    function phoneEmailEvent() {
        eventOfPhoneEmailChange();
        eventOfPhoneEmailKeyUp();
    }
    function eventOfPhoneEmailChange() {
        eventOfInputChange(oPhoneEmailInputNode, {
            belongModel: 'user',
            testCallback: function () {
                var result = null;
                var value = oPhoneEmailInputNode.val();
                if (oPhoneRule.test(value) || oEmailRule.test(value)) {
                    bIsPhoneEmailHave = false;
                    accountCheck(oPhoneEmailInputNode.val(), function (status, data) {
                        // 成功
                        if (status === 'success') {
                            bIsAccountPass = true;
                            setTipShow(oPhoneEmailInputNode, false);
                            result = true;
                        } else {// 失败
                            bIsAccountPass = false;
                            setTipShow(oPhoneEmailInputNode, true, data.message);
                            result = false;
                            if (data.status === 806) {
                                bIsPhoneEmailHave = true;
                            }
                        }
                    });
                    return result;
                } else {
                    bIsAccountPass = false;
                    setTipShow(oPhoneEmailInputNode, true, '请您输入正确的手机号/邮箱');
                    return false;
                }
            }
        });
    }
    function eventOfPhoneEmailKeyUp() {
        eventOfInputEnter(oPhoneEmailInputNode, {
            belongModel: 'user'
        });
    }

    /* 手机号码 */

    // 手机号事件
    function phoneEvent() {
        eventOfPhoneChange();
        eventOfPhoneKeyUp();
    }
    function eventOfPhoneChange() {
        eventOfInputChange(oPhoneInputNode, {
            belongModel: 'company',
            testCallback: function () {
                var result = null;
                var value = oPhoneInputNode.val();
                if (oPhoneRule.test(value)) {
                    accountCheck(oPhoneInputNode.val(), function (status, data) {
                        // 成功
                        if (status === 'success') {
                            bIsAccountPass = true;
                            setTipShow(oPhoneInputNode, false);
                            result = true;
                        } else {// 失败
                            bIsAccountPass = false;
                            setTipShow(oPhoneInputNode, true, data.message);
                            result = false;
                        }
                    });
                    return result;
                } else {
                    bIsAccountPass = false;
                    setTipShow(oPhoneInputNode, true, '请您输入正确的手机号');
                    return false;
                }
            }
        });
    }
    function eventOfPhoneKeyUp() {
        eventOfInputEnter(oPhoneInputNode, {
            belongModel: 'company'
        });
    }

    /* 验证码 */
    function codeEvent() {
        eventOfCodeChange();
        eventOfCodeKeyUp();
        codeBtnEvent();
    }
    function eventOfCodeChange() {
        eventOfInputChange(oCodeInputNode);
    }
    function eventOfCodeKeyUp() {
        eventOfInputEnter(oCodeInputNode);
    }
    // 发送验证码按钮事件
    function codeBtnEvent() {
        (createPhoneCodeBtnClickEvent())();
    }

    /* 密码 */
    function passwordEvent() {
        eventOfPasswordChange();
        eventOfPasswordKeyUp();
    }
    function eventOfPasswordChange() {
        eventOfInputChange(oPasswordInputNode, {
            testCallback: function () {
                var value = oPasswordInputNode.val();
                var sCopyPassword = null;
                if (value && value.length > 0) {
                    // if (oPasswordRule.test(value)) {
                        if (value.length < 6 || value.length > 18) {
                            setTipShow(oPasswordInputNode, true, '密码长度需在6-18个字符之间');
                            return false;
                        } else {
                            sCopyPassword = oPasswordCopyInputNode.val();
                            if (sCopyPassword.length > 0) {
                                return passwordCopyVerification();
                            } else {
                                setTipShow(oPasswordInputNode, false);
                                return true;
                            }
                        }
                    } else {
                        setTipShow(oPasswordInputNode, true, '密码由6-18位字母、数字和符号组成');
                        return false;
                    }
                // } else {
                //     setTipShow(oPasswordInputNode, true, '密码不能为空');
                //     return false;
                // }
            }
        });
    }
    function eventOfPasswordKeyUp() {
        eventOfInputEnter(oPasswordInputNode);
    }

    /* 确认密码 */
    function passwordCopyEvent() {
        eventOfPasswordCopyChange();
        eventOfPasswordCopyKeyUp();
    }
    function eventOfPasswordCopyChange() {
        eventOfInputChange(oPasswordCopyInputNode, {
            testCallback: function () {
                var stSave = oPasswordInputNode.val();
                if (stSave && stSave.length > 0) {
                    return passwordCopyVerification();
                } else {
                    setTipShow(oPasswordCopyInputNode, false);
                    return false;
                }
            }
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
        eventOfInputChange(oCreditCodeInputNode, {
            belongModel: 'company'
        });
    }
    function eventOfCreditCodeKeyUp() {
        eventOfInputEnter(oCreditCodeInputNode, {
            belongModel: 'company'
        });
    }

    // 地址绑定事件
    function addressEvent() {
        eventOfInputChange(oProvinceSelectNode,{
            belongModel: 'company',
            testCallback: function () {
                var province = oProvinceSelectNode.val();
                var city = oCitySelectNode.val();
                if (!!province && !!city) {
                    setTipShow(oAddressDetailInputNode, false);
                    return true;
                } else {
                    setTipShow(oAddressDetailInputNode, true, '省市选项不能为空');
                    return false;
                }
            }
        });
        eventOfInputChange(oCitySelectNode,{
            belongModel: 'company',
            testCallback: function () {
                var province = oProvinceSelectNode.val();
                var city = oCitySelectNode.val();
                if (!!province && !!city) {
                    setTipShow(oAddressDetailInputNode, false);
                    return true;
                } else {
                    setTipShow(oAddressDetailInputNode, true, '省市选项不能为空');
                    return false;
                }
            }
        });
    }

    /* 企业地址 */
    function detailAddressEvent() {
        // eventOfDetailAddressChange();
        // eventOfDetailAddressKeyUp();
    }
    function eventOfDetailAddressChange() {
        eventOfInputChange(oAddressDetailInputNode, {
            belongModel: 'company'
        });
    }
    function eventOfDetailAddressKeyUp() {
        eventOfInputEnter(oAddressDetailInputNode, {
            belongModel: 'company'
        });
    }

    /* 联系电话 */
    function contactNumberEvent() {
        eventOfContactNumberChange();
        eventOfContactNumberKeyUp();
    }
    function eventOfContactNumberChange() {
        eventOfInputChange(oContactNumberInputNode, {
            belongModel: 'company',
            testCallback: function () {
                var value = oContactNumberInputNode.val();
                if (oPhoneRule.test(value)) {
                    setTipShow(oContactNumberInputNode, false);
                    return true;
                } else if (oTelPhoneRule.test(value)){
                    setTipShow(oContactNumberInputNode, false);
                    return true;
                } else {
                    setTipShow(oContactNumberInputNode, true, '请您输入正确的联系电话');
                    return false;
                }
            }
        });
    }
    function eventOfContactNumberKeyUp() {
        eventOfInputEnter(oContactNumberInputNode, {
            belongModel: 'company'
        });
    }

    /* 联系人 */
    function contactPeopleEvent() {
        eventOfContactPeopleChange();
        eventOfContactPeopleKeyUp();
    }
    function eventOfContactPeopleChange() {
        eventOfInputChange(oContactPeopleInputNode, {
            belongModel: 'company'
        });
    }
    function eventOfContactPeopleKeyUp() {
        eventOfInputEnter(oContactPeopleInputNode, {
            belongModel: 'company'
        });
    }

    /* 职务 */
    function positionsEvent() {
        eventOfPositionsChange();
        eventOfPositionsKeyUp();
    }
    function eventOfPositionsChange() {
        eventOfInputChange(oPositionInputNode, {
            belongModel: 'company'
        });
    }
    function eventOfPositionsKeyUp() {
        eventOfInputEnter(oPositionInputNode, {
            belongModel: 'company'
        });
    }

    /* 行业 */
    function industryEvent() {
        eventOfIndustryChange();
        eventOfIndustryKeyUp();
    }
    function eventOfIndustryChange() {
        eventOfInputChange(oIndustrySelectNode, {
            belongModel: 'company'
        });
    }
    function eventOfIndustryKeyUp() {
        eventOfInputEnter(oIndustrySelectNode, {
            belongModel: 'company'
        });
    }

    /* 协议 */
    // 协议事件
    function protocolEvent() {
        eventOfProtocolCheckboxChange();
        eventOfProtocolLinkClick();
    }
    // checkbox change事件
    function eventOfProtocolCheckboxChange() {
        eventOfInputChange(oProtocolCheckBoxNode, {
            callback: function () {
                bIsAgreeProtocol = (oProtocolCheckBoxNode.is(':checked'));
                if (bIsAgreeProtocol) {
                    setTipShow(oProtocolCheckBoxNode, false);
                }
            }
        });
    }
    // 链接点击事件
    function eventOfProtocolLinkClick() {
        var stRule = /\s+/g;
        var result = '';
        var config = {
            title: '协议',
            agreements: '暂无内容'
        };
        if (!!protocol) {
            config = Object.assign(config, protocol);
        }
        oProtocolLinkNode.on('click', function () {
            result = sprintf(sProtocolHtml, config);
            __layer.open({
                title: config.title,
                type: 1,
                area: ['700px', '500px'],
                offset: '200px;',
                content: result,
                move: false,
                shadeClose: false
            });
            return false;
        });
    }

    /* 注册按钮 */
    // 提交事件
    function submitBtnEvent() {
        (createBtnSubmitEvent())();
    }
});
