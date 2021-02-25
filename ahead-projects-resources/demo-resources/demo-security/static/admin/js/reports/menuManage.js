/**
 * Created by mu-HUN on 2018/9/18.
 */
var $menuTree = $('#menu-tree');
var zNodes = [];
var $table = $('#table')
var $addMenuModal = $('#add-menu-modal');
var tableUrl = '/admin/frontMenu/0/query';
var currentPid = 0;//父级菜单id
var currentId = 0;//当前模态框绑定的id
var menu_belong = 202367
var menu_type = 202365
var formType = 1;//1 为编辑，0 为添加
// var zTreeObj
var $form = $('#menu-form');
$(function(){
    initPage();
});
//初始化页面
function initPage() {
    var obj = {
        id: 0,
        pid: -1,
        name: 'root',
        title: 'root',
        deleted: false,
        open: true
    };
    menus.unshift(obj);
    showTreeTable(menus);
    initTable();
    $(document).on('click','.menu-edit-btn',function (e) {
        e.stopPropagation();
        $table.bootstrapTable('uncheckAll');
        $table.bootstrapTable('check', $(this).data('index'));
        var selector = $table.bootstrapTable('getSelections');
        $('#menu-name').val(selector[0].name);
        $('#menu-type').val(selector[0].type_id);
        $('#menu-url').val(selector[0].url);
        if(selector[0].disable) {
            $('#disable').val('true')
        } else {
            $('#disable').val('false')
        }
        $('#menu-url').val(selector[0].url);
        $('#menu-sort').val(selector[0].sort);
        formType = 1;
        currentPid = selector[0].pid;
        currentId = selector[0].id;
        $addMenuModal.modal('show');
    }).on('click','#add-monitory-btn',function (e) {
        e.stopPropagation();
        $('#menu-type').val('202365');
        currentId = 0;
        formType = 0;
        $addMenuModal.modal('show');
    }).on('click','#add-menu-btn',function (e) {
        e.stopPropagation();
        $('#menu-type').val('202363');
        currentId = 0;
        formType = 0;
        $addMenuModal.modal('show');
    }).on('click','#add-virtual-btn',function (e) {
        e.stopPropagation();
        $('#menu-type').val('202364');
        currentId = 0;
        formType = 0;
        $addMenuModal.modal('show');
    }).on('click','#update-menu-btn', function (e) {
        $form.data('bootstrapValidator').validate();
        var isValid = $form.data('bootstrapValidator').isValid();
        if(!isValid) {
            return;
        }
        layer.msg('表单提交中...', { // 提交加载动画
            icon: 16,
            shade: 0.01,
            time: 8000
        });
        var postData = {};
        var array = $form.serializeArray();
        $.each(array, function(){
            // 如果该字段存在
            if(postData[this.name]) {
                if(!postData[this.name].push) {
                    postData[this.name] = [postData[this.name]];
                }
                postData[this.name].push(this.value || null);
            } else {
                postData[this.name] = this.value || null;
            }
        });
        submitForm(formType, postData);
    }).on('click','.menu-remove-btn', function (e) {
        e.stopPropagation();
        var id = $(this).data('id');
        layer.confirm('你确定删除吗？',{
            btn:['确定','取消']
        },function () {
            $.ajax({
                url: '/admin/frontMenu/delete/' + id,
                type: 'post',
                contentType: 'application/json;charset=UTF-8',
                success: function (res) {
                    if(res.status == 200){
                        layer.msg('删除成功')
                        $table.bootstrapTable('refresh')
                    } else {
                        layer.msg('删除失败，请稍候再试');
                    }
                },
                error: function (e) {
                    layer.msg('删除失败，网络错误');
                }
            })
        },function () {
            layer.closeAll();
        })
    }).on('click', '#searchTree', function (e) {
        e.stopPropagation();
        var key = $('#searchTreeText').val();
        if (key != null) {
            var ztree = $.fn.zTree.getZTreeObj("menu-tree")
            var hidenode = ztree.transformToArray(ztree.getNodes());
            ztree.hideNodes(hidenode);//隐藏所有节点
            nodeList = ztree.getNodesByParamFuzzy("name", key, null);//模糊查询
            if (nodeList && nodeList.length > 0) {
                for ( var i = 0; i < nodeList.length; i++) {
                    nodeList[i].highlight = true;//设置高亮
                    findParent(ztree, nodeList[i]);
                    ztree.updateNode(nodeList[i]);
                    ztree.expandNode(nodeList[i], true, true, false);//展开节点
                }
            }
        }else{
            alert("请输入搜索条件");
        }
    });
    $("#add-menu-modal").on('hidden.bs.modal', function() {
        $form.bootstrapValidator('resetForm', true);
        $form[0].reset();
    });//关闭窗口时 清空内容
    formValidator();
}
//初始化Table
function initTable() {
    $table.bootstrapTable({
        height: getHeight(),
        toolbar: "#toolbar",
        ajax: getTableData,
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
}
//显示数据源的树状结构
function showTreeTable(menuList) {
    for(var i = 0, iLen = menuList.length; i < iLen; i++) {
        var obj = {
            id: menuList[i].id,
            pId: menuList[i].pid || 0,
            name: menuList[i].name,
            deleted: menuList[i].deleted,
            open: true,
            data: menuList[i]
        };
        zNodes.push(obj);
    }
    setTreeViewContent(zNodes);
}
//树的结构配置
function setTreeViewContent(zNodes) {
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        view: {
            addHoverDom: null,
            removeHoverDom: null,
            selectedMulti: false,
            fontCss: setFontCss
        },
        edit: {
            enable: true,
            editNameSelectAll: true,
            showRemoveBtn: false,
            showRenameBtn: false
        },
        callback: {
            onClick: onClick
        }
    };
    zTreeObj = $.fn.zTree.init($menuTree, setting, zNodes);
}
//树的点击事件
function onClick(event, treeId, treeNode) {
    if(treeNode.id == 0) {
        menu_belong=202367
        currentPid = 0;
        currentId = 0;
        tableUrl = '/admin/frontMenu/'+ treeNode.id + '/query';
        $table.bootstrapTable('refresh');
        $addMenuModal.modal('show');
        return
    }
    tableUrl = '/admin/frontMenu/'+ treeNode.id + '/query'
    currentPid = treeNode.id
    menu_belong = JSON.parse(treeNode.data.menu_belong).id
    $table.bootstrapTable('refresh');
}
//表格数据请求
function getTableData(params) {
    var postData = {
        pager: {
            current: params.data.current,
            size: params.data.size
        },
        sortPointer: {
            order: 'DESC'
        }
    }
    $.ajax({
        url: tableUrl,
        type: 'post',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(postData),
        success: function (res) {
            var data = res.data.data_object;
            for (var i = 0;i < data.length; i++) {
            //    处理菜单类型
                if (!!data[i].menu_type) {
                   var type = JSON.parse(data[i].menu_type)
                   data[i].menu_type = type.title;
                   data[i].type_id = type.id;
                }
                /*data[i].index = i;*/
                data[i].operate = '<button data-index="'+ i +'" class="btn btn-sm btn-primary menu-edit-btn" style="margin-right: 10px">编辑</button>' +
                    '<button class="btn btn-sm btn-danger menu-remove-btn" data-id="'+data[i].id+'">删除</button>'
                // data[i].uniqueId = data[i].id
            }
            var total = data.length;
            params.success({
                total: total,
                rows: data
            })
        }
    })
}
//表单验证
function formValidator() {
    $form.bootstrapValidator({
        message: '这个值无效',
        feedbackIcons: {/*输入框不同状态，显示图片的样式*/
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        excluded: [':disabled', ':hidden', 'select']
    });
}
//提交表单
function submitForm(type, data) {
    if(type) {
        data.id = currentId;
    }
    data.pid = currentPid;
    data.menuBelong = menu_belong;
    $.ajax({
        url:'/admin/frontMenu/create_update',
        type: 'post',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(data),
        success: function (res) {
            layer.closeAll();
            if(res.status == 200) {
                new PNotify({
                    title: '修改表单信息成功！',
                    text: '请在栏目维护中查看修改后的内容',
                    type: 'success',
                    delay: 3000,
                    addclass: "stack-bottomright",
                    stack: stack_bottomright
                });
                $addMenuModal.modal('hide');
                $table.bootstrapTable('refresh');
            } else {
                new PNotify({
                    title: '修改表单信息失败！',
                    text: res.message,
                    type: 'error',
                    delay: 3000,
                    addclass: "stack-bottomright",
                    stack: stack_bottomright
                });
            }
        },
        error: function (e) {
            new PNotify({
                title: '修改表单信息失败！',
                text: '网络错误，请稍后再试',
                type: 'error',
                delay: 3000,
                addclass: "stack-bottomright",
                stack: stack_bottomright
            });
        }
    })
}
//找到其父亲节点
function findParent(ztree, node) {
    ztree.expandNode(node, true, false, true);//展开节点
    ztree.showNode(node);//显示该节点
    var pNode = node.getParentNode();
    if (pNode != null) {
        findParent(ztree, pNode);
    }
}
//设置字体颜色
function setFontCss(treeId, treeNode) {
    if (treeNode.id == 1) {//根节点
        return {
            color : "black"
        };
    }
    if (treeNode.highlight) {//如果符合模糊查询条件则高亮显示
        return {
            color : "red"
        };
    }else{
        return {
            color : "black"
        };
    }
}
//重置
$("#reset").on("click",function(){
    treeNode.highlight=false;//所有节点取消高亮
    $("#searchTreeText").val('');//搜索框重置
    $.windowbox.treeInit();//树初始化
    ztree.expandNode(treeNode,true,true,true);
    ztree.refresh();
});