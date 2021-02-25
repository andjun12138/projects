/**
 * Created by mu-HUN on 2018/6/23.
 */
var SINGLE_CHOICE = 1011,
    MULTIPLE_CHOICE = 1012,
    MULTIPLE_TREE_CHOICE = 1013;

// 存储所选项
var selections = [];
var searchOptions = {};
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
    $search = $('#search'),
    $saveSel=$("#saveSelection");
var $authority = $('#authorityTable');
var formId = $('#formId').val();

var SEARCHING = false;

$(function(){
    selections = initSeletor(rolebtns);
    initTable();
});
//初始化选项
function initSeletor(data) {
    initShuttle(data);
    var list = []
    for(var i = 0;i < data.length;i++) {
        list.push({
            id: data[i].id,
            title: data[i].title
        });
    }
    return list
}
//初始化穿梭框
function initShuttle(list) {
    $authority.bootstrapTable({
        height: getHeight,
        data: [],
        striped: true,
        minimumCountColumns: 2,
        pagination: true,
        pageList: "[15, 20, 25, 50, 100]",
        pageNumber: 1,
        pageSize: 15,
        sidePagination: "client"
    });
    $authority.on('check.bs.table', function (row) {
        $('.shuttle-delete').attr('disabled',false).addClass('btn-primary');
    }).on('check-all.bs.table',function (rows) {
        $('.shuttle-delete').attr('disabled',false).addClass('btn-primary');
    }).on('uncheck-all.bs.table',function (rows) {
        $('.shuttle-delete').attr('disabled','disabled').removeClass('btn-primary');
    }).on('uncheck.bs.table',function (row) {
        if(!$authority.bootstrapTable('getAllSelections').length) {
            $('.shuttle-delete').attr('disabled','disabled').removeClass('btn-primary');
        }
    }).on('page-change.bs.table',function (number,size) {
        $('.shuttle-delete').attr('disabled','disabled').removeClass('btn-primary');
    });
    $authority.bootstrapTable('load',list);
}

function initTable() {
    $table.bootstrapTable({
        height: getHeight,
        toolbar: "#toolbar",
        url: '/button/query',
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
        sidePagination: "server"
    });
    // sometimes footer render error.
    setTimeout(function () {
        $table.bootstrapTable('resetView');
    }, 200);

    $table.on('expand-row.bs.table', function (e, index, row, $detail) {
        var html = [];
        $.each(row, function (key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return $detail.html(html);
    }).on('check.bs.table', function (row) {
        $('.shuttle-add').attr('disabled',false).addClass('btn-primary');
    }).on('check-all.bs.table',function (rows) {
        $('.shuttle-add').attr('disabled',false).addClass('btn-primary');
    }).on('uncheck-all.bs.table',function (rows) {
        $('.shuttle-add').attr('disabled','disabled').removeClass('btn-primary');
    }).on('uncheck.bs.table',function (row) {
        if(!$table.bootstrapTable('getAllSelections').length) {
            $('.shuttle-add').attr('disabled','disabled').removeClass('btn-primary');
        }
    });
    $(window).resize(function () {
        $table.bootstrapTable('resetView', {
            height: getHeight()
        });
    });
    // 搜索
    $search.on('click', function(e) {
        e.stopPropagation();
        searchInfo(true);
    });
    // 搜索表单域中绑定的事件
    $("input.search-control").on('keydown',function(e){
        e.stopPropagation();
        // e.preventDefault();
        if(e.keyCode == "13") {
            searchInfo(true);
        }
    });
    $saveSel.off().on('click',function(e){
        var data = [];
        for (var i = 0; i < selections.length;i++) {
            data.push(selections[i].id);
        }
        // 升序排序（从小到大，用于菜单）
        function sortUp(array){
            return array.sort(function (a, b) {
                return a - b;
            })
        }
        data = sortUp(data);
        submitData(data);
    });
    $(document).on('click','.shuttle-add',function (e) {
        e.stopPropagation();
        var selector = $table.bootstrapTable('getAllSelections');
        for(var i = 0; i < selector.length;i++) {
            var flag = true
            for(var j = 0; j < selections.length;j++) {
                if(selector[i].id === selections[j].id) flag=false
            }
            if(flag) {
                selections.push({
                    id: selector[i].id,
                    title: selector[i].title
                })
            }
            $authority.bootstrapTable('load',selections);
            $('.shuttle-add').attr('disabled','disabled').removeClass('btn-primary');
            $table.bootstrapTable('refresh');
        }
    }).on('click','.shuttle-delete',function (e) {
        e.stopPropagation();
        var selector = $authority.bootstrapTable('getAllSelections');
        var tempSelections = [];
        for(var i = 0; i < selections.length; i++) {
            var flag = true;
            for(var j = 0; j < selector.length; j++) {
                if(selections[i].id === selector[j].id) {
                    flag = false;
                    break;
                }
            }
            if(flag) {
                tempSelections.push({
                    id: selections[i].id,
                    title: selections[i].title
                })
            }
        }
        selections = tempSelections;
        $authority.bootstrapTable('load',selections);
        $('.shuttle-delete').attr('disabled','disabled').removeClass('btn-primary');
        $table.bootstrapTable('refresh');
    })
}
//提交数据
function submitData(data){
    $.ajax({
        type:"post",
        url:'/role/'+roleId+'/update_buttons',
        contentType:'application/json',
        data:JSON.stringify(data),
        success:function(data){
            setTimeout(function () {
                layer.msg("提交成功", function(){});
            }, 1000);
            refreshTable();
        },
        error:function(error){
            console.log("提交失败");
        }
    })
}
// 刷新列表
function refreshTable() {
    location.reload();
}

// 数据返回处理
function responseHandler(res) {
    var data=res;
    var data_list;
    data_list=CheckresponseHander(data);
    $('.shuttle-add').attr('disabled','disabled').removeClass('btn-primary');
    return {
        "total": res.data.total,//总页数
        // "rows": res.data.data_list//数据
        "rows": data_list
    };
}
function CheckresponseHander(res){
    var list=res.data.data_list;
    // var thmenubtns=rolebtns;
    for(var i=0;i<selections.length;i++){
        for(var j=0;j<list.length;j++){
            if(list[j].id == selections[i].id)list[j].state=true;
            else continue;
        }
    }
    return list;
}
// 搜索功能
function searchInfo(flag) {
    SEARCHING = !!flag;
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
        // order: params.order,
        // sort: params.sort
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
function submitSelection(){

}
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
function StringNoEmpty(str){
    if(str!=null&&str!=""&&str!=undefined){
        return true;
    }else return false;
}