/**
 * Created by mu-HUN on 2018/9/6.
 */
var titleType='需求'
var type = '日';
var field = '类型';
var enterpriseStyle;

$(function () {
    initPage();
});
// 初始化页面
function initPage() {
    enterpriseStyle = echarts.init(document.getElementById('enterpriseStyleMap'));
    $(".time").datetimepicker({
        locale: moment.locale('zh-cn'),
        format: "YYYY-MM-DD"
    });
    getEnterpriseStyleData();
    $(document).on('click','#fieldTab a',function (e) {
        //tab栏切换
        if ($(this).html() == '企业类型') {
            getEnterpriseStyleData();
        }
        e.stopPropagation();
        $(this).tab('show');
    })
}
// 获取企业类型
function getEnterpriseStyleData() {
    $.ajax({
        url: '/userAttributes/getEnterpriseStyle',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("enterpriseStyle",res.data);
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
    if(type == 'enterpriseStyle') {
        for (var i = 0; i < data.length; i++) {
            xAxis.push(data[i].belongIndustry);
            series.push( data[i].counts);
        }
        title = '企业类型';
        getChartOption(enterpriseStyle,'simpleBar', xAxis, series, title);
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
/*            grid: [{
                left: '10%',
                bottom:'10%'
            }],*/
            grid: [
                {bottom: '30%'}
            ],
            xAxis: {
                type: 'category',
                data: xAxis,
                axisLabel:{
                    interval:0,
                    rotate:40,

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