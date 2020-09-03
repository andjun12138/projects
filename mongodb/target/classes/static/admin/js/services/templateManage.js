/**
 * Created by mu-HUN on 2018/10/10.
 */
$(function () {
    //全局变量
    var $table = $('#table'),
        $searchPart = $("#search-part"),
        $search = $("#search"),
        $toggleSearch = $("#toggle-search");
    var searchOptions = {};
    var SEARCHING = false;
    initPage();
//初始化页面
    function initPage() {
        $table.bootstrapTable({
            height: getHeight(),
            toolbar: '#toolbar',
            url: '/admin/template/query',
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
// 添加表格中的按钮
    function AddFunctionAlty(value,row,index) {
        return [
            '<button id="edit" type="button" class="btn btn-default">编辑</button>&nbsp;&nbsp;',
            '<button id="delete" type="button" class="btn btn-default">删除</button>'
        ].join("")
    }
    function responseHandler(res) {
//列表数据请求成功的回调
        var data = res.data.data_list;
        for(var i = 0;i < data.length;i++) {
            if (!!data[i].type) {
                data[i].typeTitle = JSON.parse(data[i].type).title
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
        if(!!searchOptions.type)postData['type'] = searchOptions.type;
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
        searchOptions['title'] = $("#title").val();
        searchOptions['type'] = $("#type").val();
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
// 刷新列表
    function refreshTable() {
        $table.bootstrapTable('refresh');
    }

})