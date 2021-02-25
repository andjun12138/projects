/**
 * Created by mu-HUN on 2018/9/10.
 */
var $save = $('#save'),
    $close = $('#close'),
    $form = $("#newForm"),
    $reset = $('#reset');
$(function () {
    initPage();
});
//初始化
function initPage() {
    //关闭窗口
    $close.on('click',function (e) {
        e.stopPropagation();
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
        // window.close();
    });
//    重置
    $reset.on('click',function (e) {
        e.stopPropagation();
        $form.bootstrapValidator('resetForm',true);
        $form[0].reset();
    });
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
        postData['type'] = type;
        var id = $('#keyWordsId').val();
        if(!!id){
            postData['id'] = id;
            $.ajax({
                url:'/admin/subscribeKeywords/create_update',
                data:JSON.stringify(postData),
                type:'post',
                contentType:'application/json;charset=utf-8',
                success: function (res) {
                    layer.closeAll();
                    if(res.status === 200) {
                        parent.window.refreshAndShowMessage({
                            title: '修改类型成功！',
                            text: '请在类型管理中查看',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                        // new PNotify({
                        //     title: '修改类型成功！',
                        //     text: '请在类型管理中查看',
                        //     type: 'success',
                        //     delay: 3000,
                        //     addclass: "stack-bottomright",
                        //     stack: stack_bottomright
                        // });
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.refreshTable();
                        parent.layer.close(index);
                        // parent.layer.close(index);
                    } else {
                        new PNotify({
                            title: '修改类型失败！',
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
                url:'/admin/subscribeKeywords/create_update',
                data:JSON.stringify(postData),
                type:'post',
                contentType:'application/json;charset=utf-8',
                success:function (res) {
                    layer.closeAll();
                    if(res.status === 200) {
                        parent.window.refreshAndShowMessage({
                            title: '新建关键字成功！',
                            text: '请在关键字管理中查看',
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
                            title: '新建关键字失败！',
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
}
//初始化验证表单
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