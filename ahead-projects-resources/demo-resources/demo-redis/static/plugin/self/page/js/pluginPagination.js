// 分页插件构造函数
function PluginPagination(id) {
    var _this = this;
    // 定时器，用于查看createTable是否调用
    var pageTimer = null;
    // 分页html
    var sPageHtml = '<div class="plugin-pagination">\n' +
        '        <div class="plugin-pagination-content-div plugin-pagination-content-div__ie11">\n' +
        '            <div class="plugin-pagination-content plugin-pagination-content__ie11">\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>';
    // 列表html
    var ulHtml = '<ul class="plugin-pagination-content-list"></ul>';
    // 子项html
    var liHtml = '<li class="plugin-pagination-content-item" data-mark=""></li>';
    // 省略号html
    var ellipsisHtml = '<li class="plugin-pagination-content-item">···</li>';
    // 快速通道html
    var liftHtml = '<div class="plugin-pagination-Lift-div"></div>';
    // 快速通道提示html
    var liftTipHtml = '<p class="plugin-pagination-Lift-tip" data-mark=""></p>';
    // 快速通道input html
    var liftInputHtml = '<input class="plugin-pagination-Lift-input" type="text">';
    // 快速通道btn html
    var liftBtnHtml = '<button class="plugin-pagination-Lift-btn" data-mark=""></button>';
    // 分页父节点
    var oPageParentNode = $('#' + id);
    // 分页节点
    var pageNode = null;
    // 获取第二延展层
    var secondDivNode = null;
    // 获取第三承载层
    var thirdDivNode = null;

    /*=== 数据记录变量 ===*/
    // 记录修改区域
    var resetArea = {
        leftUl: {
            isChange: true,
            str: ''
        },
        contentUl: {
            isChange: true,
            str: ''
        },
        rightUl: {
            isChange: true,
            str: ''
        },
        liftDiv: {
            isChange: true,
            str: ''
        }
    };
    // 记录当前页码
    var nowPageNumber = 1;
    // 记录最大页码
    var maxPageNumber = null;
    // 设置页码显示数量
    var pageNumberShowSize = 5;
    // 记录跳页模式 1.不出现省略号；2.出现省略号；
    var changeModel = 2;
    // 记录左列表的初始化数据
    var leftUlInitData = [
        {
            name: '上一页',
            mark: 'prev'
        },
        {
            name: '首页',
            mark: 'first'
        }
    ];
    // 记录右列表的初始化数据
    var rightUlInitData = [
        {
            name: '尾页',
            mark: 'last'
        },
        {
            name: '下一页',
            mark: 'next'
        }
    ];
    // 记录跳转的初始化数据
    var liftDivInitData = {
        tip1: {
            name: '跳至',
            mark: 'tip1'
        },
        tip2: {
            name: '页',
            mark: 'tip2'
        },
        button: {
            name: 'GO',
            mark: 'liftBtn'
        }
    };
    // 记录点击回调函数
    var clickCallback = null;
    // 记录自定义html的回调函数
    var resetHtmlCallback = null;
    // 记录获取input节点回调函数
    var getInputNodeCallback = null;
    // 开启首尾页模式
    var isOpenFirstEndModel = false;
    // 开启升降通道
    var isOpenLift = true;
    // 是否正在创建分页
    var isCreating = false;

    appendPageHtml();
    eventOfPageClick();

    // 创建
    _this.createPage = function () {
        return _this;
    };
    // 设置当前页码
    _this.setNowPageNumber = function (number) {
        try {
            if (isCreating) {
                throw new Error('请在createPage方法前调用！');
            } else if (typeof number !== "number") {
                throw new Error('参数number类型错误，需为number！');
            } else if (number < 1) {
                throw new Error('参数 number 需大于 0');
            } else if (maxPageNumber === null) {
                throw new Error('请在setMaxPageNumber方法后调用');
            }
            if (number !== nowPageNumber) {
                if (number > maxPageNumber) {
                    throw new Error('参数 number 不可大于 最大页码');
                } else {
                    nowPageNumber = number;
                    resetArea.contentUl.isChange = true;
                }
            }
            finishPage();
        } catch (err) {
            console.error('PluginPagination 插件(id = ' + id + ') 的setNowPageNumber方法错误：' + err);
        }
        return _this;
    };
    // 设置最大页码
    _this.setMaxPageNumber = function (number) {
        try {
            if (isCreating) {
                throw new Error('请在createPage方法前调用！');
            } else if (typeof number !== "number") {
                throw new Error('参数number类型错误，需为number！');
            } else if (number < 1) {
                throw new Error('参数 number 需大于 0');
            }
            if (number !== maxPageNumber) {
                // 若当前页码大于最大页码，则将最大页码赋值给当前页码
                if (!!nowPageNumber && number < nowPageNumber) {
                    nowPageNumber = number
                }
                maxPageNumber = number;
                resetArea.contentUl.isChange = true;
            }
            finishPage();
            return _this;
        } catch (err) {
            console.error('PluginPagination 插件(id = ' + id + ') 的setMaxPageNumber方法错误：' + err);
        }
    };
    // 设置是否开启“首/尾页”模式
    _this.openFirstEndModel = function (isOpen) {
        if (isOpen === undefined) {
            isOpen = false;
        }
        try {
            if (isCreating) {
                throw new Error('请在createPage方法前调用！');
            } else if (typeof isOpen !== "boolean") {
                throw new Error('参数boolean类型错误，需为Boolean！');
            }
            if (isOpen !== isOpenFirstEndModel) {
                isOpenFirstEndModel = isOpen
            }
            finishPage();
        } catch (err) {
            console.error('PluginPagination 插件(id = ' + id + ') 的openFirstEndModel方法错误：' + err);
        }
        return _this;
    };
    // 设置修改页码的模式
    _this.setChangePageNumberModel = function (number) {
        if (number === undefined) {
            number = 2;
        }
        try {
            if (typeof number !== "number") {
                throw new Error('参数number类型错误，需为number！');
            } else if (number !== 1 && number !== 2) {
                throw new Error('参数 number 只能取值 1 或 2');
            }
            if (number !== changeModel) {
                changeModel = number;
            }
        } catch (err) {
            console.error('PluginPagination 插件(id = ' + id + ') 的setChangePageNumberModel方法错误：' + err);
        }
        return _this;
    };
    // 设置点击回调函数
    _this.setClickCallback = function (callback) {
        try {
            if (typeof callback !== "function") {
                throw new Error('参数callback类型错误，需为function！');
            }
            clickCallback = callback;
        } catch (err) {
            console.error('PluginPagination 插件(id = ' + id + ') 的setClickCallback方法错误：' + err);
        }
        return _this;
    };
    // 设置自定义修改函数
    _this.setResetHtmlCallback = function (callback) {
        try {
            if (isCreating) {
                throw new Error('请在createPage方法前调用！');
            } else if (typeof callback !== "function") {
                throw new Error('参数callback类型错误，需为function！');
            }
            resetHtmlCallback = callback;
            finishPage();

        } catch (err) {
            console.error('PluginPagination 插件(id = ' + id + ') 的setResetHtmlCallback方法错误：' + err);
        }
        return _this;
    };
    // 设置左区域（上一页+首页）的配置
    _this.setLeftFuncConfig = function (arr) {
        try {
            if (isCreating) {
                throw new Error('请在createPage方法前调用！');
            } else if (!(arr instanceof Array)) {
                throw new Error('参数arr类型错误，需为Array！');
            }
            arr.forEach(function (item, index) {
                if (typeof item !== "object") {
                    throw new Error('arr的子项类型需为object');
                }
                leftUlInitData[index].name = (item.name !== undefined) ? item.name : leftUlInitData[index].name;
                leftUlInitData[index].mark = (item.mark !== undefined) ? item.mark : leftUlInitData[index].mark;
            });
            finishPage();

        } catch (err) {
            console.error('PluginPagination 插件(id = ' + id + ') 的setLeftFuncConfig方法错误：' + err);
        }
        return _this;
    };
    // 设置右区域（下一页+尾页）的配置
    _this.setRightFuncConfig = function (arr) {
        try {
            if (isCreating) {
                throw new Error('请在createPage方法前调用！');
            } else if (!(arr instanceof Array)) {
                throw new Error('参数arr类型错误，需为Array！');
            }
            arr.forEach(function (item, index) {
                if (typeof item !== "object") {
                    throw new Error('arr的子项类型需为object');
                }
                rightUlInitData[index].name = (item.name !== undefined && item.name !== null) ? item.name : leftUlInitData[index].name;
                rightUlInitData[index].mark = (item.mark !== undefined && item.name !== null) ? item.mark : leftUlInitData[index].mark;
            });
            finishPage();

        } catch (err) {
            console.error('PluginPagination 插件(id = ' + id + ') 的setRightFuncConfig方法错误：' + err);
        }
        return _this;
    };
    // 设置开启升降通道
    _this.openLift = function (isOpen) {
        if (isOpen === undefined) {
            isOpen = true;
        }
        try {
            if (isCreating) {
                throw new Error('请在createPage方法前调用！');
            } else if (typeof isOpen !== "boolean") {
                throw new Error('参数boolean类型错误，需为Boolean！');
            }
            if (isOpen !== isOpenLift) {
                isOpenLift = isOpen
            }
            finishPage();

        } catch (err) {
            console.error('PluginPagination 插件(id = ' + id + ') 的openLift方法错误：' + err);
        }
        return _this;
    };
    // 设置“跳转”功能的配置
    _this.setLiftDivConfig = function (config) {
        try {
            if (isCreating) {
                throw new Error('请在createPage方法前调用！');
            } else if (typeof config !== "object") {
                throw new Error('参数obj类型错误，需为object！');
            }
            Object.keys(config).forEach(function (key) {
                if (typeof config[key] !== "object") {
                    throw new Error('obj的属性值类型需为object');
                }
                var stSave = config[key];
                liftDivInitData[key].name = (stSave.name !== undefined && stSave.name !== null) ? stSave.name : liftDivInitData[key].name;
                liftDivInitData[key].mark = (stSave.mark !== undefined && stSave.mark !== null) ? stSave.mark : liftDivInitData[key].mark;
            });
            finishPage();

        } catch (err) {
            console.error('PluginPagination 插件(id = ' + id + ') 的setLiftDivConfig方法错误：' + err);
        }
        return _this;
    };
    // 设置页码的显示个数
    _this.setPageItemShowNumber = function (number) {
        if (number === undefined) {
            number = 5;
        }
        try {
            if (typeof number !== "number") {
                throw new Error('参数number类型错误，需为number！');
            } else if (number < 1) {
                throw new Error('参数 number 需大于 1');
            } else if (maxPageNumber !== null && number > maxPageNumber) {
                throw new Error('参数 number 不能大于 最大页码');
            }
            if (number !== pageNumberShowSize) {
                pageNumberShowSize = number;
            }

        } catch (err) {
            console.error('PluginPagination 插件(id = ' + id + ') 的setPageItemShowNumber方法错误：' + err);
        }
        return _this;
    };
    // 设置获取input框的回调函数
    _this.setGetInputNodeCallback = function (callback) {
        try {
            if (isCreating) {
                throw new Error('请在createPage方法前调用！');
            } else if (typeof callback !== "function") {
                throw new Error('参数callback类型错误，需为function！');
            }
            getInputNodeCallback = callback;
            finishPage();

        } catch (err) {
            console.error('PluginPagination 插件(id = ' + id + ') 的setGetInputNodeCallback方法错误：' + err);
        }
        return _this;
    };
    // 设置分页插件的显示隐藏
    _this.showPage = function (isShow) {
        try {
            if (isShow === undefined) {
                isShow = true;
            } else if (typeof isShow !== "boolean") {
                throw new Error('参数isShow类型错误，需为boolean！');
            }
            // 分页区域节点
            var pageAreaNode = $('#' + id);
            // 是否显示
            if (isShow) {
                pageAreaNode.show();
            } else {
                pageAreaNode.hide();
            }
        } catch (err) {
            console.error('PluginPagination 插件(id = ' + id + ') 的showPage方法错误：' + err);
        }
        return _this;
    };

    /*=== 功能函数 ===*/
    // 写入分页html
    function appendPageHtml() {
        var oWarpRule = />?\s+<|>\s+<?/g;
        var html = sPageHtml.replace(oWarpRule, function (warpStr) {
            return warpStr.replace(/\s+/g, '');
        });
        oPageParentNode.html(html);
        pageNode = oPageParentNode.find('.plugin-pagination').eq(0);
        secondDivNode = pageNode.find('.plugin-pagination-content-div').eq(0);
        thirdDivNode = pageNode.find('.plugin-pagination-content').eq(0);
    }
    // 完成分页
    function finishPage() {
        if (pageTimer === null) {
            pageTimer = setTimeout(function () {
                if (nowPageNumber && maxPageNumber && !(maxPageNumber < nowPageNumber)) {
                    createPage();
                } else {
                    console.warn('nowPageNumber或maxPageNumber设置有问题')
                }
                clearTimeout(pageTimer);
                pageTimer = null;
            }, 0)
        }
    }
    // 创建
    function createPage() {
        var str = '';
        var inputNode = null;
        // 修改左列表
        if (resetArea.leftUl.isChange) {
            if (resetHtmlCallback) {
                str += resetHtmlCallback(setLeftRightFunc(true));
            } else {
                str += setLeftRightFunc(true);
            }
        }
        // 修改中间列表
        if (resetArea.contentUl.isChange) {
            if (resetHtmlCallback) {
                str += resetHtmlCallback(setPageNumberFunc());
            } else {
                str += setPageNumberFunc();
            }
        }
        // 修改右列表
        if (resetArea.rightUl.isChange) {
            if (resetHtmlCallback) {
                str += resetHtmlCallback(setLeftRightFunc(false));
            } else {
                str += setLeftRightFunc(false);
            }
        }
        // 修改跳转节点
        if (isOpenLift && resetArea.liftDiv.isChange) {
            if (resetHtmlCallback) {
                str += resetHtmlCallback(setLiftFunc());
            } else {
                str += setLiftFunc();
            }
        }
        pageNode.find('.plugin-pagination-content').eq(0).html(str);
        // 获取input节点
        inputNode = pageNode.find('.plugin-pagination-Lift-input').eq(0);
        eventOfLiftInputNode(inputNode);
    }

    function eventOfLiftInputNode (inputNode) {
        var rule = /[^\d]/g;
        inputNode.bind('input propertychange', function () {
            var pageNumber = inputNode.val().replace(rule, function () {
                return ''
            });
            if (pageNumber.length > 0) {
                pageNumber = parseInt(pageNumber);
                if (pageNumber < 1) {
                    pageNumber = 1;
                } else if (pageNumber > maxPageNumber) {
                    pageNumber = maxPageNumber;
                }
            } else {
                pageNumber = null;
            }
            inputNode.val(pageNumber);
            if (getInputNodeCallback) {
                getInputNodeCallback(pageNumber);
            }
        });
    }

    // 写入左功能区内容
    function setLeftRightFunc(isLeft) {
        var result = '';
        var index = (isLeft) ? 0 : 1;
        var data = (isLeft) ? leftUlInitData : rightUlInitData;
        if (isOpenFirstEndModel) {
            result += ulHtml.replace(/<\/ul>/, function (substring) {
                var stSave = '';
                data.forEach(function (item) {
                    if (item.mark !== nowPageNumber) {
                        stSave += liHtml.replace(/class="[^"]+"/, function (classStr) {
                            // 当前页码
                            if (nowPageNumber === 1 && isLeft) {
                                return classStr.slice(0, -1) + ' plugin-pagination-content-item__disabled' + classStr.slice(-1);
                            } else if (nowPageNumber === maxPageNumber && !isLeft) {
                                return classStr.slice(0, -1) + ' plugin-pagination-content-item__disabled' + classStr.slice(-1);
                            } else {
                                return classStr;
                            }
                        }).replace(/data-mark=""/, function (markStr) {
                            return markStr.slice(0, -1) + item.mark + markStr.slice(-1);
                        }).replace(/<li((?!<\/li>)[^>])+>/, function (liHeadStr) {
                            if (nowPageNumber === 1 && isLeft) {
                                return liHeadStr.slice(0, -1) + ' disabled="disabled"' + liHeadStr.slice(-1);
                            } else if (nowPageNumber === maxPageNumber && !isLeft) {
                                return liHeadStr.slice(0, -1) + ' disabled="disabled"' + liHeadStr.slice(-1);
                            } else {
                                return liHeadStr;
                            }
                        }).replace(/<\/li>/, function (liStr) {
                            return item.name + liStr;
                        })
                    }
                });
                return stSave + substring;
            })
        } else {
            result += ulHtml.replace(/<\/ul>/, function (substring) {
                var stSave = '';
                stSave += liHtml.replace(/class="[^"]+"/, function (classStr) {
                    // 当前页码
                    if (nowPageNumber === 1 && isLeft) {
                        return classStr.slice(0, -1) + ' plugin-pagination-content-item__disabled' + classStr.slice(-1);
                    } else if (nowPageNumber === maxPageNumber && !isLeft) {
                        return classStr.slice(0, -1) + ' plugin-pagination-content-item__disabled' + classStr.slice(-1);
                    } else {
                        return classStr;
                    }
                }).replace(/data-mark=""/, function (markStr) {
                    return markStr.slice(0, -1) + data[index].mark + markStr.slice(-1);
                }).replace(/<li((?!<\/li>)[^>])+>/, function (liHeadStr) {
                    if (nowPageNumber === 1 && isLeft) {
                        return liHeadStr.slice(0, -1) + ' disabled="disabled"' + liHeadStr.slice(-1);
                    } else if (nowPageNumber === maxPageNumber && !isLeft) {
                        return liHeadStr.slice(0, -1) + ' disabled="disabled"' + liHeadStr.slice(-1);
                    } else {
                        return liHeadStr;
                    }
                }).replace(/<\/li>/, function (liStr) {
                    return data[index].name + liStr;
                });
                return stSave + substring;
            })
        }
        return result;
    }
    // 写入升降功能区内容
    function setLiftFunc() {
        var result = '';
        result += liftHtml.replace(/<\/div>/, function (substring) {
            var stSave = '';
            // 第一个文本提示
            stSave += liftTipHtml.replace(/data-mark=""/, function (markStr) {
                return markStr.slice(0, -1) + liftDivInitData.tip1.mark + markStr.slice(-1);
            }).replace(/<\/p>/, function (pStr) {
                return liftDivInitData.tip1.name + pStr;
            });
            // input框
            stSave += liftInputHtml;
            // 第二个文本提示
            stSave += liftTipHtml.replace(/data-mark=""/, function (markStr) {
                return markStr.slice(0, -1) + liftDivInitData.tip2.mark + markStr.slice(-1);
            }).replace(/<\/p>/, function (pStr) {
                return liftDivInitData.tip2.name + pStr;
            });
            // button
            stSave += liftBtnHtml.replace(/data-mark=""/, function (markStr) {
                return markStr.slice(0, -1) + liftDivInitData.button.mark + markStr.slice(-1);
            }).replace(/<\/button>/, function (btnStr) {
                return liftDivInitData.button.name + btnStr;
            });
            return stSave + substring;
        });
        return result;
    }
    // 写入中间功能区内容
    function setPageNumberFunc() {
        // 页码str
        var pageNumberStr = '';
        // 记录当前号码段的最大最小值
        var minMaxArr = [];
        // 暂时存储
        var stSave = 0;
        // 拼字符串
        pageNumberStr += ulHtml.replace(/<\/ul>/, function (ulStr) {
            var str = '';
            // 模式1 没有省略号
            if (changeModel === 1) {
                stSave = (nowPageNumber % pageNumberShowSize !== 0) ? Math.floor(nowPageNumber / pageNumberShowSize) * pageNumberShowSize + 1 : nowPageNumber - pageNumberShowSize + 1;
                minMaxArr.push(stSave);
                stSave = (stSave + pageNumberShowSize - 1 < maxPageNumber) ? stSave + pageNumberShowSize - 1 : maxPageNumber;
                minMaxArr.push(stSave);
                stSave = minMaxArr[0];
                while (stSave < minMaxArr[1] + 1) {
                    str += liHtml.replace(/class="[^"]+"/, function (classStr) {
                        // 当前页码
                        if (stSave === nowPageNumber) {
                            return classStr.slice(0, -1) + ' plugin-pagination-content-item__activity' + classStr.slice(-1);
                        } else {
                            return classStr;
                        }
                    }).replace(/data-mark=""/, function (markStr) {
                        return markStr.slice(0, -1) + stSave + markStr.slice(-1);
                    }).replace(/<li((?!<\/li>)[^>])+>/, function (liHeadStr) {
                        var str = ' data-status=""';
                        if (stSave === nowPageNumber) {
                            str = str.slice(0, -1) + 'active' + str.slice(-1);
                        }
                        return liHeadStr.slice(0, -1) + str + liHeadStr.slice(-1);
                    }).replace(/<\/li>/, function (liFooterStr) {
                        return stSave + liFooterStr;
                    });
                    stSave += 1;
                }
                // console.log(str);
            } else if (changeModel === 2) {// 模式2 省略号
                stSave = 1;
                while (stSave < maxPageNumber + 1) {
                    if ((stSave === 2 && nowPageNumber - stSave + 1 > 3) || (stSave === nowPageNumber + 2 && maxPageNumber - nowPageNumber + 1 > 3)) {
                        str += ellipsisHtml;
                        if (stSave === 2) {
                            stSave = nowPageNumber - 1;
                        } else if (stSave === nowPageNumber + 2) {
                            stSave = maxPageNumber;
                        }
                    } else {
                        str += liHtml.replace(/class="[^"]+"/, function (classStr) {
                            // 当前页码
                            if (stSave === nowPageNumber) {
                                return classStr.slice(0, -1) + ' plugin-pagination-content-item__activity' + classStr.slice(-1);
                            } else {
                                return classStr;
                            }
                        }).replace(/data-mark=""/, function (markStr) {
                            return markStr.slice(0, -1) + stSave + markStr.slice(-1);
                        }).replace(/<li((?!<\/li>)[^>])+>/, function (liHeadStr) {
                            var str = ' data-status=""';
                            if (stSave === nowPageNumber) {
                                str = str.slice(0, -1) + 'active' + str.slice(-1);
                            }
                            return liHeadStr.slice(0, -1) + str + liHeadStr.slice(-1);
                        }).replace(/<\/li>/, function (liStr) {
                            return stSave + liStr;
                        });
                        stSave += 1;
                    }
                }
            }
            return str + ulStr;
        });
        return pageNumberStr;
    }
    /*=== 监听函数 ===*/
    function eventOfPageClick() {
        var nowNode = null;
        pageNode.off().click(function (event) {
            nowNode = $(event.target);
            if (clickCallback) {
                clickCallback.call(_this, nowNode, nowPageNumber);
            }
        })
    }
}
