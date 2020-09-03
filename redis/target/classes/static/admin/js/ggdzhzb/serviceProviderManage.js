/**
 * Created by lqs on 2017/7/24.
 * 表单列表脚本
 */

// 关联展示类型
var SINGLE_CHOICE = 1011,
    MULTIPLE_CHOICE = 1012,
    MULTIPLE_TREE_CHOICE = 1013;

// 存储所选项
var selections = [];
// layer弹出层的下标
var layerIndex = 0;
// 关联选择对象
var relevanceObj = {
    id: null,
    name: null,
    fieldType: null
};
var searchOptions={};
var $table = $('#table'),
    $remove = $('#remove'),
    $searchPart = $("#search-part"),
    $search = $('#search'),
    $toggleSearch = $('#toggle-search');

var formId = $('#formId').val();

var SEARCHING = false;

var $postData = {};

var $addUserModal = $('#add-user-modal');

$(function(){
    initTable();
    /*$("#addressBox").distpicker({
        placeholder: true
    })
    $("#addressBox").distpicker("reset",true);*/
});

function initTable() {
    $table.bootstrapTable({
        columns: [
            {
                checkbox: true,
                field: 'state'
            },
            {
                title: '企业名称',
                field: 'name',
                align: 'center'
            },
            {
                title: '联系人',
                field: 'contact',
                align: 'center'
            },
            {
                title: '手机',
                field: 'phone',
                align: 'center'
            },
            {
                title: '固话',
                field: 'fixed_telephone',
                align: 'center'
            },
            {
                title: '邮箱',
                field: 'email',
                align: 'center'
            },
            {
                title: '官网',
                field: 'official_website',
                align: 'center'
            },
            {
                title: '所属地区',
                field: 'address',
                align: 'center'
            },
            {
                title: '类型',
                field: 'skilled_label',
                align: 'center'
            },
            {
                title: '发布需求数',
                field: 'contract_number',
                align: 'center',
                sortable: true
            },
            {
                title: '相关成果数',
                field: 'case_amount',
                align: 'center',
                sortable: true
            }
        ],
        slientSort: false,
        height: getHeight(),
        toolbar: "#toolbar",
        url: '/ggdzhzb/getServiceProvider',
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
        pageSize: 15,
        showFooter: false,
        sidePagination: "server",
        clickToSelect:true
        // onClickRow:onClickRow
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
    });
    $(window).resize(function () {
        $table.bootstrapTable('resetView', {
            height: getHeight()
        });
    });
    // 时间插件初始化
    $('.time').datetimepicker({
        format: 'yyyy-mm-dd', //显示格式
        language: 'zh-CN',
        todayHighlight: 1,
        minView: 2,
        todayBtn: true,
        autoclose: true
    });
    $toggleSearch.off('click').on('click', function(e){
        e.stopPropagation();
        if($searchPart.css('display') === 'none') {
            $toggleSearch.html('<i class="icon-angle-up"></i> 收起搜索');
        } else {
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
    });
    // checkbox 选中
    $(".checkbox-input").click(function (e) {
        e.stopPropagation();
        if($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $(this).children('input[type="checkbox"]').first().prop('checked', false);
        }else {
            $(this).addClass("selected");
            $(this).children('input[type="checkbox"]').first().prop('checked', true);
        }
        searchInfo(true);
    });
    // 搜索
    $search.on('click', function(e) {
        e.stopPropagation();
        searchInfo(true);
    });
    // 搜索表单域中绑定的事件
    $("input.search-control").on('keydown',function(e){
        e.stopPropagation();
        if(e.keyCode == "13") {
            searchInfo(true);
        }
    });
    /*$("select.search-control").on("change", function (e) {
        e.stopPropagation();
        searchInfo(true);
    })*/
}

// 刷新列表
function refreshTable() {
    $table.bootstrapTable('refresh');
}

// 数据返回处理
function responseHandler(res) {
    var length = res.data.data_list.length;
    for (var i = 0; i < length; i++) {
        var test = res.data.data_list[i].skilled_label;
        var Jtest = JSON.parse(test);
        res.data.data_list[i].skilled_label = Jtest.title;
        //服务商类别

        var categoryStr = res.data.data_list[i].category;
        if (!!categoryStr){
            var categoryJson = JSON.parse(categoryStr);
            res.data.data_list[i].category = categoryJson.title;
        }

        var userId = res.data.data_list[i].user_id;
        if (!!userId){
            var userIdJson = JSON.parse(userId);
            res.data.data_list[i].user_id = userIdJson.user_name;
        }
        res.data.data_list[i].created_at = getFormatDate(res.data.data_list[i].created_at);
        res.data.data_list[i].temp= JSON.parse(JSON.stringify(res.data.data_list[i]));
        res.data.data_list[i].is_recommend = res.data.data_list[i].is_recommend == true ? '是':'否';
    }
    return {
        "total": res.data.total,//总页数
        "rows": res.data.data_list   //数据
    };
}
// 搜索功能
function searchInfo(flag) {
    SEARCHING = !!flag
    initSearchOptions();
    if (SEARCHING) $('#table').bootstrapTable('refresh', {pageNumber:1}); // 重置页码
    else $table.bootstrapTable(('refresh'));
}
function initSearchOptions(){
    searchOptions['name'] = $("#searchName").val();
    searchOptions['isRecommend'] = $("#isRecommend").val();
    searchOptions['skillLabel'] = $("#searchSkill").val();
    searchOptions['category'] = $("#category").val();
    searchOptions['userId'] = $("#userId").attr("data-id");
    searchOptions['phone'] = $("#phone").val();
    searchOptions['contact'] = $("#searchContact").val();
    searchOptions['startTime'] = $("#startTime").val();
    searchOptions['startTimeEnd'] = $("#startTimeEnd").val();
    var province = $("#provinceName").find("option:selected").text();
    if(province=="—— 省 ——")province="";
    var city = $("#cityName").find("option:selected").text();
    if(city=="—— 市 ——")city="";
    var district = $("#districtName").find("option:selected").text();
    if(district=="—— 区 ——")district="";
    var address=province+city+district;
    searchOptions['address'] = address;
}
//表格数据获取的参数
function queryParams(params) {
    var pager = {};
    pager.current = params.offset/params.limit + 1;
    pager.size = params.limit;

    var sortPointers = [];
    /*sortPointers.push({
        order:'DESC',
        filed:'is_recommend'
    });
    sortPointers.push({
        order:'DESC',
        filed:'recommended_index'
    });*/
    sortPointers.push({
        order:'DESC',
        filed:'created_at'
    })

    if(!!params.sort){
        sortPointers = [];
        sortPointers.push({
            order: params.order,
            filed: params.sort
        })
    }

    // var sortPointer = {};
    // sortPointer.order = 'DESC';
    // sortPointer.filed = 'updated_at';
    var postData = {
        backCheckStatus:202050,
        pager: pager,
        sortPointers:sortPointers
        // order: params.order,
        // sort: params.sort
    };
    if (StringNoEmpty(searchOptions.isRecommend)) postData['isRecommend'] = searchOptions.isRecommend;
    if (StringNoEmpty(searchOptions.name)) postData['name'] = searchOptions.name;
    if (StringNoEmpty(searchOptions.phone)) postData['phone'] = searchOptions.phone;
    if (StringNoEmpty(searchOptions.contact)) postData['contact'] = searchOptions.contact;
    if (StringNoEmpty(searchOptions.skillLabel)) postData['skilledLabel'] = searchOptions.skillLabel;
    if (StringNoEmpty(searchOptions.category)) postData['category'] = searchOptions.category;
    if (StringNoEmpty(searchOptions.userId)) postData['userId'] = searchOptions.userId;
    if (searchOptions.address !="—— 省 ———— 市 ———— 区 ——" && StringNoEmpty(searchOptions.address)) postData['address'] = searchOptions.address;
    if (StringNoEmpty(searchOptions.startTime)) postData['createdAtStart'] = searchOptions.startTime;
    if (StringNoEmpty(searchOptions.startTimeEnd)) postData['createdAt'] = searchOptions.startTimeEnd;
    console.log('postData',postData);
    Object.keys(postData).forEach(function(key){
        $postData[key] = postData[key];
    });
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
function handleRelevance(data) {
    $("#userId").val(data.data[0].user_name);
    $("#userId").attr("data-id",data.data[0].id);
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

function rebackInfo(){
    var data=$table.bootstrapTable("getAllSelections");
    if(data.length==0){
        layer.msg("未选择任何项！",function(){});
        return ;
    }
    if(data.length>1){
        layer.msg("只能选择一个服务商",function(){});
    }
    var postData={
        id:data[0].id,
        userName:data[0].temp
    }
    // console.log(postData);
    if(parent.window.handleRelevance){
        parent.window.handleRelevance(postData);
        layerIndex=parent.layer.getFrameIndex(window.name);
        parent.layer.close(layerIndex)
    }
}
function onClickRow(row,$element,field){
    if(field != 'name')return ;
    window.open('/admin/serviceProviders/'+row.id+'/to_create_update.html');
}
function StringNoEmpty(str){
    if(str!=null&&str!=""&&str!=undefined){
        return true;
    }else return false;
}
// 格式化时间
function getFormatDate(time) {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return year+'-'+prevZero(month)+'-'+prevZero(day)+' '+prevZero(hour)+':'+prevZero(minute)+':'+prevZero(second);
}

// 动态补全前置0
function prevZero(str) {
    return ('0'+str).substr(-2, 2);
}
