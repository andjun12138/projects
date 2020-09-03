//  列表查询路径 /admin/demand/query  POST 默认传参数  status = 202093
//全局变量
/*
 * create by mujun at 2018/8/6
 */
var $table = $("#table"),
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
        url: '/admin/secretApply/query',
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
    for(var i = 0; i < length; i++){
        //需求名称
        data[i].name = '<a target="_blank" href="/admin/secretApply/'+data[i].id+'/to_create_update.html">'+data[i].name+'</a>';
        //
        data[i].nature = JSON.parse(data[i].nature).title;
        data[i].companySize = JSON.parse(data[i].companySize).title;
        if(!!data[i].status) {
            data[i].status = JSON.parse(data[i].status).title;
        }else {
            data[i].status = '-'
        }
        data[i].createdAt = getMyDate(data[i].createdAt);

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
        sortPointer:sortPointer,
        // status: 202093
    };
    if(!!searchOptions.name)postData['name'] = searchOptions.name;
    if(!!searchOptions.nature)postData['nature'] = searchOptions.nature;
    if(!!searchOptions.status)postData['status'] = searchOptions.status;
    if(!!searchOptions.companySize)postData['companySize'] = searchOptions.companySize;
    if(!!searchOptions.phone)postData['phone'] = searchOptions.phone;
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
    searchOptions['nature'] = $("#nature").val();
    searchOptions['status'] = $("#status").val();
    searchOptions['companySize'] = $("#companySize").val();
    searchOptions['phone'] = $("#phone").val();
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

function openRelativeDialog(url) {
    var index = layer.open({
        type: 2,
        content: url,
        area: ['1000px', '600px'],
        maxmin: true,
        shadeClose: true,
        title: '关联选择',
        success: function(layero, index){
        }
    });
    layer.full(index);
}
function handleRelevance(data) {
    var info = data.data;
    $('#front_user_id').val(info[0].nickname);
    $('#front_user_id').attr('data-id',info[0].id);
}