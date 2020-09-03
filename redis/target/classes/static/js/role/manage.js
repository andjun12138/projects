/**
 * Created by wupeng on 2017/9/21.
 * 系统管理-角色管理
 */
var $roleTree = $('#role-tree');
var $permissionSetting = $('#permission-setting');
var zNodes = [];
var oldNodeName = '';
// 消息框位置控制
var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};
// 角色获取子节点的formId
var formId = 39;

$(function(){
    // $permissionSetting.bind('click', permissionSetting);
    showTreeTable(roleList)
});

// 抽离当前登录用户的角色
var userObjRole = [];

// 应用权限设置
function permissionSetting() {
    $.ajax({
        url: '/system/apply/security',
        type: 'get',
        contentType: 'application/json;charset=utf-8',
        success: function (res) {
            new PNotify({
                title: '权限设置',
                text: '权限设置成功',
                type: 'success',
                delay: 3000,
                addclass: "stack-bottomright",
                stack: stack_bottomright
            });
        },
        error: function (err) {
            new PNotify({
                title: '权限设置',
                text: '网络出错，或服务器内部错误',
                type: 'error',
                delay: 3000,
                addclass: "stack-bottomright",
                stack: stack_bottomright
            });
        }
    });
}

// 显示数据源的树状结构
function showTreeTable(roleList) {
    for(var i = 0, iLen = roleList.length; i < iLen; i++) {
        var obj = {
            id: roleList[i].id,
            pId: roleList[i].pid || 0,
            name: roleList[i].name,
            deleted: roleList[i].deleted,
            open: true,
            data: roleList[i]
        };
        zNodes.push(obj);
    }
    setTreeViewContent(zNodes);
    // for(var i = 0, iLen = roleList.length; i < iLen; i++) {
    //     var openFlag = false;
    //     var nodeChildren = [];
    //     if (roleList[i].open) {
    //         openFlag = roleList[i].open
    //     }
    //     if (roleList[i].children) {
    //         nodeChildren = roleList[i].children
    //     }
    //     var obj = {
    //         id: roleList[i].id,
    //         pid: roleList[i].pid || '',
    //         name: roleList[i].name,
    //         deleted: roleList[i].deleted,
    //         open: openFlag,
    //         isParent: true,
    //         children: nodeChildren
    //     };
    //     if(parseInt(userId) !== 0) {
    //         obj.chkDisabled = true;
    //     }
    //     zNodes.push(obj);
    //     userObjRole.push({id:roleList[i].id, pid: roleList[i].pid});
    // }
    // setTreeViewContent(zNodes);
}

// 树状结构配置
function setTreeViewContent(zNodes) {
    // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    var setting = {
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
        data: {
            simpleData: {
                enable: true
            }
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
    // if(parseInt(userId) !== 0) {
    //     setting['check'] =  {
    //         enable: true,
    //         chkboxType: {"Y": "", "N": ""}
    //     };
    // }
    zTreeObj = $.fn.zTree.init($roleTree, setting, zNodes);
    $("#selectAll").bind("click", selectAll);
}

/*function onCheck(event, treeId, treeNode) {
    // 点击checkbox时的回调函数
}*/

function confirmPost(event) {
    event.stopPropagation();
    var nodes=zTreeObj.getChangeCheckedNodes(true);
    var roleIds = [];
    for(var i = 0, len = nodes.length; i < len; i++) {
        roleIds.push(nodes[i].id);
    }
    $.ajax({
        type:'post',
        url:'/system/allotment_role/' + userId,
        contentType:'application/json;charset=utf-8',
        dataType:'json',
        data: JSON.stringify(roleIds),
        success:function(data){
            parent.window.refreshAndShowMessage({
                title: '设置用户角色成功！',
                text: '请在用户列表中查看',
                type: 'success',
                delay: 3000,
                addclass: "stack-bottomright",
                stack: stack_bottomright
            });
            parent.layer.closeAll();
        },error:function(XMLHttpRequest, textStatus, errorThrown){
            parent.window.refreshAndShowMessage({
                title: '设置用户角色失败！',
                text: '服务器内部错误！',
                type: 'error',
                delay: 3000,
                addclass: "stack-bottomright",
                stack: stack_bottomright
            });
            parent.layer.closeAll();
        }
    });
}

function onClick(event, treeId, treeNode) {
    console.log(event.target);
    var url = '/role/' + treeNode.id + '/menus'
    var title = '菜单配置 - ' + treeNode.name
    layer.open({
        type: 2,
        content: url,
        area: ['80%', '80%'],
        maxmin: true,
        shadeClose: true,
        title: title
    });
}

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) {
        parentNode.isParent = false;
        return null;
    }
    for (var i=0, l=childNodes.length; i<l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
        childNodes[i].isParent = true;
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
    if (targetNode) {
        var postData = {
            pid: targetNode.id
        }
        $.ajax({
            type:'post',
            url:'/form/create_update_data/' + formId + '/' + treeNodes[0].id,
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
    className = (className === "dark" ? "":"dark");
    showLog("[ "+getTime()+" beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
    var zTree = $.fn.zTree.getZTreeObj("role-tree");
    zTree.selectNode(treeNode);
    setTimeout(function() {
        if (confirm("进入节点 -- " + treeNode.name + " 的编辑状态吗？")) {
            setTimeout(function() {
                zTree.editName(treeNode);
            }, 0);
        }
    }, 0);
    return false;
}

function beforeRemove(treeId, treeNode) {
    className = (className === "dark" ? "":"dark");
    var zTree = $.fn.zTree.getZTreeObj("role-tree");
    zTree.selectNode(treeNode);
    if (confirm("确认删除 -- " + treeNode.name + " 吗？")) {
        $.ajax({
            type:'post',
            url:'/role/delete/' + treeNode.id,
            contentType:'application/json;charset=utf-8',
            dataType:'json',
            success:function(data){
                console.log(data);
                return true;
            },error:function(XMLHttpRequest, textStatus, errorThrown){
                alert('删除失败，服务器内部错误');
                return false;
            }
        });
    } else {
        return false;
    }
    // return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
}

function onRemove(e, treeId, treeNode) {
    console.log('确定删除节点了')
    console.log(treeNode)
    showLog("[ "+getTime()+" onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
}

function beforeRename(treeId, treeNode, newName, isCancel) {
    oldNodeName = treeNode.name
    className = (className === "dark" ? "":"dark");
    if (newName.length == 0) {
        setTimeout(function() {
            var zTree = $.fn.zTree.getZTreeObj("role-tree");
            zTree.cancelEditName();
            alert("节点名称不能为空.");
        }, 0);
        return false;
    }
    return true;
}

function onRename(e, treeId, treeNode, isCancel) {
    console.log(treeNode)
    $.ajax({
        type:'post',
        url:'/role/create_update',
        contentType:'application/json;charset=utf-8',
        dataType:'json',
        data: JSON.stringify({name: treeNode.name, id: treeNode.id}),
        success:function(data){
            console.log(data);
        },error:function(XMLHttpRequest, textStatus, errorThrown){
            treeNode.name = oldNodeName
            var zTree = $.fn.zTree.getZTreeObj("role-tree");
            zTree.cancelEditName();
            alert('修改名称失败，服务器内部错误');
        }
    });
}

function showRemoveBtn(treeId, treeNode) {
    // return !treeNode.isFirstNode;
    return true;
}

function showRenameBtn(treeId, treeNode) {
    // return !treeNode.isLastNode;
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
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0 || $("#setBtn_"+treeNode.tId).length>0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='新增下级' onfocus='this.blur();'></span>";
    var setStr = "<button class='btn btn-sm set-icon icon-cog' style='margin-left: 5px;margin-top: -2px;padding: 2px;font-size: 11px;border-radius: 0;background-color: #ffffff;border: 1px solid #878787;' id='setBtn_" + treeNode.tId
        + "' title='按钮分配' onfocus='this.blur();'></button>";
    var pStr = "<button class='btn btn-sm set-icon icon-edit' style='margin-left: 5px;margin-top: -2px;padding: 2px;font-size: 11px;border-radius: 0;background-color: #ffffff;border: 1px solid #878787;' id='pBtn_" + treeNode.tId
        + "' title='权限分配' onfocus='this.blur();'></button>";
    sObj.append(addStr);
    sObj.append(setStr);
    sObj.append(pStr);
    var btn = $("#addBtn_"+treeNode.tId);
    var btn2 = $("#setBtn_"+treeNode.tId);
    var btn3 = $("#pBtn_"+treeNode.tId);
    if (btn) btn.bind("click", function(e){
        var postData = {
            pid: treeNode.id,
            name: "新角色" + newCount
        }
        $.ajax({
            type:'post',
            url:'/role/create_update',
            contentType:'application/json;charset=utf-8',
            dataType:'json',
            data: JSON.stringify(postData),
            success:function(data){
                var zTree = $.fn.zTree.getZTreeObj("role-tree");
                zTree.addNodes(treeNode, {id:data.data.data_object.id, pId:treeNode.id, name:"新角色" + newCount});
                var zTree = $.fn.zTree.getZTreeObj("role-tree");
                newCount++
                return false;
            },error:function(XMLHttpRequest, textStatus, errorThrown){
                alert('新建失败，服务器内部错误');
            }
        });
        e.stopPropagation();
    });
    if (btn2) btn2.bind("click", function(e){
        roleConfig(treeNode.id);
        e.stopPropagation();
    });
    if (btn3) btn3.bind("click", function(e){
        permissionConfig(treeNode.id);
        e.stopPropagation();
    })
}
function roleConfig(menuId){
    var id=menuId;
    var index = layer.open({
        type: 2,
        content: '/role/'+id+'/buttons',
        area: ['80%', '80%'],
        maxmin: true,
        success: function(index,layero){
            $("#main").text("加载成功");
        },
        error:function(index,layero){
            console.log("请求不到页面");
        }
    });
    layer.full(index);
}
//权限页面
function permissionConfig(menuId){
    var id=menuId;
    var index = layer.open({
        type: 2,
        content: '/role/'+id+'/permissions',
        area: ['80%', '80%'],
        maxmin: true,
        success: function(index,layero){
            $("#main").text("加载成功");
        },
        error:function(index,layero){
            console.log("请求不到页面");
        }
    });
    layer.full(index);
}
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
    $("#setBtn_"+treeNode.tId).unbind().remove();
    $("#pBtn_"+treeNode.tId).unbind().remove();
}

function selectAll() {
    var zTree = $.fn.zTree.getZTreeObj("role-tree");
    zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
}

// 关闭模态窗
function closeFrame() {
    if(parent.layer) {
        var layerIndex = parent.layer.getFrameIndex(window.name);
        parent.layer.close(layerIndex);
    }
}
