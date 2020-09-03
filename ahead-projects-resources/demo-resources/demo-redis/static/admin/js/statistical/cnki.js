/**
 * Created by mu-HUN on 2018/9/6.
 */
var titleType='需求'
var type = '日';
var field = '类型';
var downloadCountMap;
var downloadRankMap;

$(function () {
    initPage();
});
// 初始化页面
function initPage() {
    downloadCountMap = echarts.init(document.getElementById('downloadCountMap'));
    downloadRankMap = echarts.init(document.getElementById('downloadRankMap'));

    initDateTimePicker($(".time"));
    initDownloadCountTable();
    $(document).on('click','#fieldTab a',function (e) {
        //tab栏切换
        if ($(this).attr('href') == '#downloadCount') {
            initDownloadCountTable();
        }else if ($(this).attr('href') == '#downloadRank') {
            initDownloadRankTable();
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
    }).on('click','#downloadCountSearch',function (e) {
        e.stopPropagation();
        getData();
    }).on('click','#downloadRankSearch',function (e) {
        e.stopPropagation();
        getData();
    })
}
function initDownloadCountTable() {
    timeType = $("#downloadCountConditions").find('.select-model-type').val();
    timeRange = $("#downloadCountConditions").find('.select-model-range').val();
    searchPadDiv = 'downloadCountSearch';
    var obj = recentTime(timeRange);
    $('#downloadCountStartTime').val(obj.start);
    $('#downloadCountEndTime').val(obj.end);
    getDownloadCountData();
}
function initDownloadRankTable() {
     timeRange = $("#downloadRankConditions").find('.select-model-range').val();
     var obj = recentTime(timeRange);
     $('#downloadRankStartTime').val(obj.start);
     $('#downloadRankEndTime').val(obj.end);
    searchPadDiv = 'downloadRankSearch';
    getDownloadRankData();
}

function setRangeConditions(element) {
    var startTimeElement;
    var endTimeElement;
    if (searchPadDiv == 'downloadCountSearch'){
        startTimeElement = $('#downloadCountStartTime');
        endTimeElement = $('#downloadCountEndTime');
    } else if (searchPadDiv == 'downloadRankSearch'){
        startTimeElement = $('#downloadRankStartTime');
        endTimeElement = $('#downloadRankEndTime');
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

    if (searchPadDiv == 'downloadCountSearch'){
        getDownloadCountData();
    }else if (searchPadDiv == 'downloadRankSearch'){
        getDownloadRankData();
    }
}
// 获取企业类型
function getDownloadCountData() {
    var json = {
        startTime: $('#downloadCountStartTime').val(),
        endTime: $('#downloadCountEndTime').val(),
        type:timeType
    }
    $.ajax({
        url: '/cnki/getDownloadCount',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("downloadCount",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}
function getDownloadRankData() {
     var json = {
         startTime: $('#downloadRankStartTime').val(),
         endTime: $('#downloadRankEndTime').val()
    }
    $.ajax({
        url: '/cnki/getDownloadRank',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("downloadRank",res.data);
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

    if(type == 'downloadCount') {
        renderDownloadCountChart(data);
    } if(type == 'downloadRank') {
        var buckets = data.aggregations.result.buckets;
        if (buckets) {
            for (var i = 0; i < buckets.length; i++) {
                xAxis.push(buckets[i].key);
                series.push({
                    name: buckets[i].key,
                    value: buckets[i].doc_count
                });
            }
            title = '下载量排名';
            getChartOption(downloadRankMap, 'simpleBar', xAxis, series, title);
            // getChartOption(searchKeyWordMapRight, 'pie', xAxis, series, title);
            // renderDownloadCountChart(data);
        }
    }
}

function renderDownloadCountChart(data){
    var buckets = data.aggregations.result.buckets;
    var titleArr = [];
    var dataArr = [];
    for(var i = 0 ;i<buckets.length;i++){
        titleArr.push(buckets[i].key_as_string);
        dataArr.push(buckets[i].doc_count);
    }
    var option = {
        title: {
            text: '下载量'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['下载量']
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data:titleArr
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name:'下载量',
                type:'line',
                data:dataArr
            }
        ]
    };
    downloadCountMap.setOption(option);
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
                    interval:0,
                    rotate:40
                }
            },
            grid: [
                {bottom: '35%'}
            ],
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
                itemStyle: {
                    //通常情况下：
                    normal:{
                        //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                        color: function (params){
                            var colorList = ['rgb(255,181,197)','rgb(0,178,238)','rgb(255,228,196)','rgb(191,239,255)','rgb(218,112,214)'];
                            var index = params.dataIndex % 5;
                            return colorList[index];
                        }
                    },
                    //鼠标悬停时：
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
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