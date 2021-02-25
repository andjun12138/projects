
$(function () {
    startTime();
    showUserLineChart();
    showUserPieChart();
    showClearanceLineChart();
    showExhibitionLineChart();
    showResourceLineChart();
    showAchievementsPieChart();
    showCompanyLineChart();
    showCompanyPieChart();
    getWeather();
    updateWeather();
});

// 获取惠南天气，api来源https://www.tianqiapi.com/，免费api接口
function getWeather() {
    $.ajax({
        type: 'GET',
        url: 'https://www.tianqiapi.com/api/',
        data: 'version=v6&cityid=101280306&city=惠城',
        dataType: 'JSON',
        success: function (res) {
            var wea = res.wea;
            $('.top-content-weather').text(wea);
        },
        error: function (err) {
            console.log(err)
        }
    });
}

// 如果页面一直存在，半个小时自动更新一次天气
function updateWeather() {
    setInterval(function () {
        getWeather();
    }, 1000*60*30)
}

function startTime() {
    getNowTime();
    setInterval(function () {
        getNowTime()
    }, 1000)
}

// 获取当前时间
function getNowTime() {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var week = d.getDay();
    var hour = d.getHours();
    var min = d.getMinutes();
    var second = d.getSeconds();
    var weekList = [ '周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    var time = year + '年' + month + '月' + day + '日 ' + weekList[week] + ' ' + addZero(hour) + ':' + addZero(min) + ':' + addZero(second);
    $('.top-content-time').text(time)
}

function addZero(num) {
    return num < 10 ? '0' + num : num;
}



// 门户数据：用户数量（折线图）
function showUserLineChart() {
    var option = {
        color:['#0fced9','#ed58aa','#80FF80','#FF8096','#800080'],
        title : {
            text: '用户数据',
            x: 'center',
            y: 'bottom',
            textStyle: {
                color: '#d4d4d4',
                fontSize: 14
            }
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            itemGap: 20,
            data:[
                {
                    name: '总用户数',
                    textStyle:{
                        color: '#0fced9'
                    }
                },
                {
                    name: '活跃用户数',
                    textStyle:{
                        color: '#ed58aa'
                    }
                }
            ],
        },
        // toolbox: {
        //     show : true,
        //     feature : {
        //         mark : {show: true},
        //         dataView : {show: true, readOnly: false},
        //         magicType : {show: true, type: ['line', 'bar']},
        //         restore : {show: true},
        //         saveAsImage : {show: true}
        //     }
        // },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['201903','201904','201905','201906','201907','201908'],
                axisLine:{
                    lineStyle:{
                        color: '#4b7acc',
                        width: 1
                    }
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value}'
                },
                axisLine:{
                    lineStyle:{
                        color: '#5c629e',
                        width: 1
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle:{
                        color: ['#213e78'],
                        width: 1,
                        type: 'solid'
                    }
                }
            }
        ],
        series : [
            {
                name:'总用户数',
                type:'line',
                smooth:true,
                itemStyle : {
                    normal: {
                        lineStyle: {
                            color: '#0fced9'
                        }
                    }
                },
                data:[100, 200, 350, 500, 700, 1100],
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'}
                    ]
                }
            },
            {
                name:'活跃用户数',
                type:'line',
                smooth:true,
                itemStyle : {
                    normal: {
                        lineStyle: {
                            color: '#ed58aa'
                        }
                    }
                },
                data:[10, 50, 100, 200, 200, 250],
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('user-line-chart'));
    myChart.setOption(option);
}

// 用户数据：用户比例（饼图）
function showUserPieChart() {
    var option = {
        color:['#febc4e','#ff5963','#0fced9','#1e93ff','#53ff87','#ff7430','#ff5fb7','#ffcbcb','#6f4fb7','#30466f'],
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        title : {
            text: '用户比例',
            x: 'center',
            y: 'bottom',
            textStyle: {
                color: '#d4d4d4',
                fontSize: 14
            }
        },
        calculable : false,
        series : [
            {
                name:'访问来源',
                type:'pie',
                selectedMode: 'single',
                radius : [40, 70],

                // for funnel
                x: '20%',
                width: '40%',
                funnelAlign: 'right',
                max: 1548,

                itemStyle : {
                    normal : {
                        label : {
                            position : 'inner'
                        },
                        labelLine : {
                            show : false
                        }
                    }
                },
                data:[
                    {value:1335, name:'企业用户'},
                    {value:679, name:'个人用户'},
                ]
            },
            {
                name:'访问来源',
                type:'pie',
                radius : [80, 110],

                // for funnel
                x: '60%',
                width: '35%',
                funnelAlign: 'left',
                max: 1048,

                data:[
                    {value:808, name:'生物医药'},
                    {value:335, name:'智能装备'},
                    {value:310, name:'电子信息'},
                    {value:251, name:'其他'},
                    {value:234, name:'移动互联网'},
                    {value:135, name:'新能源新材料'}
                ]
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('user-pie-chart'));
    myChart.setOption(option);
}

// 互联网数据中心：通关金额、通关单数与通关企业数
function showClearanceLineChart() {
    var option = {
        color:['#ff5fb7','#0fced9','#febc4e','#FF8096','#800080'],
        title : {
            text: '通关金额、通关单数、通关企业数',
            x: 'center',
            y: 'bottom',
            textStyle: {
                color: '#d4d4d4',
                fontSize: 14
            }
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            itemGap: 20,
            data:[
                {
                    name: '通关金额(万)',
                    textStyle:{
                        color: '#ff5fb7'
                    }
                },
                {
                    name: '单数累计(单)',
                    textStyle:{
                        color: '#0fced9'
                    }
                },
                {
                    name: '通关企业数(个)',
                    textStyle:{
                        color: '#febc4e'
                    }
                }
            ],
        },
        // toolbox: {
        //     show : true,
        //     feature : {
        //         mark : {show: true},
        //         dataView : {show: true, readOnly: false},
        //         magicType : {show: true, type: ['line', 'bar']},
        //         restore : {show: true},
        //         saveAsImage : {show: true}
        //     }
        // },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['201903','201904','201905','201906','201907','201908'],
                axisLine:{
                    lineStyle:{
                        color: '#4b7acc',
                        width: 1
                    }
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value}'
                },
                axisLine:{
                    lineStyle:{
                        color: '#5c629e',
                        width: 1
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle:{
                        color: ['#213e78'],
                        width: 1,
                        type: 'solid'
                    }
                }
            }
        ],
        series : [
            {
                name:'通关金额(万)',
                type:'line',
                smooth:true,
                itemStyle : {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data:[50, 80, 55, 60, 90, 100]
            },
            {
                name:'单数累计(单)',
                type:'line',
                smooth:true,
                itemStyle : {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data:[10, 12, 20, 24, 13, 25]
            },
            {
                name:'通关企业数(个)',
                type:'line',
                smooth:true,
                itemStyle : {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data:[2, 5, 10, 15, 20, 20],
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('clearance-line-chart'));
    myChart.setOption(option);
}

// 互联网数据中心：展会（折线图）
function showExhibitionLineChart() {
    var option = {
        color:['#38a1ff','#6df496','#80FF80','#FF8096','#800080'],
        title : {
            text: '工业展览商品数与展会数',
            x: 'center',
            y: 'bottom',
            textStyle: {
                color: '#d4d4d4',
                fontSize: 14
            }
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            itemGap: 20,
            data:[
                {
                    name: '工业展览商品',
                    textStyle:{
                        color: '#38a1ff'
                    }
                },
                {
                    name: '展会',
                    textStyle:{
                        color: '#6df496'
                    }
                }
            ],
        },
        // toolbox: {
        //     show : true,
        //     feature : {
        //         mark : {show: true},
        //         dataView : {show: true, readOnly: false},
        //         magicType : {show: true, type: ['line', 'bar']},
        //         restore : {show: true},
        //         saveAsImage : {show: true}
        //     }
        // },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['201903','201904','201905','201906','201907','201908'],
                axisLine:{
                    lineStyle:{
                        color: '#4b7acc',
                        width: 1
                    }
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value}'
                },
                axisLine:{
                    lineStyle:{
                        color: '#5c629e',
                        width: 1
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle:{
                        color: ['#213e78'],
                        width: 1,
                        type: 'solid'
                    }
                }
            }
        ],
        series : [
            {
                name:'工业展览商品',
                type:'line',
                smooth:true,
                itemStyle : {
                    normal: {
                        lineStyle: {
                            color: '#38a1ff'
                        }
                    }
                },
                data:[100, 120, 100, 180, 150, 200]
            },
            {
                name:'展会',
                type:'line',
                smooth:true,
                itemStyle : {
                    normal: {
                        lineStyle: {
                            color: '#6df496'
                        }
                    }
                },
                data:[10, 50, 80, 60, 40, 80],
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('exhibition-line-chart'));
    myChart.setOption(option);
}

// 科技资源中心：成果、服务商、需求总量（折线图）
function showResourceLineChart() {
    var option = {
        color:['#38a1ff','#ff5fb7','#ff7430','#FF8096','#800080'],
        title : {
            text: '成果、服务商、需求总量',
            x: 'center',
            y: 'bottom',
            textStyle: {
                color: '#d4d4d4',
                fontSize: 14
            }
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            itemGap: 20,
            data:[
                {
                    name: '需求总数',
                    textStyle:{
                        color: '#38a1ff'
                    }
                },
                {
                    name: '技术成果',
                    textStyle:{
                        color: '#ff5fb7'
                    }
                },
                {
                    name: '服务商',
                    textStyle:{
                        color: '#ff7430'
                    }
                }
            ],
        },
        // toolbox: {
        //     show : true,
        //     feature : {
        //         mark : {show: true},
        //         dataView : {show: true, readOnly: false},
        //         magicType : {show: true, type: ['line', 'bar']},
        //         restore : {show: true},
        //         saveAsImage : {show: true}
        //     }
        // },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['201903','201904','201905','201906','201907','201908'],
                axisLine:{
                    lineStyle:{
                        color: '#4b7acc',
                        width: 1
                    }
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value}'
                },
                axisLine:{
                    lineStyle:{
                        color: '#5c629e',
                        width: 1
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle:{
                        color: ['#213e78'],
                        width: 1,
                        type: 'solid'
                    }
                }
            }
        ],
        series : [
            {
                name:'需求总数',
                type:'line',
                smooth:true,
                itemStyle : {
                    normal: {
                        lineStyle: {
                            color: '#38a1ff'
                        }
                    }
                },
                data:[50, 200, 350, 600, 700, 1100]
            },
            {
                name:'技术成果',
                type:'line',
                smooth:true,
                itemStyle : {
                    normal: {
                        lineStyle: {
                            color: '#ff5fb7'
                        }
                    }
                },
                data:[100, 200, 350, 500, 700, 800]
            },
            {
                name:'服务商',
                type:'line',
                itemStyle : {
                    normal: {
                        lineStyle: {
                            color: '#ff7430'
                        }
                    }
                },
                data:[10, 50, 100, 200, 200, 250],
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('resource-line-chart'));
    myChart.setOption(option);
}

// 科技资源中心：成果分类（饼图）
function showAchievementsPieChart() {
    var option = {
        color:['#0fced9','#febc4e','#6df496','#ff5fb7','#ff5963','#ff7430','#ff5fb7','#ffcbcb','#6f4fb7','#30466f'],
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        title : {
            // text: '在孵企业比例',
            x: 'center',
            y: 'bottom',
            textStyle: {
                color: '#d4d4d4',
                fontSize: 14
            }
        },
        calculable : false,
        series : [
            {
                name:'成果分类',
                type:'pie',
                radius : [60, 90],

                // for funnel
                x: '20%',
                width: '25%',
                funnelAlign: 'left',

                data:[
                    {value:30, name:'工业互联网'},
                    {value:25, name:'工业设计'},
                    {value:22, name:'能源新材料'},
                    {value:21, name:'工业机器人'},
                    {value:20, name:'其他'}
                ]
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('achievements-pie-chart'));
    myChart.setOption(option);
}

// 创业孵化中心：企业孵化（折线图）
function showCompanyLineChart() {
    var option = {
        color:['#febc4e','#ff5fb7','#0fced9','#38a1ff','#ff5963'],
        title : {
            text: '企业孵化',
            x: 'center',
            y: 'bottom',
            textStyle: {
                color: '#d4d4d4',
                fontSize: 14
            }
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            itemGap: 20,
            data:[
                {
                    name: '在孵企业数(个)',
                    textStyle:{
                        color: '#febc4e'
                    }
                },
                {
                    name: '专利(个)',
                    textStyle:{
                        color: '#ff5fb7'
                    }
                },
                {
                    name: '高科技人才(人)',
                    textStyle:{
                        color: '#0fced9'
                    }
                },
                {
                    name: '产值(百万)',
                    textStyle:{
                        color: '#38a1ff'
                    }
                },
                {
                    name: '服务机构(个)',
                    textStyle:{
                        color: '#ff5963'
                    }
                }
            ],
        },
        // toolbox: {
        //     show : true,
        //     feature : {
        //         mark : {show: true},
        //         dataView : {show: true, readOnly: false},
        //         magicType : {show: true, type: ['line', 'bar']},
        //         restore : {show: true},
        //         saveAsImage : {show: true}
        //     }
        // },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['201903','201904','201905','201906','201907','201908'],
                axisLine:{
                    lineStyle:{
                        color: '#4b7acc',
                        width: 1
                    }
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value}'
                },
                axisLine:{
                    lineStyle:{
                        color: '#5c629e',
                        width: 1
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle:{
                        color: ['#213e78'],
                        width: 1,
                        type: 'solid'
                    }
                }
            }
        ],
        series : [
            {
                name:'在孵企业数(个)',
                type:'line',
                smooth:true,
                itemStyle : {
                    normal: {
                        lineStyle: {
                            color: '#febc4e'
                        }
                    }
                },
                data:[50, 60, 70, 75, 82, 88]
            },
            {
                name:'专利(个)',
                type:'line',
                smooth:true,
                itemStyle : {
                    normal: {
                        lineStyle: {
                            color: '#ff5fb7'
                        }
                    }
                },
                data:[45, 65, 85, 100, 110, 115]
            },
            {
                name:'高科技人才(人)',
                type:'line',
                smooth:true,
                itemStyle : {
                    normal: {
                        lineStyle: {
                            color: '#0fced9'
                        }
                    }
                },
                data:[5, 10, 15, 18, 20, 25],
            },
            {
                name:'产值(百万)',
                type:'line',
                smooth:true,
                itemStyle : {
                    normal: {
                        lineStyle: {
                            color: '#38a1ff'
                        }
                    }
                },
                data:[10, 25, 60, 100, 120, 150],
            },
            {
                name:'服务机构(个)',
                type:'line',
                smooth:true,
                itemStyle : {
                    normal: {
                        lineStyle: {
                            color: '#ff5963'
                        }
                    }
                },
                data:[10, 20, 30, 35, 40, 45],
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('company-line-chart'));
    myChart.setOption(option);
}

// 创业孵化中心：在孵企业比例（饼图）
function showCompanyPieChart() {
    var option = {
        color:['#0091e7','#0fced9','#00c48d','#caf07a','#febc4e','#ff5963','#ff395a','#f946cf','#ce31f4','#7921f7','#013892'],
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        title : {
            text: '在孵企业比例',
            x: 'center',
            y: 'bottom',
            textStyle: {
                color: '#d4d4d4',
                fontSize: 14
            }
        },
        calculable : false,
        series : [
            {
                name:'在孵企业比例',
                type:'pie',
                radius : [80, 110],

                // for funnel
                x: '60%',
                width: '35%',
                funnelAlign: 'left',
                max: 1048,

                data:[
                    {value:30, name:'机器人自动化'},
                    {value:25, name:'智能制造'},
                    {value:22, name:'精密装备制造'},
                    {value:21, name:'3D打印'},
                    {value:20, name:'工业设计'},
                    {value:20, name:'互联网+(科技领域)'},
                    {value:18, name:'信息技术服务行业'},
                    {value:18, name:'教育培训'},
                    {value:15, name:'其他'},
                    {value:5, name:'新能源新材料'},
                    {value:5, name:'生物医药'}
                ]
            }
        ]
    };
    var myChart = echarts.init(document.getElementById('company-pie-chart'));
    myChart.setOption(option);
}
