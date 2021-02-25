/**
 * Created by mu-HUN on 2018/9/11.
 */
var titleType='企业'
var type = '日';
var field = '类型';
var trend;
var proportion;
$(function () {
    initPage();
});
// 初始化页面
function initPage() {
    setTimeFrame(3,'#startTime','#endTime');
    trend = echarts.init(document.getElementById('analysisBarMap'));
    proportion = echarts.init(document.getElementById('proportionBarMap'));
    $(".time").datetimepicker({
        locale: moment.locale('zh-cn'),
        format: "YYYY-MM-DD"
    });
    getAnalysisData();
    $(document).on('click','#fieldTab a',function (e) {
        //tab栏切换
        if ($(this).html() == '趋势分析') {
            setTimeFrame(3,'#startTime','#endTime');
            getAnalysisData();
        } else {
            setTimeFrame(12,'#fieldStart','#fieldEnd');
            getProportionData();
        }
        e.stopPropagation();
        $(this).tab('show');
    }).on('click', '.type-list li span', function (e) {
        e.stopPropagation();
        $(this).parent().siblings().removeClass('type-active');
        $(this).parent().addClass('type-active');
        type = $(this).data('value');
        getAnalysisData();
    }).on('click','.time-list li span',function (e) {
        e.stopPropagation();
        $(this).parent().siblings().removeClass('time-active');
        $(this).parent().addClass('time-active');
        var timeLength = $(this).data('time');
        setTimeFrame(timeLength,"#startTime","#endTime");//设置时间范围输入框的值
        getAnalysisData();
    }).on('click','#toSearch',function (e) {
        e.stopPropagation();
        getAnalysisData();
    }).on('click','#toProportionSearch',function(e) {
        e.stopPropagation();
        getProportionData();
    }).on('click','.field-list li span',function(e) {
        e.stopPropagation();
        $(this).parent().siblings().removeClass('field-active');
        $(this).parent().addClass('field-active');
        field = $(this).data('value');
        getProportionData();
    }).on('change','#timeRange',function (e) {
        e.stopPropagation();
        if ($(this).val() == 'all') {
            $('#fieldStart').val('');
            $('#fieldEnd').val('');
        } else if($(this).val() == 'week') {
            var obj = recentTime('week');
            $('#fieldStart').val(obj.start);
            $('#fieldEnd').val(obj.end);
        } else if($(this).val() == 'month') {
            var obj = recentTime('month');
            $('#fieldStart').val(obj.start);
            $('#fieldEnd').val(obj.end);
        } else {
            var obj = recentTime('year');
            $('#fieldStart').val(obj.start);
            $('#fieldEnd').val(obj.end);
        }
        getProportionData();
    })
}
// 获取趋势分析数据
function getAnalysisData() {
    //判断时间输入范围
    if(!judgeTimeInput('#startTime', '#endTime')) {
        return ;
    }
    var json = {
        type: type,
        startTime: $('#startTime').val(),
        endTime: $('#endTime').val()
    }
    $.ajax({
        url: '/admin/enterprise/getTrendAnalysis',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(json),
        success: function (res) {
            // console.log(res);
            setEcharts(true,res.data.data_object.trend);
        },
        error: function (e) {
            console.log(e);
        }
    })
}
//获取占比分析数据
function getProportionData() {
    /*if(!judgeTimeInput('#fieldStart', '#fieldEnd')) {
     return ;
     }*/
    var json = {
        type: field,
        startTime: $('#fieldStart').val(),
        endTime: $('#fieldEnd').val()
    }
    $.ajax({
        url: '/admin/enterprise/getPercentage',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(json),
        success: function (res) {
            setEcharts(false,res.data.data_object.percentage);
        },
        error: function (e) {
            console.log(e);
        }
    })
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
//设置Echart
function setEcharts(flag,data) {
    var xAxis = [];
    var series = [];
    var title='';
    var options = {};
    if (flag) {
        if(type == '日') {
            for(var i = 0;i<data.length;i++) {
                xAxis.push(data[i].days);
                series.push(data[i].counts);
            }
        } else if (type == '周') {
            for(var i = 0;i<data.length;i++) {
                xAxis.push(data[i].weeks.replace('-','第')+'周');
                series.push(data[i].counts);
            }
        } else if(type == '月') {
            for(var i = 0;i<data.length;i++) {
                xAxis.push(data[i].months.replace('-','第')+'月');
                series.push(data[i].counts);
            }
        } else {
            for(var i = 0;i<data.length;i++) {
                xAxis.push(data[i].years);
                series.push(data[i].counts);
            }
        }
        title = titleType + '发布数的' + type + '统计图';
        options = {
            title: {
                show: true,
                text: title,
                textStyle: {
                    align: 'right'
                }
            },
            xAxis: {
                type: 'category',
                data: xAxis
            },
            yAxis: {
                type: 'value'
            },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        show: false
                        // yAxisIndex: 'none'
                    },
                    dataView: {readOnly: false},
                    magicType: {type: ['line', 'bar']},
                    restore: {
                        show: false
                    },
                    saveAsImage: {
                        show: false
                    }
                },
                right: 0
            },
            series: [{
                data: series,
                type: 'bar'
            }]
        };
        trend.setOption(options);
    } else {
        if (field == '类型') {
            for(var i = 0;i<data.length;i++) {
                xAxis.push(data[i].demand_style);
                series.push({
                    name: data[i].demand_style,
                    value: data[i].counts
                });
            }
        } else if (field == '领域') {
            for(var i = 0;i<data.length;i++) {
                xAxis.push(data[i].profession);
                series.push({
                    name: data[i].profession,
                    value: data[i].counts
                });
            }
        } else if (field == '从属') {
            for(var i = 0;i<data.length;i++) {
                xAxis.push(data[i].demand_category);
                series.push({
                    name: data[i].demand_category,
                    value: data[i].counts
                });
            }
        } else {
            for(var i = 0;i<data.length;i++) {
                xAxis.push(data[i].city_name);
                series.push({
                    name: data[i].city_name,
                    value: data[i].counts
                });
            }
        }
        title = titleType + '发布数的' + field + '统计图';
        getChartOption('bar', xAxis, series, title);
    }
}
function getChartOption(type, xAxis, series, title) {
    var myToolTitle = "";
    var myToolImage = "";
    if (type === 'bar') {
        myToolTitle = "饼图切换";
        myToolImage = 'path://M459.0592 112.5376c-197.3248 23.4496-353.6896 179.8656-377.1392 377.1392l377.1392 0 0-377.1392zM566.9376 113.3056l0 432.896c0 28.3648-22.9888 51.3536-51.4048 51.3536l-432.896 0c27.6992 211.712 208.5376 375.1936 427.7248 375.1936 238.3872 0 431.7184-193.2288 431.7184-431.7184 0-219.1872-163.4816-400.0256-375.1424-427.7248z';
    } else if (type === 'pie') {
        myToolTitle = "柱状图切换";
        myToolImage = 'path://M296.421053 700.631579 296.421053 471.578947 404.210526 471.578947 404.210526 700.631579 296.421053 700.631579ZM431.157895 700.631579 431.157895 296.421053 525.473684 296.421053 525.473684 700.631579 431.157895 700.631579ZM552.421053 700.631579 552.421053 552.421053 660.210526 552.421053 660.210526 700.631579 552.421053 700.631579ZM687.157895 700.631579 687.157895 390.736842 794.947368 390.736842 794.947368 700.631579 687.157895 700.631579ZM229.052632 256 269.473684 256 269.473684 727.578947 794.947368 727.578947 794.947368 768 229.052632 768 229.052632 256Z';
    }
    //option
    var option = {};
    if (type == 'bar') {
        option = {
            title: {
                show: true,
                text: title,
                textStyle: {
                    align: 'right'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {type: []},
                    myTool: {
                        show: true,
                        title: myToolTitle,
                        icon: myToolImage,
                        onclick: function () {
                            var options = proportion.getOption();
                            getChartOption('pie', options.xAxis[0].data, options.series[0].data, options.title[0].text);
                        }
                    },
                    dataView: {readOnly: false},
                    restore: {
                        show: false
                    },
                    saveAsImage: {
                        show: false
                    }
                }
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
                type: 'bar'
            }]
        };
    } else if (type == "pie") {
        option = {
            title: {
                show: true,
                text: title,
                textStyle: {
                    align: 'right'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    var res=''
                    for(item in params.data){
                        if(item == 'name') {res+='<p style="margin-bottom:15px">'+params.data[item]+'<p>';continue}
                        res+='<p>'+item+':'+'<span style="color:#f0f0f0">'+params.data[item]+'</span>'+'</p>'
                    }
                    return res;
                }
            },
            series: [{
                data: series,
                type: 'pie'
            }],
            xAxis: {
                type: 'category',
                data: xAxis
            },
            yAxis: {
                type: 'value'
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {type: []},
                    dataView: {readOnly: false},
                    restore: {
                        show: false
                    },
                    saveAsImage: {
                        show: false
                    },
                    myTool1: {
                        show: true,
                        title: myToolTitle,
                        icon: myToolImage,
                        onclick: function () {
                            var options = proportion.getOption();
                            getChartOption('bar', options.xAxis[0].data, options.series[0].data, options.title[0].text);
                        }
                    },
                }
            }
        };

    }
    proportion.setOption(option);
}