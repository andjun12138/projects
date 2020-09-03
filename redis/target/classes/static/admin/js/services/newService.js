
/**
 * 创建或者修改成果：/admin/result/create_update
 * 请求方式：post
 */


var $save = $('#save'),
    $close = $('#close'),
    $form = $("#newForm"),
    $reset = $('#reset');
    $address=$("#addressBox");//省市区
var $pass = $('#pass');
var $storage = $('#storage');
$(function () {
    initPage();
    $address.on('blur','select',function(e){
        e.stopPropagation();
        getAddress();
    });
    getAddress();
    $pass.on('click', function (e) {
        e.stopPropagation();
        var ids=[];
        ids.push($('#serviceId').val());
        // postData.id.push($('#demandId').val());
        $.ajax({
            url: '/admin/services/pass',
            data: JSON.stringify(ids),
            type: 'post',
            contentType: 'application/json;charset=utf-8',
            success: function (res) {
                if(res.status == 200) {
                    new PNotify({
                        title: '审核通过成功！',
                        text: '请在成果列表查看',
                        type: 'success',
                        delay: 3000,
                        addclass: "stack-bottomright",
                        stack: stack_bottomright
                    });
                }
            }
        })
    });
    $storage.on('click', function (e) {
        e.stopPropagation();
        var ids=[];
        ids.push($('#serviceId').val());
        // postData.id.push($('#demandId').val());
        $.ajax({
            url: '/admin/services/serviceStaging',
            data: JSON.stringify(ids),
            type: 'post',
            contentType: 'application/json;charset=utf-8',
            success: function (res) {
                if(res.status == 200) {
                    new PNotify({
                        title: '暂存成功！',
                        type: 'success',
                        delay: 3000,
                        addclass: "stack-bottomright",
                        stack: stack_bottomright
                    });
                }
            }
        })
    })
    if (!!$('#serviceId').val()) {
        var file = $('#icon').data('file');
        if(file != null){
            if(file.length){
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
        if(!!$('#front_user_id').data('publisher')) {
            var publisher = $('#front_user_id').data('publisher');
            $('#front_user_id').attr('data-publisher',publisher.id);
            $('#front_user_id').val(publisher.nickName);
        }
    }
});
function getAddress(){
    var province = $("#provinceName").find("option:selected").text();
    var city = $("#cityName").find("option:selected").text();
    var district = $("#districtName").find("option:selected").text();
    var address=""+province+city+district;
    $("#area").val(address+"");
}
//初始化
function initPage() {
    // 初始化富文本
    var detail = CKEDITOR.replace('detail',{
        filebrowserImageUploadUrl:"/adjuncts/ckeditor/file_upload",/*文件上传路径*/
        resize_enabled : false,
        autoUpdateElement : true,
        height:200
    });
    var conditions = CKEDITOR.replace('conditions',{
        filebrowserImageUploadUrl:"/adjuncts/ckeditor/file_upload",/*文件上传路径*/
        resize_enabled : false,
        autoUpdateElement : true,
        height:200
    });
    var workflow = CKEDITOR.replace('workflow',{
        filebrowserImageUploadUrl:"/adjuncts/ckeditor/file_upload",/*文件上传路径*/
        resize_enabled : false,
        autoUpdateElement : true,
        height:200
    });
    var successcase = CKEDITOR.replace('successcase',{
        filebrowserImageUploadUrl:"/adjuncts/ckeditor/file_upload",/*文件上传路径*/
        resize_enabled : false,
        autoUpdateElement : true,
        height:200
    });
    //关闭窗口
    $close.on('click',function (e) {
        e.stopPropagation();
        window.close();
    });
//    重置
    $reset.on('click',function (e) {
        e.stopPropagation();
        $form.bootstrapValidator('resetForm',true);
        $form[0].reset();
    })
    //保存
    $save.click(function() {
        $form.data('bootstrapValidator').validate();
        var isValid = $form.data('bootstrapValidator').isValid();
        if (!isValid) {
            layer.msg('请完整填写');
            return ;
        }
        layer.msg('表单提交中...', { // 提交加载动画
            icon: 16,
            shade: 0.01,
            time: 8000
        });
        $("#detail").val(detail.getData());
        $("#conditions").val(conditions.getData());
        $("#workflow").val(workflow.getData());
        $("#successcase").val(successcase.getData());
        var postData = {};
        var array = $form.serializeArray();
        console.log(array)
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
        console.log("postdata");
        console.log(postData);
        var id = $('#serviceId').val();
        postData = initDataInit(postData);
        if(!!id){
            postData['id'] = id;
            $.ajax({
                url:'/admin/services/create_update',
                data:JSON.stringify(postData),
                type:'post',
                contentType:'application/json;charset=utf-8',
                success: function (res) {
                    layer.closeAll();
                    if(res.status === 200) {
                        new PNotify({
                            title: '修改成功！',
                            text: '请在服务管理中查看',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                        var index = parent.layer.getFrameIndex(window.name)
                        parent.layer.close(index);
                    } else {
                        console.log('d')
                        new PNotify({
                            title: '修改服务失败！',
                            text: res.message,
                            type: 'error',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                    }
                },
                error: function (error) {
                    layer.closeAll();
                    console.log(error);
                }
            });
        }else {
            $.ajax({
                url:'/admin/services/create_update',
                data:JSON.stringify(postData),
                type:'post',
                contentType:'application/json;charset=utf-8',
                success:function (res) {
                    layer.closeAll();
                    if(res.status === 200) {
                        parent.window.refreshAndShowMessage({
                            title: '新建服务成功！',
                            text: '请在服务管理中查看',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                        var index = parent.layer.getFrameIndex(window.name)
                        parent.layer.close(index);
                    } else {
                        new PNotify({
                            title: '新建服务失败！',
                            text: res.message,
                            type: 'error',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                    }
                },
                error: function (error) {
                    layer.closeAll();
                    console.log(error);
                }
            })
        }
    });
    formValidator();

    //    附件上传
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
        })
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
    });

}
//初始化验证表单
function formValidator() {
    $form.bootstrapValidator({
        message: '这个值无效',
        feedbackIcons: {
            /*输入框不同状态，显示图片的样式*/
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        excluded: [':disabled', ':hidden', 'select']
    });
}
//postData 参数处理
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
    data['icon'] = id;
    data['frontUserId'] = $('#front_user_id').attr('data-publisher');
    return data;
}


//打开关联选项框
function openPublisher(event){
    var target=$(event.currentTarget);
    var url=target.attr('data-url');
    var index = layer.open({
        type: 2,
        content: url,
        area: ['1000px', '600px'],
        maxmin: true,
        shadeClose: true,
        // title: title,
        success: function(layero, index){
        }
    });
    layer.full(index);
}

function handleRelevance(data) {
    var info = data.data;
    $('#front_user_id').val(info[0].nickname);
    $('#front_user_id').attr('data-publisher',info[0].id);
}