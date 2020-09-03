/**
 * Created by mu-HUN on 2018/9/6.
 */
var userType='';
var timeType;
var timeRange;

var titleType='需求'
var type = '日';
var field = '类型';
var searchProportionLeft;
var searchProportionRight;
var distribution;
var geographical;
$(function () {
    initPage();
});
// 初始化页面
function initPage() {
    searchProportionLeft = echarts.init(document.getElementById('searchProportionMapLeft'));
    searchProportionRight = echarts.init(document.getElementById('searchProportionMapRight'));
    distribution = echarts.init(document.getElementById('distributionMap'));
    geographical = echarts.init(document.getElementById('geographicalMap'));

    initDateTimePicker($(".time"));
    initSearchProportionTable();
    $(document).on('click','#fieldTab a',function (e) {
        //tab栏切换
        if ($(this).attr('href') == '#searchProportion') {
            initSearchProportionTable();
        } else if ($(this).attr('href') == '#distribution') {
            getDistributionData();
        } else if ($(this).attr('href') == '#geographical') {
            getGeographicalData();
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
    }).on('click','#userType',function (e) {
        e.stopPropagation();
        userType = $(this).val();
        getData();
    }).on('click','#searchProportionSearch',function (e) {
        e.stopPropagation();
        getData();
    })
}

function initSearchProportionTable() {
    timeType = $("#searchProportionConditions").find('.select-model-type').val();
    timeRange = $("#searchProportionConditions").find('.select-model-range').val();
    searchPadDiv = 'searchProportion';
    var obj = recentTime(timeRange);
    $('#searchProportionStartTime').val(obj.start);
    $('#searchProportionEndTime').val(obj.end);
    getSearchProportionData();
}

function setRangeConditions(element) {
    var startTimeElement;
    var endTimeElement;
    if (searchPadDiv == 'searchProportion'){
        startTimeElement = $('#searchProportionStartTime');
        endTimeElement = $('#searchProportionEndTime');
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
    if (searchPadDiv == 'searchProportion'){
        getSearchProportionData();
    }
}

// 搜索引擎流量占比
function getSearchProportionData() {
    var json = {
        startTime: $('#searchProportionStartTime').val(),
        endTime: $('#searchProportionEndTime').val()
    };
    $.ajax({
        url: '/userChannel/getSearchProportion',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("searchProportion",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}
// 获取用户分布占比
function getDistributionData() {
    $.ajax({
        url: '/userChannel/getUserDistribution',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("distribution",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}
//获取地理位置
function getGeographicalData() {
    $.ajax({
        url: '/userChannel/getUserGeographical',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("geographical",res.data);
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
    if(type == 'distribution') {
        for (var i = 0; i < data.length; i++) {
            xAxis.push(data[i].name);
            series.push({
                name: data[i].name,
                value: data[i].counts
            });
        }
        title = '园区内外企业占比';
        getChartOption(distribution,'pie', xAxis, series, title);
    }else if(type == 'searchProportion'){//搜索引擎流量占比
        var bucketsMap = data.aggregations.result.buckets;
        var total = data.hits.total;
        if(bucketsMap){
            var count = 0;
            for(var key in bucketsMap){

                if(key=='其他'){
                    xAxis.push(key);
                    series.push({
                        name: key,
                        value: bucketsMap[key].doc_count-bucketsMap[key].result.doc_count
                    });
                    count+=(bucketsMap[key].doc_count-bucketsMap[key].result.doc_count);
                }else if(key=='直接访问'){
                    //不用处理
                }else{
                    xAxis.push(key);
                    series.push({
                        name: key,
                        value: bucketsMap[key].doc_count
                    });
                    count+=bucketsMap[key].doc_count;
                }
            }
            xAxis.push('直接访问');
            series.push({
                name: '直接访问',
                value:total-count
            });
            title = '搜索引擎流量占比（柱状图）';
            getChartOption(searchProportionLeft,'simpleBar', xAxis, series, title);
            title = '搜索引擎流量占比（饼图）';
            getChartOption(searchProportionRight,'pie', xAxis, series, title);
        }
    }else if(type == 'geographical'){
        for (var i = 0; i < data.length; i++) {
            var provinceName = (data[i].provinceName) ? data[i].provinceName.slice(0, -1) : '';
            series.push({
                name: provinceName,
                value: data[i].counts
            });
        }
        title = '用户地理位置分布';
        getChartOption(geographical,'map', xAxis, series, title);
    }


}
function getChartOption(tab,type, xAxis, series, title) {
    var option = {};
     if (type == "pie") {
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
    }else if (type == 'simpleBar') {
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
    }else if(type == "map"){
         option = {
             title: {
                 text: title,
                 x: 'center'
             },
             tooltip: {
                 trigger: 'item',
                 showDelay: 0,
                 transitionDuration: 0.2,
                 formatter: function (params) {
                     var stSave = params.data;
                     var saveValue = typeof(stSave.value)=="undefined" ? 0 : stSave.value ;
                     return stSave.name + '：' + saveValue;
                 }
             },
             visualMap: {
                 left: 'right',
                 min: 1,
                 max: 1000,
                 inRange: {
                     color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                 },
                 text:['High','Low'],           // 文本，默认为数值文本
                 calculable: true
             },
             series: [
                 {
                     name: title,
                     type: 'map',
                     roam: true,
                     map: 'china',
                     itemStyle:{
                         emphasis:{label:{show:true}}
                     },
                     data:series
                 }
             ]
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