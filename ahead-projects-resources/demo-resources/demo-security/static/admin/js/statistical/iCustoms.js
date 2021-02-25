/**
 * Created by mu-HUN on 2018/9/6.
 */
$activityCompaniesTable = $('#activityCompaniesTable'),
    $decMoneyTable = $('#decMoneyTable'),
    $decNumberTable = $('#decNumberTable'),
    $searchPart = $("#search-part"),
    $search = $("#search"),
    $toggleSearch = $("#toggle-search");
var timeType;
var timeRange;
var searchPadDiv;


var enterpriseRegister;
var activityCompanies;

var barLabel = {
    normal: {
        show: true,
        position: 'top'
    }
};
$(function () {
    initPage();
});
// 初始化页面
function initPage() {
    enterpriseRegister = echarts.init(document.getElementById('enterpriseRegisterMap'));
    initDateTimePicker($(".time"));
    initEnterpriseRegisterTable();
    $(document).on('click','#fieldTab a',function (e) {
        //tab栏切换
        if ($(this).attr('href') == '#enterpriseRegister') {
            initEnterpriseRegisterTable();
        }else if($(this).attr('href') == '#activityCompanies'){
            initActivityCompaniesTable();
        } else if($(this).attr('href') == '#decMoney'){
            initDecMoneyTable();
        }else if($(this).attr('href') == '#decNumber'){
            initDecNumberTable();
        }
        e.stopPropagation();
        $(this).tab('show');
    }).on('change','.select-model-type',function (e) {//可共用
        e.stopPropagation();
        timeType = $(this).val();
        getData();
    }).on('change','.select-model-range',function (e) {//可共用
        e.stopPropagation();
        setRangeConditions($(this));
        getData();
    }).on('change','input.time',function (e) {//可共用
        e.stopPropagation();
        getData();
    }).on('change','#days',function (e) {
        e.stopPropagation();
        getData();
    }).on('change','#statisticalType',function (e) {
        e.stopPropagation();
        getData();
    })
}

function initEnterpriseRegisterTable() {
    timeType = $("#enterpriseRegisterConditions").find('.select-model-type').val();
    timeRange = $("#enterpriseRegisterConditions").find('.select-model-range').val();
    searchPadDiv = 'enterpriseRegister';
    var obj = recentTime(timeRange);
    $('#enterpriseRegisterStartTime').val(obj.start);
    $('#enterpriseRegisterEndTime').val(obj.end);
    getEnterpriseRegister();
}

function initDecNumberTable() {
    timeRange = $("#decNumberConditions").find('.select-model-range').val();
    var obj = recentTime(timeRange);
    $('#decNumberStartTime').val(obj.start);
    $('#decNumberEndTime').val(obj.end);
    searchPadDiv = 'decNumber';
    $decNumberTable.bootstrapTable({
        height: getHeight(),
        toolbar: '#toolbar',
        url: '/iCustoms/getDecNumberStatistical',
        method: 'post',
        responseHandler: decNumberResponseHandler,
        queryParams: decNumberQueryParams,
        striped: true,
        showRefresh: false,
        showColumns: false,
        showToggle: false,
        detailView: false,
        minimumCountColumns: 2,
        pagination: true,
        pageList: "[15, 20, 25, 50, 100]",
        pageNumber: 1,
        pageSize: 15,
        showFooter: false,
        sidePagination: "server",
        clickToSelect:true
    });
    $decNumberTable.on('expand-row.bs.table', function (e, index, row, $detail) {
        var html = [];
        $.each(row, function (key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return $detail.html(html);
    });
}

function initDecMoneyTable() {
    timeRange = $("#decMoneyConditions").find('.select-model-range').val();
    var obj = recentTime(timeRange);
    $('#decMoneyStartTime').val(obj.start);
    $('#decMoneyEndTime').val(obj.end);
    searchPadDiv = 'decMoney';
    $decMoneyTable.bootstrapTable({
        height: getHeight(),
        toolbar: '#toolbar',
        url: '/iCustoms/getDecMoneyStatistical',
        method: 'post',
        responseHandler: decMoneyResponseHandler,
        queryParams: decMoneyQueryParams,
        striped: true,
        showRefresh: false,
        showColumns: false,
        showToggle: false,
        detailView: false,
        minimumCountColumns: 2,
        pagination: true,
        pageList: "[15, 20, 25, 50, 100]",
        pageNumber: 1,
        pageSize: 15,
        showFooter: false,
        sidePagination: "server",
        clickToSelect:true
    });
    $decMoneyTable.on('expand-row.bs.table', function (e, index, row, $detail) {
        var html = [];
        $.each(row, function (key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return $detail.html(html);
    });
}

function initActivityCompaniesTable() {
    searchPadDiv = 'activityCompanies';
    $activityCompaniesTable.bootstrapTable({
        height: getHeight(),
        toolbar: '#toolbar',
        url: '/iCustoms/getActivityCompanies',
        method: 'post',
        responseHandler: responseHandler,
        queryParams: queryParams,
        striped: true,
        showRefresh: false,
        showColumns: false,
        showToggle: false,
        detailView: false,
        minimumCountColumns: 2,
        pagination: true,
        pageList: "[15, 20, 25, 50, 100]",
        pageNumber: 1,
        pageSize: 15,
        showFooter: false,
        sidePagination: "server",
        clickToSelect:true
    });
    $activityCompaniesTable.on('expand-row.bs.table', function (e, index, row, $detail) {
        var html = [];
        $.each(row, function (key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return $detail.html(html);
    });
}

//列表数据请求成功的回调
function responseHandler(res) {
    // var length = res.data.data_list.length;
    var data = res.data.data;
    var length;
    if( data == null){
        length = 0;
    }else {
        length = data.length;
    }
    return {
        "total": length,//总页数
        "rows": data  //数据
    };
}
//列表数据请求成功的回调
function decMoneyResponseHandler(res) {
    var data = res.data.d;
    var length;
    if( data == null){
        length = 0;
    }else {
        length = data.length;
    }
    return {
        "total": length,//总页数
        "rows": data  //数据
    };
}

//列表数据请求成功的回调
function decNumberResponseHandler(res) {
    // var length = res.data.data_list.length;
    var data = res.data.d;
    var length;
    if( data == null){
        length = 0;
    }else {
        length = data.length;
    }
    return {
        "total": length,//总页数
        "rows": data  //数据
    };
}


//请求数据的传参
function queryParams(params) {
    var postData = {
        startTime: "2018-06-01",
        endTime: "2019-06-01"
    }
    return postData;
}

//请求数据的传参
function decMoneyQueryParams(params) {
    var postData = {
        startTime: $('#decMoneyStartTime').val(),
        endTime: $('#decMoneyEndTime').val()
    }
    return postData;
}

//请求数据的传参
function decNumberQueryParams(params) {
    var postData = {
        startTime: $('#decNumberStartTime').val(),
        endTime:  $('#decNumberEndTime').val(),
        type : $('#statisticalType').val()
    }
    return postData;
}



function setRangeConditions(element) {
    var startTimeElement;
    var endTimeElement;
    if (searchPadDiv == 'enterpriseRegister'){//
        startTimeElement = $('#enterpriseRegisterStartTime');
        endTimeElement = $('#enterpriseRegisterEndTime');
    }else if(searchPadDiv == 'decMoney'){
        startTimeElement = $('#decMoneyStartTime');
        endTimeElement = $('#decMoneyEndTime');
    }else if(searchPadDiv == 'decNumber'){
        startTimeElement = $('#decNumberStartTime');
        endTimeElement = $('#decNumberEndTime');
    }
    if(element.val() == 'week') {
        var obj = recentTime('week');
        startTimeElement.val(obj.start);
        endTimeElement.val(obj.end);
    } else if(element.val() == 'month') {
        var obj = recentTime('month');
        startTimeElement.val(obj.start);
        endTimeElement.val(obj.end);
    } else {
        var obj = recentTime('year');
        startTimeElement.val(obj.start);
        endTimeElement.val(obj.end);
    }

}

function getData() {
    //新增用户注册数的
    if (searchPadDiv == 'enterpriseRegister'){
        getEnterpriseRegister();
    }else if(searchPadDiv == 'activityCompanies'){//
        getActivityCompanies()
    }else if(searchPadDiv == 'decMoney'){
        $decMoneyTable.bootstrapTable(('refresh'));
    }else if(searchPadDiv == 'decNumber'){
        $decNumberTable.bootstrapTable(('refresh'));
    }
}

// 活跃企业数
function getEnterpriseRegister() {
    var json = {
        type:timeType,
        startTime: $('#enterpriseRegisterStartTime').val(),
        endTime: $('#enterpriseRegisterEndTime').val()
    }
    $.ajax({
        url: '/iCustoms/getEnterpriseRegister',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("enterpriseRegister",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}

// 已入孵企业的数量
function getActivityCompanies() {
    var json = {
        days:$('#days').val()
    }
    $.ajax({
        url: '/iCustoms/getActivityCompanies',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            console.log(res);
        },
        error: function (e) {
            console.log(e);
        }
    })
}


//设置Echart
function setEcharts(type,data) {
    var xAxis = [];
    var series = [];
    var title='';
    if(type == 'enterpriseRegister') {
        for (var i = 0; i < data.length; i++) {
            xAxis.push(data[i].days);
            series.push( data[i].counts);
        }
        title = '注册企业数量';
        getChartOption(enterpriseRegister,'simpleBar', xAxis, series, title);
    }

}

function getChartOption(tab,type, xAxis, series, title) {
    var option = {};
    if (type == 'simpleBar') {
        option = {
            title: {
                show: true,
                text: title,
                x:'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: '{b} : {c}'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: xAxis
            },
            grid: [
                {bottom: '30%'}
            ],
            xAxis: {
                type: 'category',
                data: xAxis,
                axisLabel:{
                    interval:0,
                    rotate:40
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: series,
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                type: 'bar'
            }]
        };
    } else if (type == "pie") {
        option = {
            title: {
                show: true,
                text: title,
                x:'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%'
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: xAxis
            },
            series: [ {
                name: '',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:series,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
    } else if (type == "line") {
        option = {
            title: {
                show: true,
                text: title,
                x:'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: ' <br/>{b} : {c} '
            },
            xAxis: {
                type: 'category',
                data: xAxis,
                axisLabel:{
                    interval:0,
                    rotate:40
                }
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: series,
                type: 'line'
            }]
        };
    }
    tab.setOption(option);
}

// 判断时间输入
function judgeTimeInput(startTime,endTime) {
    var reg =  /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/;
    var start = $(startTime).val();
    var end = $(endTime).val();
    var sflag = start.match(reg);
    var eflag = end.match(reg);
    if (!sflag || !eflag) {
        layer.msg('请选择正确的时间格式');
        return false;
    } else {
        return true;
    }
}
//设置时间范围
function setTimeFrame(timeLength,startTime,endTime) {
    var endT = $(endTime).val();
    if (!!endT) {
        //    如果结尾时间有值
        var end = setTimeFormat(new Date(endT));
        var start = setTimeFormat(new Date(endT), timeLength);
        $(startTime).val(start);
        $(endTime).val(end);
    } else {
        var end = setTimeFormat(new Date());
        var start = setTimeFormat(new Date(), timeLength);
        $(startTime).val(start);
        $(endTime).val(end);
    }
}
//设置时间格式
function setTimeFormat(date, timeLength){
    if(!!timeLength) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1 - timeLength;
        if(month <= 0) {
            month = 12 - Math.abs(month);
            year = year - 1;
        }
        month = month < 10 ? '0' + month : month;
        var day = date.getDate();
        day = day < 10 ? ('0' + day) : day;
        return year + '-' + month + '-' + day;
    } else {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        var day = date.getDate();
        day = day < 10 ? ('0' + day) : day;
        return year + '-' + month + '-' + day;
    }
}