$(function () {
    var personalMainObj = window._personal_main_;

    var FuncOfModelCommon = personalMainObj._model_common_;

    function PersonalHome() {
        var _this = this;
        // 初始化ajax
        var _ajax = new NewAjax();
        // 当前模块
        var oMainModel = $('#personal-home');
        // 编辑判定
        var bIsEdit = false;
        // 用户数据
        var oUserInfo = null;
        // 名称头像区域
        var oNameAvatarContentModel = oMainModel.find('.content-div').eq(0);
        // header中的名称节点
        var oHeaderNameNode = $('#header').find('.header-func-item-content').eq(0);

        /* 用户头像 */
        var oAvatarInputNode = oMainModel.find('#user-avatar-input');
        var oAvatarParentNode = oAvatarInputNode.parent();
        var oAvatarImageNode = oAvatarParentNode.find('.user-avatar-image').eq(0);
        var sAvatarId = null;
        // 临时头像
        var stAvatarId = null;

        /* 截图插件 */
        // 截图实例
        var oScreenshot = null;
        // 截图layerOpen标志
        var screenshotLayerIndex = null;
        // layer 弹框的承载html
        var sLayerArea = '<div class="layer-open-screenshot-div">\n' +
            '            <div class="screenshot-show-div">\n' +
            '                <div class="image-div" style="width: 131px;height: 131px">\n' +
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

        /* 用户姓名 */
        var oNameInputNode = oMainModel.find('#user-name-input');
        var oNameInputParent = oNameInputNode.parent();
        // 展示名称
        var oNameShowNode = oMainModel.find('.user-name').eq(0);
        var oNameShowParent = oNameShowNode.parent();
        var sNameValue = null;
        // 临时用户名
        var stNameValue = null;

        /* 用户手机号 */
        var oPhoneNode = oMainModel.find('.user-phone').eq(0);
        var sPhoneValue = null;

        /* 编辑按钮 */
        var oNameEditBtnNode = oNameShowParent.find('.icon-reset').eq(0);

        /* 提交按钮 */
        var oNameSubmitBtnNode = oNameInputParent.find('.icon-true').eq(0);

        /* 取消按钮 */
        var oNameCancelBtnNode = oNameInputParent.find('.icon-error').eq(0);

        /* 快捷服务列表 */
        var oFuncListNode = oMainModel.find('.func-list').eq(0);


        allEvent();
        // 初始化截图插件
        initScreenshot();
        // 这里调用是为了不跳转到个人中心首页也能获取到用户信息
        getUserInfo();

        _this.init = function (name) {
            init();
        };

        _this.getUserInfo = function (callback) {
            getUserInfo(callback);
        };


        /**
         * 拼接头像路径
         * @param sAvatarId 头像id
         * @returns {string}
         */
        function getAvatarLink(sAvatarId) {
            return _ajax.getDomain('file') + '/adjuncts/file_download/' + sAvatarId;
        }

        /**
         * 作用：提交文件
         * @param files
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
         * 开启layer.message
         * @param message 要提示的字符串
         */
        function setLayerMsg(message) {
            __layer.closeAll();
            __layer.msg(message);
        }

        /* 主模块 */

        // 初始化
        function init() {
            initAvatar();
            initName();
            initPhone();
            getUserInfo();
        }

        // 头像初始化
        function initAvatar() {
            oAvatarInputNode.val('');
            oAvatarImageNode.removeAttr('src');
            sAvatarId = null;
        }

        // 名称初始化
        function initName() {
            oNameShowNode.text('');
            oNameInputNode.val('');
            sNameValue = null;
        }

        // 手机初始化
        function initPhone() {
            oPhoneNode.text('');
            sPhoneValue = null;
        }

        // 获取个人信息, ps：这里必须使用同步，否则在其他模块下刷新页面时会导致身份获取错误
        function getUserInfo(callback) {
            _ajax.post('default', {
                url: '/frontUser/getFrontUser',
                contentType: 'application/json',
                async: false,
                data: '{}',
                success: function (res) {
                    var data = null;
                    var stSave = null;
                    if (callback) {
                        callback(res)
                    }
                    if (res.status === 200) {
                        data = res.data;
                        if (!data.enterprise) {
                            personalMainObj.setUserType('user');
                        } else {
                            personalMainObj.setUserType('company');
                        }
                        extractUserInfo(data.frontUser);
                        stSave = oUserInfo.phone;
                        if (stSave) {
                            personalMainObj.setUserPhone(stSave);
                        }
                        giveUserInfo();
                        importUserInfo();
                    }
                },
                error: function (err) {
                    // 关闭加载
                    __layer.close(layui);
                    console.error('getUserInfo:', err);
                }
            });
        }

        // 提取个人信息
        function extractUserInfo(data) {
            oUserInfo = {};
            oUserInfo.id = data.id;
            oUserInfo.name = data.userName;
            oUserInfo.phone = data.phone;
            oUserInfo.avatar = data.headPortrait;
        }

        // 分配数据
        function giveUserInfo() {
            sNameValue = oUserInfo.name;
            sPhoneValue = oUserInfo.phone;
            sAvatarId = oUserInfo.avatar;
        }

        /* 写入数据 */
        function importUserInfo() {
            importAvatar();
            importName();
            importPhone();
        }

        // 写入头像
        function importAvatar() {
            if (sAvatarId) {
                oAvatarImageNode.attr({
                    src: getAvatarLink(sAvatarId)
                });
                // 写入头像父级，ps: 隐藏默认图标
                oAvatarParentNode.attr('data-percentage', 100);
            }
        }

        // 写入名称
        function importName() {
            if (sNameValue) {
                oNameInputNode.val(sNameValue);
                oNameShowNode.text(sNameValue);
            }
        }

        // 写入手机
        function importPhone() {
            if (sPhoneValue) {
                oPhoneNode.text(sPhoneValue);
            }
        }

        /* 事件 */
        function allEvent() {
            avatarEvent();
            nameEvent();
            editEvent();
            submitEvent();
            cancelEvent();
            funcListEvent();
        }

        // 头像事件
        function avatarEvent() {
            eventOfAvatarClick();
            eventOfAvatarChange();
        }

        // 头像点击事件
        function eventOfAvatarClick() {
            oAvatarInputNode.on('click', function () {
                if (!bIsEdit) {
                    __layer.msg('请先进入编辑状态');
                    return false;
                }
            })
        }

        // 头像change事件
        function eventOfAvatarChange() {
            var files = null;
            var formData = null;
            var isOtherFile = false;
            var imgFile = null;
            var img = null;
            oAvatarInputNode.on('change', function () {
                // 直接隐藏
                oAvatarInputNode.hide();
                files = oAvatarInputNode.get(0).files;
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
                oAvatarInputNode.val('');
                if (isOtherFile) {
                    __layer.msg("只能上传图片");
                    return 0;
                }
                if (imgFile.length === 0) {
                    __layer.msg('无上传图片');
                    return 0;
                } else if (imgFile.length > 1) {
                    __layer.msg("只能上传一张图片");
                }
                img = new Image();
                // 加载新链接
                img.src = getObjectURL(imgFile[0]);
                // 打开截图弹窗
                layerOpenScreenshot(img);
            })
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
                    moduleName: 'personalHome',
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
                if (!bIsEdit) {
                    return 0;
                }
                oScreenshotShowNode.attr({
                    src: fileStr
                });
            }).setShowCanvasSize(layerWindowWidth - 60, 350)
                .setGetImageFromOutSide(true)
                .setCutCanvasWidthHeightRatio(1, 1);
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
                if (!bIsEdit) {
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
                                    oAvatarParentNode.attr('data-percentage', percent);
                                }
                            }, false);
                        }
                    },
                    success: function (res) {
                        bIsLogoUpload = false;
                        console.log(res.data);
                        if (res.status === 200) {
                            // 提取数据,并提取id
                            extractCompanyLogo(res.data.data_list);
                            // 写入logo
                            oAvatarImageNode.attr('src', sNewPictureUrl);
                            // 写入 100 隐藏进度
                            oAvatarParentNode.attr('data-percentage', 100);
                        }
                    },
                    error: function (res) {
                        var data = err.responseJSON;
                        bIsLogoUpload = false;
                        // 写入 100 隐藏进度
                        oAvatarParentNode.attr('data-percentage', 100);
                        dealWithErrorData(data);
                    }
                });
            });
        }

        // 提取logo数据
        function extractCompanyLogo(data) {
            if (!!data && data.length > 0) {
                stAvatarId = data[0].id;
            } else {
                stAvatarId = null;
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

        // 名称事件
        function nameEvent() {
            eventOfNameChange();
        }

        // 名称change事件
        function eventOfNameChange() {
            var value = null;
            oNameInputNode.on('change', function () {
                value = oNameInputNode.val().replace(/\s+/g, '');
                if (value.length > 0) {
                    stNameValue = value;
                } else {
                    stNameValue = null;
                }
            });
        }

        // 编辑按钮事件
        function editEvent() {
            oNameEditBtnNode.on('click', function () {
                oNameInputNode.val(sNameValue);
                // 赋值名称，ps:stAvatarId不用赋值的原因是没上传图片是可以传null
                stNameValue = sNameValue;
                oAvatarImageNode.removeAttr('src');
                // 头像id 需要初始化
                stAvatarId = null;
                // 可编辑
                bIsEdit = true;
                // 写入头像父级
                oAvatarParentNode.attr('data-percentage', 0);
                oNameAvatarContentModel.attr({
                    type: 'edit'
                });
                return false;
            });
        }

        // 提交事件
        function submitEvent() {
            var config = null;
            oNameSubmitBtnNode.on('click', function () {
                if (!(!!stNameValue)) {
                    __layer.closeAll();
                    __layer.msg('名称不能都为空');
                    return false;
                }
                config = {
                    userName: stNameValue,
                    headPortrait: (!!stAvatarId) ? stAvatarId : null
                };
                _ajax.post('default', {
                    url: "/frontUser/update",
                    contentType: 'application/json',
                    data: JSON.stringify(config),
                    success: function (res) {
                        var data = null;
                        if (res.status === 200) {
                            __layer.closeAll();
                            __layer.msg('修改信息成功');
                            if (!!stAvatarId) {
                                sAvatarId = stAvatarId;
                            }
                            sNameValue = stNameValue;
                            // 修改header的名称节点
                            oHeaderNameNode.text(sNameValue);
                            handleOfChangeShow();
                        }
                    },
                    error: function (err) {
                        __layer.closeAll();
                        __layer.msg('修改用户信息失败');
                        console.log('submitEvent:', err);
                    }
                });
            });
        }

        // 取消事件
        function cancelEvent() {
            oNameCancelBtnNode.on('click', handleOfChangeShow)
        }

        // 取消执行函数
        function handleOfChangeShow() {
            oAvatarImageNode.attr({
                src: getAvatarLink(sAvatarId)
            });
            // 存在旧头像时
            if (sAvatarId) {
                oAvatarParentNode.attr('data-percentage', 100);
            }
            oNameShowNode.text(sNameValue);
            oNameAvatarContentModel.attr({
                type: 'show'
            });
            // 不可编辑状态
            bIsEdit = false;
        }

        // 功能列表事件
        function funcListEvent() {
            oFuncListNode.on('click', 'a.func-link', function () {
                personalMainObj.devTip();
                return false;
            });
        }
    }

    PersonalHome.prototype = new FuncOfModelCommon();

    FuncOfModelCommon = null;

    personalMainObj.setMethodObj('personalHome', new PersonalHome());
});

