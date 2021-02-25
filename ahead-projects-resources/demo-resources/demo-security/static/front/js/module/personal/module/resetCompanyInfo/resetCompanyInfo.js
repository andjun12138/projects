$(function () {
    var personalMainObj = window._personal_main_;

    var FuncOfModelCommon = personalMainObj._model_common_;

    function PersonalResetCompanyInfo() {
        var _this = this;

        // 初始化ajax
        var _ajax = new NewAjax();
        // 获取当前模块
        var oNowModel = $('#reset-company-info');
        // form
        var oFormNode = oNowModel.find('.reset-company-info-form').eq(0);
        // 记录当前表单的状态 编辑：edit;展示：show;
        var sFormStatus = 'edit';
        // 审核状态 未进行：none; 进行中：doing; 通过:pass; 未通过：reject
        var sReviewStatus = 'none';
        // 回显数据
        var oEchoData = null;
        // 企业信息
        var sCompanyId = null;
        // 用户类型
        var sUserType = null;
        // 空格正则
        var oWarpRule = />?\s+<|>\s+<?/g;

        /* 右上角审核状态 */
        var oReviewCircleNode = oNowModel.find('.review-status').eq(0);

        /* 企业头像 */
        var oLogoInputNode = oFormNode.find('.company-logo-input').eq(0);
        // logo 对应的父节点
        var oLogoParentNode = oLogoInputNode.parents('.company-logo-model').eq(0);
        // logo 展示节点
        var oLogoShowNode = oLogoParentNode.find('img.company-logo').eq(0);
        var sLogoValue = null;
        var bIsLogoUpload = false;

        /* 企业名 */
        var oNameInputNode = oFormNode.find('.company-name-input').eq(0);
        var sNameValue = null;
        // 存储已经通过的企业名，防止填已通过名称触发“同名检测”的bug
        var sTrueName = null;

        /* 信用代码 */
        var oCreditCodeInputNode = oFormNode.find('.credit-code-input').eq(0);
        var sCreditCodeValue = null;
        // 正则
        var oCreditCodeRule = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/;

        /* 企业地址 */
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

        /* 联系电话 */
        var oPhoneInputNode = oFormNode.find('.concat-phone-input').eq(0);
        // 联系电话值
        var sPhoneValue = null;
        // 电话正则
        var oPhoneRule = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;

        /* 邮箱 */
        // 邮箱正则
        var oEmailRule = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

        /* 联系人 */
        var oPeopleInputNode = oFormNode.find('.concat-person-input').eq(0);
        // 联系人值
        var sPeopleValue = null;

        /* 职务 */
        var oPositionInputNode = oFormNode.find('.position-input').eq(0);
        // 职务值
        var sPositionValue = null;

        /* 所属行业 */
        var oIndustrySelectNode = oFormNode.find('.industry-select').eq(0);
        var oIndustryShowNode = oIndustrySelectNode.parent().find('p.industry-show').eq(0);
        // 选项数据
        var aOptionData = null;
        // 所属行业值
        var sIndustryValue = null;

        /* 按钮 */
        // 提交按钮
        var oSubmitBtn = oFormNode.find('.reset-company-info-submit').eq(0);
        // 重置按钮
        var oResetBtn = oFormNode.find('.reset-company-info-again').eq(0);
        // 修改按钮
        var oEditBtn = oFormNode.find('.reset-company-info-edit').eq(0);

        /* 申请企业 */
        // 申请企业模块
        var oApplicationModel = oNowModel.find('.application-company-div').eq(0);
        // 申请按钮
        var oApplicationBtn = oApplicationModel.find('.active-button').eq(0);

        /* 截图插件 */
        // 截图实例
        var oScreenshot = null;
        // 截图layerOpen标志
        var screenshotLayerIndex = null;
        // layer 弹框的承载html
        var sLayerArea = '<div class="layer-open-screenshot-div">\n' +
            '            <div class="screenshot-show-div">\n' +
            '                <div class="image-div" style="width: 300px; height: 131px">\n' +
            '                    <img src="" alt="" class="image">\n' +
            '                </div>\n' +
            '            </div>\n' +
            '            <div id="%id%" class="screenshot-edit-div">\n' +
            '            </div>\n' +
            '            <div class="screenshot-btn-div">\n' +
            '                <button class="active-button submit">确定</button>\n' +
            '                <button class="active-button close">取消</button>\n' +
            '            </div>\n' +
            '        </div>';
        // 截图的url
        var sNewPictureUrl = null;
        // 获取全局截图模块
        var oScreenshotModel = null;
        // logo展示节点
        var oScreenshotShowNode = null;
        // 确认按钮
        var oScreenshotSubmitBtn = null;
        // 取消按钮
        var oScreenshotCloseBtn = null;
        // 弹窗宽度,ps：不可低于300
        var layerWindowWidth = 800;

        /* 简介 */
        // 简介节点
        var oIntroductionInputNode = oFormNode.find('.company-introduction').eq(0);
        // 富文本
        // var oRichTextOfIntroduction = null;
        // 简介内容
        var sIntroductionValue = null;
        // 简介iframe
        // var oIntroductionIframeNode = null;
        // 简介富文本是否初始化完毕
        // var bIsIntroductionInitFinish = false;



        allEvent();
        // 初始化截图插件
        initScreenshot();

        _this.init = function () {
            getUserType();
            initForm();
            initApplication();
            getFormData();
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
                oTipNode = oInputDivNode.parents('.form-group').eq(0).find('.input-tip').eq(0);
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
                logo: logoTest(),
                name: inputTest(oNameInputNode, {isJudge: isRequired(oNameInputNode)}),
                creditCode: inputTest(oCreditCodeInputNode, {
                    isJudge: isRequired(oCreditCodeInputNode),
                    callback: function () {
                        var value = oCreditCodeInputNode.val();
                        if (!oCreditCodeRule.test(value)) {
                            setTipShow(oCreditCodeInputNode, true, '请输入正确的统一社会信用代码');
                            return false;
                        } else {
                            setTipShow(oCreditCodeInputNode, false);
                            return true;
                        }
                    }
                }),
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
                people: inputTest(oPeopleInputNode, {isJudge: isRequired(oPeopleInputNode)}),
                introduction:  inputTest(oIntroductionInputNode, {isJudge: isRequired(oIntroductionInputNode)})
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
            setCleanIcon(inputNode);
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

        /**
         * 处理错误信息
         * @param data
         * @param callback
         */
        function dealWithErrorData(data, callback) {
            var status = data.status;
            var msg = data.message;
            if (status !== 303) {
                setLayerMsg(msg);
            }
            if (callback) {
                callback();
            } else {
                // 账号密码错误
                if (status === 405) {
                }
            }
        }

        /**
         * 作用：提交文件
         * @param files 上传文件
         * @param config 配置数据
         */
        function uploadFile(files, config) {
            var xhr = (config && config.xhr) ? config.xhr : null;
            var success = (config && config.success) ? config.success : null;
            var error = (config && config.error) ? config.error : null;
            _ajax.post('file', {
                url: "/adjuncts/file_upload",
                data: files,
                async: true,
                processData: false,
                contentType: false,
                xhr: function () {
                    var myXhr = $.ajaxSettings.xhr();
                    if (xhr) {
                        xhr(myXhr);
                    }
                    return myXhr;
                },
                success: function (res) {
                    if (success) {
                        success(res);
                    }
                },
                error: function (err) {
                    if (error) {
                        error(err);
                    }
                }
            });
        }

        /**
         * 作用：初始化CKEditor
         * @param name
         */
        /*function initCKEditor(name) {
            return CKEDITOR.replace(name, {
                resize_enabled: false,
                autoUpdateElement: true,
                height: 200,
                toolbarGroups: [
                    {name: 'document', groups: []},
                    {name: 'clipboard', groups: []},
                    {name: 'editing', groups: []},
                    {name: 'forms', groups: ['forms']},
                    '/',
                    {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
                    {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
                    {name: 'links', groups: ['links']},
                    {name: 'insert', groups: ['insert']},
                    '/',
                    {name: 'styles', groups: ['styles']},
                    {name: 'colors', groups: ['colors']},
                    {name: 'tools', groups: ['tools']},
                    {name: 'others', groups: ['others']},
                    {name: 'about', groups: ['about']}
                ]
            })
        }*/

        /**
         * 开启layer.message
         * @param message 要提示的字符串
         */
        function setLayerMsg(message) {
            __layer.closeAll();
            __layer.msg(message);
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

        /* 主体函数 */

        /* 初始化 */
        function initForm() {
            initLogo();
            initName();
            initCreditCode();
            initAddressModel();
            initAddressDetail();
            initPhone();
            initPeople();
            initPosition();
            initIndustry();
            initIntroduction();
        }

        // 初始化头像
        function initLogo() {
            initNormalInput(oLogoInputNode);
            oLogoShowNode.attr('src', null);
            // 为了显示 “+” 号
            oLogoParentNode.attr('data-percentage', 0);
            sLogoValue = null;
        }

        // 初始化名称
        function initName() {
            initNormalInput(oNameInputNode);
            sNameValue = null;
        }

        // 初始化信用代码
        function initCreditCode() {
            initNormalInput(oCreditCodeInputNode);
            sCreditCodeValue = null;
        }

        // 初始化地区模块
        function initAddressModel() {
            oAddress.distpicker("destroy");
            oAddress.distpicker({
                province: '广东省',
                city: '佛山市',
                district: '南海区'
            });
            sProvinceValue = '广东省';
            sCityValue = '佛山市';
            sAreaValue = '南海区';
            sAddressValue = '广东省佛山市南海区';
        }

        // 初始化详细地址
        function initAddressDetail() {
            initNormalInput(oAddressDetailInputNode);
            sAddressDetailValue = null;
        }

        // 初始化电话
        function initPhone() {
            initNormalInput(oPhoneInputNode);
            sPhoneValue = null;
        }

        // 初始化联系人
        function initPeople() {
            initNormalInput(oPeopleInputNode);
            sPeopleValue = null;
        }

        // 初始化职务
        function initPosition() {
            initNormalInput(oPositionInputNode);
            sPositionValue = null;
        }

        // 所属行业
        function initIndustry() {
            var aOptions = oIndustrySelectNode.children();
            aOptionData = [];
            sIndustryValue = initNormalSelect(oIndustrySelectNode);
            // 获取选项数据
            aOptions.each(function () {
                var stSave = $(this);
                var obj = {};
                obj.id = stSave.attr('value');
                obj.title = stSave.text();
                aOptionData.push(obj);
            })
        }

        // 初始化简介
        function initIntroduction() {
            initNormalInput(oIntroductionInputNode);
            // 这里赋值null,等后面
            sIntroductionValue = null;
            // 没初始化过才初始化
            /*if (!(!!oRichTextOfIntroduction)) {
                initRichText();
            } else {
                bIsIntroductionInitFinish = true;
            }*/
        }

        // 初始化富文本
        /*function initRichText(callback) {
            oRichTextOfIntroduction = initCKEditor('company-introduction');
            // 异步任务
            oRichTextOfIntroduction.on('instanceReady', function (event) {
                bIsIntroductionInitFinish = true;
                // 富文本展示节点，可以通过修改此节点来修改展示内容
                oIntroductionIframeNode = $(oRichTextOfIntroduction.element.$).next().find('iframe').eq(0);
                oRichTextOfIntroduction.setData(sIntroductionValue);
                introductionEvent();
                if (callback) {
                    callback(oRichTextOfIntroduction);
                }
            });
        }*/

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
                        // 不启动申请企业功能
                        setApplicationEnable(false);
                    } else {
                        oEchoData = {};
                        sProvinceValue = '广东省';
                        sCityValue = '佛山市';
                        sAreaValue = '南海区';
                        sAddressValue = '广东省佛山市南海区';
                        // 启动申请企业功能
                        if (sUserType === 'user') {
                            setApplicationEnable(true);
                        }
                    }
                    renderEchoData();
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
            sCompanyId = oEchoData.id;
            sLogoValue = oEchoData.logo;
            sNameValue = oEchoData.name;
            // 保存原本通过的名称
            sTrueName = sNameValue;
            sCreditCodeValue = oEchoData.unifiedSocialCredit;
            sProvinceValue = oEchoData.provinceName || '广东省';
            sCityValue = oEchoData.cityName || '佛山市';
            sAreaValue = oEchoData.areaName || '南海区';
            sAddressValue = oEchoData.address || '广东省佛山市南海区';
            sAddressDetailValue = oEchoData.detailAddress;
            sPhoneValue = oEchoData.phone;
            sPeopleValue = oEchoData.contact;
            sPositionValue = oEchoData.positions;
            sIndustryValue = (oEchoData.belongIndustry) ? JSON.parse(oEchoData.belongIndustry).id : null;
            sIntroductionValue = oEchoData.introduction;
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

        // 加载截图插件
        function initScreenshot(callback) {
            // 插件已加载
            if (!!window.ScreenshotPlugin) {
                if (!!callback) {
                    callback();
                }
            } else { // 插件未加载
                personalMainObj.loadResource({
                    moduleName: 'resetCompanyInfo',
                    pluginName: 'ScreenshotPlugin',
                    vNode: {
                        tag: 'script',
                        src: '/static/plugin/self/screenshot/screenShot.js?time=' + new Date().getTime()
                    },
                    callback: function (data) {
                        // 类型
                        var type = data.type;
                        // 获取dom节点
                        var node = data.node;
                        // 加载节点
                        if (type === 'success') {// 加载成功
                            if (!!callback) {
                                callback();
                            }
                        } else if (type === 'error') {// 未能加载成功
                            __layer.confirm('ScreenshotPlugin插件引入失败，是否重新引入?', {
                                title: '资源引入失败'
                            }, function (index) {
                                __layer.close(index);
                                // 删除dom节点
                                node.remove();
                                node = null;
                                // 确定
                                initScreenshot(callback);
                            }, function (index) {
                                // 取消
                                __layer.close(index);
                            });
                        }
                    }
                });
            }
        }

        // 截图弹框初始化
        function layerOpenScreenshot (imgNode) {
            // 获取截图插件父框id
            var id = 'screenshot-' + new Date().getTime().toString(16);
            // 获取el
            var el = document.documentElement;
            // 替换参数
            var replaceConfig = {
                id: id,
                content: ''
            };
            // 弹窗打开
            screenshotLayerIndex = __layer.open({
                // 采用写入html的方式
                type: 1,
                title: '截图',
                // 显示关闭按钮
                closeBtn: 1,
                // 开启遮罩层
                shade: true,
                // 定义宽高
                area: layerWindowWidth + 'px',
                // 居中
                offset: '50px',
                // 不自动关闭
                time: 0,
                // 底向上划入动画
                anim: 0,
                // 弹出的内容
                content: sprintf(sLayerArea, replaceConfig),
                // 打开成功
                success: function () {
                    // 获取截图模块节点
                    oScreenshotModel = $('div.layer-open-screenshot-div').eq(0);
                    // 获取确定按钮
                    oScreenshotSubmitBtn = oScreenshotModel.find('button.submit').eq(0);
                    // 取消按钮
                    oScreenshotCloseBtn = oScreenshotModel.find('button.close').eq(0);
                    // logo 节点
                    oScreenshotShowNode = oScreenshotModel.find('img.image').eq(0);
                    // 绑定事件
                    bindScreenshotBtnEvent();
                    // new 截图实例
                    if (!(!!oScreenshot)) {
                        oScreenshot = new ScreenshotPlugin(id);
                    }
                    // 写入截图数据
                    setScreenshot(imgNode);

                },
                // 关闭事件
                cancel: function(index) {
                    __layer.close(index);
                },
                // 图层销毁回调
                end: function () {
                    // 销毁截图实例
                    oScreenshot = null;
                    unBindScreenshotBtnEvent();
                }
            });
        }

        // 初始化截图插件
        function setScreenshot(imgNode) {
            oScreenshot.setResultCallback(function (fileStr) {
                // 若非截图时间
                if (sFormStatus === 'show') {
                    return 0;
                }
                oScreenshotShowNode.attr({
                    src: fileStr
                });
            }).setShowCanvasSize(layerWindowWidth - 60, 350)
                .setGetImageFromOutSide(true)
                .setCutCanvasWidthHeightRatio(400, 175);
            if (!!imgNode) {
                oScreenshot.setNewImage(imgNode);
            }
        }

        // 绑定截图模块的按钮事件
        function bindScreenshotBtnEvent() {
            eventOfScreenshotSubmitBtnClick();
            eventOfScreenshotCloseBtnClick();
        }

        // 确定按钮的绑定事件
        function eventOfScreenshotSubmitBtnClick() {
            // 上传头像中
            var bIsLogoUpload = false;
            // form对象
            var formData = null;
            // 二进制
            var blob = null;
            // 暂时存储
            var stSave = null;
            // 点击事件
            oScreenshotSubmitBtn.on('click', function () {
                if (sFormStatus !== 'edit') {
                    setLayerMsg('非编辑状态，不可上传！');
                    return false;
                }
                if (bIsLogoUpload) {
                    setLayerMsg('正则上传中...');
                    return false;
                }
                sNewPictureUrl = oScreenshotShowNode.get(0).src;
                if (!sNewPictureUrl) {
                    setLayerMsg('没有要上传的图片');
                    return 0;
                }
                bIsLogoUpload = true;
                var data = window.atob(sNewPictureUrl.split(',')[1]);
                stSave = new Uint8Array(data.length);
                for (var index = 0; index < data.length; index++) {
                    stSave[index] = data.charCodeAt(index);
                }
                // canvas.toDataURL 返回的默认格式就是 image/png
                blob = new Blob([stSave], {type: "image/png"});
                formData = new FormData();
                formData.append("filename", "avatar.png");
                formData.append('files', blob);
                // 关闭弹窗
                __layer.close(screenshotLayerIndex);
                uploadFile(formData, {
                    xhr: function (myXhr) {
                        if (myXhr.upload) {
                            myXhr.upload.addEventListener('progress', function (event) {
                                // 已经上传大小情况
                                var loaded = event.loaded;
                                // 附件总大小
                                var total = event.total;
                                // 已经上传的百分比
                                var percent = Math.floor(100 * loaded / total);
                                // 写入百分比。ps:不写100是因为具体请求返回和上传成功之间有一定的响应时间。
                                if (percent < 100){
                                    oLogoParentNode.attr('data-percentage', percent);
                                }
                            }, false);
                        }
                    },
                    success: function (res) {
                        bIsLogoUpload = false;
                        if (res.status === 200) {
                            // 提取数据,并提取id
                            extractCompanyLogo(res.data.data_list);
                            // 写入logo
                            oLogoShowNode.attr('src', sNewPictureUrl);
                            // 写入 100 隐藏进度
                            oLogoParentNode.attr('data-percentage', 100);
                            // 去除错误信息
                            setTipShow(oLogoInputNode, false);
                        }
                    },
                    error: function (res) {
                        var data = err.responseJSON;
                        bIsLogoUpload = false;
                        // 写入 100 隐藏进度
                        oLogoParentNode.attr('data-percentage', 100);
                        dealWithErrorData(data);
                    }
                });
            });
        }

        // 提取logo数据
        function extractCompanyLogo(data) {
            if (!!data && data.length > 0) {
                sLogoValue = data[0].id;
            } else {
                sLogoValue = null;
            }
        }

        // 取消按钮的绑定事件
        function eventOfScreenshotCloseBtnClick() {
            oScreenshotCloseBtn.on('click', function () {
                __layer.close(screenshotLayerIndex);
            })
        }

        // 取消按钮绑定
        function unBindScreenshotBtnEvent () {
            if (!!oScreenshotSubmitBtn && oScreenshotSubmitBtn.unbind) {
                oScreenshotSubmitBtn.unbind();
                oScreenshotSubmitBtn = null;
            }
            if (!!oScreenshotCloseBtn && oScreenshotCloseBtn.unbind) {
                oScreenshotCloseBtn.unbind();
                oScreenshotSubmitBtn = null;
            }
        }

        /* 写入回显数据 */
        function renderEchoData() {
            renderNormalInputData();
            renderLogo();
            renderAddress();
            renderIndustry();
        }

        // 普通input写入
        function renderNormalInputData() {
            if (sNameValue) {
                oNameInputNode.val(sNameValue);
            }
            if (sCreditCodeValue) {
                oCreditCodeInputNode.val(sCreditCodeValue);
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
            if (sPositionValue) {
                oPositionInputNode.val(sPositionValue);
            }
            if (sIntroductionValue) {
                oIntroductionInputNode.val(sIntroductionValue);
            }
        }

        // 写入头像
        function renderLogo() {
            var stSave = null;
            if (sLogoValue) {
                stSave = _ajax.getDomain('file') + '/adjuncts/file_download/' + sLogoValue;
                // 写入图片
                oLogoShowNode.attr('src', stSave);
                // 修改百分比
                oLogoParentNode.attr('data-percentage', 100);
            }
        }

        // 写入地区模块
        function renderAddress() {
            oAddress.distpicker("destroy");
            oAddress.distpicker({
                province: sProvinceValue,
                city: sCityValue,
                district: sAreaValue
            });
            oAddressShowNode.text(sAddressValue);
        }

        // 写入所属行业
        function renderIndustry() {
            var nIndex = null;
            if (sIndustryValue) {
                oIndustrySelectNode.val(sIndustryValue);
                nIndex = aOptionData.searchArrayObj(sIndustryValue, 'id');
                if (nIndex > -1) {
                    oIndustryShowNode.text(aOptionData[nIndex].title);
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
            oCreditCodeInputNode.prop({
                readOnly: bIsShow
            });
            setCleanIcon(oCreditCodeInputNode);
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
            oPositionInputNode.prop({
                readOnly: bIsShow
            });
            setCleanIcon(oPositionInputNode);
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
            companyLogoEvent();
            nameEvent();
            creditCodeEvent();
            addressEvent();
            addressDetailEvent();
            phoneEvent();
            peopleEvent();
            positionEvent();
            industryEvent();
            introductionEvent();
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

        // 头像事件
        function companyLogoEvent() {
            eventOfDeviceImageUpload();
        }
        // 图片上传事件
        function eventOfDeviceImageUpload() {
            // 是否已经新增了节点
            var isAddDom = false;
            var files = null;
            var formData = null;
            var imgFile = null;
            var img = null;
            oLogoInputNode.on('click', function () {
                if (sFormStatus === 'show') {
                    return false;
                }
                if (bIsLogoUpload) {
                    layerMsg('上传图片中...');
                    // 阻止默认行为
                    return false;
                }
            });
            oLogoInputNode.on('change', function () {
                var oNowNode = $(this);
                // 是否存在非图片文件
                var isOtherFile = false;
                // 不是编辑模式不执行
                if (sFormStatus === 'show' || bIsLogoUpload) {
                    // 清空file input，防止再上传时出现不触发change的bug
                    oNowNode.val('');
                    return false;
                }
                files = oNowNode.get(0).files;
                formData = new FormData();
                imgFile = [];
                for (var f in files) {
                    if (files.hasOwnProperty(f)) {
                        if (files[f].type.split("/")[0] === "image") {
                            imgFile.push(files[f]);
                        } else {
                            isOtherFile = true;
                            break;
                        }
                    }
                }
                // 清空file input，防止再上传时出现不触发change的bug
                oNowNode.val('');
                if (!imgFile[0].type) {
                    // input点击取消的情况
                    return 0;
                }
                if (isOtherFile) {
                    layerMsg("只能上传图片");
                    return false;
                }
                if (imgFile.length === 0) {
                    layerMsg('无可上传的图片');
                    return false;
                }
                img = new Image();
                // 加载新链接
                img.src = getObjectURL(imgFile[0]);
                // 打开截图弹窗
                layerOpenScreenshot(img);
            })
        }
        // 头像检测
        function logoTest() {
            if (!!sLogoValue) {
                setTipShow(oLogoInputNode, false);
                return true;
            } else {
                setTipShow(oLogoInputNode, true, '企业头像不能为空');
                return false;
            }
        }

        // 名称事件
        function nameEvent() {
            eventOfInput(oNameInputNode, {
                callback: function (res) {
                    if (res) {
                        sNameValue = oNameInputNode.val();
                        if (sTrueName !== sNameValue) {
                            accountCheck(sNameValue, function (status, data) {
                                // 成功
                                if (status === 'success') {
                                    setTipShow(oNameInputNode, false);
                                } else {// 失败
                                    sNameValue = null;
                                    setTipShow(oNameInputNode, true, data.message);
                                }
                            });
                        } else {
                            setTipShow(oNameInputNode, false);
                        }
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

        // 统一信用代码事件
        function creditCodeEvent() {
            eventOfInput(oCreditCodeInputNode, {
                testCallback: function () {
                    var value = oCreditCodeInputNode.val();
                    if (!oCreditCodeRule.test(value)) {
                        setTipShow(oCreditCodeInputNode, true, '请输入正确的统一社会信用代码');
                        return false;
                    } else {
                        setTipShow(oCreditCodeInputNode, false);
                        return true;
                    }
                },
                callback: function (res) {
                    if (res) {
                        sCreditCodeValue = oCreditCodeInputNode.val();
                    }
                }
            });
            eventOfInput(oCreditCodeInputNode, {
                eventType: 'input',
                callback: function () {
                    setCleanIcon(oCreditCodeInputNode);
                }
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

        // 职务事件
        function positionEvent() {
            eventOfInput(oPositionInputNode, {
                callback: function (res) {
                    if (res) {
                        sPositionValue = oPositionInputNode.val();
                    }
                }
            });
            eventOfInput(oPositionInputNode,{
                eventType: 'input',
                callback: function () {
                    setCleanIcon(oPositionInputNode);
                }
            })
        }

        // 所属行业事件
        function industryEvent() {
            var nIndex = null;
            oIndustrySelectNode.on('change', function () {
                sIndustryValue = oIndustrySelectNode.val();
                nIndex = aOptionData.searchArrayObj(sIndustryValue, 'id');
                oIndustryShowNode.text(aOptionData[nIndex].title);
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
                url = (sUserType === 'user') ? '/enterCertification/update' : '/enterprise/update';
                config = {
                    id: sCompanyId,
                    logo: sLogoValue,
                    name: sNameValue,
                    unifiedSocialCredit: sCreditCodeValue,
                    provinceName: sProvinceValue,
                    cityName: sCityValue,
                    areaName: sAreaValue,
                    detailAddress: sAddressDetailValue,
                    address: sAddressValue,
                    phone: sPhoneValue,
                    contact: sPeopleValue,
                    positions: sPositionValue,
                    belongIndustry: sIndustryValue,
                    introduction: sIntroductionValue
                };
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
                            __layer.msg('修改企业信息成功');
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

    PersonalResetCompanyInfo.prototype = new FuncOfModelCommon();

    FuncOfModelCommon = null;

    personalMainObj.setMethodObj('resetCompanyInfo', new PersonalResetCompanyInfo());
});
