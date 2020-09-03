/**
 * Created by mu-HUN on 2018/9/4.
 */
var $menuTree = $('#menu-tree');
var $addMenuModal = $('#add-menu-modal');
var zNodes = [];
var currentNode = '';        // 当前节点（点击添加节点）
var modalType = 1;          // 模态窗类型：菜单详情：1，添加菜单：2
// 消息框位置控制
var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};

// 角色获取子节点的formId
var formId = 43;

$("#add-menu-modal").on('hidden.bs.modal', function() {
    $('#menu-form')[0].reset();
});

$(function(){
    var menus = sortUp(menuList,"sort");
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
    getEnumeration(802, $('#menu-openway'));
    $('#add-menu-btn').bind('click', addMenu);
});

function addMenu(){
    if(!StringNoEmpty($("#menu-title").val())||!StringNoEmpty($("#menu-sort").val())){
        layer.msg("请完整填写名称和排序",function(){});
        return;
    }
    var postData = {
        title: $('#menu-title').val() || null,
        icon: $('#menu-icon').val() || null,
        url: $('#menu-path').val() || null,
        sort: $('#menu-sort').val() || null
    }
    var url = '/admin/personalMenu/create_update';
    if (modalType == 1) {
        postData.id = currentNode.id;
        postData.pid = currentNode.pid;
    }else if(modalType==2){
        postData.pid = currentNode.id
    }
    if(postData.pid === 0){
        postData.pid = null;
    }
    $.ajax({
        type:'post',
        url: url,
        contentType:'application/json;charset=utf-8',
        dataType:'json',
        data: JSON.stringify(postData),
        success:function(res){
            var zTree = $.fn.zTree.getZTreeObj("menu-tree");
            var title = '添加菜单';
            var text = '添加菜单成功';
            if (modalType == 1) {
                title = '修改菜单';
                text = '修改菜单成功';
            }
            new PNotify({
                title: title,
                text: text,
                type: 'success',
                delay: 3000,
                addclass: "stack-bottomright",
                stack: stack_bottomright
            });
            if (modalType == 2) {
                var nodeObj = {
                    id:res.data.id,
                    pId:currentNode.id,
                    name:$('#menu-title').val(),
                    data: {
                        id:res.data.id,
                        pId:currentNode.id,
                        title: $('#menu-title').val() || null,
                        url: $('#menu-path').val() || null,
                        sort: $('#menu-sort').val() || null,
                        openWay: $('#menu-openway option:selected').val() || null,
                        description: $('#menu-description').val() || null,
                        icon: $('#menu-icon').val() || null
                    }
                }
                zTree.addNodes(currentNode, nodeObj);
            }
            $addMenuModal.modal('hide');
            location.reload();
            return false;
        },error:function(XMLHttpRequest, textStatus, errorThrown){
            alert('添加菜单失败，服务器内部错误');
        }
    });
}

// 新增菜单时获取菜单类型枚举: pid: pid, parentDom: 插入的select下拉框
function getEnumeration(pid, parentDom) {
    $.ajax({
        type:'get',
        url:'/selectItem/' + pid + '/get_by_pid',
        contentType:'application/json;charset=utf-8',
        success: function (res) {
            var list = res.data.data_list;
            var menuTypeList = [];
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                var obj = {};
                obj.title = item.title;
                obj.id = item.id;
                menuTypeList.push(obj)
            }
            for (var j = 0; j < menuTypeList.length; j++) {
                var dom = '';
                dom = "<option value='"+ menuTypeList[j].id +"'>" + menuTypeList[j].title + "</option>";
                parentDom.append(dom);
            }
        },
        error: function (err) {
            console.log('获取菜单枚举失败，pid为：' + pid);
            console.log(err);
        }
    })
}

// 显示数据源的树状结构
function showTreeTable(menuList) {
    for(var i = 0, iLen = menuList.length; i < iLen; i++) {
        var obj = {
            id: menuList[i].id,
            pId: menuList[i].pid || 0,
            name: menuList[i].title,
            deleted: menuList[i].deleted,
            open: true,
            data: menuList[i]
        };
        zNodes.push(obj);
    }
    setTreeViewContent(zNodes);
}

// 树状结构配置
function setTreeViewContent(zNodes) {
    // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        view: {
            addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom,
            selectedMulti: false
        },
        edit: {
            enable: true,
            editNameSelectAll: true,
            showRemoveBtn: showRemoveBtn,
            showRenameBtn: showRenameBtn
        },
        callback: {
            onClick: onClick,
            beforeDrag: beforeDrag,
            beforeDrop: beforeDrop,
            beforeEditName: beforeEditName,
            beforeRemove: beforeRemove,
            beforeRename: beforeRename,
            onRemove: onRemove,
            onRename: onRename
        }
    };
    zTreeObj = $.fn.zTree.init($menuTree, setting, zNodes);
}

function onClick(event, treeId, treeNode) {
    modalType = 1;
    currentNode = treeNode;
    var data = treeNode.data;
    $('#menu-title').val(data.title);
    $('#menu-path').val(data.url);
    $('#menu-sort').val(data.sort);
    $('#menu-icon').val(data.icon);
    $('#modal-title').text('修改菜单');
    $addMenuModal.modal('show');
}

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    if (childNodes.length > 0) {
        for (var i=0, l=childNodes.length; i<l; i++) {
            childNodes[i].name = childNodes[i].title;
            childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
            childNodes[i].isParent = true;
        }
    } else {
        parentNode.isParent = false;
    }
    return childNodes;
}

var log, className = "dark";
function beforeDrag(treeId, treeNodes) {
    for (var i=0,l=treeNodes.length; i<l; i++) {
        if (treeNodes[i].drag === false) {
            return false;
        }
    }
    return true;
}

function beforeDrop(treeId, treeNodes, targetNode, moveType) {
    var data=treeNodes[0];
    console.log(data);
    if (targetNode) {
        var postData = {
            title:data.title,
            id:data.id,
            url:data.url,
            icon:data.icon,
            openWay:data.openWay,
            sort:data.sort,
            pid: targetNode.data.id
        }
        $.ajax({
            type:'post',
            url:'/menu/create_update',
            contentType:'application/json;charset=utf-8',
            dataType:'json',
            data: JSON.stringify(postData),
            success:function(data){
                console.log(data);
                return treeNodes.drop !== false
            },error:function(XMLHttpRequest, textStatus, errorThrown){
                alert('修改失败，服务器内部错误');
                return treeNodes.drop !== false
            }
        });
    } else {
        console.log('无拖拽目标')
        return true
    }
    // return targetNode ? targetNode.drop !== false : true;
}

function beforeEditName(treeId, treeNode) {
    modalType = 1;
    currentNode = treeNode;
    var data = treeNode.data;
    console.log(data);
    $('#menu-title').val(data.title);
    $('#menu-path').val(data.url);
    $('#menu-sort').val(data.sort);
    $('#menu-icon').val(data.icon);
    $addMenuModal.modal('show');
    return false;
}

function beforeRemove(treeId, treeNode) {
    className = (className === "dark" ? "":"dark");
    var zTree = $.fn.zTree.getZTreeObj("menu-tree");
    zTree.selectNode(treeNode);
    if (confirm("确认删除 -- " + treeNode.name + " 吗？")) {
        // var nodeArr = getAllChildrenNodes(treeNode, [treeNode.id]);
        // console.log(nodeArr);
        $.ajax({
            type:'post',
            url:'/admin/personalMenu/delete/'+ treeNode.id,
            // data: JSON.stringify(nodeArr),
            contentType:'application/json;charset=utf-8',
            dataType:'json',
            success:function(data){
                return true;
            },error:function(XMLHttpRequest, textStatus, errorThrown){
                alert('删除失败，服务器内部错误');
                return false;
            }
        });
    } else {
        return false;
    }
}

function onRemove(e, treeId, treeNode) {
    console.log('确定删除节点了')
    console.log(treeNode)
}

function beforeRename(treeId, treeNode, newName, isCancel) {
    oldNodeName = treeNode.name
    className = (className === "dark" ? "":"dark");
    if (newName.length == 0) {
        setTimeout(function() {
            var zTree = $.fn.zTree.getZTreeObj("menu-tree");
            zTree.cancelEditName();
            alert("节点名称不能为空.");
        }, 0);
        return false;
    }
    return true;
}

function onRename(e, treeId, treeNode, isCancel) {
    $.ajax({
        type:'post',
        url:'/form/create_update_data/' + formId + '/' + treeNode.id,
        contentType:'application/json;charset=utf-8',
        dataType:'json',
        data: JSON.stringify({title: treeNode.name}),
        success:function(data){
            console.log(data);
        },error:function(XMLHttpRequest, textStatus, errorThrown){
            treeNode.name = oldNodeName
            var zTree = $.fn.zTree.getZTreeObj("menu-tree");
            zTree.cancelEditName();
            alert('修改名称失败，服务器内部错误');
        }
    });
}
function onDrop(e, treeId, treeNode,targetNode,moveType,isCopy){
    console.log(isCopy);
}
function showRemoveBtn(treeId, treeNode) {
    return true;
}

function showRenameBtn(treeId, treeNode) {
    return true;
}

function showLog(str) {
    if (!log) log = $("#log");
    log.append("<li class='"+className+"'>"+str+"</li>");
    if(log.children("li").length > 8) {
        log.get(0).removeChild(log.children("li")[0]);
    }
}

function getTime() {
    var now= new Date(),
        h=now.getHours(),
        m=now.getMinutes(),
        s=now.getSeconds(),
        ms=now.getMilliseconds();
    return (h+":"+m+":"+s+ " " +ms);
}

var newCount = 1;
function addHoverDom(treeId, treeNode) {
    var aObj = $("#" + treeNode.tId + "_a");
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='新增下级菜单' onfocus='this.blur();'></span>";
    aObj.append(addStr);
    var btn = $("#addBtn_"+treeNode.tId);
    if (btn) btn.bind("click", function(e){
        modalType = 2;
        currentNode = treeNode;
        $('#modal-title').text('新增菜单');
        $addMenuModal.modal('show');
        e.stopPropagation();
    });
}
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
}
function selectAll() {
    var zTree = $.fn.zTree.getZTreeObj("menu-tree");
    zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
}

// 升序排序（从小到大，用于菜单）
function sortUp(array, property){
    return array.sort(function (a, b) {
        return a[property] - b[property];
    })
}
// 获取
function getAllChildrenNodes(treeNode, result){
    if (treeNode.isParent) {
        var childrenNodes = treeNode.children;
        if (childrenNodes) {
            for (var i = 0; i < childrenNodes.length; i++) {
                result.push(childrenNodes[i].id);
                result = getAllChildrenNodes(childrenNodes[i], result);
            }
        }
    }
    return result;
}
function StringNoEmpty(str){
    if(str!=null&&str!=""&&str!=undefined){
        return true;
    }else return false;
}