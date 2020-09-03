/**
 * Created by lqs on 2017/8/18.
 * 新增表单字段脚本
 */

$(function(){
    var $save = $("#save"),
        $reset = $('#reset'),
        $form = $("#newField");
    // 消息框位置控制
    var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};
    // 获取表单id
    var formId = $("#formId").val();
    // 获取字段id
    var formFieldId = $("#formFieldId").val();
    // 获取表单字段下拉框
    var fields = [];
    // 如果存在父窗口，获取窗口索引
    if(typeof parent.layer !== 'undefined' && formFieldId !== null) {
        var index = parent.layer.getFrameIndex(window.name);
    }

    // checkbox 选中
    $(".checkbox-input").click(function (e) {
        e.stopPropagation();
        if($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $(this).children('input[type="checkbox"]').first().attr('checked', false).prop('checked', false);
        }else {
            $(this).addClass("selected");
            $(this).children('input[type="checkbox"]').first().attr('checked', true).prop('checked', true);
        }
    });
    // 初始化代码编辑框
    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
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

    // 下拉框控制
    $('#showType').on('change', function(e){
        e.stopPropagation();
        initSelect($(this).val());
    });
    $("#fieldType").on('change', function(e){
        e.stopPropagation();
        if($(this).val() === '1006') { // 如果是可变字符串
            $("#length").parent().show();
        } else {
            $("#length").parent().hide();
        }
    });
    // 重置
    $reset.on('click', function  (e) {
        e.stopPropagation();
        $form.bootstrapValidator('resetForm', true);
        $form[0].reset();
    });
    // 点击保存
    $save.on('click', function(e){
        e.stopPropagation();
        $form.data('bootstrapValidator').validate();
        var isValid = $form.data('bootstrapValidator').isValid();
        if(!isValid) {
            return;
        }
        layer.msg('表单字段提交中...', { // 提交加载动画
            icon: 16,
            shade: 0.01,
            time: 8000
        });
        var postData = {};
        postData['formId'] = $("#formId").val();
        postData['title'] = $("#title").val();
        postData['fieldName'] = $("#fieldName").val();
        postData['showType'] = $("#showType").val();
        postData['fieldType'] = $("#fieldType").val();
        postData['targetId'] = $("#targetId").parent().css("display") === 'none' ?  null : $("#targetId").val() || null;
        postData['length'] = $("#length").parent().css("display") === 'none' ? null : $("#length").val() || null;
        postData['defaultValue'] = $("#defaultValue").parent().css("display") === 'none' ? null : $("#defaultValue").val() || null;
        postData['fieldUnit'] = $("#fieldUnit").parent().css("display") === 'none' ? null : $("#fieldUnit").val() || null;
        postData['attachNum'] = $("#attachNum").parent().css("display") === 'none' ? null : $('#attachNum').val() || null;
        postData['required'] = $("#required").attr("checked") === 'checked' ? true : false;
        postData['saveToSearchEngine'] = $("#saveToSearchEngine").attr("checked") === 'checked' ? true : false;
        postData['readonly'] = $("#readonly").attr("checked") === 'checked' ? true : false;
        postData['hidden'] = $("#hidden").attr("checked") === 'checked' ? true : false;
        postData['pageComponentInput'] = $("#pageComponentInput").val();
        postData['pageComponentOutput'] = $("#pageComponentOutput").val();
        postData['sort'] = $("#sort").val() || null;
        postData['jsHandle'] = editor.getValue() || null;
        postData['description'] = $("#description").val() || null;
        postData['id'] = $(id).val() || null;

        if(typeof formFieldId !== 'undefined' && formFieldId !== '' && formFieldId !== null) {
            $.ajax({
                url: '/formField/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    layer.closeAll();
                    if(res.status === 200) {
                        new PNotify({
                            title: '修改表单字段成功！',
                            text: '请在表单设计列表中查看',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                    } else {
                        new PNotify({
                            title: '修改表单字段失败！',
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
                        title: '修改表单字段失败！',
                        text: '网络出错，或服务器内部错误，请稍后再试',
                        type: 'error',
                        delay: 3000,
                        addclass: "stack-bottomright",
                        stack: stack_bottomright
                    });
                }
            });
        } else {
            $.ajax({
                url: '/formField/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    layer.closeAll();
                    if(res.status === 200) {
                        parent.window.refreshAndShowMessage({
                            title: '新建表单字段成功！',
                            text: '请在表单字段列表中查看',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                        parent.layer.close(index);
                    } else {
                        new PNotify({
                            title: '新建表单字段失败！',
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
                        title: '新建表单字段失败！',
                        text: '网络出错，或服务器内部错误，请稍后再试',
                        type: 'error',
                        delay: 3000,
                        addclass: "stack-bottomright",
                        stack: stack_bottomright
                    });
                }
            });
        }
    });

    // 表单验证
    function formValidator() {
        $form.bootstrapValidator({
            message: '这个值无效',
            feedbackIcons: {/*输入框不同状态，显示图片的样式*/
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            excluded: [':disabled', ':hidden', 'select'],
            fields: {/*验证*/
                title: {/*键名username和input name值对应*/
                    message: '字段标题无效',
                    validators: {
                        notEmpty: {/*非空提示*/
                            message: '字段标题不能为空'
                        }
                    }
                },
                fieldName: {
                    message:'字段名称无效',
                    validators: {
                        notEmpty: {
                            message: '字段名称不能为空'
                        }
                    }
                }
            }
        });
    }

    // 显示字段类型
    function showFieldType(arr) {
        var hasVal = false;
        $("#fieldType").children("option").each(function(){
            var len = arr.length;
            for(var i = 0; i < len; i++ ) {
                if($(this).val() === arr[i]) {
                    $(this).show();
                    if($(this).val() === $('#fieldType').val()) {
                        hasVal = true;
                    }
                    break;
                }
            }
            if(i === len) {
                $(this).hide();
            }
        });
        if(!hasVal) {
            $('#fieldType').val(arr[0]);
        }
    }

    // 初始化下拉框
    function initSelect(text) {
        var showFieldArray = [];
        $("#showType").children('option').each(function(index){
            if($(this).val() === text) {
                showFieldArray = $(this).attr("data-value").split(",");
                return false;
            }
        });
        showFieldType(showFieldArray);
        if(text === '1107' || text === '1111') { // 如果是关联对象
            $("#targetId").parent().show();
            $("#defaultValue").parent().hide();
        }else {
            $("#targetId").parent().hide();
            $("#defaultValue").parent().show();
        }
        if(text === '1104') {  // 如果是可变文本
            $("#length").parent().show();
        }else {
            $("#length").parent().hide();
        }
        if(text === '1101' || text === '1102') { // 如果是整形或者浮点型
            $("#fieldUnit").parent().show();
        } else {
            $("#fieldUnit").parent().hide();
        }
        if(text === '1108' || text === '1109') {  // 如果是图片或附件
            $('#attachNum').parent().show();
        } else {
            $("#attachNum").parent().hide();
        }
        /**
         * 多关联的特殊处理
         */
        if(text === '1111') { //如果是多关联
            $.get('/formField/query_fields/'+formId, function(res){
               if(res.status === 200) {
                   var tempFields = res.data.form_list;
                   var tempVal = parseInt($("#targetId").attr('value'));
                   $("#targetId").empty();
                   for(var i = 0, tempLen = tempFields.length; i < tempLen; i++) {
                       if(tempVal === tempFields[i].id) {
                           $("#targetId").append('<option value="'+tempFields[i].id+'" selected="selected">'+tempFields[i].title+'</option>')
                       } else {
                           $("#targetId").append('<option value="'+tempFields[i].id+'">'+tempFields[i].title+'</option>')
                       }
                   }
               } else {
                   new PNotify({
                       title: '获取多关联字段失败！',
                       text: '网络出错，或服务器内部错误，请稍后再试',
                       type: 'error',
                       delay: 3000,
                       addclass: "stack-bottomright",
                       stack: stack_bottomright
                   });
               }
            });
        } else if(text === '1107') {
            var tempVal = parseInt($("#targetId").attr('value'));
            $("#targetId").empty();
            for(var i = 0, tempLen = tempTargetId.length; i < tempLen; i++) {
                if(tempVal === tempTargetId[i].id) {
                    $("#targetId").append('<option value="'+tempTargetId[i].id+'" selected="selected">'+tempTargetId[i].title+'</option>')
                } else {
                    $("#targetId").append('<option value="'+tempTargetId[i].id+'">'+tempTargetId[i].title+'</option>')
                }
            }
        }
    }

    // 初始化checkbox
    function initCheckbox() {
        $('.checkbox-input').each(function(){
            var checked = $(this).children('input[type="checkbox"]').first().attr('checked');
            if(typeof checked === 'undefined') {
                return true;
            }else {
                $(this).addClass("selected");
            }
        });
    }

    // 初始化代码块
    function initEditor() {
        editor.setValue($("#code").text());
    }

    // 初始化select
    $("#targetId").select2();

    initSelect($("#showType").val());
    formValidator();
    initCheckbox();
    initEditor();
});