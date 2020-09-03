/**
 * Created by Bingo on 2018/10/26.
 */
var $table = $('#table'),
    $searchPart = $("#search-part"),
    $search = $("#search"),
    $toggleSearch = $("#toggle-search");
var searchOptions = {};
var SEARCHING = false;
$(function () {
    initPage();
});
function initPage() {
    $table.bootstrapTable({
        height: getHeight(),
        toolbar: '#toolbar',
        url: '/admin/frontService/query',
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
        });
}

//列表数据请求成功的回调
function responseHandler(res) {
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
/**
  跳转到列表页面
  路径：/admin/frontService/manage.html       GET
  返回页面：admin/frontService/manage
 */

/**
  列表数据查询
  路径：/admin/frontService/query      POST
  参数：对象（需要分页）
        "sortPointer":{//分页信息
             "order":"desc",   //排序
              "field":"updated_at"  //排序字段
         }
         "pager":{//分页信息
             "current":1,   //当前页数
              "size":4        //每页条数
         }
 */


/*
    跳转到编辑页面
    路径：/admin/frontService/{frontServiceId}/{type}/to_create_update.html    GET
    type为0时则进行新增或者修改页面，type为1时则进行查看操作
    参数：frontServiceId  type
    注入参数：frontService
    返回页面：admin/frontService/newFrontService
*/


/*
    创建或者修改
    路径：/admin/frontService/create_update   POST
    参数：对象
    {
        姓名：name
        联系方式：phone
        内容：content
    }
*/

/*
     删除
     路径：/admin/frontService/delete/{frontServiceId}   POST
     参数：frontServiceId
 */