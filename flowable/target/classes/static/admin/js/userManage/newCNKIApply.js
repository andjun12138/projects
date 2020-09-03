//type 注入
//  保存接口  /admin/reviewOpinion/{type}/create_update  POST
var $save = $('#save'),
    $form = $('#newForm'),
    $reset = $('#reset');
$(function () {
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
        var id = $('#cnkiApplyId').val();
        if(!!id){
            postData['id'] = id;
            $.ajax({
                url:'/cnkiApply/create_update',
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
