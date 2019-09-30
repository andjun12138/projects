function ScreenshotPlugin(sAreaId) {
    var _this = this;
    var oPluginNode = null;
    var sActiveAreaHtml = '<div id="" style="position:relative;top: 0;left: 50%;width:502px;height: 502px;border: 1px solid #dddddd;overflow: hidden"></div>';
    var sFileInputHtml = '<input id="" type="file" style="display:block;position: absolute;top: 0;left: 100%;width: 0;height: 0;visibility: hidden;opacity: 0">';
    var sShowCanvasHtml = '<canvas id="" width="500px" height="500px" style=""></canvas>';
    var sMarkHtml = '<div id="" style="display:none;position:absolute;top: 0;left: 0;width: 100%;height: 100%;background:rgba(0,0,0,0.3);"></div>';
    var sCutCanvasHtml = '<canvas id="" width="50px" height="50px" style="position:absolute;top: 0;left: 0;"></canvas>';
    var sFileInputId = null;
    var sActiveAreaId = null;
    var sShowCanvasId = null;
    var sCutCanvasId = null;
    var sMarkId = null;
    var oCutCanvasNode_jq = null;
    var oCutCanvasNode_dom = null;
    var oFileInputNode = null;
    var oActiveAreaNode = null;
    var oShowCanvasNode = null;
    var oMarkNode = null;
    var img = new Image();
    var nImageWidth = null;
    var nImageHeight = null;
    // 截图画笔
    var cut_ctx = null;
    // 展示画笔
    var show_ctx = null;
    // 截图框的宽
    var nCutWidth = null;
    // 截图框的高
    var nCutHeight = null;
    // 展示画布宽
    var nShowCanvasWidth = null;
    // 展示画布高
    var nShowCanvasHeight = null;
    // 媒体文件（图片）在展示画布中展示的宽度
    var nZoomWidth = null;
    // 媒体文件（图片）在展示画布中展示的高度
    var nZoomHeight = null;
    // 白边宽度
    var nWhiteBorderWidth = 20;
    var nOldX = null;
    var nOldY = null;
    var nNowX = null;
    var nNowY = null;
    var nCutCanvasMoveX = null;
    var nCutCanvasMoveY = null;
    var nCutCanvasFinalTop = null;
    var nCutCanvasFinalLeft = null;
    var nOldCutCanvasFinalTop = null;
    var nOldCutCanvasFinalLeft = null;
    // 相对于浏览器
    var nCutCanvasOffsetTop = null;
    var nCutCanvasOffsetLeft = null;
    // 变化模式（上，下，左，右等8个方向的拉伸）
    var nCutCanvasZoomModel = null;
    var nOldCutCanvasZoomModel = null;
    // 判定是否可以移动
    var bCanMoveCutCanvas = false;
    // 是否加载完图片
    var bIsLoadImage = false;
    // 判定是否可以缩放
    var bCanZoomCutCanvas = false;
    // 判定鼠标mouseDown
    var bIsMouseDown = false;
    // 是否重外部获取img
    var bIsGetOutSideImage = false;
    // 定时器
    var timer = null;
    // 换图定时器
    var changeImageTimer = null;
    // 当前缩放方法
    var fNowZoomMethod = null;
    // 获取结果回调函数
    var fGetResultCallBack = null;
    // 获取文档（document）的滚动距离
    var nScrollX = null;
    var nScrollY = null;
    // 获取图片链接
    var sOutSideImageSrc = null;

    if (typeof jQuery === "undefined") {
        throw new Error('本插件需要jquery支持，请在本插件前引入jquery');
    }

    // 若没有目标节点
    if ($('#' + sAreaId).length === 0) {
        throw new Error('未查找到 id:' + sAreaId + '对应的节点');
    } else {
        oPluginNode = $('#' + sAreaId);
    }
    // 获取id
    getPrivateId();
    // 插入节点
    pluginNode();
    // 获取节点
    getNode();
    // 初始化其他变量
    initOtherVariable();
    // 调用所有事件
    allEvents();


    // 设置展示画布的宽高
    _this.setShowCanvasSize = function (nWidth, nHeight) {
        try {
            if (getVariableType(nWidth) !== 'number' || getVariableType(nHeight) !== 'number') {
                throw new Error('参数 nWidth 和 nHeight 皆需为 Number');
            } else if (nWidth < 70 || nHeight < 70) {
                throw new Error('参数 nWidth 和 nHeight 不能小于 70')
            }
            nShowCanvasWidth = nWidth;
            nShowCanvasHeight = nHeight;
            oActiveAreaNode.css({
                marginLeft:(-1 * nWidth/2) + 'px',
                width: nWidth + 'px',
                height: nHeight + 'px'
            });
            $(oShowCanvasNode).attr({
                width: nWidth + 'px',
                height: nHeight + 'px'
            });
            return _this;
        } catch (err) {
            console.error('setShowCanvasSize方法，原因：' + err);
        }
    };

    // 设置截图画布的宽高
    _this.setCutCanvasWidthHeightRatio = function (nWidth, nHeight) {
        try {
            if (getVariableType(nWidth) !== 'number' || getVariableType(nHeight) !== 'number') {
                throw new Error('参数 nWidth 和 nHeight 皆需为 Number');
            }

            if (nWidth > nHeight) {
                nCutWidth = 52;
                nCutHeight = 50 * nHeight / nWidth + 2;
            } else {
                nCutHeight = 52;
                nCutWidth = 50 * nWidth / nHeight + 2;
            }
            oCutCanvasNode_jq.attr({
                width: nCutWidth + 'px',
                height: nCutHeight + 'px'
            });
            return _this;
        } catch (err) {
            console.error('setCutCanvasSize方法，原因：' + err);
        }
    };

    // 设置获取截图结果回调
    _this.setResultCallback = function (callback) {
        try {
            if (getVariableType(callback) !== 'function') {
                throw new Error('参数 callback 需为 function');
            }
            fGetResultCallBack = callback;
            return _this;
        } catch (err) {
            console.error('setResultCallback方法，原因：' + err);
        }
    };

    // 设置是否关闭自身input[type="file"]的功能
    _this.setGetImageFromOutSide = function (isOutSide) {
        try {
            isOutSide = isOutSide || false;
            if (getVariableType(isOutSide) !== 'boolean') {
                throw new Error('参数 isOutSide 的类型需为 Boolean');
            }
            bIsGetOutSideImage = isOutSide;
            return _this;
        } catch (err) {
            console.error('setGetImageModel方法, 原因：' + err);
        }
    };

    // 设置截图内容
    _this.setNewImage = function (imageNode) {
        try {
            if (imageNode instanceof jQuery) {
                sOutSideImageSrc = imageNode.get(0).src;
                img.src = sOutSideImageSrc;
            } else if (imageNode.nodeType === 1 && imageNode.tagName.toLowerCase() === 'img') {
                sOutSideImageSrc = imageNode.src;
                img.src = sOutSideImageSrc;
            } else {
                throw new Error('参数 imageNode 需为 jQuery 类型或是 DOM 类型的 img 节点');
            }
            return _this;
        } catch (err) {
            console.error('setNewImage方法，原因：' + err);
        }
    };


    // 生成id
    function getPrivateId() {
        sFileInputId = getRandomString('fileInput');
        sActiveAreaId = getRandomString('activeArea');
        sShowCanvasId = getRandomString('showCanvas');
        sCutCanvasId = getRandomString('cutCanvas');
        sMarkId = getRandomString('mark');
    }

    // 插入节点
    function pluginNode() {
        var result = sActiveAreaHtml.replace(/<\/div>/, function (divStr) {
            var stSave = sFileInputHtml.replace('id=""', 'id="' + sFileInputId + '"');
            stSave += sShowCanvasHtml.replace('id=""', 'id="' + sShowCanvasId + '"');
            stSave += sMarkHtml.replace('id=""', 'id="' + sMarkId + '"');
            stSave += sCutCanvasHtml.replace('id=""', 'id="' + sCutCanvasId + '"');
            return stSave + divStr;
        }).replace('id=""', 'id="' + sActiveAreaId + '"');
        oPluginNode.html(result);
    }

    // 获取节点
    function getNode() {
        oCutCanvasNode_jq = $('#' + sCutCanvasId);
        oCutCanvasNode_dom = oCutCanvasNode_jq.get(0);
        oFileInputNode = $('#' + sFileInputId);
        oActiveAreaNode = $('#' + sActiveAreaId);
        oShowCanvasNode = $('#' + sShowCanvasId).get(0);
        oMarkNode = $('#' + sMarkId);
    }

    // 获取其他变量
    function initOtherVariable() {
        cut_ctx = oCutCanvasNode_dom.getContext('2d');
        show_ctx = oShowCanvasNode.getContext('2d');
        nCutWidth = oCutCanvasNode_dom.offsetWidth;
        nCutHeight = oCutCanvasNode_dom.offsetHeight;
        nShowCanvasWidth = oShowCanvasNode.offsetWidth;
        nShowCanvasHeight = oShowCanvasNode.offsetHeight;
    }

    // 绑定并触发load事件
    function loadImage(file) {
        // 转换成链接
        var src = getObjectURL(file);

        // 写入src触发onload
        if (src) {
            img.src = src;
        }
    }

    // 图片的load事件
    function eventOfImageLoad() {
        img.onload = function () {
            nImageWidth = img.width;
            nImageHeight = img.height;
            if (nImageWidth > nImageHeight) {
                nZoomWidth = nShowCanvasWidth - 2 * nWhiteBorderWidth;
                nZoomHeight = nImageHeight * nZoomWidth / nImageWidth;
            } else {
                nZoomHeight = nShowCanvasHeight - 2 * nWhiteBorderWidth;
                nZoomWidth = nImageWidth * nZoomHeight / nImageHeight;
            }
            // 清空画布
            show_ctx.clearRect(0, 0, nShowCanvasWidth, nShowCanvasHeight);
            // 这里填充透明背景以防重影
            show_ctx.fillStyle = '#ffffff';
            show_ctx.fillRect(0, 0, nShowCanvasWidth, nShowCanvasHeight);
            // 接入图片
            show_ctx.drawImage(img, 0, 0, nImageWidth, nImageHeight, (nShowCanvasWidth - nZoomWidth) / 2, (nShowCanvasHeight - nZoomHeight) / 2, nZoomWidth, nZoomHeight);
            oMarkNode.show();
            // 设置白色背景
            cut_ctx.fillStyle = '#ffffff';
            // 传入画布
            cut_ctx.drawImage(oShowCanvasNode, (nShowCanvasWidth - nCutWidth) / 2, (nShowCanvasHeight - nCutHeight) / 2, nCutWidth, nCutHeight, 0, 0, nCutWidth, nCutHeight);
            oCutCanvasNode_jq.css({
                top: (nShowCanvasHeight - nCutHeight) / 2 + 'px',
                left: (nShowCanvasWidth - nCutWidth) / 2 + 'px',
                border: '1px solid #0066cc',
                cursor: 'pointer'
            });
            // 同上记录top和left，用于拖拽计算top,left
            nCutCanvasFinalTop = oCutCanvasNode_dom.offsetTop;
            nCutCanvasFinalLeft = oCutCanvasNode_dom.offsetLeft;
            // 相对于浏览器的top,left;
            nCutCanvasOffsetTop = oCutCanvasNode_jq.offset().top;
            nCutCanvasOffsetLeft = oCutCanvasNode_jq.offset().left;
            // 已经加载了媒体资源
            bIsLoadImage = true;
            // 执行回调
            if (fGetResultCallBack) {
                fGetResultCallBack(oCutCanvasNode_dom.toDataURL());
            }
        };
    }

    // 调用所有监听
    function allEvents() {
        eventOfImageLoad();
        eventOfFileInputChange();
        eventOfCutCanvasMouseDown();
        eventOfGlobalMouseUp();
        eventOfActiveAreaMouseDown();
        eventOfActiveAreaMouseMove();
    }

    // 为上传图片绑定change事件
    function eventOfFileInputChange() {
        oFileInputNode.change(function () {
            if (bIsGetOutSideImage) {
                return 0;
            }
            var file = this.files[0];
            // 判定
            if (file.type.split("/")[0] !== "image") {
                console.error('选中的文件需为图片（image）');
                return 0;
            }
            // 传入图片
            loadImage(file);
        })
    }

    // 为截图框移动功能绑定mousedown事件
    function eventOfCutCanvasMouseDown() {
        // 移动截图框点击
        oCutCanvasNode_jq.mousedown(function (event) {
            // 若触发缩放, 则不执行以下代码
            if (bCanZoomCutCanvas) {
                return 0;
            }
            bCanMoveCutCanvas = true;
            event = event || window.event;
            nScrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            nScrollY = document.documentElement.scrollTop || document.body.scrollTop;
            nNowX = event.pageX || event.clientX + nScrollX;
            nNowY = event.pageY || event.clientY + nScrollY;
        });
    }

    // 全局的mouseup事件
    function eventOfGlobalMouseUp() {
        $(document).mouseup(function () {
            bIsMouseDown = false;
            if (bCanZoomCutCanvas) {
                // 修改缩放判定
                bCanZoomCutCanvas = false;
                // 清空缩放方法
                fNowZoomMethod = null;
                // 重新计算位置
                nCutCanvasOffsetTop = oCutCanvasNode_jq.offset().top;
                nCutCanvasOffsetLeft = oCutCanvasNode_jq.offset().left;
            } else if (bCanMoveCutCanvas) {
                bCanMoveCutCanvas = false;
                // 重新计算位置
                nCutCanvasOffsetTop = oCutCanvasNode_jq.offset().top;
                nCutCanvasOffsetLeft = oCutCanvasNode_jq.offset().left;
            }
        });
    }

    // 为缩放功能绑定的mousedown事件
    function eventOfActiveAreaMouseDown() {
        oActiveAreaNode.mousedown(function () {
            bIsMouseDown = true;
            if (nCutCanvasZoomModel) {
                bCanZoomCutCanvas = true;
                // 触发缩放时，直接取消拖拽判定
                if (bCanMoveCutCanvas) {
                    bCanMoveCutCanvas = false;
                }
            } else {
                if (!changeImageTimer) {
                    changeImageTimer = setTimeout(function () {
                        // 清除定时器（利用定时器清除后还会执行完当前代码的特性）
                        clearTimeout(changeImageTimer);
                        changeImageTimer = null;
                        // 还在长按
                        if (bIsMouseDown) {
                            return 0;
                        }
                        // 直接从外部获取image, 则不用执行以下代码
                        if (bIsGetOutSideImage) {
                            return 0;
                        }
                        // 检测到单击
                        oFileInputNode.click();
                    }, 300);
                }
            }
        });
    }

    // 为缩放功能绑定的mousemove事件
    function eventOfActiveAreaMouseMove() {
        oActiveAreaNode.mousemove(function (event) {
            if (!timer && bIsLoadImage) {
                // 定时器缓解执行次数，合理安排资源
                timer = setTimeout(function () {
                    // 清除
                    clearTimeout(timer);
                    timer = null;
                    // 这里需要考虑兼容问题和滚动条问题
                    event = event || window.event;
                    nScrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
                    nScrollY = document.documentElement.scrollTop || document.body.scrollTop;
                    nOldX = nNowX;
                    nOldY = nNowY;
                    nNowX = event.pageX || event.clientX + nScrollX;
                    nNowY = event.pageY || event.clientY + nScrollY;

                    /* 缩放部分 */
                    // 若未开始执行缩放
                    if (!bCanZoomCutCanvas && !bCanMoveCutCanvas) {
                        // 修正父级滚动带来的误差
                        if (oCutCanvasNode_jq.offset().top !== nCutCanvasOffsetTop) {
                            nCutCanvasOffsetTop = oCutCanvasNode_jq.offset().top
                        }
                        if (oCutCanvasNode_jq.offset().left !== nCutCanvasOffsetLeft) {
                            nCutCanvasOffsetLeft = oCutCanvasNode_jq.offset().left
                        }
                        // 执行截图canvas边框判定
                        if (Math.abs(nNowY - nCutCanvasOffsetTop) < 5) {
                            if (Math.abs(nNowX - nCutCanvasOffsetLeft) < 5) {
                                nCutCanvasZoomModel = 1;
                            } else if (Math.abs(nNowX - nCutCanvasOffsetLeft - nCutWidth) < 5) {
                                nCutCanvasZoomModel = 2;
                            } else {
                                nCutCanvasZoomModel = 5;
                            }
                            if (nCutCanvasZoomModel !== nOldCutCanvasZoomModel) {
                                oCutCanvasNode_jq.css({
                                    cursor: (nCutCanvasZoomModel === 1) ? 'nw-resize' : (nCutCanvasZoomModel === 2) ? 'ne-resize' : 'n-resize'
                                });
                            }
                        } else if (Math.abs(nNowY - nCutCanvasOffsetTop - nCutHeight) < 5) {
                            if (Math.abs(nNowX - nCutCanvasOffsetLeft) < 5) {
                                nCutCanvasZoomModel = 3;
                            } else if (Math.abs(nNowX - nCutCanvasOffsetLeft - nCutWidth) < 5) {
                                nCutCanvasZoomModel = 4;
                            } else {
                                nCutCanvasZoomModel = 8;
                            }
                            if (nCutCanvasZoomModel !== nOldCutCanvasZoomModel) {
                                oCutCanvasNode_jq.css({
                                    cursor: (nCutCanvasZoomModel === 3) ? 'sw-resize' : (nCutCanvasZoomModel === 4) ? 'se-resize' : 's-resize'
                                });
                            }
                        } else if (Math.abs(nNowX - nCutCanvasOffsetLeft) < 5) {
                            if (Math.abs(nNowY - nCutCanvasOffsetTop) < 5) {
                                nCutCanvasZoomModel = 1;
                            } else if (Math.abs(nNowY - nCutCanvasOffsetTop - nCutHeight) < 5) {
                                nCutCanvasZoomModel = 3;
                            } else {
                                nCutCanvasZoomModel = 6;
                            }
                            if (nCutCanvasZoomModel !== nOldCutCanvasZoomModel) {
                                oCutCanvasNode_jq.css({
                                    cursor: (nCutCanvasZoomModel === 1) ? 'nw-resize' : (nCutCanvasZoomModel === 3) ? 'sw-resize' : 'w-resize'
                                });
                            }
                        } else if (Math.abs(nNowX - nCutCanvasOffsetLeft - nCutWidth) < 5) {
                            if (Math.abs(nNowY - nCutCanvasOffsetTop) < 5) {
                                nCutCanvasZoomModel = 2;
                            } else if (Math.abs(nNowY - nCutCanvasOffsetTop - nCutHeight) < 5) {
                                nCutCanvasZoomModel = 4;
                            } else {
                                nCutCanvasZoomModel = 7;
                            }
                            if (nCutCanvasZoomModel !== nOldCutCanvasZoomModel) {
                                oCutCanvasNode_jq.css({
                                    cursor: (nCutCanvasZoomModel === 2) ? 'ne-resize' : (nCutCanvasZoomModel === 4) ? 'se-resize' : 'e-resize'
                                });
                            }
                        } else {
                            nCutCanvasZoomModel = null;
                            if (nCutCanvasZoomModel !== nOldCutCanvasZoomModel) {
                                oCutCanvasNode_jq.css({
                                    cursor: 'pointer'
                                });
                            }
                        }
                        // 若新旧缩放模式不一致则更新旧缩放模式
                        if (nCutCanvasZoomModel !== nOldCutCanvasZoomModel) {
                            nOldCutCanvasZoomModel = nCutCanvasZoomModel;
                        }
                    } else {
                        if (!fNowZoomMethod) {
                            if (nCutCanvasZoomModel === 1) {
                                fNowZoomMethod = cutCanvasZoomTopLeft;
                            } else if (nCutCanvasZoomModel === 2 || nCutCanvasZoomModel === 5) {
                                fNowZoomMethod = cutCanvasZoomTopRight;
                            } else if (nCutCanvasZoomModel === 3 || nCutCanvasZoomModel === 6) {
                                fNowZoomMethod = cutCanvasZoomBottomLeft;
                            } else if (nCutCanvasZoomModel === 4 || nCutCanvasZoomModel === 7 || nCutCanvasZoomModel === 8) {
                                fNowZoomMethod = cutCanvasZoomBottomRight;
                            }
                        } else {
                            var positionData = {
                                nowX: nNowX,
                                oldX: nOldX,
                                nowY: nNowY,
                                oldY: nOldY
                            };
                            fNowZoomMethod(positionData, function () {
                                nCutWidth = Math.round(nCutWidth);
                                nCutHeight = Math.round(nCutHeight);
                                oCutCanvasNode_jq.attr({
                                    width: nCutWidth + 'px',
                                    height: nCutHeight + 'px'
                                }).css({
                                    top: nCutCanvasFinalTop + 'px',
                                    left: nCutCanvasFinalLeft + 'px'
                                });
                                cut_ctx.drawImage(oShowCanvasNode, nCutCanvasFinalLeft, nCutCanvasFinalTop, nCutWidth, nCutHeight, 0, 0, nCutWidth, nCutHeight);
                                positionData = null;
                                // 执行回调
                                if (fGetResultCallBack) {
                                    fGetResultCallBack(oCutCanvasNode_dom.toDataURL());
                                }
                            });
                        }
                    }

                    /* 拖拽部分 */
                    // 若不能拖拽或正在缩放时，不执行以下代码
                    if (!bCanMoveCutCanvas || bCanZoomCutCanvas) {
                        // 清除
                        /*clearTimeout(timer);
                        timer = null;*/
                        return 0;
                    }
                    // 以下执行canvas拖动功能
                    nCutCanvasMoveX = nNowX - nOldX;
                    nCutCanvasMoveY = nNowY - nOldY;
                    nOldCutCanvasFinalTop = nCutCanvasFinalTop;
                    nOldCutCanvasFinalLeft = nCutCanvasFinalLeft;
                    nCutCanvasFinalTop = (nOldCutCanvasFinalTop + nCutCanvasMoveY < 0) ? 0 : (nOldCutCanvasFinalTop + nCutCanvasMoveY + nCutHeight < nShowCanvasHeight) ? nOldCutCanvasFinalTop + nCutCanvasMoveY : nShowCanvasHeight - nCutHeight;
                    nCutCanvasFinalLeft = (nOldCutCanvasFinalLeft + nCutCanvasMoveX < 0) ? 0 : (nOldCutCanvasFinalLeft + nCutCanvasMoveX + nCutWidth < nShowCanvasWidth) ? nOldCutCanvasFinalLeft + nCutCanvasMoveX : nShowCanvasWidth - nCutWidth;
                    // 当计算后的top left 一直相同就不进行以下操作
                    if (nOldCutCanvasFinalTop !== null && nOldCutCanvasFinalTop === nCutCanvasFinalTop && nOldCutCanvasFinalLeft !== null && nOldCutCanvasFinalLeft === nCutCanvasFinalLeft) {
                        // 清除
                        /*clearTimeout(timer);
                        timer = null;*/
                        return 0;
                    }
                    oCutCanvasNode_jq.css({
                        top: nCutCanvasFinalTop + 'px',
                        left: nCutCanvasFinalLeft + 'px'
                    });
                    // 传入画布
                    cut_ctx.drawImage(oShowCanvasNode, nCutCanvasFinalLeft, nCutCanvasFinalTop, nCutWidth, nCutHeight, 0, 0, nCutWidth, nCutHeight);
                    // 清除
                    /*clearTimeout(timer);
                    timer = null;*/
                    // 执行回调
                    if (fGetResultCallBack) {
                        fGetResultCallBack(oCutCanvasNode_dom.toDataURL());
                    }
                }, 1000 / 60);
            }
        });
    }

    // 左上方向缩放
    function cutCanvasZoomTopLeft(positionData, callback) {
        var changeX = positionData.nowX - positionData.oldX,
            changeY = positionData.nowY - positionData.oldY,
            newWidth = null,
            newHeight = null;

        // 释放变量
        positionData = null;
        if (Math.abs(changeX) > Math.abs(changeY)) {
            // 计算宽高
            newWidth = nCutWidth - changeX;
            newHeight = nCutHeight * newWidth / nCutWidth;
            // 若宽或高超出底层画布则不执行以下代码
            if (nCutCanvasFinalLeft + changeX < 0 || nCutCanvasFinalTop + (nCutHeight - newHeight) < 0) {
                return 0;
            }
            nCutCanvasFinalLeft += changeX;
            nCutCanvasFinalTop += nCutHeight - newHeight;
            nCutWidth = newWidth;
            nCutHeight = newHeight;
            if (callback) {
                callback();
            }
        } else {
            // 计算宽高
            newHeight = nCutHeight - changeY;
            newWidth = nCutWidth * newHeight / nCutHeight;
            // 若宽或高超出底层画布则不执行以下代码
            if (nCutCanvasFinalLeft + (nCutWidth - newWidth) < 0 || nCutCanvasFinalTop + changeY < 0) {
                return 0;
            }
            nCutCanvasFinalTop += changeY;
            nCutCanvasFinalLeft += nCutWidth - newWidth;
            nCutWidth = newWidth;
            nCutHeight = newHeight;
            if (callback) {
                callback();
            }
        }
    }

    // 右上方向缩放
    function cutCanvasZoomTopRight(positionData, callback) {
        var changeX = positionData.nowX - positionData.oldX,
            changeY = positionData.nowY - positionData.oldY,
            newWidth = null,
            newHeight = null;

        // 释放变量
        positionData = null;
        if (Math.abs(changeX) > Math.abs(changeY)) {
            // 计算宽高
            newWidth = nCutWidth + changeX;
            newHeight = nCutHeight * newWidth / nCutWidth;
            // 若宽或高超出底层画布则不执行以下代码
            if (nCutCanvasFinalLeft + newWidth > nShowCanvasWidth || nCutCanvasFinalTop + (nCutHeight - newHeight) < 0) {
                return 0;
            }
            nCutCanvasFinalTop += nCutHeight - newHeight;
            nCutWidth = newWidth;
            nCutHeight = newHeight;
            if (callback) {
                callback();
            }
        } else {
            // 计算宽高
            newHeight = nCutHeight - changeY;
            newWidth = nCutWidth * newHeight / nCutHeight;
            // 若宽或高超出底层画布则不执行以下代码
            if (nCutCanvasFinalLeft + newWidth > nShowCanvasWidth || nCutCanvasFinalTop + changeY < 0) {
                return 0;
            }
            nCutCanvasFinalTop += changeY;
            nCutWidth = newWidth;
            nCutHeight = newHeight;
            if (callback) {
                callback();
            }
        }
    }

    // 左下方向缩放
    function cutCanvasZoomBottomLeft(positionData, callback) {
        var changeX = positionData.nowX - positionData.oldX,
            changeY = positionData.nowY - positionData.oldY,
            newWidth = null,
            newHeight = null;

        // 释放变量
        positionData = null;
        if (Math.abs(changeX) > Math.abs(changeY)) {
            // 计算宽高
            newWidth = nCutWidth - changeX;
            newHeight = nCutHeight * newWidth / nCutWidth;
            // 若宽或高超出底层画布则不执行以下代码
            if (nCutCanvasFinalLeft + changeX < 0 || nCutCanvasFinalTop + newHeight > nShowCanvasHeight) {
                return 0;
            }
            nCutCanvasFinalLeft += changeX;
            nCutWidth = newWidth;
            nCutHeight = newHeight;
            if (callback) {
                callback();
            }
        } else {
            // 计算宽高
            newHeight = nCutHeight + changeY;
            newWidth = nCutWidth * newHeight / nCutHeight;
            // 若宽或高超出底层画布则不执行以下代码
            if (nCutCanvasFinalLeft + (nCutWidth - newWidth) < 0 || nCutCanvasFinalTop + newHeight > nShowCanvasHeight) {
                return 0;
            }
            nCutCanvasFinalLeft += nCutWidth - newWidth;
            nCutWidth = newWidth;
            nCutHeight = newHeight;
            if (callback) {
                callback();
            }
        }
    }

    // 右下方向缩放
    function cutCanvasZoomBottomRight(positionData, callback) {
        var changeX = positionData.nowX - positionData.oldX,
            changeY = positionData.nowY - positionData.oldY,
            newWidth = null,
            newHeight = null;

        // 释放变量
        positionData = null;
        if (Math.abs(changeX) > Math.abs(changeY)) {
            // 计算宽高
            newWidth = nCutWidth + changeX;
            newHeight = nCutHeight * newWidth / nCutWidth;
            // 若宽或高超出底层画布则不执行以下代码
            if (nCutCanvasFinalLeft + newWidth > nShowCanvasWidth || nCutCanvasFinalTop + newHeight > nShowCanvasHeight) {
                return 0;
            }
            nCutWidth = newWidth;
            nCutHeight = newHeight;
            if (callback) {
                callback();
            }
        } else {
            // 计算宽高
            newHeight = nCutHeight + changeY;
            newWidth = nCutWidth * newHeight / nCutHeight;
            // 若宽或高超出底层画布则不执行以下代码
            if (nCutCanvasFinalLeft + newWidth > nShowCanvasWidth || nCutCanvasFinalTop + newHeight > nShowCanvasHeight) {
                return 0;
            }
            nCutWidth = newWidth;
            nCutHeight = newHeight;
            if (callback) {
                callback();
            }
        }
    }

    // 转换文件路径
    function getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) {
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }

    // 获取随机字段
    function getRandomString(str) {
        return str + (Math.random() * 10000000).toString(16).slice(0, 4) + '-' + ((new Date()).getTime()).toString(16);
    }

    // 获取变量类型
    function getVariableType(variable) {
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }
}

