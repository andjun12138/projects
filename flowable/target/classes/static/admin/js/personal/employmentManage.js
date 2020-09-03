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
    $table.bootstrapTable({
        height: getHeight(),
        toolbar: '#toolbar',
        url: '/employment/query',
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
        data[i].title = '<a target="_blank" href="/employment/to_create_update/'+data[i].id+'.html">'+data[i].title+'</a>';
        if(!!data[i].enterpriseId){
            data[i].enterpriseId = JSON.parse(data[i].enterpriseId).name;
        }

        if(!!data[i].userId){
            data[i].userId = JSON.parse(data[i].userId).userName;
        }
        data[i].education = JSON.parse(data[i].education).title;
        data[i].industry = JSON.parse(data[i].industry).title;
        data[i].backCheckStatus = JSON.parse(data[i].backCheckStatus).title;
        if(data[i].wageStart == 0 || data[i].wageEnd == 0){
            data[i].wage = '面议';
        }else{
            data[i].wage = data[i].wageStart + 'K -- ' + data[i].wageEnd + 'K';
        }

        //处理报名截止时间
        var backCheckTimeObj = res.data.data_list[i].backCheckTime;
        if(!!backCheckTimeObj){
            var backCheckTime = getMyDate(backCheckTimeObj,true);
            res.data.data_list[i].backCheckTime = backCheckTime;
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
    if(!!searchOptions.title)postData['title'] = searchOptions.title;
    if(!!searchOptions.enterpriseId)postData['enterpriseId'] = searchOptions.enterpriseId;
    if(!!searchOptions.industry)postData['industry'] = searchOptions.industry;
    if(!!searchOptions.education)postData['education'] = searchOptions.education;
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
    searchOptions['enterpriseId'] = $("#enterpriseId").attr('data-id');
    searchOptions['industry'] = $("#industry").val();
    searchOptions['education'] = $("#education").val();
}


// 获取bootstrap table高度
function getHeight() {
    var searchHeight = 0;
    if($("#search-part").css('display') !== 'none') {
        searchHeight = $('#search-part').height();
    }
    return $(window).height() - 20 - searchHeight;
}

function StringNoEmpty(str){
    if(str!=null&&str!=""&&str!=undefined){
        return true;
    }else return false;
}
// 返回关联选择后的值
function handleRelevance(data, selector) {
    console.log(data);
    $('input#enterpriseId').val(data.data[0].nameStr).attr("data-id",data.data[0].id);
    // 调用搜索功能
    searchInfo();
}
// 触发关联选择的打开
function triggerOpenRelativeDialog(event) {
    if(document.all) {
        $(event.currentTarget).next().get(0).click();
    } else {
        var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        $(event.currentTarget).next().get(0).dispatchEvent(e);
    }
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
            //得到iframe页的窗口对象
            var iframeWin = window[layero.find('iframe')[0]['name']];
            // 执行iframe页的方法：
            // iframeWin.setRelevanceObj(id, name, fieldType, selector);
        }
    });
    layer.full(index);
}

//时间戳转日期
function getMyDate(str,isToSeccond){
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth()+1,
        oDay = oDate.getDate();
    var oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay);
    //是否精确到秒
    if(isToSeccond){
        var oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds();
        oTime = oTime +' '+ getzf(oHour) +':'+ getzf(oMin) +':'+getzf(oSen);//最后拼接时间
    }
    return oTime;
}
//补0操作
function getzf(num){
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}
function StringNoEmpty(str){
    if(str!=null&&str!=""&&str!=undefined){
        return true;
    }else return false;
}