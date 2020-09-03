var $table = $('#table'),
    $searchPart = $("#search-part"),
    $search = $("#search"),
    $toggleSearch = $("#toggle-search");
var searchOptions = {};
var SEARCHING = false;
$(function () {
    initPage();
});
//初始化页面
function initPage() {
    $table.bootstrapTable({
        height: getHeight(),
        toolbar: '#toolbar',
        url: '/equipment/query',
        method: 'post',
        responseHandler: responseHandler,
        queryParams: queryParams,
        striped: true,
        showRefresh: true,
        showColumns: true,
        showToggle: true,
        detailView: true,
        minimumCountColumns: 2,
        pagination: true,
        pageList: "[15, 20, 25, 50, 100]",
        pageNumber: 1,
        pageSize: 15,
        showFooter: false,
        sidePagination: "server",
        clickToSelect:true
    });
    $(document).on('click','#toggle-search',function (e) {
        e.stopPropagation();
        if($searchPart.css('display') === 'none') {
            $toggleSearch.html('<i class="icon-angle-up"></i> 收起搜索');
        }else {
            $toggleSearch.html('<i class="icon-angle-down"></i> 展开搜索');
            searchOptions={};
            $('#table').bootstrapTable('refresh', {pageNumber:1});
        }
        $searchPart.slideToggle(function(){
            $table.bootstrapTable('resetView', {
                height: getHeight()
            });
        });
        $search.toggle();
    })
        .on('click','#search',function(e) {
            e.stopPropagation();
            searchInfo(true);
        })
        .on('keydown','input.search-control',function (e) {
            e.stopPropagation();
            if(e.keyCode == "13") {
                searchInfo(true);
            }
        })
        .on('change','select.search-control',function (e) {
            e.stopPropagation();
            searchInfo(true);
        });
}
//列表数据请求成功的回调
function responseHandler(res) {
    var length = res.data.data_list.length;
    var data = res.data.data_list;
    for(var i = 0;i < length;i++) {
        data[i].name = '<a target="_blank" href="/equipment/to_create_update/'+data[i].id+'.html">'+data[i].name+'</a>';
        data[i].buyTime = formatTime(data[i].buyTime, false, 'YYYY-MM-DD HH:mm:ss');
        if(!!data[i].status){
            data[i].status = JSON.parse(data[i].status).title;
        }

        if(!!data[i].bigType){
            data[i].bigType = JSON.parse(data[i].bigType).title;
        }

        if(!!data[i].smallType){
            data[i].smallType = JSON.parse(data[i].smallType).title;
        }

        if(!!data[i].reserveType){
            data[i].reserveType = JSON.parse(data[i].reserveType).title;
        }

        if(!!data[i].reserveWay){
            data[i].reserveWay = JSON.parse(data[i].reserveWay).title;
        }

        if(!!data[i].backCheckStatus){
            data[i].backCheckStatus = JSON.parse(data[i].backCheckStatus).title;
        }

        if(!!data[i].backCheckTime){
            data[i].backCheckTime = formatTime(data[i].backCheckTime, false, 'YYYY-MM-DD HH:mm:ss');
        }

    }
    return {
        "total": res.data.total,//总页数
        "rows": data  //数据
    };
}
//请求数据的传参
function queryParams(params) {
    var pager = {};
    pager.current = params.offset/params.limit + 1;
    pager.size = params.limit ;
    var sortPointer = {};
    sortPointer.order = 'DESC';
    var postData = {
        pager: pager,
        sortPointer:sortPointer
    };
    if(!!searchOptions.name)postData['name'] = searchOptions.name;
    if(!!searchOptions.model)postData['model'] = searchOptions.model;
    if(!!searchOptions.belongUnit)postData['belongUnit'] = searchOptions.belongUnit;
    if(!!searchOptions.manufacturerName)postData['manufacturerName'] = searchOptions.manufacturerName;
    if(!!searchOptions.backCheckStatus)postData['backCheckStatus'] = searchOptions.backCheckStatus;
    return postData;
}

//搜索
function searchInfo(flag){
    SEARCHING = !!flag;
    initSearchOptions();
    if (SEARCHING) $('#table').bootstrapTable('refresh', {pageNumber:1}); // 重置页码
    else $table.bootstrapTable(('refresh'));
}

function initSearchOptions() {
    searchOptions['name'] = $("#name").val();
    searchOptions['model'] = $("#model").val();
    searchOptions['belongUnit'] = $("#belongUnit").val();
    searchOptions['manufacturerName'] = $("#manufacturerName").val();
    searchOptions['backCheckStatus'] = $("#backCheckStatus").val();
}



