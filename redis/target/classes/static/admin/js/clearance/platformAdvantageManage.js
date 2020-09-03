//  列表查询路径 /admin/platformAdvantage/query  post
$table = $('#table')
$(function () {
    initPage();
});

function initPage() {
    $table.bootstrapTable({
        height: getHeight(),
        toolbar: '#toolbar',
        url: '/platformAdvantage/query',
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
        pager: pager,
        sortPointer:sortPointer
    };
    return postData;
}
