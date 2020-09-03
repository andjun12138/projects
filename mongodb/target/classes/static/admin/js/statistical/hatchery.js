/**
 * Created by mu-HUN on 2018/9/6.
 */
var timeType;
var timeRange;
var searchPadDiv;


var activeCompany;
var enterpriseNum;
var activityNum;
var participateUserNum;

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
    activeCompany = echarts.init(document.getElementById('activeCompanyMap'));
    enterpriseNum = echarts.init(document.getElementById('enterpriseNumMap'));
    activityNum = echarts.init(document.getElementById('activityNumMap'));
    participateUserNum = echarts.init(document.getElementById('participateUserNumMap'));
    initDateTimePicker($(".time"));
    initActiveCompanyTable();
    $(document).on('click','#fieldTab a',function (e) {
        //tab栏切换
        if ($(this).attr('href') == '#activeCompany') {
            initActiveCompanyTable();
        }else if($(this).attr('href') == '#enterpriseNum'){
            initEnterpriseNumTable();
        }else if ($(this).attr('href') == '#activityNum') {
            initActivityNumTable();
        }else if($(this).attr('href') == '#participateUserNum'){
            initParticipateUserNumTable();
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
    })
}

function initActiveCompanyTable() {
    timeType = $("#activeCompanyConditions").find('.select-model-type').val();
    timeRange = $("#activeCompanyConditions").find('.select-model-range').val();
    searchPadDiv = 'activeCompany';
    var obj = recentTime(timeRange);
    $('#activeCompanyStartTime').val(obj.start);
    $('#activeCompanyEndTime').val(obj.end);
    getActiveCompany();
}

function initEnterpriseNumTable() {
    timeType = $("#enterpriseNumConditions").find('.select-model-type').val();
    timeRange = $("#enterpriseNumConditions").find('.select-model-range').val();
    searchPadDiv = 'enterpriseNum';
    var obj = recentTime(timeRange);
    $('#enterpriseNumStartTime').val(obj.start);
    $('#enterpriseNumEndTime').val(obj.end);
    getEnterpriseNum();
}

function initActivityNumTable() {
    timeType = $("#activityNumConditions").find('.select-model-type').val();
    timeRange = $("#activityNumConditions").find('.select-model-range').val();
    searchPadDiv = 'activityNum';
    var obj = recentTime(timeRange);
    $('#activityNumStartTime').val(obj.start);
    $('#activityNumEndTime').val(obj.end);
    getActivityNum();
}

function initParticipateUserNumTable() {
    timeType = $("#participateUserNumConditions").find('.select-model-type').val();
    timeRange = $("#participateUserNumConditions").find('.select-model-range').val();
    searchPadDiv = 'participateUserNum';
    var obj = recentTime(timeRange);
    $('#participateUserNumStartTime').val(obj.start);
    $('#participateUserNumEndTime').val(obj.end);
    getParticipateUserNum();
}



function setRangeConditions(element) {
    var startTimeElement;
    var endTimeElement;
    if (searchPadDiv == 'activeCompany'){//
        startTimeElement = $('#activeCompanyStartTime');
        endTimeElement = $('#activeCompanyEndTime');
    }else if(searchPadDiv == 'enterpriseNum'){//
        startTimeElement = $('#enterpriseNumStartTime');
        endTimeElement = $('#enterpriseNumEndTime');
    }else if(searchPadDiv == 'activityNum'){//
        startTimeElement = $('#activityNumStartTime');
        endTimeElement = $('#activityNumEndTime');
    }else if(searchPadDiv == 'participateUserNum'){//
        startTimeElement = $('#participateUserNumStartTime');
        endTimeElement = $('#participateUserNumEndTime');
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
    if (searchPadDiv == 'activeCompany'){
        getActiveCompany();
    }else if(searchPadDiv == 'enterpriseNum'){//
        getEnterpriseNum()
    } else if(searchPadDiv == 'activityNum'){
        getActivityNum();
    }else if(searchPadDiv == 'participateUserNum'){
        getParticipateUserNum();
    }
}

// 活跃企业数
function getActiveCompany() {
    var json = {
        type:timeType,
        startTime: $('#activeCompanyStartTime').val(),
        endTime: $('#activeCompanyEndTime').val()
    }
    $.ajax({
        url: '/hatchery/getActiveCompany',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("activeCompany",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}

// 已入孵企业的数量
function getEnterpriseNum() {
    var json = {
        type:timeType,
        startTime: $('#enterpriseNumStartTime').val(),
        endTime: $('#enterpriseNumEndTime').val()
    }
    $.ajax({
        url: '/hatchery/getEnterpriseNum',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("enterpriseNum",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}
// 发布的活动数量
function getActivityNum() {
    var json = {
        type:timeType,
        startTime: $('#activityNumStartTime').val(),
        endTime: $('#activityNumEndTime').val()
    }
    $.ajax({
        url: '/hatchery/getActivityNum',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("activityNum",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}

// 参加活动的用户数量
function getParticipateUserNum() {
    var json = {
        type:timeType,
        startTime: $('#participateUserNumStartTime').val(),
        endTime: $('#participateUserNumEndTime').val()
    }
    $.ajax({
        url: '/hatchery/getParticipateUserNum',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("participateUserNum",res.data);
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
    if(type == 'activeCompany') {
        for (var i = 0; i < data.length; i++) {
            xAxis.push(data[i].sdate);
            series.push( data[i].activeCount);
        }
        title = '活跃企业数';
        getChartOption(activeCompany,'simpleBar', xAxis, series, title);
    }else if(type == 'enterpriseNum') {
        for (var i = 0; i < data.length; i++) {
            xAxis.push(data[i].sdate);
            series.push( data[i].activeCount);
        }
        title = '已入孵企业的数量';
        getChartOption(enterpriseNum,'simpleBar', xAxis, series, title);
    }else if(type == 'activityNum') {
        for (var i = 0; i < data.length; i++) {
            xAxis.push(data[i].sdate);
            series.push( data[i].activeCount);
        }
        title = '发布的活动数量';
        getChartOption(activityNum,'simpleBar', xAxis, series, title);
    }else if(type == 'participateUserNum'){
        for (var i = 1; i < data.length; i++) {
            if(data[i-1].counts != 0){
                xAxis.push(data[i].sdate);
                series.push( data[i].activeCount);
            }
        }
        title = '参加活动的用户数量';
        getChartOption(participateUserNum,'simpleBar', xAxis, series, title);
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