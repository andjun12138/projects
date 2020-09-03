/**
 * Created by mu-HUN on 2018/9/19.
 */
var $table = $('#table');
$(function () {
    initPage();
});

function initPage() {
    $table.bootstrapTable({
        height: '400',
        toolbar: '#toolbar',
        url: '/admin/statisticalController/realTimeOverview',
        method: 'post',
        responseHandler: responseHandler,
        queryParams: queryParams,
        striped: true,
        showRefresh: true,
        showColumns: true,
        minimumCountColumns: 2,
        pagination: false,
        pageList: "[15, 20, 25, 50, 100]",
        pageNumber: 1,
        pageSize: 15,
        showFooter: false,
        sidePagination: "server",
        clickToSelect:true
    });
    $(document).on('click', '#refresh', function (e) {
        e.stopPropagation();
        $table.bootstrapTable('refresh');
    })
}

//列表数据请求成功的回调
function responseHandler(res) {
    // var length = res.data.data_list.length;
    var data = res.data.data_object;
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
    return postData;
}
jQuery.download = function(url, data, method){ // 获得url和data
    if( url && data ){
        // data 是 string 或者 array/object
        data = typeof data == 'string' ? data : jQuery.param(data); // 把参数组装成 form的 input
        var inputs = '';
        jQuery.each(data.split('&'), function(){
            var pair = this.split('=');
            inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />';
        }); // request发送请求
        jQuery('<form action="'+ url +'" method="post"'+ 'enctype="application/x-www-form-urlencoded">'+inputs+'</form>').appendTo('body').submit().remove();
    };
};