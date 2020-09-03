/**
 * Created by mu-HUN on 2018/6/23.
 */
var SINGLE_CHOICE = 1011,
    MULTIPLE_CHOICE = 1012,
    MULTIPLE_TREE_CHOICE = 1013;

// 存储所选项
var selections = [];
var searchOptions = {};
var tempFirstId;
var tempFinalId;
// layer弹出层的下标
var layerIndex = 0;
// 关联选择对象
var relevanceObj = {
    id: null,
    name: null,
    fieldType: null
};
var $table = $('#table'),
    $remove = $('#remove'),
    // $searchPart = $("#search-part"),
    $search = $('#search'),
    $saveSel=$("#saveSelection");
    // $toggleSearch = $('#toggle-search');

var formId = $('#formId').val();

var SEARCHING = false;

$(function(){
    initTable();
});
function initTable() {
    $table.bootstrapTable({
        height: getHeight(),
        toolbar: "#toolbar",
        url: '/button/query',
        method: 'post',
        // sortOrder: 'desc',
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
        maintainSelected:true,
        pageSize: 15,
        showFooter: false,
        sidePagination: "server",
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
    $(window).resize(function () {
        $table.bootstrapTable('resetView', {
            height: getHeight()
        });
    });
    /*$toggleSearch.on('click', function(e){
        e.stopPropagation();
        if($searchPart.css('display') === 'none') {
            $toggleSearch.html('<i class="icon-angle-up"></i> 收起搜索');
        } else {
            $toggleSearch.html('<i class="icon-angle-down"></i> 展开搜索');
        }
        $searchPart.slideToggle(function(){
            $table.bootstrapTable('resetView', {
                height: getHeight()
            });
        });
        $search.toggle();
    });*/
    // 搜索
    $search.on('click', function(e) {
        e.stopPropagation();
        searchInfo(true);
    });
    // 搜索表单域中绑定的事件
    $("input.search-control").on('keydown',function(e){
        // e.preventDefault();
        e.stopPropagation();
        if(e.keyCode == "13") {
            searchInfo(true);
        }
    });
    $saveSel.on('click',function(e){
        e.stopPropagation();
        e.preventDefault();
        selections=[];
        //获取本页中选中的项
        var data=$table.bootstrapTable("getAllSelections");
        //将不在本页的原本选中项加入selections
        /*for(var i=0;i<menubtns.length;i++){
            if(menubtns[i].id>tempFirstId||menubtns[i].id<tempFinalId){
                selections.push(menubtns[i].id);
            }
        }*/
        for(var j=0;j<data.length;j++){
            selections.push(data[j].id);
        }
        submitData(selections);
    })
}
//提交数据
function submitData(data){
    $.ajax({
        type:"post",
        url:'/menu/'+menuId+'/update_buttons',
        contentType:'application/json',
        data:JSON.stringify(data),
        success:function(data){
            refreshTable();
            setTimeout(function () {
                layer.msg("提交成功", function(){});
            }, 1000);
        },
        error:function(error){
            console.log("提交失败");
        }
    })
}
// 刷新列表
function refreshTable() {
    initTable();
}

// 数据返回处理
function responseHandler(res) {
    var data=res;
    var data_list;
    data_list=CheckresponseHander(data);
    return {
        "total": res.data.total,//总页数
        "rows": data_list
    };
}
function CheckresponseHander(res){
    var list=res.data.data_list;
    var thmenubtns=menubtns;
    for(var i=0;i<thmenubtns.length;i++){
        for(var j=0;j<list.length;j++){
            if(list[j].id == thmenubtns[i].id){
                list[j].state=true;
            }
            else continue;
        }
    }
    if(res.data.total != 0){
        tempFirstId=list[0].id;
        tempFinalId=list[list.length-1].id;
    }
    return list;
}
// 搜索功能
function searchInfo(flag) {
    SEARCHING = !!flag
    initSearchOptions();
    if (SEARCHING) $('#table').bootstrapTable('refresh', {pageNumber:1}); // 重置页码
    else $table.bootstrapTable(('refresh'));
}
function initSearchOptions() {
    searchOptions['title'] = $("#title").val();
    searchOptions['description'] = $("#description").val();
}
//表格数据获取的参数
function queryParams(params) {
    var pager = {};
    var sortPointer = {};
    pager.current = params.offset/params.limit + 1;
    pager.size = params.limit;
    sortPointer.order = 'DESC';
    var postData = {
        pager: pager,
        sortPointer:sortPointer
    };
    if(StringNoEmpty(searchOptions.title))postData['title'] = searchOptions.title;
    if(StringNoEmpty(searchOptions.description))postData['description'] = searchOptions.description;
    return postData;
}
// 获取bootstrap table高度
function getHeight() {
    var searchHeight = 0;
    if($("#search-part").css('display') !== 'none') {
        searchHeight = $('#search-part').height();
    }
    return $(window).height() - 20 - searchHeight;
}
// 刷新列表并且弹出提示信息
function refreshAndShowMessage(options){
    new PNotify(options);
    $('#table').bootstrapTable('refresh');
}
// 确定按钮控制
function confirmHandle() {
    var selectionsLen = selections.length;
    if(selectionsLen === 0) {
        layer.msg("未选择任何项！", function(){});
        return;
    }
    switch(parseInt(relevanceObj['fieldType'])) { // 转换为数字
        case SINGLE_CHOICE:
            if(selectionsLen > 1) {
                layer.msg("只能选择一项！", function(){});
                return;
            }
            break;
        case MULTIPLE_CHOICE:
        case MULTIPLE_TREE_CHOICE:
            break;
    }
    if(parent.window.handleRelevance) {
        parent.window.handleRelevance(selections, relevanceObj.selector);
        layerIndex = parent.layer.getFrameIndex(window.name);
        parent.layer.close(layerIndex);
    }
}
// 撤销控制操作
function repealHandle() {
    if(parent.layer) {
        parent.window.handleRelevance([], relevanceObj.selector);
        layerIndex = parent.layer.getFrameIndex(window.name);
        parent.layer.close(layerIndex);
    }
}
// 关联获取的值
function setRelevanceObj(id, name, fieldType, selector) {
    relevanceObj['id'] = id;
    relevanceObj['name'] = name;
    relevanceObj['fieldType'] = fieldType;
    relevanceObj['selector'] = selector;
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
            iframeWin.setRelevanceObj(id, name, fieldType, selector);
        }
    });
    layer.full(index);
}

// 返回关联选择后的值
function handleRelevance(data, selector) {
    var tempName = '';
    var tempId = '';
    for(var i = 0, len = data.length; i < len; i++) {
        if( i > 0 ) { // 如果不是第一个
            tempName += ',';
            tempId += ',';
        }
        tempName += data[i].name;
        tempId += data[i].id;
    }
    $('input[name=' + selector + ']').val(tempId).next().val(tempName);
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
// 消息框位置控制
var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};
/**
 * 获取选中项
 * @param  可以是：空值、字符串、字符串数组
 */
function getSelection(option) {
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
/* 页码发生改变时 */
function changePage(){
    var data=[];
    data=$table.bootstrapTable('getAllSelections');//获得的当前页被选中的数据
    var index;//用于循环
    if(data.length==0 && selections.length==0)return ;
    else if(data.length==0 && selections.length != 0){
        for(index=0;index<selections.length;index++){
            if(selections[index]>=tempFirstId && selections[index]<=tempFinalId){
                selections.splice(index,1);
            }
        }
        console.log(selections);
    }
    else if(data.length != 0){
        for(index=0;index<selections.length;index++){
            if(selections[index]>=tempFirstId && selections[index]<=tempFinalId){
                selections.splice(index,1);
            }
        }
        for(var i=0;i<data.length;i++){
            selections.push(data[index].id);
        }
    }
}
function StringNoEmpty(str){
    if(str!=null&&str!=""&&str!=undefined){
        return true;
    }else return false;
}