// 保存或修改接口 /incubaPlatform/create_update  POST
/*
 * create by wupeng at 2018/2/28
 */
var $save = $('#save'),
    $close = $("#close"),
    $reset = $('#reset'),
    $form = $("#newForm");
var incubaPlatformId = $('#selectItemId').val();
var fileLength=0;
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

var fileName = null;
var width = 70;
var height = 70;
//图片裁剪相关方法=================================start=======================
//1.初始化裁剪插件
var initCropper = function (img, input){
    var $image = img;
    var options = {
        aspectRatio: width / height,
        dragMode: 'move',
        viewMode: 1,
        cropBoxResizable: true,
        preview: '.img-preview'
    };
    $image.cropper(options);
    var $inputImage = input;
    var uploadedImageURL;
    if (URL) {
        $inputImage.change(function () {  // 给input添加监听
            //业务逻辑
            //判断文件大小
            if(fileLength==1){
                layer.msg('只能上传一张图片');
                var fileList = $(this).get(0).files;
                fileList.length=fileList.length-1;
                return ;
            }
            var uploadfile = $inputImage.val();
            fileName= getFileName(uploadfile);
            // $("#form").hide();

            var files = this.files;
            var file;
            if (!$image.data('cropper')) {
                return;
            }
            if (files && files.length) {
                file = files[0];
                if (/^image\/\w+$/.test(file.type)) {   // 判断是否是图像文件
                    $("#cropperBox").slideDown();
                    if (uploadedImageURL) {   // 如果URL已存在就先释放
                        URL.revokeObjectURL(uploadedImageURL);
                    }
                    uploadedImageURL = URL.createObjectURL(file);
                    // 销毁cropper后更改src属性再重新创建cropper
                    $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
                    $inputImage.val('');
                } else {
                    layer.msg('请选择一个图像文件！');
                    return;
                }
            }
        });
    } else {
        $inputImage.prop('disabled', true).addClass('disabled');
    }
};

var crop = function(){
    var $image = $('#photo');
    var $target = $('#selectImg');
    $image.cropper('getCroppedCanvas',{
        width:750,
        height:300
    }).toBlob(function(blob){
        // $("#form").show();
        var target = $('#pictureFileList');
        var targetInput = $('#fileInput');
        var fileIds = targetInput.attr('data-id') || '';

        $("#cropperBox").slideUp();
        $("#selectImg").show();
        $target.attr('src', URL.createObjectURL(blob));    // 将裁剪后的图片放到指定标签
        var formData = new FormData();      // 将裁剪后的图片上传到服务器
        formData.append('files', blob, fileName);
        $.ajax('/adjuncts/file_upload', {
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log('sssssssssssssssssssssssssss',res)
                //处理返回结果
                if(res.status === 200){
                    var list = res.data.data_list;
                    var fileIds = targetInput.attr('data-id') || '';
                    for(var i = 0; i < list.length; i++) {
                        if(fileIds === '') {
                            fileIds += list[i].id;
                        } else {
                            fileIds += ',' + list[i].id;
                        }
                        var suffix = list[i].prefix;
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
                        target.append('<div class="file-item"><img class="file-icon pull-left" src="' + iconSrc + '"/><div class="file-name" title="' + list[i].title+'.'+list[i].prefix + '" data-id="'+list[i].id+'">' + list[i].title+'.'+list[i].prefix + '</div><i class="icon-remove-sign pull-right file-remove" title="删除"></i></div>');
                    }
                    fileLength++;
                    targetInput.attr('data-id', fileIds);
                    targetInput.val("已选择"+fileLength+"个文件");
                }

            }
        });
    });
};
//图片裁剪相关方法=================================end==============================

$(function () {
    if(!!incubaPlatformId){
        initPage();
    }
    //初始化富文本插件
    var Resultcontent = CKEDITOR.replace('detail',{
        filebrowserImageUploadUrl:"/adjuncts/ckeditor/file_upload",/*文件上传路径*/
        resize_enabled : false,
        autoUpdateElement : true,
        height:200
    });

    initCropper($('#photo'),$('#logo'));

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
        $("#detail").val(Resultcontent.getData());
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
        if (!!$('.file-name').data('id')) {
            postData['logo'] = $('.file-name').data('id');
        } else if(fileLength == 1){
            layer.msg('只能上传一张图片',function(){});
            return ;
        }
        if (!!incubaPlatformId) {
            postData['id'] = incubaPlatformId;
            $.ajax({
                url: '/incubaPlatform/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    layer.closeAll();
                    if(res.status == 200) {
                        parent.window.refreshAndShowMessage({
                            title: '修改表单信息成功！',
                            text: '请在孵化器链接管理中查看修改后的内容',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
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
                url: '/incubaPlatform/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    layer.closeAll();
                    if(res.status === 200) {
                        parent.window.refreshAndShowMessage({
                            title: '新建孵化平台成功！',
                            text: '请在孵化器链接管理中查看',
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

    $('#newForm').on("change",'input[type="file"]',function(e){
        e.stopPropagation();
        if(fileLength==1){
            layer.msg("仅能上传一张图片");
            var fileList = $(this).get(0).files;
            fileList.length=fileList.length-1;
            return ;
        }
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
                fileLength=1;
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
            fileLength=0;
        },function () {
            layer.closeAll();
        });
    }).on('click','.file-item .file-name',function(e){
        e.stopPropagation();
        var id = $(this).attr('data-id');
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

function initPage() {
    var logo = $('#logo').data('pic');
    console.log('qqqqqqqqqqqqqqqqqqqqqq',logo);
    if(logo.length > 0 && !!logo[0] ){
        var picList = $('.file-list:eq(0)');
        var filename=logo[0].title+"."+logo[0].prefix;
        var iconSrc='/static/assets/photo.png';
        picList.append('<div class="file-item"><img class="file-icon pull-left" src="' + iconSrc + '"/><div class="file-name" title="' + filename + '" data-id="'+logo[0].id+'">' + filename + '</div><i class="icon-remove-sign pull-right file-remove" title="删除"></i></div>');
        $("#logoInput").val("已选择1张图片");
        fileLength=1;
    }
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
