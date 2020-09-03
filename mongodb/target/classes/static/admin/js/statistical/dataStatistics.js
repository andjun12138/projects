var barLabel = {
    normal: {
        show: true,
        position: 'top'
    }
};
var nowPad = 'clearance';

$(function () {
    initPage();
});
// 初始化页面
function initPage() {
    $(".time").datetimepicker("setDate", new Date());
    initICustoms();
    $(document).on('click','#fieldTab a',function (e) {
        //tab栏切换
        if ($(this).attr('href') == '#incubator') {
            nowPad = 'incubator'
            initHatchery();
        }else if($(this).attr('href') == '#cnki'){
            nowPad = 'cnki'
            initCnki();
        }else if($(this).attr('href') == '#clearance'){
            nowPad = 'clearance'
            initICustoms();
        }
        e.stopPropagation();
        $(this).tab('show');
    }).on('change','input.time',function (e) {//可共用
        e.stopPropagation();
        getData();
    })
}

function getData() {
    if (nowPad == 'incubator'){
        initHatchery();
    }else if(nowPad == 'cnki'){//
        initCnki()
    }else if(nowPad == 'clearance'){
        initICustoms()
    }
}


function initICustoms() {
    var decNumberTime = $("#decNumberTime").val();
    var json = {
        decNumberTime: decNumberTime
    }
    $.ajax({
        url: '/iCustoms/getInitData',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(json),
        success: function (res) {
            var data = res.data;
            var decNumberResult = data['decNumber'];
            var decNumberTotal = 0;
            if (decNumberResult.length > 0){
                for(var i = 0 ; i < decNumberResult.length;i++){
                    var decNumberObj = decNumberResult[i];
                    decNumberTotal = decNumberTotal + decNumberObj['decNumberTotal'];
                }
            }
            $("#decNumberTotal").html(decNumberTotal+" 单")
        },
        error: function (e) {
            console.log(e);
        }
    })
}

function initCnki() {
    $.ajax({
        url: '/cnki/getInitData',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            var downloadTotal = res.data.downloadTotal.hits.total;
            $("#downloadTotal").html(downloadTotal)
        },
        error: function (e) {
            console.log(e);
        }
    })
}

function initHatchery() {
    $.ajax({
        url: '/hatchery/getInitData',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            var roomOfUsed = res.data['roomOfUsed'];
            var allEnterpriseNum = res.data['allEnterpriseNum'];
            $("#roomOfUsed").html(roomOfUsed['percentage']*100 + '%')
            $(".progress-bar").css('width',roomOfUsed['percentage']*100 + '%');
            $("#allEnterpriseNum").html(allEnterpriseNum + ' 家')
            var enterpriseType = res.data['enterpriseType'];
            initIncubatorCompanyChart(enterpriseType)
            var enterpriseUserType = res.data['enterpriseUserType'];
            initIncubatorPersonChart(enterpriseUserType);
        },
        error: function (e) {
            console.log(e);
        }
    })
}



initClearanceChart();
initCnkiChart();
//initIncubatorCompanyChart();
//initIncubatorPersonChart();
initIncubatorGrowthChart();
initDateTimePicker($(".month-time"),{format: 'yyyy-mm', language: 'zh-CN',minView:3,startView:3});
initDateTimePicker($(".year-time"),{format: 'yyyy', language: 'zh-CN',minView:4,startView :4});

function initClearanceChart(){
    var myChart = echarts.init(document.getElementById('clearance-chart'));
    var options={
        //定义一个标题
        title:{
            text:'通关企业排名：',
            textStyle:{
                fontSize:20,
                color:'#4d4d4d'
            }
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {},
        //X轴设置
        xAxis:{
            type : 'category',
            data:['品智科技','万智信息科技','视觉中国','长生医疗','万达地产','网易有道','华润万家'],
            splitLine: {
                show: true, //网格线
            },
            axisTick:{       //刻度线
                show:false
            },
            axisLabel:{
                margin:15,
                textStyle:{
                    fontWeight:'bold'
                }
            }
        },
        yAxis:[
            {
                type : 'value',
                splitLine: {
                    show: true,//网格线
                },
                axisTick:{       //刻度线
                    show:false
                }
            },
            {
                type : 'value',
                splitLine: {
                    show: true,//网格线
                },
                axisTick:{       //刻度线
                    show:false
                },
                axisLabel: {
                    formatter: function(value,index){
                        var value;
                        if (value >=10000) {
                            value = value/10000+'万元';
                        }else if(value <10000){
                            value = value+'元';
                        }
                        return value
                    }
                }
            }
        ],
        series:[
            {
                name:'单量',
                type:'bar',
                label:barLabel,
                itemStyle:{
                    normal:{
                        color:'#4288f9',
                        barBorderRadius: [30,30,0,0]
                    }
                },
                data:[700,600,500,400,300,200,100]
            },
            {
                name:'金额',
                type:'bar',
                yAxisIndex: 1,
                label:barLabel,
                itemStyle:{
                    normal:{
                        color:'#8ec2fe',
                        barBorderRadius: [30,30,0,0]
                    }
                },
                data:[7777,6666,5555,4444,3333,2222,1111]
            }
        ]
    };
    myChart.setOption(options);
}


function initCnkiChart(){
    var myChart = echarts.init(document.getElementById('cnki-chart'));
    var options={
        //定义一个标题
        title:{
            text:'科技偏好：',
            textStyle:{
                fontSize:20,
                color:'#4d4d4d'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'right',
            data:['大数据','OLED','物联网','电子商务','智能集成','移动互联网 ','智能识别','智能制造']
        },
        series: [
            {
                name:'科技偏好',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {

                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: true
                    }
                },
                data:[
                    {value:335, name:'大数据'},
                    {value:310, name:'OLED'},
                    {value:234, name:'物联网'},
                    {value:135, name:'电子商务'},
                    {value:1548, name:'智能集成'},
                    {value:100, name:'移动互联网'},
                    {value:600, name:'智能识别'},
                    {value:800, name:'智能制造'}
                ]
            }
        ]
    };
    myChart.setOption(options);
}

function initIncubatorCompanyChart(enterpriseType){
    var xAxis = [];
    var series = [];
    for (var i = 0; i < enterpriseType.length; i++) {
        xAxis.push(enterpriseType[i].title);
        series.push( enterpriseType[i].num);
    }
    var myChart = echarts.init(document.getElementById('incubator-company-chart'));
    var options={
        //定义一个标题
        title:{
            text:'企业行业分布：',
            textStyle:{
                fontSize:20,
                color:'#4d4d4d'
            }
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {},
        //X轴设置
        xAxis:{
            type : 'category',
            data:xAxis,
            splitLine: {
                show: true, //网格线
            },
            axisTick:{       //刻度线
                show:false
            },
            axisLabel:{
                margin:15,
                textStyle:{
                    fontWeight:'bold'
                }
            }
        },
        yAxis:[
            {
                name:'单位：家',
                type : 'value',
                splitLine: {
                    show: true,//网格线
                },
                axisTick:{       //刻度线
                    show:false
                }
            }
        ],
        series:[
            {
                name:'数量',
                type:'bar',
                label:barLabel,
                itemStyle:{
                    normal:{
                        color:'#3398db',
                    }
                },
                data:series
            }
        ]
    };
    myChart.setOption(options);
}

/**
 * 孵化器人员学历结构
 */
function initIncubatorPersonChart(enterpriseUserType){
    var series = [];
    var legend = [];
    for (var i = 0; i < enterpriseUserType.length; i++) {
        if (enterpriseUserType[i].num != 0) {
            legend.push(enterpriseUserType[i].title);
            var obj = {};
            obj['value'] = enterpriseUserType[i].num;
            obj['name'] = enterpriseUserType[i].title;
            series.push(obj);
        }
    }
    var myChart = echarts.init(document.getElementById('incubator-person-chart'));
    var options={
        //定义一个标题
        title:{
            text:'孵化器人员学历结构：',
            textStyle:{
                fontSize:20,
                color:'#4d4d4d'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'right',
            data:legend
        },
        series: [
            {
                name:'孵化器人员学历结构',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: true
                    }
                },
                data:series
            }
        ]
    };
    myChart.setOption(options);
}

/**
 * 年均增长：
 */
function initIncubatorGrowthChart(){
    var myChart = echarts.init(document.getElementById('incubator-growth-chart'));
    var options = {
        legend: {},
        tooltip: {
            trigger: 'axis'
        },
        xAxis: [
            {
                type: 'category',
                data: ['2014','2015','2016','2017','2018','2019'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '产值',
            },
            {
                type: 'value',
                name: '增长率',
                axisLabel: {
                    formatter: '{value} %'
                }
            }
        ],
        series: [
            {
                name:'访问量',
                type:'bar',
                label:barLabel,
                data:[100,200,300,400,500,600]
            },
            {
                name:'增长率',
                type:'line',
                yAxisIndex: 1,
                data:[6,7,8,9,10,11]
            }

        ]
    };
    myChart.setOption(options);
}

function dateClick(obj){

    $(obj).parent().find(".time").datetimepicker('show');
}
