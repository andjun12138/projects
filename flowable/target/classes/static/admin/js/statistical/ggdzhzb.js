/**
 * Created by mu-HUN on 2018/9/6.
 */
var timeType;
var timeRange;
var searchPadDiv;


var serviceProvider;
var skillDemand;
var matureCase;
var companySkillDemand;

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
    serviceProvider = echarts.init(document.getElementById('serviceProviderMap'));
    skillDemand = echarts.init(document.getElementById('skillDemandMap'));
    matureCase = echarts.init(document.getElementById('matureCaseMap'));
    companySkillDemand = echarts.init(document.getElementById('companySkillDemandMap'));
    initDateTimePicker($(".time"));
    initServiceProviderTable();
    $(document).on('click','#fieldTab a',function (e) {
        //tab栏切换
        if ($(this).attr('href') == '#serviceProvider') {
            initServiceProviderTable();
        }else if($(this).attr('href') == '#skillDemand'){
            initSkillDemandTable();
        }else if ($(this).attr('href') == '#matureCase') {
            initMatureCaseTable();
        }else if($(this).attr('href') == '#companySkillDemand'){
            initCompanySkillDemandTable();
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

function initServiceProviderTable() {
    timeType = $("#serviceProviderConditions").find('.select-model-type').val();
    timeRange = $("#serviceProviderConditions").find('.select-model-range').val();
    searchPadDiv = 'serviceProvider';
    var obj = recentTime(timeRange);
    $('#serviceProviderStartTime').val(obj.start);
    $('#serviceProviderEndTime').val(obj.end);
    getServiceProvider();
}

function initSkillDemandTable() {
    timeType = $("#skillDemandConditions").find('.select-model-type').val();
    timeRange = $("#skillDemandConditions").find('.select-model-range').val();
    searchPadDiv = 'skillDemand';
    var obj = recentTime(timeRange);
    $('#skillDemandStartTime').val(obj.start);
    $('#skillDemandEndTime').val(obj.end);
    getSkillDemand();
}

function initMatureCaseTable() {
    timeType = $("#matureCaseConditions").find('.select-model-type').val();
    timeRange = $("#matureCaseConditions").find('.select-model-range').val();
    searchPadDiv = 'matureCase';
    var obj = recentTime(timeRange);
    $('#matureCaseStartTime').val(obj.start);
    $('#matureCaseEndTime').val(obj.end);
    getMatureCase();
}

function initCompanySkillDemandTable() {
    timeType = $("#companySkillDemandConditions").find('.select-model-type').val();
    timeRange = $("#companySkillDemandConditions").find('.select-model-range').val();
    searchPadDiv = 'companySkillDemand';
    var obj = recentTime(timeRange);
    $('#companySkillDemandStartTime').val(obj.start);
    $('#companySkillDemandEndTime').val(obj.end);
    getCompanySkillDemand();
}



function setRangeConditions(element) {
    var startTimeElement;
    var endTimeElement;
    if (searchPadDiv == 'serviceProvider'){//
        startTimeElement = $('#serviceProviderStartTime');
        endTimeElement = $('#serviceProviderEndTime');
    }else if(searchPadDiv == 'skillDemand'){//
        startTimeElement = $('#skillDemandStartTime');
        endTimeElement = $('#skillDemandEndTime');
    }else if(searchPadDiv == 'matureCase'){//
        startTimeElement = $('#matureCaseStartTime');
        endTimeElement = $('#matureCaseEndTime');
    }else if(searchPadDiv == 'companySkillDemand'){//
        startTimeElement = $('#companySkillDemandStartTime');
        endTimeElement = $('#companySkillDemandEndTime');
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
    if (searchPadDiv == 'serviceProvider'){
        getServiceProvider();
    }else if(searchPadDiv == 'skillDemand'){//
        getSkillDemand()
    } else if(searchPadDiv == 'matureCase'){
        getMatureCase();
    }else if(searchPadDiv == 'companySkillDemand'){
        getCompanySkillDemand();
    }
}

// 活跃企业数
function getServiceProvider() {
    var json = {
        type:timeType,
        startTime: $('#serviceProviderStartTime').val(),
        endTime: $('#serviceProviderEndTime').val()
    }
    $.ajax({
        url: '/hatchery/getServiceProvider',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("serviceProvider",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}

// 已入孵企业的数量
function getSkillDemand() {
    var json = {
        type:timeType,
        startTime: $('#skillDemandStartTime').val(),
        endTime: $('#skillDemandEndTime').val()
    }
    $.ajax({
        url: '/hatchery/getSkillDemand',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("skillDemand",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}
// 发布的活动数量
function getMatureCase() {
    var json = {
        type:timeType,
        startTime: $('#matureCaseStartTime').val(),
        endTime: $('#matureCaseEndTime').val()
    }
    $.ajax({
        url: '/hatchery/getMatureCase',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("matureCase",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}

// 参加活动的用户数量
function getCompanySkillDemand() {
    var json = {
        type:timeType,
        startTime: $('#companySkillDemandStartTime').val(),
        endTime: $('#companySkillDemandEndTime').val()
    }
    $.ajax({
        url: '/hatchery/getCompanySkillDemand',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("companySkillDemand",res.data);
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
    if(type == 'serviceProvider') {
        for (var i = 0; i < data.length; i++) {
            xAxis.push(data[i].sdate);
            series.push( data[i].activeCount);
        }
        title = '活跃企业数';
        getChartOption(serviceProvider,'simpleBar', xAxis, series, title);
    }else if(type == 'skillDemand') {
        for (var i = 0; i < data.length; i++) {
            xAxis.push(data[i].sdate);
            series.push( data[i].activeCount);
        }
        title = '已入孵企业的数量';
        getChartOption(skillDemand,'simpleBar', xAxis, series, title);
    }else if(type == 'matureCase') {
        for (var i = 0; i < data.length; i++) {
            xAxis.push(data[i].sdate);
            series.push( data[i].activeCount);
        }
        title = '发布的活动数量';
        getChartOption(matureCase,'simpleBar', xAxis, series, title);
    }else if(type == 'companySkillDemand'){
        for (var i = 1; i < data.length; i++) {
            if(data[i-1].counts != 0){
                xAxis.push(data[i].sdate);
                series.push( data[i].activeCount);
            }
        }
        title = '参加活动的用户数量';
        getChartOption(companySkillDemand,'simpleBar', xAxis, series, title);
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
            xAxis: {
                type: 'category',
                data: xAxis,
                axisLabel:{
                    interval:0
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
                data: xAxis
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