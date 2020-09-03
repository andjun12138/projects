/**
 * Created by mu-HUN on 2018/9/4.
 * 个人管理-前端角色管理
 */
var $roleTree = $('#role-tree');
var zNodes = [];
var oldNodeName = '';
var formId = 39;

$(function(){
    showTreeTable(roleList)
});
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
            showRemoveBtn: false,
            showRenameBtn: false
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: onClick
        }
    };
    zTreeObj = $.fn.zTree.init($roleTree, setting, zNodes);
    $("#selectAll").bind("click", selectAll);
}
function onClick(event, treeId, treeNode) {
    var url = '/admin/frontRoleMenu/' + treeNode.id + '/menus.html'
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
var log, className = "dark";
function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#setBtn_"+treeNode.tId).length>0) return;
    var setStr = "<button class='btn btn-sm set-icon icon-cog' style='margin-left: 5px;margin-top: -2px;padding: 2px;font-size: 11px;border-radius: 0;background-color: #ffffff;border: 1px solid #878787;' id='setBtn_" + treeNode.tId
        + "' title='按钮分配' onfocus='this.blur();'></button>";
    sObj.append(setStr);
    var btn = $("#setBtn_"+treeNode.tId);
    if (btn) btn.bind("click", function(e){
        roleConfig(treeNode.id);
        e.stopPropagation();
    });
}
function roleConfig(menuId){
    var id=menuId;
    var index = layer.open({
        type: 2,
        content: '/admin/frontRoleMenu/'+id+'/menus.html',
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
    $("#setBtn_"+treeNode.tId).unbind().remove();
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
