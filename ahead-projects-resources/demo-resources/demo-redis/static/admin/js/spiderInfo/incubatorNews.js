// 获取列表接口 /admin/industryInformation/query
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
    var date = new Date();
    var picker1 = $('#publishDateStart').datetimepicker({
        locale: moment.locale('zh-cn'),
        format: "YYYY-MM-DD"
    });
    var picker2 = $('#publishDateEnd').datetimepicker({
        locale: moment.locale('zh-cn'),
        format: "YYYY-MM-DD"
    });
    picker1.on('dp.change', function (e) {
        picker2.data('DateTimePicker').minDate(e.date);
    });
    //动态设置最大值
    picker2.on('dp.change', function (e) {
        picker1.data('DateTimePicker').maxDate(e.date);
    });
    $table.bootstrapTable({
        height: getHeight,
        toolbar: '#toolbar',
        url: '/spiderInfo/incubatorNews/query',
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
    $table.on('expand-row.bs.table', function (e, index, row, $detail) {
        var html = [];
        $.each(row, function (key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return $detail.html(html);
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
            // initSearchOptions();
            searchInfo(true,'#table');
        })
        .on('keydown','input.search-control',function (e) {
            e.stopPropagation();
            if(e.keyCode == "13") {
                // initSearchOptions();
                searchInfo(true,'#table');
            }
        })
        .on('change','select.search-control',function (e) {
            e.stopPropagation();
            // initSearchOptions();
            searchInfo(true,'#table');
        });
}

//列表数据请求成功的回调
function responseHandler(res) {
    var length = res.data.data_list.length;
    var data = res.data.data_list;
    for(var i = 0;i < length;i++) {
        data[i].url = '<a target="_blank" href="'+data[i].url+'">'+data[i].url+'</a>';
        data[i].title = '<a target="_blank" href="/spiderInfo/incubatorNews/edit/'+data[i].id+'.html">'+data[i].title+'</a>';
        if(null != data[i].publishDate){
            data[i].publishDate = getMyDate(data[i].publishDate);
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
    sortPointer.filed = "publish_date";
    var postData = {
        pager: pager,
        sortPointer:sortPointer
    };
    if(!!searchOptions.title)postData['title'] = searchOptions.title;
    if(!!searchOptions.author)postData['author'] = searchOptions.author;
    if(!!searchOptions.publishDateStart)postData['publishDateStart'] = searchOptions.publishDateStart;
    if(!!searchOptions.publishDateEnd)postData['publishDateEnd'] = searchOptions.publishDateEnd;
    return postData;
}
//初始化搜索内容
function initSearchOptions() {
    searchOptions['title'] = $("#title").val();
    // searchOptions['author'] = $("#author").val();
    searchOptions['publishDateStart'] = $("#publishDateStart").val();
    searchOptions['publishDateEnd'] = $("#publishDateEnd").val();
    searchOptions['author'] = $("#author").val();
}
function searchInfo(flag,selector){
    SEARCHING = !!flag;
    initSearchOptions();
    if (SEARCHING) $(selector).bootstrapTable('refresh', {pageNumber:1}); // 重置页码
    else $(selector).bootstrapTable(('refresh'));
}
// 获取bootstrap table高度
function getHeight() {
    var searchHeight = 0;
    if($("#search-part").css('display') !== 'none') {
        searchHeight = $('#search-part').height();
    }
    return $(window).height() - 20 - searchHeight;
}


