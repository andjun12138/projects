// 获取列表接口 /admin/incubatorArticle/query
var $table = $('#table'),
    $searchPart = $("#search-part"),
    $search = $("#search"),
    $toggleSearch = $("#toggle-search");
var searchOptions = {};
var SEARCHING = false;

// 关联展示类型
var SINGLE_CHOICE = 1011,
    MULTIPLE_CHOICE = 1012,
    MULTIPLE_TREE_CHOICE = 1013;

$(function () {
    initPage();
});
//初始化页面
function initPage() {
    var myColumns = [
        {
            checkbox: true,
            field: 'state'
        },
        {
            title: '标题',
            field: 'title',
            align: 'center'
        },
        {
            title: '类型',
            field: 'type',
            align: 'center',
            sortable: true
        },
        {
            title: '作者',
            field: 'author',
            align: 'center'
        },
        {
            title: '点击量',
            field: 'clickRate',
            align: 'center',
            sortable: true
        },
        {
            title: '状态',
            field: 'published',
            align: 'center',
        },
        {
            title: '发布时间',
            field: 'publishDate',
            align: 'center',
            sortable: true
        },
        {
            title: '推荐',
            field: 'recommended',
            align: 'center'
        },
        {
            title: '推荐指数',
            field: 'recommendedIndex',
            align: 'center',
            sortable: true
        }
    ];


    var date = new Date();
    var picker1 = $('#releaseTimeStart').datetimepicker({
        format: 'yyyy-mm-dd', //显示格式
        language: 'zh-CN',
        todayHighlight: 1,
        minView: 2,
        todayBtn: true,
        autoclose: true
    });
    var picker2 = $('#releaseTimeEnd').datetimepicker({
        format: 'yyyy-mm-dd', //显示格式
        language: 'zh-CN',
        todayHighlight: 1,
        minView: 2,
        todayBtn: true,
        autoclose: true
    });
    picker1.on('dp.change', function (e) {
        picker2.data('DateTimePicker').minDate(e.date);
    });
    //动态设置最大值
    picker2.on('dp.change', function (e) {
        picker1.data('DateTimePicker').maxDate(e.date);
    });
    $table.bootstrapTable({
        columns: myColumns,
        slientSort: false,
        height: getHeight,
        toolbar: '#toolbar',
        url: '/clearanceNews/query',
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
        if(null != data[i].type){
            data[i].type = JSON.parse(data[i].type).title
        }
        if(null != data[i].publishDate){
            data[i].publishDate = getMyDate(data[i].publishDate);
        }
        if(null != data[i].publishDate){
            data[i].recommended = data[i].recommended ? '是' : '否'
        }
        console.log(data[i].published);
        if(null != data[i].published){
            console.log(data[i].published);
            data[i].published = data[i].published ? '已发布' : '待发布'
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
    if(!!params.sort){
        var paramsFiled = params.sort;
        var filed = paramsFiled.replace(/([A-Z])/g,"_$1").toLowerCase();
        sortPointer.order = params.order;
        sortPointer.filed = filed;
    }else {
        sortPointer.order = 'DESC';
        sortPointer.filed = "updated_at";
    }
    var postData = {
        // pid: 202088,
        pager: pager,
        sortPointer:sortPointer
    };
    if(!!searchOptions.title)postData['title'] = searchOptions.title;
    if(!!searchOptions.author)postData['author'] = searchOptions.author;
    if(!!searchOptions.releaseTimeStart)postData['publishStartTime'] = searchOptions.releaseTimeStart;
    if(!!searchOptions.releaseTimeEnd)postData['publishEndTime'] = searchOptions.releaseTimeEnd;
    return postData;
}
//初始化搜索内容
function initSearchOptions() {
    searchOptions['title'] = $("#title").val();
    // searchOptions['author'] = $("#author").val();
    searchOptions['releaseTimeStart'] = $("#releaseTimeStart").val();
    searchOptions['releaseTimeEnd'] = $("#releaseTimeEnd").val();
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

// 关联选择框的打开
function openRelativeDialog(event) {
    var target = $(event.currentTarget);
    var url = target.attr('data-url');
    var bindField = target.attr('data-bind-field');
    var fieldType = target.attr('data-field-type');
    var id = target.attr('data-id');
    var name = target.attr('data-title');
    var selector = target.attr('data-name');
    // 处理url问题
    if(url === 'undefined') {
        var tempVal = $('[name="'+bindField+'"]').val();
        url = formFieldsData[selector]['reference_link_'+tempVal];
    }
    var title =  '';
    switch(parseInt(fieldType)) {
        case SINGLE_CHOICE:
            title = '关联单项选择';
            break;
        case MULTIPLE_CHOICE:
            title = '关联多项选择';
            break;
        case MULTIPLE_TREE_CHOICE:
            title = '关联多项（树形）选择'
            break;
        default:
            title = '关联选择'
    }
    var index = layer.open({
        type: 2,
        content: url,
        area: ['1000px', '600px'],
        maxmin: true,
        shadeClose: true,
        title: title,
        success: function(layero, index){
            // //得到iframe页的窗口对象
            // var iframeWin = window[layero.find('iframe')[0]['name']];
            // // 执行iframe页的方法：
            // iframeWin.setRelevanceObj(id, name, fieldType, selector);
        }
    });
    layer.full(index);
}
// 返回关联选择后的值
function handleRelevance(data) {
    $("#author").val(data.data[0].nickname);
    $("#author").attr("data-id",data.data[0].id);
}
