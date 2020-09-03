var timeType = null;
var startTime = null;
var endTime = null;

var xAxisData = [];
var yAxisData = [];

var seriesName = '科技成果录入数';

var total = 0;
var avg = 0;

$(function(){
    initPlugins();
    initData();

});

function initPlugins() {
    $('.time').datetimepicker({
        format: 'yyyy-mm-dd', //显示格式
        language: 'zh-CN',
        todayHighlight: 1,
        minView: 2,
        todayBtn: true,
        autoclose: true
    });
}

function initData() {
    xAxisData = [];
    yAxisData = [];
    var url = '/ggdzhzb/getMatureCaseCount?timeType='+timeType+'&startTime='+startTime+'&endTime='+endTime;
    if($tab == 'skillDemand'){
        url = '/ggdzhzb/getSkillDemandCount?timeType='+timeType+'&startTime='+startTime+'&endTime='+endTime;
        seriesName = '技术需求发布数';
    }
    //获取数据
    $.ajax({
        url: url,
        type: 'get',
        contentType: 'application/json;charset=utf-8',
        success: function (res) {
            console.log(res);

            if (res.status == 200) {
                total = 0;
                avg = 0;
                for(var i in res.data){
                    total += res.data[i]['countNum'];
                }
                if(total != 0){
                    avg = Math.round(parseFloat(total/res.data.length)*100)/100;
                }
                console.log('total:'+total+'--avg:'+avg);
                $.each(res.data,function(index,value) {
                    xAxisData.push(value['dateTime']) ;
                    yAxisData.push(value['countNum']) ;
                });
                initEcharts();
            } else {
                console.log(res.status,res.message);
            }
        },
        error: function (error) {
            console.log('内部服务器错误');
        }
    });

}

function initEcharts() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('echarts'));

    // 指定图表的配置项和数据
    option = {
        title: {
            text: seriesName,
            subtext: '数据总数：'+total+'    平均数：'+avg,
            x: 'center',
            align: 'right'
        },
        tooltip: {
            trigger: 'axis'
        },
        // legend: {
        //     data:[seriesName]
        // },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '数量',
                type:'line',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                lineStyle:{
                    color:'green'
                },
                areaStyle: {color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'green' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'blue' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }},
                data:yAxisData
            }
        ]
    };
    
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

function search() {
    timeType = !!$('#timeType').val() ? $('#timeType').val() : null;
    startTime = !!$('#startTime').val() ? $('#startTime').val() : null;
    endTime = !!$('#endTime').val() ? $('#endTime').val() : null;
    initData();
}