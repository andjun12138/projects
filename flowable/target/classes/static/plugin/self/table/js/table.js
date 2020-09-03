(function () {
    // 根据特定字段查找数组中的对应项，可返回对应项
    if (Array.prototype.searchArrayObj === undefined) {
        if (Object.defineProperty !== undefined) {
            Object.defineProperty(Array.prototype, 'searchArrayObj', {
                enumerable: false,
                writable: false,
                configurable: false,
                value: function (str, attrName, isReturnItem) {
                    var arr = this;
                    var result = -1;
                    var index;
                    if (isReturnItem === undefined) {
                        isReturnItem = false;
                    }
                    for (index in arr) {
                        if (!isNaN(index)) {
                            var shortTimeSave = (attrName !== undefined) ? arr[index][attrName] : arr[index];
                            if (shortTimeSave == str) {
                                if (isReturnItem) {
                                    result = arr[index];
                                } else {
                                    result = index;
                                }
                                break
                            }
                        }
                    }
                    return result;
                }
            })
        } else {
            // 查询数组对象
            Array.prototype.searchArrayObj = function (str, attrName, isReturnItem) {
                var arr = this;
                var result = -1;
                if (isReturnItem === undefined) {
                    isReturnItem = false;
                }
                for (var index in arr) {
                    if (!isNaN(index)) {
                        var shortTimeSave = (attrName !== undefined) ? arr[index][attrName] : arr[index];
                        if (shortTimeSave === str) {
                            if (isReturnItem) {
                                result = arr[index];
                            } else {
                                result = index;
                            }
                            break
                        }
                    }
                }
                return result;
            };
        }
    }
})();
function Table(parentId) {
    var _this = this;
    // 定时器，用于查看createTable是否调用
    var tableTimer = null;
    // 定义colGroup标签html
    var colGroupHtml = '<colgroup></colgroup>';
    // 定义col标签html
    var colHtml = '<col>';
    // 定义tbody标签的html
    var tbodyHtml = '<tbody></tbody>';
    // 定义tr标签的html
    var trHtml = '<tr></tr>';
    // 定义th标签的html
    var thHtml = '<th></th>';
    // 定义td标签的html
    var tdHtml = '<td></td>';
    // 存储样式格式
    var baseStyleArr = [];
    // 存储数据源
    var tableData = [];
    // 是否开启序号
    var isIndexEnable = true;
    // 是否开启复选框
    var isCheckBoxEnable = false;
    // 复选框模式
    var checkBoxModel = 1;
    // 存储行高
    var tableLineHeight = 30;
    // 存储自定义回调
    var resetCallback = null;
    // 存储列顺序数组
    var colOrderArr = [];
    // 限制列显示
    var showColArr = [];
    // 存储点击回调
    var clickCallback = null;
    // 存储选中的下标
    var selectIndexArr = [];
    // 存储选中回调函数
    var selectCallback = null;
    // 父级节点
    var oTableParent = $('#' + parentId);
    // 存储table父级节点
    var tableNode = null;
    // table Html
    var tableHtml = '<table class="global-table" cellpadding="0" cellspacing="0" border="1" bordercolor="#dcdcdc"></table>';
    // 起始序号
    var nStartIndex = 0;

    /*=== 调用函数 ===*/
    addTableHtml();
    eventOfTableClick();

    /*=== 功能函数 ===*/
    // 写入tableHtml
    function addTableHtml() {
        oTableParent.html(tableHtml);
        tableNode = oTableParent.find('.global-table').eq(0)
    }
    // 初始化表格
    function createdTable() {
        var result = '';
        var colStr = '';
        var thStr = '';
        var tdStr = '';
        // 遍历数据 ， col, th, td
        tableData.forEach(function (dataItem, itemIndex) {
            // 不改变原数组保证后续重绘不会出现序号个数异常的情况
            var stSaveOfShowCol = [];
            var stSaveOfColOrder = [];
            // 判别是否需要补全限制
            if (showColArr.length === 0) {
                showColArr = Object.keys(dataItem);
            }
            // 获取列顺序 (只需要自行一次)
            if (itemIndex === 0) {
                if (colOrderArr.length === 0) {
                    colOrderArr = Object.keys(dataItem);
                } else {
                    // 遍历数据源子项，将colOrderArr缺的数据补上
                    Object.keys(dataItem).forEach(function (key) {
                        if (colOrderArr.searchArrayObj(key) < 0) {
                            colOrderArr.push(key);
                        }
                    });
                }
            }
            // 当允许序号
            if (isIndexEnable) {
                stSaveOfShowCol = ['index'].concat(showColArr);
                stSaveOfColOrder = ['index'].concat(colOrderArr);
            }
            // 当允许复选框
            if (isCheckBoxEnable) {
                // 只有有序号才能开启2模式
                if (checkBoxModel === 2 && isIndexEnable) {
                    stSaveOfShowCol[0] = 'checkIndex';
                    stSaveOfColOrder[0] = 'checkIndex';
                } else {
                    stSaveOfShowCol = ['check'].concat(showColArr);
                    stSaveOfColOrder = ['check'].concat(colOrderArr);
                }
            }
            // 当还没设置列宽的时候
            if (colStr.length === 0) {
                // 字符串替换
                colStr = colGroupHtml.replace(/><\/colgroup>/, function () {
                    // 临时存储
                    var stSave = '';
                    // 判定基础样式是否有
                    if (baseStyleArr.length > 0) {
                        // 遍历列顺序
                        stSaveOfColOrder.forEach(function (colItem) {
                            if (stSaveOfShowCol.searchArrayObj(colItem) > -1) {
                                stSave += colHtml.replace(/>/, function () {
                                    // 查找当前type在基础样式中的对应项
                                    var obj = baseStyleArr.searchArrayObj(colItem, 'type', true);
                                    // 存储实际宽度
                                    var trueWidth = null;
                                    // 判定obj情况返回
                                    if (obj !== -1 && obj.width !== undefined) {
                                        trueWidth = ' width="' + parseInt(obj.width) + 'px">';
                                    } else if (colItem === 'index') {
                                        trueWidth = ' width="60px">';
                                    } else if (colItem === 'check') {
                                        trueWidth = ' width="40px">';
                                    } else if (colItem === 'checkIndex') {
                                        trueWidth = ' width="80px">';
                                    } else {
                                        trueWidth = '>';
                                    }
                                    return trueWidth;
                                })
                            }
                        })
                    } else {
                        stSaveOfColOrder.forEach(function (colItem, index) {
                            if (colItem === 'index') {
                                stSave += colHtml.replace(/>/, ' width="60px">');
                            } else if (colItem === 'check') {
                                stSave += colHtml.replace(/>/, ' width="40px">');
                            } else if (colItem === 'checkIndex') {
                                stSave += colHtml.replace(/>/, ' width="80px">');
                            } else {
                                if (index === stSaveOfColOrder.length - 1) {
                                    stSave += colHtml;
                                } else {
                                    stSave += colHtml.replace(/>/, ' width="' + (100 / stSaveOfColOrder.length) + '%">');
                                }
                            }
                        })
                    }
                    return '>' + stSave + '</colgroup>';
                });
                result = colStr + tbodyHtml;
            }
            // 当还没设置表头
            if (thStr.length === 0) {
                thStr = trHtml.replace(/><\/tr>/, function () {
                    var stSave = '';
                    stSaveOfColOrder.forEach(function (colItem) {
                        if (stSaveOfShowCol.searchArrayObj(colItem) > -1) {
                            // 存储回调的返回值
                            var resetStr = '';
                            // 存储基础样式中的对应项
                            var obj = baseStyleArr.searchArrayObj(colItem, 'type', true);
                            // 获取默认要填写的内容
                            var name = (obj !== -1 && obj.name !== undefined) ? obj.name : colItem;
                            // 临时存储
                            var indexCheckSave = '';
                            stSave += thHtml.replace(/><\/th>/, function () {
                                // 若自定义回调
                                if (resetCallback) {
                                    // 获取自定义
                                    resetStr = resetCallback(colItem, name, 'th');
                                }
                                if (colItem === 'checkIndex' || colItem === 'check' || colItem === 'index') {
                                    if (resetStr !== name && resetStr) {
                                        indexCheckSave = resetStr;
                                    } else {
                                        // 为0的情况
                                        if (typeof resetStr === "number") {
                                            indexCheckSave = resetStr;
                                        } else if (colItem === 'checkIndex') {
                                            indexCheckSave = '<input type="checkbox" name="selectAll"><p style="display: inline;margin-left: 10px">' + (name !== 'checkIndex' ? name : '序号') + '</p>';
                                        } else if (colItem === 'check') {
                                            indexCheckSave = '<input type="checkbox" name="selectAll">';
                                        } else {
                                            indexCheckSave = (name !== 'index' ? name : '序号');
                                        }
                                    }
                                    return ' data-type="' + (colItem) + '" style="text-align:' + ((obj !== -1 && obj.align !== undefined) ? obj.align : (colItem === 'checkIndex') ? 'left' : 'center') + '">' + indexCheckSave + '</th>';
                                } else {
                                    // 根据自定义回调返回值赋值
                                    return ' data-type="' + colItem + '" style="text-align:' + ((obj !== -1 && obj.align !== undefined) ? obj.align : 'center') + '">' + ((!!resetStr) ? resetStr : name) + '</th>';
                                }
                            })
                        }
                    });
                    return ' style="height:' + tableLineHeight + 'px">' + stSave + '</tr>';
                });
                result = result.replace(/<\/tbody>/, thStr + '</tbody>');
            }
            // 清空td
            tdStr = '';
            // 开始设置td
            tdStr += trHtml.replace(/><\/tr>/, function () {
                var stSave = '';
                stSaveOfColOrder.forEach(function (colItem) {
                    if (stSaveOfShowCol.searchArrayObj(colItem) > -1) {
                        // 存储基础样式中的对应项
                        var obj = baseStyleArr.searchArrayObj(colItem, 'type', true);
                        // 暂时存储
                        var indexCheckSave = '';
                        // 存储回调的返回值
                        var resetStr = '';
                        stSave += tdHtml.replace(/><\/td>/, function () {
                            // 若自定义回调存在
                            if (resetCallback) {
                                // 获取自定义内容
                                resetStr = resetCallback(colItem, dataItem[colItem], 'td');
                            }
                            // 序号/复选框区域
                            if (colItem === 'checkIndex' || colItem === 'check' || colItem === 'index') {
                                // 自定义内容不为undefined/null/空
                                if (!!resetStr) {
                                    indexCheckSave = resetStr;
                                } else { // 自定义内容为undefined/null/空
                                    // 为0的情况
                                    if (typeof resetStr === "number") {
                                        indexCheckSave = resetStr;
                                    } else if (colItem === 'checkIndex') {
                                        // 自定义不能用，根据数据源进行写入
                                        indexCheckSave = '<input type="checkbox" name="selectItem" data-index="' + (itemIndex + nStartIndex) + '"><p style="display: inline;margin-left: 10px">' + (itemIndex + nStartIndex + 1) + '</p>';
                                    } else if (colItem === 'check') {
                                        // 自定义不能用，回复复选框
                                        indexCheckSave = '<input type="checkbox" name="selectItem" data-index="' + (itemIndex + nStartIndex) + '">';
                                    } else {
                                        // 自定义不能用，回复序号
                                        indexCheckSave = itemIndex + nStartIndex + 1;
                                    }
                                }
                                return ' data-type="' + colItem + '" style="text-align:' + ((obj !== -1 && obj.align !== undefined) ? obj.align : (colItem === 'checkIndex') ? 'left' : 'center') + '">' + indexCheckSave + '</th> ';
                            } else { // 内容区域
                                // 存储数据 (序号/复选框不会用到)
                                var content = (!!resetStr || resetStr === '') ? resetStr : (!!dataItem[colItem] || dataItem[colItem] === 0) ? dataItem[colItem] : '';
                                // 根据自定义回调返回值赋值
                                return ' data-type="' + colItem + '" style="text-align:' + ((obj !== -1 && obj.align !== undefined) ? obj.align : 'center') + '">' + content + '</td>';
                            }
                        })
                    }
                });
                return ' style="height:' + tableLineHeight + 'px">' + stSave + '</tr>';
            });
            result = result.replace(/<\/tbody>/, tdStr + '</tbody>');
        });
        tableNode.html(result);
        // 必须清空限制列数组，防止重设表格显示错误
        showColArr = [];
    }
    // 点击回调
    function eventOfTableClick() {
        tableNode.off('click').on('click', function (event) {
            var nowNode = $(event.target);
            if (nowNode.get(0).tagName.toLowerCase() === 'input' && nowNode.attr('type') === 'checkbox') {
                clickCheckBox(nowNode);
            }
            if (clickCallback) {
                clickCallback(nowNode);
            }
        })
    }
    // 复选框点击处理函数
    function clickCheckBox(node) {
        var checkAll = tableNode.find('input[name="selectAll"]').eq(0);
        var checkItem = tableNode.find('input[name="selectItem"]');
        var name = node.attr('name');
        if (name === 'selectAll') {
            if (node.prop('checked')) {
                checkItem.prop('checked', true);
                tableData.forEach(function (item, index) {
                    selectIndexArr.push(index);
                })
            } else {
                checkItem.prop('checked', false);
                selectIndexArr.splice(0, selectIndexArr.length);
            }
        } else if (name === 'selectItem') {
            var index = node.data().index;
            if (node.prop('checked')) {
                selectIndexArr.push(index);
                if (selectIndexArr.length === tableData.length) {
                    checkAll.prop('checked', true);
                }
            } else {
                selectIndexArr.splice(selectIndexArr.searchArrayObj(index), 1);
                if (checkAll.prop('checked')) {
                    checkAll.prop('checked', false);
                }
            }
        }
        if (!!selectCallback) {
            selectCallback(selectIndexArr);
        }
    }
    // 创建表格
    function finishTable() {
        if (tableTimer === null) {
            tableTimer = setTimeout(function () {
                if (tableData.length > 0) {
                    createdTable()
                } else {
                    console.warn('查找不到表格数据，无法新建表格')
                }
                clearTimeout(tableTimer);
                tableTimer = null;
            }, 0)
        }
    }
    // 获取变量类型
    function getVariableType(variable) {
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }

    /*=== 调用方法 ===*/
    // 设置基础样式
    _this.setBaseStyle = function (styleArr) {
        try {
            if (styleArr === undefined) {
                throw new Error('styleArr为undefined，将不会设置自定义样式')
            } else if (!(styleArr instanceof Array)) {
                throw new Error('styleArr格式错误，需为数组（Array）')
            } else if (styleArr.length > 0) {
                styleArr.forEach(function (item) {
                    if (!item.type && typeof item.type !== "number") {
                        throw new Error('styleArr中type不能为undefined/null/空字符串')
                    }
                });
                baseStyleArr = JSON.parse(JSON.stringify(styleArr))
            }
            // 调用完成表格创建
            finishTable();
            /*else if (styleArr.length === 0){
                throw new Error('styleArr为空数组，将不会设置自定义样式')
            }*/
        } catch (err) {
            console.error('table_error: setBaseStyle ' + err)
        }
        return _this
    };
    // 设置表格数据
    _this.setTableData = function (data) {
        try {
            if (data === undefined) {
                throw new Error('data不能为undefined')
            } else if (!(data instanceof Array)) {
                throw new Error('data格式错误，需为数组（Array）')
            }
            if (data.length > 0) {
                if (tableNode.css('display') === 'none') {
                    tableNode.removeAttr('style')
                }
                data.forEach(function (item) {
                    if (typeof item !== "object") {
                        throw new Error('data的子项必须为对象')
                    } else if (!(/[^{}\s]/.test(JSON.stringify(item)))) {
                        throw new Error('data的子项不能为空对象')
                    }
                });
                // table展示
                tableNode.show();
                tableData = JSON.parse(JSON.stringify(data));
            } else {
                // 隐藏
                tableNode.hide();
                tableData = []
            }
            // 调用完成表格创建
            finishTable();
        } catch (err) {
            console.error('table_error: setTableData ' + err)
        }
        return _this
    };
    // 创建表格 (为兼容旧版不报错)
    _this.createTable = function () {
        // 不需要执行
        return 0;
    };
    // 设置自定义内容回调
    _this.resetHtmlCallBack = function (callback) {
        try {
            if (callback === undefined) {
                throw new Error('callback为undefined，将不会设置自定义内容')
            } else if (typeof callback !== "function") {
                throw new Error('callback格式错误，需为函数（function）')
            } else if (resetCallback === null) {
                resetCallback = callback
            }
            // 调用完成表格创建
            finishTable();
        } catch (err) {
            console.error('table_error: resetHtmlCallBack ' + err)
        }
        return _this
    };
    // 设置列顺序
    _this.setColOrder = function (orderArr) {
        try {
            if (orderArr === undefined) {
                throw new Error('orderArr为undefined，将不会设置自定义列顺序');
            } else if (!(orderArr instanceof Array)) {
                throw new Error('orderArr格式错误，需为数组（array）');
            } else if (orderArr.length > 0) {
                colOrderArr = JSON.parse(JSON.stringify(orderArr));
            }
            // 调用完成表格创建
            finishTable();
        } catch (err) {
            console.error('table_error: setColOrder ' + err);
        }
        return _this;
    };
    // 设置是否启用序号
    _this.setOpenIndex = function (isOpen) {
        try {
            if (isOpen === undefined) {
                isOpen = true;
            } else if (typeof isOpen !== "boolean") {
                throw new Error('isOpen格式错误，需为布尔值(boolean）');
            }
            isIndexEnable = isOpen;
            // 调用完成表格创建
            finishTable();
        } catch (err) {
            console.error('table_error: setOpenIndex ' + err);
        }
        return _this;
    };
    // 设置是否启用复选框
    _this.setOpenCheckBox = function (isOpen, model) {
        try {
            if (model === undefined) {
                model = 1
            }
            if (isOpen === undefined) {
                isOpen = false;
            } else if (typeof isOpen !== "boolean") {
                throw new Error('isOpen格式错误，需为布尔值(boolean）')
            } else if (typeof model !== "number" && model !== 1 && model !== 2) {
                throw new Error('model需为数值的1或2')
            }
            isCheckBoxEnable = isOpen;
            checkBoxModel = model;
            // 调用完成表格创建
            finishTable();
        } catch (err) {
            console.error('table_error: setOpenCheckBox ' + err);
        }
        return _this;
    };
    // 设置显示列
    _this.setShowColArr = function (colArr) {
        try {
            if (colArr === undefined) {
                throw new Error('colArr为undefined，将不会限制列显示');
            } else if (!(colArr instanceof Array)) {
                throw new Error('colArr格式错误，需为数组（array）');
            } else if (colArr.length > 0) {
                showColArr = JSON.parse(JSON.stringify(colArr));
            }
            /*else if (colArr.length === 0){
                throw new Error('styleArr为空数组，将不会设置自定义列顺序')
            }*/
            // 调用完成表格创建
            finishTable();
        } catch (err) {
            console.error('table_error: setShowColArr ' + err);
        }
        return _this;
    };
    // 设置行高
    _this.setTableLineHeight = function (height) {
        try {
            if (height === undefined) {
                height = 30;
            } else if (typeof height !== "number") {
                throw new Error('height格式错误，需为数值(number）')
            }
            tableLineHeight = height;
            // 调用完成表格创建
            finishTable();
        } catch (err) {
            console.error('table_error: setTableLineHeight ' + err)
        }
        return _this
    };
    // 设置选中下标的回调函数
    _this.setSelectCallback = function (callback) {
        try {
            if (callback === undefined) {
                throw new Error('callback为undefined')
            } else if (typeof callback !== "function") {
                throw new Error('callback格式错误，需为函数(function）')
            }
            if (callback) {
                selectCallback = callback;
            }
            // 调用完成表格创建
            finishTable();
        } catch (err) {
            console.error('table_error: setSelectCallback ' + err)
        }
        return _this
    };
    // 设置点击回调方法
    _this.setClickCallback = function (callback) {
        try {
            if (callback === undefined) {
                throw new Error('callback为undefined')
            } else if (typeof callback !== "function") {
                throw new Error('callback格式错误，需为函数(function）')
            }
            clickCallback = callback;
            // 调用完成表格创建
            finishTable();
        } catch (err) {
            console.error('table_error: setClickCallback ' + err)
        }
        return _this
    };
    // 设置起始序号
    _this.setStartIndex = function (index) {
        try {
            if (index === undefined) {
                nStartIndex = 0;
            } else if (getVariableType(index) !== 'number') {
                throw new Error('index格式错误，需为Number');
            } else if (index < 1) {
                throw new Error('index不能小于1');
            } else {
                nStartIndex = index - 1;
            }
            // 调用完成表格创建
            finishTable();
        } catch (err) {
            console.error('table_error: setShowColArr ' + err);
        }
        return _this;
    }
}