/**
 * Created by mu-HUN on 2018/8/3.
 */
var stack_bottom_right = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};
var clickButtonId;
//共用函数
var FORM_PREVIEW = {
    state: {
        deleteFileIds: []
    },
    setDeleteFileIds: function (fileIds) {
        this.state.deleteFileIds = fileIds;
    },
    addDeleteFileId: function (fileId) {
        var deleteFileIds = this.getDeleteFileIds();
        for(var i = 0, len = deleteFileIds.length; i < len; i++) {
            if(parseInt(deleteFileIds[i]) === parseInt(fileId)) { // 查重
                return false;
            }
        }
        deleteFileIds.push(fileId);
        return true;
    },
    getDeleteFileIds: function () {
        return this.state.deleteFileIds;
    }
}

// iframe高度自适应
function changeFrameHeight(ifm) {
    ifm.height = document.documentElement.clientHeight - 49;
}

// 点击行获取行数据
function onClickRow(row) {
    clickButtonId = row.id;
}
//
function getHeight() {
    var searchHeight = 0;
    if($("#search-part").css('display') !== 'none') {
        searchHeight = $('#search-part').height();
    }
    return $(parent.window).height() - 115 - searchHeight;
}
//时间戳转日期
function getMyDate(str){
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth()+1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay) +' '+ getzf(oHour) +':'+ getzf(oMin) +':'+getzf(oSen);//最后拼接时间
    return oTime;
};
//补0操作
function getzf(num){
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}
//刷新列表并且弹出提示消息
function refreshAndShowMessage(options){
    new PNotify(options);
    $('#table').bootstrapTable('refresh');
}
// 报表勾选获取信息通用接口  -- 接收参数类型，空值、字符串、字符串数组
function getSelectionMessage(option) {
    if(typeof option === 'undefined') {
        return [];
    } else if(typeof option === 'string') {
        return $.map($('#table').bootstrapTable('getSelections'), function (row) {
            var obj = {};
            var tempName = row[option] + '';
            if(tempName.indexOf('<a') !== -1) {
                tempName = $(tempName).text();
            }
            obj[option] = tempName;
            return obj;
        });
    } else {
        return $.map($('#table').bootstrapTable('getSelections'), function (row) {
            var obj = {};
            for(var i = 0, len = option.length; i < len; i++) {
                var tempName = row[option[i]] + '';
                if(tempName.indexOf('<a') !== -1) {
                    tempName = $(tempName).text();
                }
                obj[option[i]] = tempName;
            }
            return obj;
        });
    }
}
//刷新表格
function refreshTable() {
    $("#table").bootstrapTable('refresh');
}

function StringNoEmpty(str){
    if(str!=null&&str!=""&&str!=undefined){
        return true;
    }else return false;
}

jQuery.download = function(url, data, method){ // 获得url和data
    if( url && data ){
        var inputs = '';
        jQuery.each(data, function(i){
            inputs+='<input type="hidden" name="'+ i +'" value="'+ data[i] +'" />';
        }); // request发送请求
        jQuery('<form action="'+ url +'" method="post"'+ 'enctype="application/x-www-form-urlencoded" accept-charset="UTF-8">'+inputs+'</form>').appendTo('body').submit().remove();
    };
};
//xmlhttprequest初始化
function getRequestObject(){
    var xhr=null;
    if(window.XMLHttpRequest){
        try{
            xhr = new XMLHttpRequest();
        }catch(e){
            xhr=null;
        }
    }else if(window.ActiveXObject){
        try{
            xhr=new ActiveXObject('Microsoft.XMLHTTP');
        }catch(e){
            try{
                xhr=new ActiveXObject('Msxml2.XMLHTTP');
            }catch(e){
                xhr=null;
            }
        }
    }
    return xhr;
}

//触发上传文件input
function upLoading(selector){
    $(selector).click();
}
//数据统计页面使用函数
function recentTime(type) {
    var obj = {
        start: '',
        end: ''
    }
    if(type == 'all') {
        return obj;
    }else if(type == 'week') {
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var day = time.getDate();
        var date = new Date(time.getTime()- 7 * 24 * 3600 * 1000);
        month = month < 10 ? '0'+ month : month
        day = day < 10 ? ('0' + day) : day;
        obj.end = year + '-' + month + '-' + day;
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();
        month = month < 10 ? '0'+ month : month
        day = day < 10 ? ('0' + day) : day;
        obj.start = year + '-' + month + '-' + day;
        return obj;
    } else if (type == 'month') {
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var day = time.getDate();
        month = month < 10 ? '0'+ month : month
        day = day < 10 ? ('0' + day) : day;
        obj.end = year + '-' + month + '-' + day;
        time.setMonth(time.getMonth()-1);
        year = time.getFullYear();
        month = time.getMonth() + 1;
        day = time.getDate();
        month = month < 10 ? '0'+ month : month
        day = day < 10 ? ('0' + day) : day;
        obj.start = year + '-' + month + '-' + day;
        return obj;
    } else if (type == 'year') {
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var day = time.getDate();
        month = month < 10 ? '0'+ month : month
        day = day < 10 ? ('0' + day) : day;
        obj.end = year + '-' + month + '-' + day;
        time.setYear(time.getFullYear() - 1);
        year = time.getFullYear();
        month = time.getMonth() + 1;
        day = time.getDate();
        month = month < 10 ? '0'+ month : month
        day = day < 10 ? ('0' + day) : day;
        obj.start = year + '-' + month + '-' + day;
        return obj;
    }
}


// 时间规范
function formatTime(date, isOldMethods, model) {
    if (typeof date !== 'string' && typeof date !== "number" && !(date instanceof Date)) {
        return 0;
    }
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    model = model || 'YYYY-MM-DD';
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    var result = '';
    if (isOldMethods === undefined) {
        isOldMethods = true;
    }
    if (isOldMethods) {
        var t1 = [year, month, day].map(formatNumber).join('-');
        var t2 = [hour, minute, second].map(formatNumber).join(':');
        result = t1 + ' ' + t2;
    } else {
        result = model.replace(/[^\/: -]{2,4}/g, function (timeStr) {
            if (/y/i.test(timeStr)) {
                // 年
                return String(year).slice(String(year).length - timeStr.length);
            } else if (/M/.test(timeStr)) {
                // 月，一定大写
                if (month > 9) {
                    return String(month).slice(String(month).length - timeStr.length);
                } else {
                    var monthStr = '0' + month;
                    return monthStr.slice(monthStr.length - timeStr.length);
                }
            } else if (/d/i.test(timeStr)) {
                // 日
                if (day > 9) {
                    return String(day).slice(String(day).length - timeStr.length);
                } else {
                    var dayStr = '0' + day;
                    return dayStr.slice(dayStr.length - timeStr.length);
                }
            } else if (/h/i.test(timeStr)) {
                // 时
                if (hour > 9) {
                    return String(hour).slice(String(hour).length - timeStr.length);
                } else {
                    var hourStr = '0' + hour;
                    return hourStr.slice(hourStr.length - timeStr.length);
                }
            } else if (/m/.test(timeStr)) {
                // 分
                if (minute > 9) {
                    return String(minute).slice(String(minute).length - timeStr.length);
                } else {
                    var minuteStr = '0' + minute;
                    return minuteStr.slice(minuteStr.length - timeStr.length);
                }
            } else if (/s/.test(timeStr)) {
                // 秒
                if (second > 9) {
                    return String(second).slice(String(second).length - timeStr.length);
                } else {
                    var secondStr = '0' + second;
                    return secondStr.slice(secondStr.length - timeStr.length);
                }
            }
        })
    }
    return result;
}

function getNextMonthWithoutDay(dateString){
    var time = new Date(dateString);
    time.setMonth(time.getMonth()+1);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    month = month < 10 ? '0'+ month : month
    return year + '-' + month;
}

function getNextMonth(dateString){
    var time = new Date(dateString);
    time.setMonth(time.getMonth()+1);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate();
    month = month < 10 ? '0'+ month : month
    day = day < 10 ? ('0' + day) : day;
    return year + '-' + month + '-' + day;;
}

function getNextDay(dateString) {
    var time = new Date(dateString);
    time.setDate(time.getDate()+1);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate();
    month = month < 10 ? '0'+ month : month
    day = day < 10 ? ('0' + day) : day;
    return year + '-' + month + '-' + day;;
}


/**
 * 用户初始化时间插件
 * @param timeNode: 时间节点
 */
function initDateTimePicker(timeNode, config) {
    var timeConfig = {
        format: 'yyyy-mm-dd', //显示格式
        language: 'zh-CN',
        todayHighlight: 1,
        minView: 2,
        todayBtn: true,
        autoclose: true
    };
    if (!!config) {
        timeConfig = Object.assign(timeConfig, config);
    }
    if (timeNode.length > 0) {
        $.each(timeNode, function () {
            $(this).datetimepicker(timeConfig);
        })
    }
}