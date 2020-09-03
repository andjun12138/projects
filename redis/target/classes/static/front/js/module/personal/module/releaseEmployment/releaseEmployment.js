$(function () {
    var personalMainObj = window._personal_main_;
    var FuncOfModelCommon = personalMainObj._model_common_;

    function PersonalReleaseEmployment() {
        var _this = this;

        // 初始化ajax
        var _ajax = new NewAjax();
        // 获取当前模块
        var oNowModel = $('#release-employment');
        // form
        var oFormNode = oNowModel.find('.release-employment-form').eq(0);
        // 记录当前表单的状态 编辑：edit;展示：show;
        var sFormStatus = 'edit';
        // 审核状态 未进行：none; 进行中：doing; 通过:pass; 未通过：reject
        var sReviewStatus = 'none';
        // 回显数据
        var oEchoData = null;
        // 招聘id
        var sEmploymentId = null;
        // 用户类型
        var sUserType = null;

        /* 右上角审核状态 */
        var oReviewCircleNode = oNowModel.find('.review-status').eq(0);

        /* 标题 */
        var oNameInputNode = oFormNode.find('.employment-name-input').eq(0);
        var sNameValue = null;

        /* 最低工资 */
        var oSalaryMinInputNode = oFormNode.find('.employment-salary-min-input').eq(0);
        var sSalaryMinValue = null;

        /* 最高工资 */
        var oSalaryMaxInputNode = oFormNode.find('.employment-salary-max-input').eq(0);
        var sSalaryMaxValue = null;

        /* 工作经验 */
        var oExperienceInputNode = oFormNode.find('.employment-experience-input').eq(0);
        var sExperienceValue = null;

        /* 学历 */
        var oEducationSelectNode = oFormNode.find('.education-select').eq(0);
        var oEducationShowNode = oEducationSelectNode.parent().find('p.education-show').eq(0);
        // 选项数据
        var aEducationOptionData = null;
        // 所属学历值
        var sEducationValue = null;

        /* 地址 */
        // 地区选项节点
        var oAddress = oFormNode.find('.address-box').eq(0);
        // 省级节点
        var oProvinceNode = oFormNode.find('.company-province-name').eq(0);
        // 市级节点
        var oCityNode = oFormNode.find('.company-city-name').eq(0);
        // 区级节点
        var oAreaNode = oFormNode.find('.company-district-name').eq(0);
        // 地址展示节点
        var oAddressShowNode = oAddress.parent().find('.address-show').eq(0);
        // 详细地址节点
        var oAddressDetailInputNode = oFormNode.find('.address-detail-input').eq(0);
        // 省值
        var sProvinceValue = null;
        // 市值
        var sCityValue = null;
        // 区值
        var sAreaValue = null;
        // 地址值
        var sAddressValue = null;
        // 详细地址
        var sAddressDetailValue = null;

        /* 所属行业 */
        var oIndustrySelectNode = oFormNode.find('.industry-select').eq(0);
        var oIndustryShowNode = oIndustrySelectNode.parent().find('p.industry-show').eq(0);
        // 选项数据
        var aIndustryOptionData = null;
        // 所属行业值
        var sIndustryValue = null;

        /* 联系人 */
        var oPeopleInputNode = oFormNode.find('.concat-person-input').eq(0);
        // 联系人值
        var sPeopleValue = null;

        /* 联系电话 */
        var oPhoneInputNode = oFormNode.find('.concat-phone-input').eq(0);
        // 联系电话值
        var sPhoneValue = null;
        // 电话正则
        var oPhoneRule = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;

        /* 联系邮箱 */
        var oEmailInputNode = oFormNode.find('.concat-email-input').eq(0);
        // 联系邮箱值
        var sEmailValue = null;

        /* 联系邮箱 */
        var oIntroductionInputNode = oFormNode.find('.job-introduction-input').eq(0);
        // 联系邮箱值
        var sIntroductionValue = null;

        /* 职位描述 */
        var oDescriptionInputNode = oFormNode.find('.job-description-input').eq(0);
        // 职位描述值
        var sDescriptionValue = null;

        /* 按钮 */
        // 提交按钮
        var oSubmitBtn = oFormNode.find('.release-employment-submit').eq(0);
        // 重置按钮
        var oResetBtn = oFormNode.find('.release-employment-again').eq(0);
        // 修改按钮
        var oEditBtn = oFormNode.find('.release-employment-edit').eq(0);

        /* 申请企业 */
        // 申请企业模块
        var oApplicationModel = oNowModel.find('.application-company-div').eq(0);
        // 申请按钮
        var oApplicationBtn = oApplicationModel.find('.active-button').eq(0);

        allEvent();

        _this.init = function () {
            getUserType();
            initForm();
            initApplication();
            // getFormData();
        };
        // 是否开启申请转成企业功能
        _this.isEnableApplicationCompany = function (isEnable) {
            setApplicationEnable(isEnable);
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
         * 作用：用于开启关闭input的清除按钮
         * @param inputNode
         */
        function setCleanIcon(inputNode) {
            // 不是编辑模式不执行
            if (sFormStatus !== 'edit') {
                return false;
            }
            var value = inputNode.val();
            var oCleanNode = inputNode.parents('.form-group').eq(0).find('.icon-error').eq(0);
            if (value.length > 0) {
                if (!oCleanNode.hasClass('show')) {
                    oCleanNode.addClass('show');
                }
            } else {
                if (oCleanNode.hasClass('show')) {
                    oCleanNode.removeClass('show');
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
         * 作用:检测必填项
         * @returns {boolean}
         */
        function submitItemTest() {
            var stSave = {
                name: inputTest(oNameInputNode, {isJudge: isRequired(oNameInputNode)}),
                address: addressTest(),
                addressDetail: inputTest(oAddressDetailInputNode, {isJudge: isRequired(oAddressDetailInputNode)}),
                phone: inputTest(oPhoneInputNode, {
                    isJudge: isRequired(oPhoneInputNode),
                    callback: function () {
                        var value = oPhoneInputNode.val();
                        if (!oPhoneRule.test(value)) {
                            setTipShow(oPhoneInputNode, true, '请输入正确的联系电话');
                            return false;
                        } else {
                            setTipShow(oPhoneInputNode, false);
                            return true;
                        }
                    }
                }),
                people: inputTest(oPeopleInputNode, {isJudge: isRequired(oPeopleInputNode)})
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

        // 地址验证
        function addressTest() {
            if (sProvinceValue && sCityValue) {
                setTipShow(oAddress, false);
                return true;
            } else {
                setTipShow(oAddress, true, '地区选项不能放空');
                return false;
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
         * 初始化普通select
         * @param selectNode
         * @returns {*}
         */
        function initNormalSelect(selectNode) {
            var options = selectNode.children();
            var value = null;
            if (options.length > 0) {
                value = options.eq(0).val();
                selectNode.val(value);
            } else {
                selectNode.val('');
            }
            return value;
        }

        /**
         * 设置是否启动申请企业
         * @param isEnable
         */
        function setApplicationEnable(isEnable) {
            // 启用
            if (!!isEnable) {
                if (!!oApplicationModel) {
                    oApplicationModel.css({
                        right: 0
                    }).show();
                }
                sFormStatus = 'show';
            } else {// 不启用
                if (!!oApplicationModel) {
                    oApplicationModel.hide();
                }
                sFormStatus = 'edit';
            }
        }

        /**
         * 获取用户类型
         */
        function getUserType() {
            if (!(!!sUserType) && personalMainObj && personalMainObj.getUserType) {
                sUserType = personalMainObj.getUserType();
            }
        }


        /* 主体函数 */

        /* 初始化 */
        function initForm() {
            initName();
            initSalary();
            initExperience();
            initEducation();
            initAddressModel();
            initAddressDetail();
            initIndustry();
            initPeople();
            initPhone();
            initEmail();
            initIntroduction();
            initDescription();
        }

        // 初始化名称
        function initName() {
            initNormalInput(oNameInputNode);
            sNameValue = null;
        }

        // 初始化工资
        function initSalary() {
            // initNormalInput(oSalaryMinInputNode);
            // initNormalInput(oSalaryMaxInputNode);
            sSalaryMinValue = null;
            sSalaryMaxValue = null;
        }

        // 初始化工作经验
        function initExperience() {
            initNormalInput(oExperienceInputNode);
            sExperienceValue = null;
        }

        // 初始化学历
        function initEducation() {
            var aOptions = oEducationSelectNode.children();
            aEducationOptionData = [];
            sIndustryValue = initNormalSelect(oEducationSelectNode);
            // 获取选项数据
            aOptions.each(function () {
                var stSave = $(this);
                var obj = {};
                obj.id = stSave.attr('value');
                obj.title = stSave.text();
                aEducationOptionData.push(obj);
            })
        }

        // 初始化地区模块
        function initAddressModel() {
            oAddress.distpicker("destroy");
            oAddress.distpicker({
                province: '广东省',
                city: '惠州市',
                district: '惠城区'
            });
            sProvinceValue = '广东省';
            sCityValue = '惠州市';
            sAreaValue = '惠城区';
            sAddressValue = '';
        }

        // 初始化详细地址
        function initAddressDetail() {
            initNormalInput(oAddressDetailInputNode);
            sAddressDetailValue = null;
        }

        // 初始化所属行业
        function initIndustry() {
            var aOptions = oIndustrySelectNode.children();
            aIndustryOptionData = [];
            sIndustryValue = initNormalSelect(oIndustrySelectNode);
            // 获取选项数据
            aOptions.each(function () {
                var stSave = $(this);
                var obj = {};
                obj.id = stSave.attr('value');
                obj.title = stSave.text();
                aIndustryOptionData.push(obj);
            })
        }

        // 初始化联系人
        function initPeople() {
            initNormalInput(oPeopleInputNode);
            sPeopleValue = null;
        }

        // 初始化电话
        function initPhone() {
            initNormalInput(oPhoneInputNode);
            sPhoneValue = null;
        }

        // 初始化邮箱
        function initEmail() {
            initNormalInput(oEmailInputNode);
            sEmailValue = null;
        }

        // 初始化简介
        function initIntroduction() {
            initNormalInput(oIntroductionInputNode);
            sIntroductionValue = null;
        }

        // 初始化描述
        function initDescription() {
            initNormalInput(oDescriptionInputNode);
            sDescriptionValue = null;
        }

        /* 获取回显数据 */
        function getFormData() {
            oEchoData = null;
            // 获取所有回显数据
            if (personalMainObj && personalMainObj.getCompanyInfo) {
                // 这里是异步操作
                personalMainObj.getCompanyInfo(function (data) {
                    if (data) {
                        oEchoData = data;
                        giveData();
                        // 不启动
                        setApplicationEnable(false);
                    } else {
                        oEchoData = {};
                        sProvinceValue = '广东省';
                        sCityValue = '佛山市';
                        sAreaValue = '南海区';
                        sAddressValue = '广东省佛山市南海区';
                        if (sUserType === 'user') {
                            setApplicationEnable(true);
                        }
                    }
                    importEchoData();
                    // 根据数据跟新表单状态
                    updateFormStatus();
                    setFormStatus();
                });
            } else {
                throw new Error('个人中心功能缺失！');
            }
        }

        // 分配数据
        function giveData() {
            sEmploymentId = oEchoData.id;
            sNameValue = oEchoData.name;
            sCreditCodeValue = oEchoData.unifiedSocialCredit;
            sProvinceValue = oEchoData.provinceName || '广东省';
            sCityValue = oEchoData.cityName || '佛山市';
            sAreaValue = oEchoData.areaName || '南海区';
            sAddressValue = oEchoData.address || '广东省佛山市南海区';
            sAddressDetailValue = oEchoData.detailAddress;
            sPhoneValue = oEchoData.phone;
            sPeopleValue = oEchoData.contact;
            sIndustryValue = oEchoData.belongIndustry;
        }

        // 更新表单状态
        function updateFormStatus() {
            var sReviewId = null;
            if (oEchoData.status) {
                sReviewId = oEchoData.status;
                switch (sReviewId) {
                    case '019a934e-488f-11e9-880c-20040fed244c':
                        sReviewStatus = 'doing';
                        sFormStatus = 'show';
                        break;
                    case '15d90aa6-488f-11e9-880c-20040fed244c':
                        sReviewStatus = 'pass';
                        sFormStatus = 'show';
                        break;
                    case '0ba408c8-488f-11e9-880c-20040fed244c':
                        sReviewStatus = 'reject';
                        sFormStatus = 'show';
                        break;
                    default:
                        break;
                }
            } else {
                sReviewStatus = 'none';
                sFormStatus = 'edit';
            }
        }

        /* 写入回显数据 */
        function importEchoData() {
            importNormalInputData();
            importAddress();
            importIndustry();
        }

        // 普通input写入
        function importNormalInputData() {
            if (sNameValue) {
                oNameInputNode.val(sNameValue);
            }
            if (sAddressDetailValue) {
                oAddressDetailInputNode.val(sAddressDetailValue);
            }
            if (sPhoneValue) {
                oPhoneInputNode.val(sPhoneValue);
            }
            if (sPeopleValue) {
                oPeopleInputNode.val(sPeopleValue);
            }
        }

        // 写入地区模块
        function importAddress() {
            oAddress.distpicker("destroy");
            oAddress.distpicker({
                province: sProvinceValue,
                city: sCityValue,
                district: sAreaValue
            });
            oAddressShowNode.text(sAddressValue);
        }

        // 写入所属行业
        function importIndustry() {
            var nIndex = null;
            if (sIndustryValue) {
                oIndustrySelectNode.val(sIndustryValue);
                nIndex = aIndustryOptionData.searchArrayObj(sIndustryValue, 'id');
                if (nIndex > -1) {
                    oIndustryShowNode.text(aIndustryOptionData[nIndex].title);
                }
            }
        }

        /* form表单模式切换 */
        function setFormStatus() {
            var bIsShow = (sFormStatus === 'show');
            // 更改审核图标
            switch (sReviewStatus) {
                case 'none':
                    oReviewCircleNode.hide();
                    break;
                case 'doing':
                    oReviewCircleNode.css({
                        borderColor: '#808080',
                        color: '#808080'
                    }).text('审核中');
                    break;
                case 'pass':
                    oReviewCircleNode.css({
                        borderColor: '#00ff00',
                        color: '#00ff00'
                    }).text('通过');
                    break;
                case 'reject':
                    oReviewCircleNode.css({
                        borderColor: '#ff0000',
                        color: '#ff0000'
                    }).text('不通过');
                    break;
                default:
                    break;
            }
            // 处理表单
            if (bIsShow) {
                oFormNode.addClass('form-show');
                oReviewCircleNode.show();
            } else {
                oFormNode.removeClass('form-show');
                oReviewCircleNode.hide();
            }
            oNameInputNode.prop({
                readOnly: bIsShow
            });
            setCleanIcon(oNameInputNode);
            oAddressDetailInputNode.prop({
                readOnly: bIsShow
            });
            setCleanIcon(oAddressDetailInputNode);
            oPhoneInputNode.prop({
                readOnly: bIsShow
            });
            setCleanIcon(oPhoneInputNode);
            oPeopleInputNode.prop({
                readOnly: bIsShow
            });
            setCleanIcon(oPeopleInputNode);
            /* oIndustryInputNode.prop({
                 readOnly: bIsShow
             });
             setCleanIcon(oIndustryInputNode);*/
            if (sReviewStatus === 'doing') {
                oEditBtn.hide();
            } else if (bIsShow) {
                oEditBtn.show();
            }
        }

        /* 申请企业 */

        // 初始化申请企业
        function initApplication() {
            if (!!oApplicationModel) {
                oApplicationModel.css({
                    height: (oNowModel.height() - 42) + 'px'
                })
            }
        }

        // 设置申请模块显示
        function setApplicationShow(isShow) {
            if (!(!!oApplicationModel)) {
                return false;
            }
            if (isShow) {
                oApplicationModel.animate({
                    right: 0
                }, 1000, function () {
                    setApplicationEnable(true);
                });
            } else {
                oApplicationModel.animate({
                    right: '100%'
                }, 1000, function () {
                    setApplicationEnable(false);
                });
            }
        }

        /* 事件 */
        function allEvent() {
            cleanClick();
            nameEvent();
            addressEvent();
            salaryMinEvent();
            salaryMaxEvent();
            experienceEvent();
            educaEvent();
            addressDetailEvent();
            industryEvent();
            peopleEvent();
            phoneEvent();
            emailEvent();
            introductionEvent();
            descriptionEvent();
            submitEvent();
            resetEvent();
            editEvent();
            ApplicationEvent();
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

        // 最低工资事件
        function nameEvent() {
            eventOfInput(oNameInputNode, {
                callback: function (res) {
                    if (res) {
                        sNameValue = oNameInputNode.val();
                    }
                }
            });
            eventOfInput(oNameInputNode, {
                eventType: 'input',
                callback: function () {
                    setCleanIcon(oNameInputNode);
                }
            });
        }

        // 最低事件
        function salaryMinEvent() {
            eventOfInput(oSalaryMinInputNode, {
                callback: function (res) {
                    if (res) {
                        sSalaryMinValue = oSalaryMinInputNode.val();
                    }
                }
            });
            eventOfInput(oSalaryMinInputNode, {
                eventType: 'input',
                callback: function () {
                    setCleanIcon(oSalaryMaxInputNode);
                }
            });
        }

        // 最高事件
        function salaryMaxEvent() {
            eventOfInput(oSalaryMaxInputNode, {
                callback: function (res) {
                    if (res) {
                        sSalaryMaxValue = oSalaryMaxInputNode.val();
                    }
                }
            });
            eventOfInput(oSalaryMaxInputNode, {
                eventType: 'input',
                callback: function () {
                    setCleanIcon(oSalaryMinInputNode);
                }
            });
        }

        // 经验事件
        function experienceEvent() {
            eventOfInput(oExperienceInputNode, {
                callback: function (res) {
                    if (res) {
                        sExperienceValue = oExperienceInputNode.val();
                    }
                }
            });
            eventOfInput(oExperienceInputNode, {
                eventType: 'input',
                callback: function () {
                    setCleanIcon(oExperienceInputNode);
                }
            });
        }

        // 学历
        function educaEvent() {
            var nIndex = null;
            oEducationSelectNode.on('change', function () {
                sEducationValue = oEducationSelectNode.val();
                nIndex = aEducationOptionData.searchArrayObj(sEducationValue, 'id');
                oEducationShowNode.text(aEducationOptionData[nIndex].title);
            });
        }

        // 地址事件
        function addressEvent() {
            eventOfProvinceChange();
            eventOfCityChange();
            eventOfDistrictChange();
        }

        // 省监听
        function eventOfProvinceChange() {
            oProvinceNode.on('change', upDateAddress)
        }

        // 市监听
        function eventOfCityChange() {
            oCityNode.on('change', upDateAddress);
        }

        // 区监听
        function eventOfDistrictChange() {
            oAreaNode.on('change', upDateAddress);
        }

        // 更新地区值
        function upDateAddress() {
            sProvinceValue = oProvinceNode.val();
            sCityValue = oCityNode.val();
            sAreaValue = oAreaNode.val();
            sAddressValue = ((sProvinceValue) ? sProvinceValue : '') + ((sCityValue) ? sCityValue : '') + ((sAreaValue) ? sAreaValue : '');
            oAddressShowNode.text(sAddressValue);
        }

        // 详细地址
        function addressDetailEvent() {
            eventOfInput(oAddressDetailInputNode, {
                callback: function (res) {
                    if (res) {
                        sAddressDetailValue = oAddressDetailInputNode.val();
                    }
                }
            });
            eventOfInput(oAddressDetailInputNode, {
                eventType: 'input',
                callback: function () {
                    setCleanIcon(oAddressDetailInputNode);
                }
            });
        }

        // 所属行业事件
        function industryEvent() {
            var nIndex = null;
            oIndustrySelectNode.on('change', function () {
                sIndustryValue = oIndustrySelectNode.val();
                nIndex = aIndustryOptionData.searchArrayObj(sIndustryValue, 'id');
                oIndustryShowNode.text(aIndustryOptionData[nIndex].title);
            });
        }

        // 联系人事件
        function peopleEvent() {
            eventOfInput(oPeopleInputNode, {
                callback: function (res) {
                    if (res) {
                        sPeopleValue = oPeopleInputNode.val();
                    }
                }
            });
            eventOfInput(oPeopleInputNode, {
                eventType: 'input',
                callback: function () {
                    setCleanIcon(oPeopleInputNode);
                }
            });
        }

        // 联系电话事件
        function phoneEvent() {
            eventOfInput(oPhoneInputNode, {
                testCallback: function () {
                    var value = oPhoneInputNode.val();
                    if (!oPhoneRule.test(value)) {
                        setTipShow(oPhoneInputNode, true, '请输入正确的联系电话');
                        return false;
                    } else {
                        setTipShow(oPhoneInputNode, false);
                        return true;
                    }
                },
                callback: function (res) {
                    if (res) {
                        sPhoneValue = oPhoneInputNode.val();
                    }
                }
            });
            eventOfInput(oPhoneInputNode, {
                eventType: 'input',
                callback: function () {
                    setCleanIcon(oPhoneInputNode);
                }
            });
        }

        // 邮箱事件
        function emailEvent() {
            eventOfInput(oEmailInputNode, {
                callback: function (res) {
                    if (res) {
                        sEmailValue = oEmailInputNode.val();
                    }
                }
            });
            eventOfInput(oEmailInputNode, {
                eventType: 'input',
                callback: function () {
                    setCleanIcon(oEmailInputNode);
                }
            });
        }

        // 简介事件
        function introductionEvent() {
            eventOfInput(oIntroductionInputNode, {
                callback: function (res) {
                    if (res) {
                        sIntroductionValue = oIntroductionInputNode.val();
                    }
                }
            });
            eventOfInput(oIntroductionInputNode, {
                eventType: 'input',
                callback: function () {
                    setCleanIcon(oIntroductionInputNode);
                }
            });
        }

        // 描述事件
        function descriptionEvent() {
            eventOfInput(oDescriptionInputNode, {
                callback: function (res) {
                    if (res) {
                        sDescriptionValue = oDescriptionInputNode.val();
                    }
                }
            });
            eventOfInput(oDescriptionInputNode, {
                eventType: 'input',
                callback: function () {
                    setCleanIcon(oDescriptionInputNode);
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
                var url = null;
                if (isSubmit || sFormStatus !== 'edit') {
                    return 0;
                }
                if (!submitItemTest()) {
                    __layer.msg('请先改正错误');
                    return 0;
                }
                isSubmit = true;
                url = '/employment/create_update';
                config = {
                    title: sNameValue,
                    wageStart: sSalaryMinValue,     //工资1
                    wageEnd: sSalaryMaxValue,       //工资2
                    workExperience: sExperienceValue,
                    education: sEducationValue,//学历枚举
                    address: sAddressValue,
                    provinceName: sProvinceValue,
                    cityName: sCityValue,
                    areaName: sAreaValue,
                    detailAddress: sAddressDetailValue,
                    industry: sIndustryValue,//所属行业枚举
                    contact: sPeopleValue,
                    contactNumber: sPhoneValue,
                    contactEmail: sEmailValue,
                    jobDescription: sIntroductionValue,
                    workDetail: sDescriptionValue,
                };
                if (sEmploymentId) {
                    config.id = sEmploymentId
                }
                layui = __layer.load(2, {shade: [0.5, '#ffffff']});
                _ajax.post('default', {
                    url: url,
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    data: JSON.stringify(config),
                    success: function (res) {
                        isSubmit = false;
                        __layer.close(layui);
                        if (res.status === 200) {
                            __layer.msg('发布招聘成功');
                            // 初始化表单
                            _this.init();
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

        // 修改事件
        function editEvent() {
            oEditBtn.on('click', function () {
                if (sFormStatus !== 'show') {
                    return false;
                }
                sFormStatus = 'edit';
                // 切换模式
                setFormStatus();
            });
        }

        // 企业申请事件
        function ApplicationEvent() {
            var isApplication = false;
            var layerLoad = null;
            oApplicationBtn.on('click', function () {
                if (isApplication) {
                    __layer.closeAll();
                    __layer.msg('对申请企业权限进行验证中，请勿重复操作！');
                    return false;
                }
                isApplication = true;
                layerLoad = __layer.load(2, {shade: [0.5, '#ffffff']});
                _ajax.post('default', {
                    url: '/enterCertification/canEnterCertification',
                    contentType: "application/json;charset=UTF-8",
                    dataType: "json",
                    data: '{}',
                    success: function (res) {
                        isApplication = false;
                        __layer.close(layerLoad);
                        if (res.status === 200) {
                            __layer.msg('用户可升级为企业');
                            setApplicationShow(false);
                        }
                    },
                    error: function (err) {
                        isApplication = false;
                        var data = err.responseJSON;
                        console.log(data);
                        __layer.close(layerLoad);
                        __layer.msg(data.message);
                    }
                })
            })
        }
    }

    PersonalReleaseEmployment.prototype = new FuncOfModelCommon();

    FuncOfModelCommon = null;

    personalMainObj.setMethodObj('releaseEmployment', new PersonalReleaseEmployment());
});
