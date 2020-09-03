// 搜索路径 /selectItem/query  默认要传 pid = 202088
// 多选删除接口  /admin/demand/style/batch_delete  POST  参数selectItemIds
/*
 * create by mujun at 2018/8/6
 */
//全局变量
var $table = $('#table'),
    $searchPart = $("#search-part"),
    $search = $("#search"),
    $toggleSearch = $("#toggle-search");
var searchOptions = {};
var SEARCHING = false;
$(function(){
    initPage();
});
//初始化页面
function initPage() {
    $table.bootstrapTable({
        height: getHeight(),
        toolbar: '#toolbar',
        url: '/admin/qualification/query',
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
    setTimeout(function () {
        $table.bootstrapTable('resetView');
    }, 200);
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
    // var length = res.data.data_list.length;
    var data = res.data.data_list;
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
        pid: 202088,
        pager: pager,
        sortPointer:sortPointer
    };
    if(!!searchOptions.name)postData['name'] = searchOptions.name;
    return postData;
}
//搜索
function searchInfo(flag){
    SEARCHING = !!flag;
    initSearchOptions();
    if (SEARCHING) $('#table').bootstrapTable('refresh', {pageNumber:1}); // 重置页码
    else $table.bootstrapTable(('refresh'));
}
//初始化搜索内容
function initSearchOptions() {
    searchOptions['name'] = $("#name").val();
}


// 报表勾选获取信息通用接口  -- 接收参数类型，空值、字符串、字符串数组
function getSelectionMessage(option) {
    if(typeof option === 'undefined') {
        return [];
    } else if(typeof option === 'string') {
        return $.map($table.bootstrapTable('getSelections'), function (row) {
            var obj = {};
            var tempName = row[option] + '';
            if(tempName.indexOf('<a') !== -1) {
                tempName = $(tempName).text();
            }
            obj[option] = tempName;
            return obj;
        });
    } else {
        return $.map($table.bootstrapTable('getSelections'), function (row) {
            var obj = {};
            for(var i = 0, len = option.length; i < len; i++) {
                var tempName = row[option[i]] + '';
                if(tempName.indexOf('<a') !== -1) {
                    tempName = $(tempName).text();
                }
                obj[option[i]] = tempName;
            }
            return obj;
        });
    }
}
// 刷新列表
function refreshTable() {
    $table.bootstrapTable('refresh');
}