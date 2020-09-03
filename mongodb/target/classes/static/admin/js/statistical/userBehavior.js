/**
 * Created by mu-HUN on 2018/9/6.
 */
var userType='';
var userActiveType='';
var timeType;
var timeRange;
var register;
var increasePercentage;
var searchPadDiv;
var userRetention;
var userViewMap;
var userViewAgvMap;
var repVisUserCountMap;
var visitDepthMap;
var maxVisitPageMap;
var trafficGrowthMap;
var searchKeyWordMapLeft;
var searchKeyWordMapRight;
var userBounce;
var enterpriseStyle;
var userActive;

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
    userViewMap = echarts.init(document.getElementById('userViewMap'));
    userViewAgvMap = echarts.init(document.getElementById('userViewAgvMap'));
    repVisUserCountMap = echarts.init(document.getElementById('repVisUserCountMap'));
    visitDepthMap = echarts.init(document.getElementById('visitDepthMap'));
    register = echarts.init(document.getElementById('registerMap'));
    increasePercentage = echarts.init(document.getElementById('increasePercentageMap'));
    maxVisitPageMap = echarts.init(document.getElementById('maxVisitPageMap'));
    trafficGrowthMap = echarts.init(document.getElementById('trafficGrowthMap'));
    searchKeyWordMapLeft = echarts.init(document.getElementById('searchKeyWordMapLeft'));
    searchKeyWordMapRight = echarts.init(document.getElementById('searchKeyWordMapRight'));
    userRetention = echarts.init(document.getElementById('userRetentionMap'));
    userBounce = echarts.init(document.getElementById('userBounceMap'));
    enterpriseStyle = echarts.init(document.getElementById('enterpriseStyleMap'));
    userActive = echarts.init(document.getElementById('userActiveMap'));
    initDateTimePicker($(".time"));
    initUserViewTable();
//    initVisitDepthTable();
    $(document).on('click','#fieldTab a',function (e) {
        //tab栏切换
        if ($(this).attr('href') == '#userView') {
            initUserViewTable();
        }else if ($(this).attr('href') == '#userViewAgv') {
            initUserViewAgvTable();
        }else if ($(this).attr('href') == '#repVisUserCount') {
            initRepVisUserCountTable();
        }else if ($(this).attr('href') == '#visitDepth') {
            initVisitDepthTable();
        }else if($(this).attr('href') == '#maxVisitPage'){
            initMaxVisitPageTable();
        }else if ($(this).attr('href') == '#register') {
            initRegisterTable();
        }else if($(this).attr('href') == '#trafficGrowth'){
            initTrafficGrowthTable();
        }else if($(this).attr('href') == '#searchKeyWord') {
            initSearchKeyWordTable();
        }else if($(this).attr('href') == '#increasePercentage'){
            initIncreasePercentageTable();
        }else if($(this).attr('href') == '#userRetention'){
            initUserRetentionTable();
        }else if($(this).attr('href') == '#userBounce'){
            initUserBounceTable();
        }else if ($(this).attr('href') == '#enterpriseStyle') {
            initEnterpriseStyleTable();
        }else if ($(this).attr('href') == '#userActive') {
            initUserActiveTable();
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
    }).on('click','#registerSearch',function (e) {
        e.stopPropagation();
        getData();
    }).on('click','#maxVisitPageSearch',function (e) {
        e.stopPropagation();
        getData();
    }).on('click','#trafficGrowthSearch',function (e) {
        e.stopPropagation();
        getData();
    }).on('click','#searchKeyWordSearch',function (e) {
        e.stopPropagation();
        getData();
    }).on('click','#visitDepthSearch',function (e) {
        e.stopPropagation();
        getData();
    }).on('click','#userViewSearch',function (e) {
        e.stopPropagation();
        getData();
    }).on('click','#userViewAgvSearch',function (e) {
        e.stopPropagation();
        getData();
    }).on('click','#repVisUserCountSearch',function (e) {
        e.stopPropagation();
        getData();
    })
}

function initUserViewTable() {
    timeType = $("#userViewConditions").find('.select-model-type').val();
    timeRange = $("#userViewConditions").find('.select-model-range').val();
    searchPadDiv = 'userView';
    var obj = recentTime(timeRange);
    $('#userViewStartTime').val(obj.start);
    $('#userViewEndTime').val(obj.end);
    getUserView();
}
function initUserViewAgvTable() {
    timeType = $("#userViewAgvConditions").find('.select-model-type').val();
    timeRange = $("#userViewAgvConditions").find('.select-model-range').val();
    searchPadDiv = 'userViewAgv';
    var obj = recentTime(timeRange);
    $('#userViewAgvStartTime').val(obj.start);
    $('#userViewAgvEndTime').val(obj.end);
    getUserViewAgv();
}
function initRepVisUserCountTable() {
    timeType = $("#repVisUserCountConditions").find('.select-model-type').val();
    timeRange = $("#repVisUserCountConditions").find('.select-model-range').val();
    searchPadDiv = 'repVisUserCount';
    var obj = recentTime(timeRange);
    $('#repVisUserCountStartTime').val(obj.start);
    $('#repVisUserCountEndTime').val(obj.end);
    getRepVisUserCount();
}
function initVisitDepthTable() {
    timeType = $("#visitDepthConditions").find('.select-model-type').val();
    timeRange = $("#visitDepthConditions").find('.select-model-range').val();
    searchPadDiv = 'visitDepth';
    var obj = recentTime(timeRange);
    $('#visitDepthStartTime').val(obj.start);
    $('#visitDepthEndTime').val(obj.end);
    getVisitDepth();
}

function initMaxVisitPageTable() {
    timeType = $("#maxVisitPageConditions").find('.select-model-type').val();
    timeRange = $("#maxVisitPageConditions").find('.select-model-range').val();
    searchPadDiv = 'maxVisitPage';
    var obj = recentTime(timeRange);
    $('#maxVisitPageStartTime').val(obj.start);
    $('#maxVisitPageEndTime').val(obj.end);
    getMaxVisitPage();
}

function initRegisterTable() {
    timeType = $("#registerConditions").find('.select-model-type').val();
    timeRange = $("#registerConditions").find('.select-model-range').val();
    searchPadDiv = 'register';
    var obj = recentTime(timeRange);
    $('#registerStartTime').val(obj.start);
    $('#registerEndTime').val(obj.end);
    getRegisterData();
}
function initTrafficGrowthTable() {
    timeType = $("#trafficGrowthConditions").find('.select-model-type').val();
    timeRange = $("#trafficGrowthConditions").find('.select-model-range').val();
    searchPadDiv = 'trafficGrowth';
    var obj = recentTime(timeRange);
    $('#trafficGrowthStartTime').val(obj.start);
    $('#trafficGrowthEndTime').val(obj.end);
    getTrafficGrowth();
}

function initSearchKeyWordTable() {
    timeType = $("#searchKeyWordConditions").find('.select-model-type').val();
    timeRange = $("#searchKeyWordConditions").find('.select-model-range').val();
    searchPadDiv = 'searchKeyWord';
    var obj = recentTime(timeRange);
    $('#searchKeyWordStartTime').val(obj.start);
    $('#searchKeyWordEndTime').val(obj.end);
    getSearchKeyWord();
}
function initIncreasePercentageTable() {
    timeType = $("#increasePercentageConditions").find('.select-model-type').val();
    timeRange = $("#increasePercentageConditions").find('.select-model-range').val();
    searchPadDiv = 'increasePercentage';
    var obj = recentTime(timeRange);
    $('#increasePercentageStartTime').val(obj.start);
    $('#increasePercentageEndTime').val(obj.end);
    getIncreasePercentageData();
}

function initUserRetentionTable() {
    timeType = $("#userRetentionConditions").find('.select-model-type').val();
    timeRange = $("#userRetentionConditions").find('.select-model-range').val();
    searchPadDiv = 'userRetention';
    var obj = recentTime(timeRange);
    $('#userRetentionStartTime').val(obj.start);
    $('#userRetentionEndTime').val(obj.end);
    getUserRetentionData();
}

function initUserActiveTable() {
    timeType = $("#userActiveConditions").find('.select-model-type').val();
    timeRange = $("#userActiveConditions").find('.select-model-range').val();
    searchPadDiv = 'userActive';
    var obj = recentTime(timeRange);
    $('#userActiveStartTime').val(obj.start);
    $('#userActiveEndTime').val(obj.end);
    getUserActiveData();
}


function initUserBounceTable() {
    timeType = $("#userBounceConditions").find('.select-model-type').val();
    timeRange = $("#userBounceConditions").find('.select-model-range').val();
    searchPadDiv = 'userBounce';
    var obj = recentTime(timeRange);
    $('#userBounceStartTime').val(obj.start);
    $('#userBounceEndTime').val(obj.end);
    getUserBounceData();
}



function initEnterpriseStyleTable() {
    searchPadDiv = 'enterpriseStyle';
    getEnterpriseStyleData();
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

function setRangeConditions(element) {
    var startTimeElement;
    var endTimeElement;
    if (searchPadDiv == 'register'){//新增注册用户数
        startTimeElement = $('#registerStartTime');
        endTimeElement = $('#registerEndTime');
    }else if(searchPadDiv == 'increasePercentage'){//用户增长百分比
        startTimeElement = $('#increasePercentageStartTime');
        endTimeElement = $('#increasePercentageEndTime');
    }else if(searchPadDiv == 'userRetention'){//用户留存
        startTimeElement = $('#userRetentionStartTime');
        endTimeElement = $('#userRetentionEndTime');
    }else if(searchPadDiv == 'userBounce'){//用户跳出率
        startTimeElement = $('#userBounceStartTime');
        endTimeElement = $('#userBounceEndTime');
    }else if(searchPadDiv == 'maxVisitPage'){
        startTimeElement = $('#maxVisitPageStartTime');
        endTimeElement = $('#maxVisitPageEndTime');
    }else if(searchPadDiv == 'trafficGrowth'){
        startTimeElement = $('#trafficGrowthStartTime');
        endTimeElement = $('#trafficGrowthEndTime');
    }else if(searchPadDiv == 'searchKeyWord'){
        startTimeElement = $('#searchKeyWordStartTime');
        endTimeElement = $('#searchKeyWordEndTime');
    }else if(searchPadDiv == 'visitDepth'){
        startTimeElement = $('#visitDepthStartTime');
        endTimeElement = $('#visitDepthEndTime');
    }else if(searchPadDiv == 'userView'){
        startTimeElement = $('#userViewStartTime');
        endTimeElement = $('#userViewEndTime');
    }else if(searchPadDiv == 'userViewAgv'){
        startTimeElement = $('#userViewAgvStartTime');
        endTimeElement = $('#userViewAgvEndTime');
    }else if(searchPadDiv == 'repVisUserCount'){
        startTimeElement = $('#repVisUserCountStartTime');
        endTimeElement = $('#repVisUserCountEndTime');
    }else if(searchPadDiv == 'userActive'){
        startTimeElement = $('#userActiveStartTime');
        endTimeElement = $('#userActiveEndTime');
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
    if (searchPadDiv == 'register'){
        getRegisterData();
    }else if(searchPadDiv == 'increasePercentage'){//用户增长百分比
        getIncreasePercentageData()
    } else if(searchPadDiv == 'userRetention'){
        getUserRetentionData();
    }else if(searchPadDiv == 'userBounce'){
        getUserBounceData();
    }else if(searchPadDiv == 'maxVisitPage'){
        getMaxVisitPage();
    }else if(searchPadDiv == 'trafficGrowth'){
        getTrafficGrowth();
    }else if(searchPadDiv == 'searchKeyWord'){
        getSearchKeyWord();
    }else if(searchPadDiv == 'visitDepth'){
        getVisitDepth();
    }else if(searchPadDiv == 'userView'){
        getUserView();
    }else if(searchPadDiv == 'userViewAgv'){
        getUserViewAgv();
    }else if(searchPadDiv == 'repVisUserCount'){
        getRepVisUserCount();
    }else if(searchPadDiv == 'userActive'){
        getUserActiveData();
    }
}

// 访问深度
function getVisitDepth() {
    var json = {
        startTime: $('#visitDepthStartTime').val(),
        endTime: $('#visitDepthEndTime').val()
    }
    $.ajax({
        url: '/userBehavior/getVisitDepth',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("visitDepth",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}
// 用户访问量
function getUserView() {
    var json = {
        type:timeType,
        startTime: $('#userViewStartTime').val(),
        endTime: $('#userViewEndTime').val()
    }
    $.ajax({
        url: '/userBehavior/getUserView',
        type: 'post',
        dataType: 'json',
        data:json,
        success: function (res) {
            setEcharts("userView",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}
// 时间内均用户访问量
function getUserViewAgv() {
    var json = {
        type:timeType,
        startTime: $('#userViewAgvStartTime').val(),
        endTime: $('#userViewAgvEndTime').val()
    }
    $.ajax({
        url: '/userBehavior/getUserView/agv',
        type: 'post',
        dataType: 'json',
        data:json,
        success: function (res) {
            setEcharts("userViewAgv",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}
// 重复访问用户量
function getRepVisUserCount() {
    var json = {
        type:timeType,
        startTime: $('#repVisUserCountStartTime').val(),
        endTime: $('#repVisUserCountEndTime').val()
    }
    $.ajax({
        url: '/userBehavior/getRepeatVisitorUserCount',
        type: 'post',
        dataType: 'json',
        data:json,
        success: function (res) {
            setEcharts("repVisUserCount",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}
// 访问最多的页面
function getMaxVisitPage() {
    var json = {
        startTime: $('#maxVisitPageStartTime').val(),
        endTime: $('#maxVisitPageEndTime').val()
    }
    $.ajax({
        url: '/userBehavior/getMaxVisitPage',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("maxVisitPage",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}
// 流量增长百分比
function getTrafficGrowth() {
    var json = {
        type:timeType,
        startTime: $('#trafficGrowthStartTime').val(),
        endTime: $('#trafficGrowthEndTime').val()
    }
    $.ajax({
        url: '/userBehavior/getTrafficGrowth',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("trafficGrowth",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}
// 搜索关键词排名
function getSearchKeyWord() {
    var json = {
        startTime: $('#searchKeyWordStartTime').val(),
        endTime: $('#searchKeyWordEndTime').val()
    }
    $.ajax({
        url: '/userBehavior/getSearchKeyWord',
        type: 'post',
        dataType: 'json',
        data:JSON.stringify(json),
        contentType: 'application/json;charset=UTF-8',
        success: function (res) {
            setEcharts("searchKeyWord",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}
// 获取新增注册用户数
function getRegisterData() {
    //判断时间输入范围
    if(!judgeTimeInput('#registerStartTime', '#registerEndTime')) {
        return ;
    }
    var json = {
        type:timeType,
        userType: userType,
        startTime: $('#registerStartTime').val(),
        endTime: $('#registerEndTime').val()
    }

    $.ajax({
        url: '/userBehavior/getNewRegister',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(json),
        success: function (res) {
            setEcharts("register",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}

// 获取用户增长百分比
function getIncreasePercentageData() {
    //判断时间输入范围
    if(!judgeTimeInput('#increasePercentageStartTime', '#increasePercentageEndTime')) {
        return ;
    }
    var json = {
        type: timeType,
        startTime: $('#increasePercentageStartTime').val(),
        endTime: $('#increasePercentageEndTime').val()
    };
    $.ajax({
        url: '/userBehavior/getNewRegister',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(json),
        success: function (res) {
            setEcharts("increasePercentage",res.data.list);
        },
        error: function (e) {
            console.log(e);
        }
    })
}

// 获取用户留存率
function getUserRetentionData() {
    //判断时间输入范围
    if(!judgeTimeInput('#userRetentionStartTime', '#userRetentionEndTime')) {
        return ;
    }
    var json = {
        type: timeType,
        startTime: $('#userRetentionStartTime').val(),
        endTime: $('#userRetentionEndTime').val()
    };
    $.ajax({
        url: '/userBehavior/getUserRetention',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(json),
        success: function (res) {
            setEcharts("userRetention",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}// 获取用户活跃数(实际与周期内留存率类似)
function getUserActiveData() {
    //判断时间输入范围
    if(!judgeTimeInput('#userActiveStartTime', '#userActiveEndTime')) {
        return ;
    }
    var json = {
        type: timeType,
        startTime: $('#userActiveStartTime').val(),
        endTime: $('#userActiveEndTime').val()
    };
    $.ajax({
        url: '/userBehavior/getUserRetention',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(json),
        success: function (res) {
            setEcharts("userActive",res.data);
        },
        error: function (e) {
            console.log(e);
        }
    })
}


// 获取用户跳出
function getUserBounceData() {
    //判断时间输入范围
    if(!judgeTimeInput('#userBounceStartTime', '#userBounceEndTime')) {
        return ;
    }
    var json = {
        type: timeType,
        startTime: $('#userBounceStartTime').val(),
        endTime: $('#userBounceEndTime').val()
    };
    $.ajax({
        url: '/userBehavior/getUserBounce',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(json),
        success: function (res) {
            setEcharts("userBounce",res.data);
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
    if(type == 'userView') {
        renderUserViewChart(data);
    }else if(type == 'userViewAgv') {
        renderUserViewAgvChart(data);
    }else if(type == 'repVisUserCount') {
        renderRepVisUserCountChart(data);
    }else if(type == 'visitDepth') {
        renderVisitDepthChart(data);
    }else if(type == 'maxVisitPage') {
       renderMaxVisitPageChart(data);
    }else if(type == 'register') {
        var list = data.list;
        var counts = data.counts;
        var yData1 = [];
        var yData2 = [];
        var yAxis = [];
        for (var i = 0; i < list.length; i++) {
            xAxis.push(list[i].days);
            yData1.push(list[i].counts);
            counts = counts + list[i].counts;
            yData2.push(counts)
        }
        yAxis.push({
                type: 'value',
                name: '新增用户数'
            },
            {
                type: 'value',
                name: '用户总数',
            }
         );
        series.push(
            {
                name:'新增用户数',
                type:'bar',
                data:yData1
            },
            {
                name:'用户总数',
                type:'line',
                yAxisIndex: 1,
                label:barLabel,
                data:yData2
            }
        );
        title = '新增注册用户数';
        getChartOption(register,'multipleY', xAxis,yAxis, series, title);
    }else if(type == 'increasePercentage'){
        for (var i = 1; i < data.length; i++) {
            if(data[i-1].counts != 0){
                xAxis.push(data[i].days);
                var result = (data[i].counts-data[i-1].counts)/data[i].counts * 100;
                series.push(result.toFixed(2) );
            }
        }
        title = '用户注册增长百分比';
        getChartOption(increasePercentage,'line', xAxis,null, series, title);
    }else if(type == 'trafficGrowth') {
        renderTrafficGrowthChart(data);

    }else if(type == 'searchKeyWord') {
        var buckets = data.aggregations.result.buckets;
        if(buckets) {
            for (var i = 0; i < buckets.length; i++) {
                xAxis.push(buckets[i].key);
                series.push({
                    name: buckets[i].key,
                    value: buckets[i].doc_count
                });
            }
            title = '关键词搜索排名';
            getChartOption(searchKeyWordMapLeft, 'simpleBar', xAxis,null, series, title);
            getChartOption(searchKeyWordMapRight, 'pie', xAxis, null,series, title);
        }
    }else if (type == 'userRetention'){
        var buckets = data.aggregations.result.buckets;
        var seriesData = [];
        if(buckets) {
            for (var i = 0; i < buckets.length; i++) {
                xAxis.push(buckets[i].key_as_string);
                var userTotalBuckets = buckets[i].userTotal.buckets;
                if(userTotalBuckets.length > 0){
                    var lastUserCounts = 0;
                    for (var j = 0;j < userTotalBuckets.length;j++){
                        var nowUserCounts = userTotalBuckets[j].userCounts.value;
                        if (nowUserCounts > lastUserCounts){
                            lastUserCounts = nowUserCounts;
                        }
                    }
                    var result = userTotalBuckets.length/lastUserCounts * 100;
                    seriesData.push(result.toFixed(2));
                }else {
                    seriesData.push(0);
                }
            }
            series.push({
                name:'留存率',
                type:'line',
                stack: '总量',
                areaStyle: {},
                data: seriesData
            });
            title = '周期内留存率';
            getChartOption(userRetention, 'area', xAxis,null, series, title);
        }
    }else if (type == 'userActive'){
        var buckets = data.aggregations.result.buckets;
        if(buckets) {
            for (var i = 0; i < buckets.length; i++) {
                xAxis.push(buckets[i].key_as_string);
                var userTotalBuckets = buckets[i].userTotal.buckets;
                if(userTotalBuckets.length > 0){
                    series.push(userTotalBuckets.length);
                }else {
                    series.push(0);
                }
            }
            title = '用户活跃数分析';
            getChartOption(userActive,'simpleBar', xAxis, null,series, title);
        }
    }else if (type == 'userBounce'){
        var buckets = data.aggregations.result.buckets;
        if(buckets) {
            for (var i = 0; i < buckets.length; i++) {
                xAxis.push(buckets[i].key_as_string);
                var ipCounts = buckets[i].ipCounts;
                var ipCountsBuckets = ipCounts.buckets;
                var seriesValue= 0;
                if (ipCountsBuckets.length > 0) {
                    for (var j = 0; j < ipCountsBuckets.length; j++) {
                        if (ipCountsBuckets[j].doc_count == 1) {
                            seriesValue = seriesValue + 1;
                        }
                    }
                    series.push(seriesValue/ipCountsBuckets.length);
                }else {
                    series.push(seriesValue);
                }
            }
            title = '用户跳出率';
            getChartOption(userBounce, 'line', xAxis, null,series, title);
        }
    }else if(type = 'enterpriseStyle'){
        var xAxis = [];
        var series = [];
        var title='';
        //用户分布占比分析
        if(type == 'enterpriseStyle') {
            for (var i = 0; i < data.length; i++) {
                xAxis.push(data[i].belongIndustry);
                series.push({
                    name:data[i].belongIndustry,
                    value:data[i].counts
                });
            }
            title = '企业类型';
            getChartOption(enterpriseStyle,'pie', xAxis,null, series, title);
        }
    }


}
function renderTrafficGrowthChart(data) {
    var xAxis = [];
    var y0 = [];
    var y1 = [];
    var buckets = data.aggregations.result.buckets;
    if(buckets) {
        for (var i = 0; i < buckets.length; i++) {
            xAxis.push(buckets[i].key_as_string);
            y1.push(buckets[i].doc_count);
            var rate = 0;
            if(i>0 && buckets[i-1].doc_count!=0){
                rate = (buckets[i].doc_count-buckets[i-1].doc_count)/buckets[i-1].doc_count*100;

            }
            y0.push(rate);
        }
        var option = {
            legend: {},
            tooltip: {
                trigger: 'axis',
                formatter:function(params){
                    return params[0].value+'%';
                }
            },
            xAxis: [
                {
                    type: 'category',
                    data: xAxis,
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel: {
                        interval:0,
                        rotate:40
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '增长率',
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },
                {
                    type: 'value',
                    name: '访问量',
                }
            ],
            series: [
                {
                    name:'增长率',
                    type:'line',
                    data:y0
                },
                {
                    name:'访问量',
                    type:'bar',
                    yAxisIndex: 1,
                    label:barLabel,
                    data:y1
                }
            ]
        };
        trafficGrowthMap.setOption(option);
    }
}
var quarterIndex={
    "01":1,
    "04":2,
    "07":3,
    "10":4
}
//用户访问量
function renderUserViewChart(data) {
    var buckets = data.aggregations.result.buckets;
    var timeStr,timeArr;
    if (buckets) {
        var buckets = data.aggregations.result.buckets;
        var titleArr = [];
        var sessionArr = [];
        var userArr = [];
        var ipArr = [];
        var total = 0;

        for (var i = 0; i < buckets.length; i++) {
            timeStr = buckets[i].key_as_string;
            if (timeType == "quarter") {
                timeArr = timeStr.split("-");
                timeStr = timeArr[0] + "-" + quarterIndex[timeArr[1]] + "季度";
            } else if (timeType == "week") {
                timeStr += "周";
            }
            titleArr.push(timeStr);
            var sessionCount = buckets[i].sessionCount.value;
            if (sessionCount != null || sessionCount != undefined) {
                sessionArr.push(sessionCount);
                total = total + sessionCount;
            } else {
                sessionArr.push(0);
            }
            userArr.push(buckets[i].userCount.value);
            ipArr.push(buckets[i].ipCount.value);
        }
        var avg = 0;
        if (titleArr.length > 0) {
            avg = total / titleArr.length;
        }
        $("#total").html(total);
        $("#avg").html(avg.toFixed(2));
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['session量','用户量',"ip量"]
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:titleArr
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'session量',
                    type:'line',
                    areaStyle: {},
                    data:sessionArr
                },
                {
                    name:'用户量',
                    type:'line',
                    areaStyle: {},
                    data:userArr
                },
                {
                    name:'ip量',
                    areaStyle: {},
                    type:'line',
                    data:ipArr
                }
            ]
        };
        userViewMap.setOption(option);
    }
}
//时间内均用户访问量
function renderUserViewAgvChart(data) {
    var buckets = data.aggregations.result.buckets;
    var timeStr,timeArr;
    if (buckets) {
        var buckets = data.aggregations.result.buckets;
        var titleArr = [];
        var sessionArr = [];
        var userArr = [];
        var ipArr = [];
        for (var i = 0; i < buckets.length; i++) {
            timeStr = buckets[i].key_as_string;
            if(timeType == "quarter"){
                timeArr = timeStr.split("-");
                timeStr=timeArr[0]+"-"+quarterIndex[timeArr[1]]+"季度";
            } else if (timeType =="week"){
                timeStr +="周";
            }
            titleArr.push(timeStr);

            if(buckets[i].sessionCount.value == null){
                sessionArr.push(0);
            }else {
                sessionArr.push(buckets[i].sessionCount.value);
            }
            if(buckets[i].userCount.value == null){
                userArr.push(0);
            }else {
                userArr.push(buckets[i].userCount.value);
            }
            if(buckets[i].ipCount.value == null){
                ipArr.push(0);
            }else {
                ipArr.push(buckets[i].ipCount.value);
            }
        }
        var option = {
            title: {
                text: '用户访问量'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['session量','用户量',"ip量"]
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:titleArr
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'session量',
                    type:'line',
                    data:sessionArr
                },
                {
                    name:'用户量',
                    type:'line',
                    data:userArr
                },
                {
                    name:'ip量',
                    type:'line',
                    data:ipArr
                }
            ]
        };
        userViewAgvMap.setOption(option);
    }
}

//重复访问用户量
function renderRepVisUserCountChart(data) {
    var buckets = data.aggregations.result.buckets;
    var userCount = data.userCount;
    var registerCounts = data.registerCounts;
    var timeStr,timeArr;
    if (buckets) {
        var buckets = data.aggregations.result.buckets;
        var titleArr = [];
        var repeatCountArr = [];
        var userCountMap = {};
        var userCountArr = [];
        var fragmentCount = 0;
        for (var i = registerCounts.length-1; i >= 0; --i) {
            userCountMap[registerCounts[i].days] = userCount - fragmentCount;
            fragmentCount += registerCounts[i].counts;
        }
        for (var i = 0; i < buckets.length; i++) {
            timeStr = buckets[i].key_as_string;
            if(userCountMap[timeStr] == undefined){
                userCountArr.push(userCount);
            }else{
                userCountArr.push(userCountMap[timeStr]);
            }
            if(timeType == "quarter"){
                timeArr = timeStr.split("-");
                timeStr=timeArr[0]+"-"+quarterIndex[timeArr[1]]+"季度";
            } else if (timeType =="week"){
                timeStr +="周";
            }
            titleArr.push(timeStr);
            repeatCountArr.push(buckets[i].repeatCount.value);
        }

        var option = {
            title: {
                text: '重复访问用户量'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['重复访问用户量','用户量']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:titleArr
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'重复访问用户量',
                    type:'line',
                    data:repeatCountArr
                },
                {
                    name:'用户量',
                    type:'line',
                    data:userCountArr
                }
            ]
        };
        repVisUserCountMap.setOption(option);
    }
}
function renderVisitDepthChart(data) {
    var userList = data.userResult.data;
    var pageList = data.pageResult.data;
    var source = [];
    var titleArr = [];
    var totalArr = [];
    var userArr = [];
    var touristsArr = [];
    for (var i = 0; i < pageList.length; i++) {
        var pv_count = pageList[i].pv_count;
        var pv_user_count = pageList[i].pv_user_level_count;
        var uv_count = 1;
        var uv_user_count = 1;
        if(userList[i]){
            uv_count = userList[i].uv_session_count || 1;
            uv_user_count = userList[i].uv_user_count || 1;
        }
        titleArr.push(pageList[i].pv_time);
        if(pv_count == null || pv_count == 'undefined'){
            totalArr.push(0);
        }else {
            totalArr.push((pv_count/uv_count).toFixed(2));
        }
        if(pv_user_count == null || pv_user_count == 'undefined'){
            userArr.push(0);
        }else {
            userArr.push((pv_user_count/uv_user_count).toFixed(2));
        }
        var touristsValue = ((pv_count-pv_user_count)/((uv_count-uv_user_count) || 1)).toFixed(2)
        if (isNaN(touristsValue)){
            touristsValue = 0;
        }
        touristsArr.push(touristsValue);
    }
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['总访问','用户访问',"游客访问"]
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data:titleArr
        },
        yAxis: {
            type: 'value',
            name: '平均深度',
        },
        series: [
            {
                name:'总访问',
                type:'line',
                areaStyle: {},
                data:totalArr
            },
            {
                name:'用户访问',
                type:'line',
                areaStyle: {},
                data:userArr
            },
            {
                name:'游客访问',
                areaStyle: {},
                type:'line',
                data:touristsArr
            }
        ]
    };
   /* var barOption = {
        legend: {},
        tooltip: {},
        dataset: {
            source: source
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                interval:0,
                rotate:40
            }
        },
        grid: [
            {bottom: '35%'}
        ],
        yAxis: {
            type: 'value',
            name: '平均深度',
        },
        series: [
            {type: 'bar',label:barLabel},
            {type: 'bar',label:barLabel},
            {type: 'bar',label:barLabel}
        ]
    };*/
    visitDepthMap.setOption(option);

}
function renderMaxVisitPageChart(data) {
    var buckets = data.aggregations.result.buckets;
    if (buckets) {
        var buckets = data.aggregations.result.buckets;
        var source = [];
        var keyArr = [];
        source.push(new Array('page', '总访问', '用户访问', '游客访问'));
        for (var i = 0; i < buckets.length; i++) {
            keyArr.push(buckets[i].key);
            source.push(new Array(buckets[i].key, buckets[i].doc_count, buckets[i].doc_count-buckets[i].result.doc_count,buckets[i].result.doc_count));
        }

        var barOption = {
            legend: {},
            tooltip: {},
            dataset: {
                source: source
            },
            xAxis: {type: 'category',data:keyArr,
                axisLabel: {
                    interval:0,
                    rotate:40
                }
            },
            grid: [
                {bottom: '35%'}
            ],
            yAxis: {},
            series: [
                {type: 'bar',label:barLabel},
                {type: 'bar',label:barLabel},
                {type: 'bar',label:barLabel}
            ]
        };
        maxVisitPageMap.setOption(barOption);
    }
}
function getChartOption(tab,type, xAxis, yAxis,series, title) {
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
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 70,
                bottom: 20,
                data: xAxis
            },
            series: [ {
                name: title,
                type: 'pie',
                radius : '55%',
                center: ['30%', '40%'],
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
    }else if (type == "area"){
        option = {
            title: {
                text: title
            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data:['留存率']
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : xAxis
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel: {
                        formatter: '{value} %'
                    }
                }
            ],
            series : series
        };
    }else if (type = "multipleY"){
        option = {
            legend: {},
            tooltip: {
                trigger: 'axis',
                formatter:function(params){
                    return params[0].value;
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: [
                {
                    type: 'category',
                    data: xAxis,
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel: {
                        interval:0,
                        rotate:40
                    }
                }
            ],
            yAxis: yAxis,
            series: series
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