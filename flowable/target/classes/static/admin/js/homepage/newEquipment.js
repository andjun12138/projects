var equipmentId = $("#equipmentId").val();
// 消息框位置控制
var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};

// 内存数据管理
var FORM_PREVIEW = {
    state: {
        deleteFileIds: []
    },
    setDeleteFileIds: function (fileIds) {
        this.state.deleteFileIds = fileIds;
    },
    addDeleteFileId: function (fileId) {
        var deleteFileIds = this.getDeleteFileIds();
        for(var i = 0, len = deleteFileIds.length; i < len; i++) {
            if(parseInt(deleteFileIds[i]) === parseInt(fileId)) { // 查重
                return false;
            }
        }
        deleteFileIds.push(fileId);
        return true;
    },
    getDeleteFileIds: function () {
        return this.state.deleteFileIds;
    }
}
var fileLength=0;

$(function(){
    // 获取各个操作dom
    var $save = $('#save'),
        $close = $("#close"),
        $reset = $('#reset'),
        $form = $("#newForm");

    $('#buyTime').datetimepicker({
        format: 'yyyy-mm-dd', //显示格式
        language: 'zh-CN',
        todayHighlight: 1,
        minView: 2,
        todayBtn: true,
        autoclose: true
    });

    // 初始化插件
    $('.select2').val("").select2({
        placeholder: '请选择',
        maximumSelectionLength: 3,
        tags:true,
        multiple:true,
        allowClear : true,
        language: "zh-CN"
    });

    // 如果存在父窗口，获取窗口索引
    if(typeof parent.layer !== 'undefined' && equipmentId !== null) {
        var index = parent.layer.getFrameIndex(window.name);
    }
    if (equipmentId !== ""){
        initPage();
    }

    // 关闭窗口
    $close.on("click", function (e) {
        e.stopPropagation();
        window.close();
    });
    // 重置
    $reset.on('click', function (e) {
        e.stopPropagation();
        $form.bootstrapValidator('resetForm', true);
        $form[0].reset();
    });
    // 保存
    $save.click(function () {
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
        postData=postDataInit(postData);
        console.log(equipmentId)
        // 如果存在id
        if(typeof equipmentId !== 'undefined' && equipmentId !== null && equipmentId !== '' ){
            
            postData['id'] = equipmentId;
            console.log(postData);
            $.ajax({
                url: '/equipment/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    layer.closeAll();
                    if(res.status == 200) {
                        new PNotify({
                            title: '修改成功！',
                            text: '请在数据管理中查看修改后的内容',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
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
                error: function(error) {
                    layer.closeAll();
                    new PNotify({
                        title: '修改表单信息失败！',
                        text: '网络出错，请稍后再试',
                        type: 'error',
                        delay: 3000,
                        addclass: "stack-bottomright",
                        stack: stack_bottomright
                    });
                }
            });
        } else {

            $.ajax({
                url: '/equipment/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    layer.closeAll();
                    if(res.status === 200) {
                        parent.window.refreshAndShowMessage({
                            title: '新建成功！',
                            text: '请在数据管理中查看',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                        parent.layer.close(index);
                    } else {
                        new PNotify({
                            title: '新建表单失败！',
                            text: res.message,
                            type: 'error',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                    }

                },
                error: function(error) {
                    layer.closeAll();
                    new PNotify({
                        title: '新建表单失败！',
                        text: '网络出错，请稍后再试',
                        type: 'error',
                        delay: 3000,
                        addclass: "stack-bottomright",
                        stack: stack_bottomright
                    });
                }
            })
        }
    });
    function formValidator() {
        // 表单验证
        $form.bootstrapValidator({
            message: '这个值无效',
            feedbackIcons: {/*输入框不同状态，显示图片的样式*/
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            excluded: [':disabled', ':hidden', 'select'],
            fields: {/*验证*/
                servicePrice: {
                    message: '请填写有效金额（保留两位小数）',
                    validators: {
                        regexp: {
                            regexp: /^(([0-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/,
                            message: '只能输入数额,且保留两位小数'
                        }
                    }
                },
                phoneNum:{
                    message:'请输入正确电话联系方式',
                    validators:{
                        regexp:{
                            regexp:/^(\(\d{1,15}\)|\d{1,15}-)?\d{1,15}$/,
                            // regexp:/^((00|\+)?(86(?:-| )))?((\d{11})|(\d{3}[- ]{1}\d{4}[- ]{1}\d{4})|((\d{2,4}[- ]){1}(\d{7,8}|(\d{3,4}[- ]{1}\d{4}))([- ]{1}\d{1,4})?))$/,
                            message:'请输入正确电话联系方式'
                        }
                    }
                }
            }
        });

    }
    formValidator();
    $('#newForm').on("change",'input[type="file"]',function(e){
        e.stopPropagation();
/*        if(fileLength==1){
            layer.msg("仅能上传一张图片");
            var fileList = $(this).get(0).files;
            fileList.length=fileList.length-1;
            return ;
        }*/
        var fileList = $(this).get(0).files;
        if(fileList.length==0)return; //如果文件为空
        var formData=new FormData();
        // var target=$(this).next().next().children(".file-list").first();
        var target=$(this).parent().find(".file-list");
        var targetInput=$(this).next().children('input');
        if (fileList[0].type.indexOf("image")<0) {
            layer.msg("请上传图片格式文件");
            return;
        }
        formData.append('files',fileList[0]);
        var xhr = getRequestObject();
        //  成功回调
        xhr.onload = function(){
            var data=JSON.parse(xhr.responseText);/*需要引入文件 /static/plugin/ajaxfileupload.js*/
            if(xhr.status===200){
                var list = data.data.data_list;
                var iconSrc= '/static/assets/photo.png';
                target.append('<div class="file-item">' +
                    '<img class="file-icon pull-left" src="' + iconSrc + '"/>' +
                    '<div class="file-name" title="' + list[0].title + '" data-id="'+list[0].id+'">' + list[0].title+'.'+list[0].prefix+ '</div>' +
                    '<i class="icon-remove-sign pull-right file-remove" title="删除"></i>' +
                    '</div>');
                fileLength++;
                targetInput.val("已选择"+fileLength+"个文件");
                target.next().hide();
            }else{
                new PNotify({
                    title: '文件上传失败！',
                    text: '稍后再试',
                    type: 'error',
                    delay: 3000,
                    addclass: "stack-bottomright",
                    stack: stack_bottomright
                });
            }
        }
        xhr.onerror = function() {
            target.next().hide();
            new PNotify({
                title: '文件上传失败！',
                text: '稍后再试',
                type: 'error',
                delay: 3000,
                addclass: "stack-bottomright",
                stack: stack_bottomright
            });
        };
        xhr.upload.onprogress= function(event) {
            if(event.lengthComputable) {
                var percentComplete = event.loaded / event.total;
                if(parseInt(percentComplete*100) === 100) {
                    // 进度条消失显示
                    target.next().hide();
                } else {
                    target.next().show();
                    target.next().find('.progress-bar').first().css('width', parseInt(percentComplete*100)+'%')
                }
            } else {
                // Unable to compute progress information since the total size is unknown.
            }
        }
        // 打开链接
        xhr.open('POST', '/adjuncts/file_upload', true);
        // 发送请求
        xhr.send(formData);
    }).on("click",".file-remove",function(e){
        e.stopPropagation();
        var self=$(this);
        layer.confirm('你确定删除该文件',{
            btn:['确定','取消']
        },function(){
            var fileListDom=self.parent().parent();
            var inputDom=fileListDom.parent().prev().prev().children('input[type="text"]');
            var fileDom=self.parent();
            var fileId=parseInt(self.prev().attr('data-id'));
            FORM_PREVIEW.addDeleteFileId(fileId);
            fileDom.remove();
            var ids = inputDom.attr('data-id') || '';
            if(ids.indexOf(fileId+',') > -1) {
                ids = ids.replace(fileId+',', '');
            }else if(ids.indexOf(','+fileId) > -1){
                ids = ids.replace(','+fileId, '');
            }else if(ids.indexOf(fileId+'') > -1) {
                ids = ids.replace(fileId+'', '');
            }
            inputDom.attr('data-id', ids);
            if(fileListDom.children('.file-item').length === 0) {
                inputDom.val("");
            } else {
                inputDom.val("已选择"+fileListDom.length+"个文件")
            }
            layer.closeAll();
            fileLength--;
        },function () {
            layer.closeAll();
        });
    }).on('click','.file-item .file-name',function(e){
        e.stopPropagation();
        var id = $(this).attr('data-id');
        var name = $(this).text();
        layer.open({
            type: 1,
            title: name,
            shadeClose: true,
            shade: 0.3,
            area: ['80%', '80%'],
            content: '<img src="'+'/adjuncts/file_download/'+id+'"/>'
        });
    });

});
function upLoading(selector){
    $(selector).click();
}
//xmlhttprequest初始化
function getRequestObject(){
    var xhr=null;
    if(window.XMLHttpRequest){
        try{
            xhr = new XMLHttpRequest();
        }catch(e){
            xhr=null;
        }
    }else if(window.ActiveXObject){
        try{
            xhr=new ActiveXObject('Microsoft.XMLHTTP');
        }catch(e){
            try{
                xhr=new ActiveXObject('Msxml2.XMLHTTP');
            }catch(e){
                xhr=null;
            }
        }
    }
    return xhr;
}
function initPage(){
    // 作者发布时间
    var oDeadlineNode = $('#buyTime');
    var deadlineStr = null;
    deadlineStr = oDeadlineNode.val();
    if(!!deadlineStr){
        oDeadlineNode.val(formatTime(new Date(deadlineStr), false, 'YYYY-MM-DD'));
    }

    if (!!$("#picture").attr("data-picture")) {
        var picture_cover = JSON.parse($("#picture").attr("data-picture"));
        var picList = $(".file-list:eq(0)");
        for (var i = 0; i < picture_cover.length; i++) {
            var filename = picture_cover[i].title + "." + picture_cover[i].prefix;
            var iconSrc = '/static/assets/photo.png';
            picList.append('<div class="file-item"><img class="file-icon pull-left" src="' + iconSrc + '"/><div class="file-name" title="' + filename + '" data-id="' + picture_cover[i].id + '">' + filename + '</div><i class="icon-remove-sign pull-right file-remove" title="删除"></i></div>');
        }
        $("#fileInput").val("已选择" + picture_cover.length + "张图片");
        fileLength = picture_cover.length;
    }

    if(!!$("#status").data("status")){
        var status = $("#status").data("status").id;
        $('#status option[value="' + status + '"]').attr("selected", true);
    }

    if(!!$("#bigType").data("bigtype")){
        var bigType = $("#bigType").data("bigtype").id;
        $('#bigType option[value="' + bigType + '"]').attr("selected", true);
    }

    if(!!$("#smallType").data("smalltype")){
        var smallType = $("#smallType").data("smalltype").id;
        $('#smallType option[value="' + smallType + '"]').attr("selected", true);
    }

    if(!!$("#reserveType").data("reservetype")){
        var reserveType = $("#reserveType").data("reservetype").id;
        $('#reserveType option[value="' + reserveType + '"]').attr("selected", true);
    }

    if(!!$("#reserveWay").data("reserveway")){
        var reserveWay = $("#reserveWay").data("reserveway").id;
        $('#reserveWay option[value="' + reserveWay + '"]').attr("selected", true);
    }

}
function postDataInit(data){
    console.log('data',data);
    if(!!data.buyTime){
        var dateTime = new Date(data.buyTime);
        data.buyTime = dateTime;
    }

    var pList = $("#picture").siblings(".file-content").children(".file-list");
    var length = pList.children().length;
    var pid = "";
    for (var i = 0; i < length; i++) {
        pid += pList.children().eq(i).children("div").attr("data-id");
        if (i != length - 1) {
            pid += ",";
        }
    }
    data['picture'] = pid;

    return data;
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
