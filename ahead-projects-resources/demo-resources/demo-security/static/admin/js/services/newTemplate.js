/**
 * Created by mu-HUN on 2018/10/10.
 */
$(function () {
    //内容富文本
    var content;
    var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};
    var $save = $('#save'),
        $close = $('#close'),
        $form = $("#newForm"),
        $reset = $('#reset');
    $(function () {
        initPage();
    });
//初始化页面
    function initPage() {
        content = CKEDITOR.replace('content',{
            filebrowserImageUploadUrl:"/adjuncts/ckeditor/file_upload",/*文件上传路径*/
            resize_enabled : false,
            autoUpdateElement : true,
            height:200
        });
        formValidator();
        $save.on('click',function (e) {
            $form.data('bootstrapValidator').validate();
            var isValid = $form.data('bootstrapValidator').isValid();
            if(!isValid){
                return;
            }
            layer.msg('表单提交中...',{
                icon: 16,
                shade: 0.01,
                time: 8000
            });
            var postData = {};
            $("#content").val(content.getData());
            var array = $form.serializeArray();
            $.each(array, function () {
                if(postData[this.name]) {
                    if(!postData[this.name].push) {
                        postData[this.name] = [postData[this.name]];
                    }
                    postData[this.name].push(this.value || null);
                } else {
                    postData[this.name] = this.value || null;
                }
            });
            if(!!$('#selectItemId').val()){
                postData = postDataInit(postData);
                postData['id'] = $('#selectItemId').val();//id
                $.ajax({
                    contentType: 'application/json;charset=utf-8',
                    url: '/admin/template/create_update',
                    type: 'post',
                    data: JSON.stringify(postData),
                    success: function (res) {
                        if(res.status ==200) {
                            parent.window.refreshAndShowMessage({
                                title: '修改表单信息成功！',
                                text: '请查看',
                                type: 'success',
                                delay: 3000,
                                addclass: 'stack-bottomright',
                                stack: stack_bottomright
                            });
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.refreshTable();
                            parent.layer.close(index);
                        }else{
                            new PNotify({
                                title: '修改表单信息失败！',
                                text: res.message,
                                type: 'error',
                                delay: 3000,
                                addclass: "stack-bottomright",
                                stack: stack_bottomright
                            })
                        }
                    }
                })
            } else {
                //    新建
                postData=postDataInit(postData);
                $.ajax({
                    contentType: 'application/json;charset=utf-8',
                    url: '/admin/template/create_update',
                    type: 'post',
                    data: JSON.stringify(postData),
                    success: function (res) {
                        layer.closeAll();
                        if(res.status == 200) {
                            parent.window.refreshAndShowMessage({
                                title: '新建表单信息成功！',
                                text: '请在其他需求管理中查看',
                                type: 'success',
                                delay: 3000,
                                addclass: "stack-bottomright",
                                stack: stack_bottomright
                            });
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.refreshTable();
                            parent.layer.close(index);
                        } else {
                            new PNotify({
                                title: '新建表单信息失败！',
                                text: res.message,
                                type: 'error',
                                delay: 3000,
                                addclass: "stack-bottomright",
                                stack: stack_bottomright
                            });
                        }
                    },
                    error:function (error) {
                        layer.closeAll();
                        new PNotify({
                            title:'新建表单失败！',
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
        //关闭窗口
        $close.on('click',function (e) {
            e.stopPropagation();
            window.close();
            /*var index = parent.layer.getFrameIndex(window.name);
             parent.layer.close(index);*/
        });
//    重置
        $reset.on('click',function (e) {
            e.stopPropagation();
            $form.bootstrapValidator('resetForm',true);
            $form[0].reset();
        })
    }
//postData参数处理
    function postDataInit(data){
        return data;
    }
    function formValidator() {
        $form.bootstrapValidator({
            message: '这个值无效',
            feedbackIcons: {/*输入框不同状态，显示图片的样式*/
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            excluded: [':disabled', ':hidden', 'select']
        })
    }
})