// 保存或修改接口 /aboutUs/create_update  POST
/*
 * create by wupeng at 2018/2/28
 */
var $save = $('#save'),
    $close = $("#close"),
    $reset = $('#reset'),
    $form = $("#newForm");
var helpCenterId = $('#helpCenterId').val()
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
$(function () {
    initPage();
});

function initPage() {
    // 关闭窗口
    $close.on("click", function (e) {
        e.stopPropagation();
        var index = parent.layer.getFrameIndex(window.name)
        parent.layer.close(index);
    });
    // 重置
    $reset.on('click', function (e) {
        e.stopPropagation();
        $form.bootstrapValidator('resetForm', true);
        $form[0].reset();
    });
    if (!!helpCenterId) {
        var file = $('#adjunct_id').data('file');
        if(!!file && file.length){
            var fileList=$(".file-list");
            for(var i=0;i<file.length;i++){
                var filename=file[i].title+"."+file[i].prefix;
                var suffix=file[i].prefix;
                var iconSrc='';
                switch (suffix) {
                    case 'doc':
                    case 'docx':
                        iconSrc = '/static/assets/word.png';
                        break;
                    case 'xls':
                    case 'xlsx':
                        iconSrc = '/static/assets/excel.png';
                        break;
                    case 'txt':
                        iconSrc = '/static/assets/txt.png';
                        break;
                    case 'pdf':
                        iconSrc = '/static/assets/pdf.png';
                        break;
                    case 'zip':
                    case 'rar':
                        iconSrc = '/static/assets/zip.png';
                        break;
                    case 'png':
                    case 'jpg':
                    case 'jpeg':
                    case 'gif':
                        iconSrc = '/static/assets/photo.png';
                        break;
                    default:
                        iconSrc = '/static/assets/file.png';
                }
                fileList.append('<div class="file-item"><img class="file-icon pull-left" src="' + iconSrc + '"/><div class="file-name" title="' + filename + '" data-id="'+file[i].id+'">' + filename + '</div><i class="icon-remove-sign pull-right file-remove" title="删除"></i></div>');
            }
            $("#fileInput").val("已选择"+file.length+"个文件");
        }
    }


    //初始化富文本插件
    var problemsContent = CKEDITOR.replace('problems',{});
    var operationContent = CKEDITOR.replace('operation',{});

    $save.on('click', function (e) {
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
        $("#problems").val(problemsContent.getData());
        $("#operation").val(operationContent.getData());
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
        postData = initDataInit(postData);
        if (!!helpCenterId) {
            postData['id'] = helpCenterId;
            $.ajax({
                url: '/helpCenter/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    layer.closeAll();
                    if(res.status == 200) {
                        new PNotify({
                            title: '修改表单信息成功！',
                            text: '请在关于我们管理中查看修改后的内容',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
/*                        parent.window.refreshAndShowMessage({
                            title: '修改表单信息成功！',
                            text: '请在关于我们管理中查看修改后的内容',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });*/
                        var index = parent.layer.getFrameIndex(window.name)
                        parent.layer.close(index);
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
            })
        } else {
            $.ajax({
                url: '/helpCenter/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    layer.closeAll();
                    if(res.status === 200) {
                        parent.window.refreshAndShowMessage({
                            title: '新建孵化平台成功！',
                            text: '请在关于我们管理中查看',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                        var index = parent.layer.getFrameIndex(window.name)
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
    formValidator();

    $('#newForm').on("change",'input[type="file"]',function (e) {
        e.stopPropagation();
        var fileList = $(this).get(0).files;
        if(fileList.length == 0)return ;
        var target=$(this).next().next().children(".file-list").first();
        var targetInput=$(this).next().children('input').first();
        var formData = new FormData();
        // for(var i = 0;fileList.length;i++)
        formData.append('files',fileList[0]);
        var xhr = getRequestObject();
        xhr.onload = function () {
            console.log(xhr);
            var data=JSON.parse(xhr.responseText);
            if(xhr.status===200){
                var list = data.data.data_list;
                var fileIds = targetInput.attr('data-id') || '';
                for(var i = 0; i < list.length; i++) {
                    if(fileIds === '') {
                        fileIds += list[i].id;
                    } else {
                        fileIds += ',' + list[i].id;
                    }
                    var suffix = (fileList[i].name).split('.')[1];
                    var iconSrc = '';
                    switch (suffix) {
                        case 'doc':
                        case 'docx':
                            iconSrc = '/static/assets/word.png';
                            break;
                        case 'xls':
                        case 'xlsx':
                            iconSrc = '/static/assets/excel.png';
                            break;
                        case 'txt':
                            iconSrc = '/static/assets/txt.png';
                            break;
                        case 'pdf':
                            iconSrc = '/static/assets/pdf.png';
                            break;
                        case 'zip':
                        case 'rar':
                            iconSrc = '/static/assets/zip.png';
                            break;
                        case 'png':
                        case 'jpg':
                        case 'jpeg':
                        case 'gif':
                            iconSrc = '/static/assets/photo.png';
                            break;
                        default:
                            iconSrc = '/static/assets/file.png';
                    }
                    target.append('<div class="file-item"><img class="file-icon pull-left" src="' + iconSrc + '"/><div class="file-name" title="' + fileList[i].name + '" data-id="'+list[i].id+'">' + fileList[i].name + '</div><i class="icon-remove-sign pull-right file-remove" title="删除"></i></div>');
                }
                targetInput.attr('data-id', fileIds);
                targetInput.val("已选择"+target.children('.file-item').length+"个文件");
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
        //    上传加载
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
    }).on("click",".file-remove",function (e) {
        e.stopPropagation();
        var self=$(this);
        layer.confirm('你确定删除该文件',{
            btn:['确定','取消']
        },function(){
            var fileListDom=self.parent().parent();
            var inputDom=fileListDom.parent().prev().children('input[type="text"]');
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
                inputDom.val("已选择"+fileListDom.length+"个文件");
            }
            layer.closeAll();
        },function () {
            layer.closeAll();
        });
    }).on('click','.file-item .file-name',function (e) {
        e.stopPropagation();
        var id = $(this).data('id');
        var name = $(this).text();
        var suffix = name.split('.')[1];
        if(suffix === 'png' || suffix === 'jpeg' || suffix === 'jpg' || suffix === 'gif') {
            layer.open({
                type: 1,
                title: name,
                shadeClose: true,
                shade: 0.3,
                area: ['80%', '80%'],
                content: '<img src="'+'/adjuncts/file_download/'+id+'"/>'
            });
        } else {
            window.open("/adjuncts/file_download/"+id);
        }
    })
}


function initDataInit(data) {
    var fileList = $(".file-list");
    var length = fileList.children().length;
    var id = "";
    for(var i=0;i<length;i++){
        id+=fileList.children().eq(i).children("div").data("id");
        if(i!=length-1){
            id+=",";
        }
    }
    data['adjunctId'] = id;
    return data;
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
