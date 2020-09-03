/**
 * Created by mu-HUN on 2018/9/6.
 */
$allTable = $('#allTable'),
    $bugTable = $('#bugTable'),
    $saleTable = $('#saleTable'),
    $searchPart = $("#search-part"),
    $search = $("#search"),
    $toggleSearch = $("#toggle-search");
var timeType;
var timeRange;
var searchPadDiv;
var tableName = $('#tableName').val();
var allTimes;
var bugTimes;
var saleTimes;

var all;

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
    initAllTable();
    $(document).on('click','#fieldTab a',function (e) {
        //tab栏切换
        if($(this).attr('href') == '#all'){
            console.log("all")
            initAllTable();
        } else if($(this).attr('href') == '#bug'){
            console.log("bug");
            initBugTable();
        }else if($(this).attr('href') == '#sale'){
            console.log("sale")
            initSaleTable();
        }
        e.stopPropagation();
        $(this).tab('show');
    }).on('change','.search-control',function (e) {
        e.stopPropagation();
        getData();
    })
}

function initAllTable() {
    searchPadDiv = 'all';
    $allTable.bootstrapTable({
        height: getHeight(),
        toolbar: '#toolbar',
        url: '/cost/getRecords',
        method: 'post',
        responseHandler: allResponseHandler,
        queryParams: allQueryParams,
        striped: true,
        showRefresh: false,
        showColumns: false,
        showToggle: false,
        detailView: false,
        minimumCountColumns: 2,
        pagination: true,
        pageList: "[15, 20, 25, 50, 100]",
        pageNumber: 1,
        pageSize: 15,
        showFooter: false,
        sidePagination: "server",
        clickToSelect:true
    });
    $allTable.on('expand-row.bs.table', function (e, index, row, $detail) {
        var html = [];
        $.each(row, function (key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return $detail.html(html);
    });
}

function initBugTable() {
    searchPadDiv = 'bug';
    $bugTable.bootstrapTable({
        height: getHeight(),
        toolbar: '#toolbar',
        url: '/cost/getRecords',
        method: 'post',
        responseHandler: bugResponseHandler,
        queryParams: bugQueryParams,
        striped: true,
        showRefresh: false,
        showColumns: false,
        showToggle: false,
        detailView: false,
        minimumCountColumns: 2,
        pagination: true,
        pageList: "[15, 20, 25, 50, 100]",
        pageNumber: 1,
        pageSize: 15,
        showFooter: false,
        sidePagination: "server",
        clickToSelect:true
    });
    $bugTable.on('expand-row.bs.table', function (e, index, row, $detail) {
        var html = [];
        $.each(row, function (key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return $detail.html(html);
    });
}

function initSaleTable() {
    searchPadDiv = 'sale';
    $saleTable.bootstrapTable({
        height: getHeight(),
        toolbar: '#toolbar',
        url: '/cost/getRecords',
        method: 'post',
        responseHandler: saleResponseHandler,
        queryParams: saleQueryParams,
        striped: true,
        showRefresh: false,
        showColumns: false,
        showToggle: false,
        detailView: false,
        minimumCountColumns: 2,
        pagination: true,
        pageList: "[15, 20, 25, 50, 100]",
        pageNumber: 1,
        pageSize: 15,
        showFooter: false,
        sidePagination: "server",
        clickToSelect:true
    });
    $saleTable.on('expand-row.bs.table', function (e, index, row, $detail) {
        var html = [];
        $.each(row, function (key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return $detail.html(html);
    });
}

//列表数据请求成功的回调
function saleResponseHandler(res) {
    // var length = res.data.data_list.length;
    var data = res.list;
    return {
        "total": data.length,//总页数
        "rows": data  //数据
    };
}
//列表数据请求成功的回调
function bugResponseHandler(res) {
    var data = res.list;
    return {
        "total": data.length,//总页数
        "rows": data  //数据
    };
}

function bugResponseHandler(res) {
    var data = res.list;
    return{
        "total" : data.length,
        "rows" : data
    }
}

function allResponseHandler(res) {
    var data = res.list;
    return {
        "total":data.length,
        "rows":data
    }
}


//列表数据请求成功的回调
function allResponseHandler(res) {
    // var length = res.data.data_list.length;
    var data = res.list;
    return {
        "total": data.length,//总页数
        "rows": data  //数据
    };
}


//请求数据的传参
function saleQueryParams(params) {
    var postData = {
        times: $('#saleTimes').val(),
        tableName: tableName,
        type :"sale"
    }
    return postData;
}

//请求数据的传参
function bugQueryParams(params) {
    var postData = {
        times: $('#bugTimes').val(),
        tableName: tableName,
        type :"bug"
    }
    return postData;
}

//请求数据的传参
function allQueryParams(params) {
    var postData = {
        times: $('#allTimes').val(),
        tableName: tableName,
        type :"all"
    }
    return postData;
}

function getData() {
    //新增用户注册数的
    if (searchPadDiv == 'all'){
        $allTable.bootstrapTable(('refresh'));
    }else if(searchPadDiv == 'bug'){//
        $bugTable.bootstrapTable(('refresh'));
    }else if(searchPadDiv == 'sale'){
        $saleTable.bootstrapTable(('refresh'));
    }
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

function setTimeFormat2(date,timeLength) {
    if(!!timeLength){
        var year = date.getFullYear();
        var month = date.getMonth() + 1 -timeLength;
        if(month < 0){
            month = 12 - Math.abs(month);
            year = year - 1;
        }
        month = month < 10 ? '0' + month : month;
        var day = date.getDate();
        day = day < 10 ? ('0' + day):day;

    }
}
