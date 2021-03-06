//type 注入
//  保存接口  /admin/reviewOpinion/{type}/create_update  POST
var $save = $('#save'),
    $form = $('#newForm'),
    $reset = $('#reset');
var enterCertificationId = $('#enterCertificationId').val()
var fileLength=0;
$(function () {
    if(!!enterCertificationId){
        //    修改页
        var logo = $('#logo').data('pic');
        if(logo.length > 0 && !!logo[0]){
            var picList = $('.file-list:eq(0)');
            var filename=logo[0].title+"."+logo[0].prefix;
            var iconSrc='/static/assets/photo.png';
            picList.append('<div class="file-item"><img class="file-icon pull-left" src="' + iconSrc + '"/><div class="file-name" title="' + filename + '" data-id="'+logo[0].id+'">' + filename + '</div><i class="icon-remove-sign pull-right file-remove" title="删除"></i></div>');
            $("#logoInput").val("已选择1张图片");
            fileLength=1;
        }
    }
    formValidator("#newForm");
    $reset.on('click',function (e) {
        e.stopPropagation();
        $form.bootstrapValidator('resetForm',true);
        $form[0].reset();
    });
    $save.on('click',function (e) {
        e.stopPropagation();
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
        var id = $('#enterCertificationId').val();
        if (!!$('.file-name').data('id')) {
            postData['logo'] = $('.file-name').data('id');
        } else {
            layer.msg('请上传至少一张图片',function(){});
            return ;
        }
        console.log(postData)
        if(!!id){
            postData['id'] = id;
            $.ajax({
                url:'/enterCertification/create_update',
                data:JSON.stringify(postData),
                type:'post',
                contentType:'application/json;charset=utf-8',
                success:function (res) {
                    layer.closeAll();
                    new PNotify({
                        title: '保存成功！',
                        text: '请在列表中查看',
                        type: 'success',
                        delay: 3000,
                        addclass: "stack-bottomright",
                        stack: stack_bottomright
                    });
                    var index = parent.layer.getFrameIndex(window.name)
                    parent.layer.close(index);
                }
            })
        }
    })
    $(document).on('change','input[type="file"]', function (e) {
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
        if(fileList[0].type.indexOf("image")<0){
            layer.msg("请上传图片格式文件");
            return ;
        }
        formData.append('files',fileList[0]);
        var target=$(this).parent().find(".file-list");
        var targetInput=$(this).next().children('input');
        var xhr = getRequestObject();
        //  成功回调
        xhr.onload = function(){
            var data=JSON.parse(xhr.responseText);
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
        var self = $(this);
        layer.confirm('你确定删除该logo图片',{
            btn:['确定','取消']
        },function(){
            var fileListDom=self.parent().parent();
            var inputDom=fileListDom.parent().prev().prev().children('input[type="text"]');
            var fileDom=self.parent();//file-item
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
            inputDom.val("");
            fileLength=0;
            layer.closeAll();
        },function () {
            layer.closeAll();
        }).on('click','.file-item .file-name',function(e){
            e.stopPropagation();
            var id = $(this).attr('data-id');
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
                    //    图片url接口
                });
            } else {
                window.open("/adjuncts/file_download/"+id);
                //
            }
        });
    }).on('click','.file-item .file-name',function(e){
        e.stopPropagation();
        var id = $(this).attr('data-id');
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
                //    图片url接口
            });
        } else {
            window.open("/adjuncts/file_download/"+id);
            //
        }
    })
});
function formValidator() {
    $form.bootstrapValidator({
        message:'这个值无效',
        feedbackIcons: {/*输入框不同状态，显示图片的样式*/
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        excluded: [':disabled', ':hidden', 'select']
    });
}
