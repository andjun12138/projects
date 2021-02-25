/**
 * Created by Bingo on 2018/8/6.
 */

/** 查询优质企业列表:  /admin/enterprise/query
 *  请求方式：post
 *  参数：json对象
 **/
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
        url: '/admin/enterprise/query',
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
         //成果名称
         data[i].name = '<a target="_blank" href="/admin/enterprise/'+data[i].id+'/to_create_update.html">'+data[i].name+'</a>';
         //    处理状态
        if(data[i].status != null){
            data[i].status = JSON.parse(data[i].status).title;
        }
        if(data[i].certification_status != null){
            data[i].certification_status = JSON.parse(data[i].certification_status).title;
        }
        if(data[i].field != null){
            data[i].field = JSON.parse(data[i].field).title;
        }
        if(data[i].nature != null){
            data[i].nature = JSON.parse(data[i].nature).title;
        }
        if(!!data[i].front_user_id){
            data[i].front_user_id = JSON.parse(data[i].front_user_id).nickname;
        }
        data[i].shown = data[i].shown == true ? '是':'否';
        data[i].placed_top = data[i].placed_top == true ? '是':'否';
        data[i].recommended = data[i].recommended == true ? '是':'否';
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
    if(!!searchOptions.field)postData['field'] = searchOptions.field;
    if(!!searchOptions.nature)postData['nature'] = searchOptions.nature;
    if(!!searchOptions.contact)postData['contact'] = searchOptions.contact;
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
    searchOptions['contact'] = $("#contact").val();
    searchOptions['nature'] = $("#nature").val();
    searchOptions['field'] = $("#field").val();
}

/**
 * 跳转到企业新增或者修改页面：/admin/enterprise/{enterpriseId}/to_create_update
 */

/**
 * 删除企业：/admin/enterprise/delete
 * 请求方式：get
 * 请求参数：enterpriseId
 */

/**
 * 审核通过 /admin/enterprise/pass
 * 请求方式：post
 * 请求参数：对象，需求要对象的id
 */

/**
 * 审核不通过 /admin/enterprise/disagree
 * 请求方式：post
 * 请求参数：对象，需求要对象的id
 */



