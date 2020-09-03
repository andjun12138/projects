/**
 * Created by mu-HUN on 2018/9/6.
 */
var titleType='需求'
var type = '日';
var field = '类型';
var newsFetchRateMap;

$(function () {
    initPage();
});
// 初始化页面
function initPage() {
    newsFetchRateMap = echarts.init(document.getElementById('newsFetchRateMap'));

    initDateTimePicker($(".time"));
    initNewsFetchRateTable();
    $(document).on('click','#fieldTab a',function (e) {
        //tab栏切换
        if ($(this).html() == '企业类型') {
            initNewsFetchRateTable();
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
    }).on('click','#newsFetchRateSearch',function (e) {
        e.stopPropagation();
        getData();
    })
}
function initNewsFetchRateTable() {
    timeType = $("#newsFetchRateConditions").find('.select-model-type').val();
    timeRange = $("#newsFetchRateConditions").find('.select-model-range').val();
    searchPadDiv = 'newsFetchRateSearch';
    var obj = recentTime(timeRange);
    $('#newsFetchRateStartTime').val(obj.start);
    $('#newsFetchRateEndTime').val(obj.end);
    getNewsFetchRateData();
}

function setRangeConditions(element) {
    var startTimeElement;
    var endTimeElement;
    if (searchPadDiv == 'newsFetchRateSearch'){//新增注册用户数
        startTimeElement = $('#newsFetchRateStartTime');
        endTimeElement = $('#newsFetchRateEndTime');
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
    if (searchPadDiv == 'newsFetchRateSearch'){
        getNewsFetchRateData();
    }
}
// 获取企业类型
function getNewsFetchRateData() {
    var json = {
        startTime: $('#newsFetchRateStartTime').val(),
        endTime: $('#newsFetchRateEndTime').val(),
        rangeType:timeType
    }
    $.ajax({
        url: '/contentEfficiency/getNewsFetchRate',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("newsFetchRate",res.data);
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
    //用户分布占比分析
    if(type == 'newsFetchRate') {
        renderNewsFetchRateChart(data);
    }
}

function renderNewsFetchRateChart(data){
    var incubatorFetchList = data.incubatorFetchList;
    var platformFetchList = data.platformFetchList;
    var incubatorTotal = data.incubatorTotal;
    var platformTotal = data.platformTotal;
    var platformRate = [];
    var incubatorRate = [];
    var titleArr = [];
    for(var i = 0 ;i<platformFetchList.length;i++){
        platformRate.push(platformFetchList[i].TOTAL/platformTotal*100);
    }
    for(var i = 0 ;i<incubatorFetchList.length;i++){
        titleArr.push(incubatorFetchList[i].TITLE);
        incubatorRate.push(incubatorFetchList[i].TOTAL/incubatorTotal*100);
    }

    var option = {
        title: {
            text: '信息采用率'
        },
        tooltip: {
            trigger: 'axis',
            formatter:function(params){
                return params[0].value+'%';
            }
        },
        legend: {
            data:['平台咨询','孵化资讯']
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data:titleArr,
            axisLabel: {
                interval:0,
                rotate:40
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} %'
            },
        },
        series: [
            {
                name:'平台咨询',
                type:'line',
                data:platformRate
            },
            {
                name:'孵化资讯',
                type:'line',
                data:incubatorRate
            }
        ]
    };
    newsFetchRateMap.setOption(option);
}
function getChartOption(tab,type, xAxis, series, title) {
    var option = {};
    if (type == 'simpleBar') {
        console.log(xAxis);
        console.log(series);
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
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                data: series,
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