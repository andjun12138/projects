/*
 * create by mujun at 2018/8/6
 */
//变量
var $table = $('#table'),
    $searchPart = $("#search-part"),
    $search = $("#search"),
    $toggleSearch = $("#toggle-search");
var searchOptions = {};
var SEARCHING = false;
$(function () {
    initPage();
})
/** 查询成果列表:  /admin/service/query
 *  请求方式：post
 *  参数：空json对象
**/
function initPage() {
    var date = new Date();
    console.log(date)
    var picker1 = $('#star_time').datetimepicker({
        locale: moment.locale('zh-cn'),
        format: "YYYY-MM-DD"
    });
    var picker2 = $('#end_time').datetimepicker({
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
        height: getHeight(),
        toolbar: '#toolbar',
        url: '/admin/services/query',
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
    for(var i = 0;i < length;i++) {
        //成果名称
        if(data[i].title == null || data[i].title == ''){
            data[i].title = '';
        }else{
            data[i].title = '<a target="_blank" href="/admin/services/'+data[i].id+'/to_create_update.html">'+data[i].title+'</a>';
        }
    //    处理状态
    //     data[i].data_status = data[i].status;
        if(data[i].status != null){
            data[i].status = JSON.parse(data[i].status).title;
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
    if(!!searchOptions.title)postData['title'] = searchOptions.title;
    if(!!searchOptions.status)postData['status'] = searchOptions.status;
    if(!!searchOptions.serviceProvider)postData['serviceProvider'] = searchOptions.serviceProvider;
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
    searchOptions['title'] = $("#title").val();
    searchOptions['status'] = $("#status").val();
    searchOptions['serviceProvider'] = $("#serviceProvider").val();
}
/**
 * 跳转到成果新增或者修改页面：/admin/result/{resultId}/to_create_update.html
 */

/**
 * 删除成果：/admin/result/delete
 * 请求方式：get
 * 请求参数：resultId
 */

/**
 * 审核通过：/admin/result/pass
 * 请求方式：post
 * 请求参数：json对象（对象的id）
 */

/**
 * 审核不通过：/admin/result/disagree
 * 请求方式：post
 * 请求参数：json对象（对象的id）
 */