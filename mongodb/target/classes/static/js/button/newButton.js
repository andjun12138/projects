var buttonId = $("#buttonId").val();
// 消息框位置控制
var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};

$(function(){
    // 获取各个操作dom
    var $save = $('#save'),
        $close = $("#close"),
        $reset = $('#reset'),
        $button = $("#newButton");

    // 初始化代码编辑框
    var editor = CodeMirror.fromTextArea(document.getElementById("jsContent"), {
        lineNumbers: true,     // 显示行数
        indentUnit: 4,         // 缩进单位为4
        styleActiveLine: true, // 当前行背景高亮
        matchBrackets: true,   // 括号匹配
        mode: 'text/javascript',     // HMTL混合模式
        lineWrapping: true,    // 自动换行
        theme: 'dracula'      // 使用monokai模版
    });

    editor.setOption("extraKeys", {
        // Tab键换成4个空格
        Tab: function(cm) {
            var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
            cm.replaceSelection(spaces);
        },
        // F10键切换全屏
        "F10": function(cm) {
            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        },
        // Esc键退出全屏
        "Esc": function(cm) {
            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        }
    });

    // 如果存在父窗口，获取窗口索引
    if(typeof parent.layer !== 'undefined' && buttonId !== null) {
        var index = parent.layer.getFrameIndex(window.name);
    }

    // 关闭窗口
    $close.on("click", function (e) {
        e.stopPropagation();
        window.close();
    });

    // 重置
    $reset.on('click', function (e) {
        e.stopPropagation();
        $button.bootstrapValidator('resetForm', true);
        $button[0].reset();
    });

    // tab事件控制
    $('#fieldTab a').click(function (e) {
        e.preventDefault()
        var url = $(this).attr('data-url');
        var target = $(this).attr('href');
        if($(target).children("iframe").length === 0) {
            $(target).append('<iframe class="tab_iframe" src="'+url+'" frameborder="0" width="100%" scrolling="auto" onload="changeFrameHeight(this)"></iframe>');
        }
        $(this).tab('show')
    });

    // 保存
    $save.click(function () {
        $button.data('bootstrapValidator').validate();
        var isValid = $button.data('bootstrapValidator').isValid();
        if(!isValid) {
            return;
        }
        layer.msg('数据提交中...', { // 提交加载动画
            icon: 16,
            shade: 0.01,
            time: 8000
        });
        var postData = {};
        postData['id'] = $("#buttonId").val() || null;
        postData['title'] = $("#title").val();
        postData['className'] = $("#className").val() || null;
        postData['icon'] = $("#icon").val() || null;
        postData['showIndex'] = $("#showIndex").val();
        postData['description'] = $("#description").val() || null;
        postData['jsContent'] = editor.getValue() || null;
        // 如果存在id
        if(typeof buttonId !== 'undefined' && buttonId !== null && buttonId !== '' ){
            postData['id'] = buttonId;
            $.ajax({
                url: '/button/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    layer.closeAll();
                    if(res.status == 200) {
                        new PNotify({
                            title: '修改数据成功！',
                            text: '请在详情中查看修改后的内容',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                    } else {
                        new PNotify({
                            title: '修改数据失败！',
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
                        title: '修改数据失败！',
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
                url: '/button/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    layer.closeAll();
                    if(res.status === 200) {
                        parent.window.refreshAndShowMessage({
                            title: '新建成功！',
                            text: '请在列表中查看',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                        parent.layer.close(index);
                    } else {
                       new PNotify({
                           title: '新建失败！',
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
                        title: '新建失败！',
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
        $button.bootstrapValidator({
            message: '这个值无效',
            feedbackIcons: {/*输入框不同状态，显示图片的样式*/
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            excluded: [':disabled', ':hidden', 'select'],
            fields: {/*验证*/
                title: {/*键名username和input name值对应*/
                    message: '按钮名称无效',
                    validators: {
                        notEmpty: {/*非空提示*/
                            message: '按钮名称不能为空'
                        }
                    }
                },
                collection: {
                    message:'显示顺序无效',
                    validators: {
                        notEmpty: {
                            message: '显示顺序不能为空'
                        }
                    }
                }
            }
        });
    }
    formValidator();
});

// iframe高度自适应
function changeFrameHeight(ifm) {
    console.log('改变');
    ifm.height = document.documentElement.clientHeight - 110;
}
// 重新调整iframe高度
function resizeFrameHeight() {
    $('.tab_iframe').css('height', document.documentElement.clientHeight - 110);
}
// 窗体尺寸改变时
window.onresize = function() {
    resizeFrameHeight();
}
