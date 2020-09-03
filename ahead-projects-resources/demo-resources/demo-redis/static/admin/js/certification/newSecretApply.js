/**
 * Created by mu-HUN on 2018/8/8.
 */
//全局变量
// 情况描述：situation_desc 富文本
var situation;
// 需求描述：demand_desc 富文本
var demandDesc;
// 项目难点：demand_diff  富文本
var demandDiff;
var $form = $('#newForm');
var $save = $('#save');
var $close = $('#close');
var $reset = $('#reset');
$(function () {
    initPage();
});
//初始化
function initPage() {
    if (!!$('#secretApplyId').val()) {
        var t = getMyDate($('#release_time').data('time')).split(" ")[0];
        $('#release_time').val(t);
        var file = $('#adjunct_ids').data('file');
        if (!!file && file.length) {
            var fileList = $(".file-list");
            for (var i = 0; i < file.length; i++) {
                var filename = file[i].title + "." + file[i].prefix;
                var suffix = file[i].prefix;
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
                fileList.append('<div class="file-item"><img class="file-icon pull-left" src="' + iconSrc + '"/><div class="file-name" title="' + filename + '" data-id="' + file[i].id + '">' + filename + '</div><i class="icon-remove-sign pull-right file-remove" title="删除"></i></div>');
            }
            $("#fileInput").val("已选择" + file.length + "个文件");
        }
    }
    formValidator();
    $save.on('click', function (e) {
        $form.data('bootstrapValidator').validate();
        var isValid = $form.data('bootstrapValidator').isValid();
        if (!isValid) {
            return;
        }
        layer.msg('表单提交中...', {
            icon: 16,
            shade: 0.01,
            time: 8000
        });
        var postData = {};
        var array = $form.serializeArray();
        $.each(array, function () {
            if (postData[this.name]) {
                if (!postData[this.name].push) {
                    postData[this.name] = [postData[this.name]];
                }
                postData[this.name].push(this.value || null);
            } else {
                postData[this.name] = this.value || null;
            }
        });
        console.log(postData)
        if (!!$('#secretApplyId').val()) {
            postData['id'] = $('#secretApplyId').val();//id
            console.log(postData);
            $.ajax({
                url: '/admin/secretApply/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    layer.closeAll();
                    if (res.status == 200) {
                        parent.window.refreshAndShowMessage({
                            title: '新建轮播图成功！',
                            text: '请在管理中查看',
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
                error: function (error) {
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
            //    新建
            $.ajax({
                url: '/admin/secretApply/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    layer.closeAll();
                    if (res.status == 200) {
                        parent.window.refreshAndShowMessage({
                            title: '修改表单信息成功！',
                            text: '请在管理中查看修改后的内容',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                        var index = parent.layer.getFrameIndex(window.name)
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
                error: function (error) {
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
            });
        }
    });
    $close.on("click", function (e) {
        e.stopPropagation();
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    });
    $reset.on('click', function (e) {
        e.stopPropagation();
        $form.bootstrapValidator('resetForm', true);
        $form[0].reset();
    });
}
//修改页面 回显数据
function echoData() {
    console.log("回线数据");
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
        excluded: [':disabled', ':hidden', 'select'],
        fields: {
            phone: {
                message:'请输入联系电话',
                validators: {
                    regexp:{
                        regexp:/^((00|\+)?(86(?:-| )))?((\d{11})|(\d{3}[- ]{1}\d{4}[- ]{1}\d{4})|((\d{2,4}[- ]){1}(\d{7,8}|(\d{3,4}[- ]{1}\d{4}))([- ]{1}\d{1,4})?))$/,
                        message:'请输入正确号码'
                    }
                }
            }
        }
    })
}
