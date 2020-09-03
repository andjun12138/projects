/**
 * Created by lqs on 2017/8/21.
 * 新建 或 修改报表
 */

$(function(){
    var $close = $("#close"),
        $save = $("#save"),
        $reset = $("#reset"),
        $form = $("#newReport"),
        $newReportField = $("#newReportField"),
        $removeReportField = $("#removeReportField"),
        $table = $("#reportFieldTable");
    // 消息弹出框弹出位置设置
    var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};
    // 获取表单id
    var reportId = $("#reportId").val();
    // 如果存在父窗口，获取窗口索引
    if(typeof parent.layer !== 'undefined' && reportId !== null) {
        var index = parent.layer.getFrameIndex(window.name);
    }
    // 存储要删除的报表字段id的数组
    var REMOVE_ARRAY = [];

    // 事件控制
    $("#main").on('click', '#reportTab a', function(e){
        e.preventDefault()
        var url = $(this).attr('data-url');
        var target = $(this).attr('href');
        if($(target).children(".tab_iframe").length === 0) {
            $(target).append('<iframe class="tab_iframe" src="'+url+'" frameborder="0" width="100%"  height="300px" scrolling="auto"></iframe>');
        }
        $(this).tab('show');
    }).on('click', '.checkbox-input', function(e){
        // checkbox 选中
        e.stopPropagation();
        if($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            $(this).children('input[type="checkbox"]').first().attr('checked', false).prop('checked', false);
        }else {
            $(this).addClass("selected");
            $(this).children('input[type="checkbox"]').first().attr('checked', true).prop('checked', true);
        }
    }).on('click', '#selectAll', function(e){
        e.stopPropagation();
        if($table.children("tbody").first().children("tr").length === 2) {
            $(this).removeClass("selected");
            return false;
        }
        if($(this).hasClass("selected")){
            $table.children("tbody").first().children("tr").each(function (index) {
                if( index > 1 ) {
                    $(this).children('td').first().find('.checkbox-input').first().addClass('selected');
                }
            })
            $removeReportField.removeAttr('disabled');
        }else {
            $table.children("tbody").first().children("tr").each(function (index) {
                if( index > 1 ) {
                    $(this).children('td').first().find('.checkbox-input').first().removeClass('selected');
                }
            })
            $removeReportField.attr('disabled', 'disabled');
        }
    }).on("click", '#reportFieldTable tbody tr td:first-child .checkbox-input', function(e) {
        e.stopPropagation();
        toggleRemovable();
    }).on('change', 'select[name="show_type"]', function (e) {
        e.stopPropagation();
        if($(this).val() === '1107' || $(this).val() === '1111') { // 如果是关联选择
            $(this).parent().parent().parent().find('[name="target_id"]').first().removeAttr('disabled');
        }else {
            $(this).parent().parent().parent().find('[name="target_id"]').first().attr("disabled", "disabled");
        }
        if($(this).val() === '1104') { // 如果是文本
            $(this).parent().parent().parent().find('[name="url"]').removeAttr("disabled");
        }else {
            $(this).parent().parent().parent().find('[name="url"]').attr("disabled", "disabled");
        }
    }).on('click', '.checkbox-input.searchable', function(e){
       e.stopPropagation();
       if($(this).hasClass("selected")){
           $(this).parent().parent().parent().parent().find('[name="search_sort"]').first().removeAttr("disabled");
       }else {
           $(this).parent().parent().parent().parent().find('[name="search_sort"]').first().attr("disabled", "disabled");
       }
    });

    // 报表验证
    function formValidator() {
        // 表单验证
        $form.bootstrapValidator({
            message: '这个值无效',
            feedbackIcons: {
                /*输入框不同状态，显示图片的样式*/
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            excluded: [':disabled', ':hidden', 'select'],
            fields: {
                /*验证*/
                title: {
                    /*键名username和input name值对应*/
                    message: '报表名称无效',
                    validators: {
                        notEmpty: {
                            /*非空提示*/
                            message: '报表名称不能为空'
                        }
                    }
                },
                review: {
                    message: '数据库表/视图无效',
                    validators: {
                        notEmpty: {
                            message: '数据库表/视图不能为空'
                        }
                    }
                }
            }
        });
    }
    // 关闭窗口
    $close.click(function  (e) {
        e.stopPropagation();
        window.close();
    });
    // 保存
    $save.click(function (e) {
        e.stopPropagation();
        $form.data('bootstrapValidator').validate();
        var isValid = $form.data('bootstrapValidator').isValid();
        if(!isValid) {
            return;
        }
        var postData = {
            report: {},
            reportFields: []
        };
        // 处理报表基本信息
        var array = $form.serializeArray();
        $.each(array, function(){
            // 如果该字段存在
            if(postData.report[this.name]) {
                if(!postData.report[this.name].push) {
                    postData.report[this.name] = [postData.report[this.name]];
                }
                postData.report[this.name].push(this.value || '');
            } else {
                postData.report[this.name] = this.value || '';
            }
        });
        // 处理报表字段信息
        $table.children("tbody").first().children("tr").each(function (index) {
            if(index > 1){
                var obj = {};
                $(this).children('td').each(function(idx){
                    if(idx === 0) {
                        var tempId = parseInt($(this).find('input[name="id"]').first().val());
                        if(tempId !== -1) { // 如果修改
                            obj['id'] = tempId;
                        }
                    }else {
                        var tempNode = null, tempName = null, tempValue = null;
                        if($(this).find('input[type="text"]').length !== 0) {
                            tempNode = $(this).find('input[type="text"]').first();
                            tempName = tempNode.attr('name');
                            tempValue = tempNode.val();
                            obj[tempName] = tempValue || null;
                        } else if($(this).find('select').length !== 0) {
                            tempNode = $(this).find('select').first()
                            tempName = tempNode.attr('name');
                            tempValue = tempNode.val();
                            obj[tempName] = tempValue || null;
                        } else if($(this).find('input[type="checkbox"]').length !== 0) {
                            tempNode = $(this).find('input[type="checkbox"]').first();
                            tempName = tempNode.attr('name');
                            tempValue = tempNode.attr('checked') === 'checked' ? true : false;
                            obj[tempName] = tempValue;
                        }
                    }
                });
                postData.reportFields.push(obj);
            }
        });
        if(typeof reportId !== 'undefined' && reportId !== null && reportId !== '' ){
            postData.report['id'] = reportId;
            $.ajax({
                url: '/report/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    if(res.status == 200) {
                        new PNotify({
                            title: '修改报表信息成功！',
                            text: '请在报表详情中查看修改后的内容',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                    } else {
                        new PNotify({
                            title: '修改报表信息失败！',
                            text: res.message,
                            type: 'error',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                    }
                },
                error: function(error) {
                    new PNotify({
                        title: '修改报表信息失败！',
                        text: '网络出错，或服务器出错，请稍后再试',
                        type: 'error',
                        delay: 3000,
                        addclass: "stack-bottomright",
                        stack: stack_bottomright
                    });
                }
            });
        } else {
            $.ajax({
                url: '/report/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    if(res.status === 200) {
                        parent.window.refreshAndShowMessage({
                            title: '新建报表成功！',
                            text: '请在报表设计列表中查看',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                    } else {
                        parent.window.refreshAndShowMessage({
                            title: '新建报表失败！',
                            text: res.message,
                            type: 'error',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                    }
                    parent.layer.close(index);
                },
                error: function(error) {
                    parent.window.refreshAndShowMessage({
                        title: '新建报表失败！',
                        text: '网络出错，或服务器出错，请稍后再试',
                        type: 'error',
                        delay: 3000,
                        addclass: "stack-bottomright",
                        stack: stack_bottomright
                    });
                    parent.layer.close(index);
                }
            })
        }
    })
    // 重置
    $reset.click(function (e) {
        e.stopPropagation();
        $form.bootstrapValidator('resetForm', true);
        $form[0].reset();
    });
    // 新建报表字段
    $newReportField.on('click', function (e) {
       e.stopPropagation();
       var trContent = $("#report_field_template").clone().removeAttr('id').show();
        $table.children("tbody").first().append(trContent);
        showEmptyMessage();
    });
    // 删除报表字段
    $removeReportField.click(function (e) {
        e.stopPropagation();
        // 先清空数组
        REMOVE_ARRAY = [];
        $table.children("tbody").first().children("tr").each(function(index){
            var firstCheckbox = $(this).children('td').first().find('.checkbox-input').first();
            if(index > 1 && firstCheckbox.hasClass('selected')){ // 如果当前的记录被激活了
                var fieldId = parseInt(firstCheckbox.children("input[type='checkbox']").first().val());
                if(fieldId !== -1) {
                    REMOVE_ARRAY.push(fieldId);  // 筛选出非新建的记录
                }
                $(this).remove();
            }
        });
        if(REMOVE_ARRAY.length !== 0) {
            layer.msg('删除报表字段请求提交中...', { // 提交加载动画
                icon: 16,
                shade: 0.01,
                time: 8000
            });
            $.ajax({
                url: '/business/delete/51',
                data: JSON.stringify(REMOVE_ARRAY),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res){
                    layer.closeAll();
                    if(res.status === 200) {
                        new PNotify({
                            title: '删除报表字段成功！',
                            text: '请在报表字段列表中查看删除后的内容',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                    } else {
                        new PNotify({
                            title: '删除报表字段失败！',
                            text: res.message,
                            type: 'error',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                    }
                },
                error: function(err){
                    layer.closeAll();
                    new PNotify({
                        title: '删除报表字段失败！',
                        text: '网络出错，或服务器出错，请稍后再试',
                        type: 'error',
                        delay: 3000,
                        addclass: "stack-bottomright",
                        stack: stack_bottomright
                    });
                }
            })
        }
        $("#selectAll").removeClass("selected");
        $(this).attr("disabled", "disabled");
        showEmptyMessage();
    });

    // 初始化函数
    function showEmptyMessage() {
        if($table.children("tbody").first().children("tr").length === 2) {
            $("#empty_content").show();
        }else {
            $("#empty_content").hide();
        }
    }
    // toggle 删除报表字段
    function toggleRemovable() {
        var normal = true;
        var allSelected = true;
        $table.children("tbody").first().children("tr").each(function(index) {
            if (index > 1) {
                if ($(this).children('td').first().find('.checkbox-input').first().hasClass('selected')) {
                    $removeReportField.removeAttr("disabled");
                    normal = false;
                } else {
                    allSelected = false;
                }
            }
        });
        if(normal){
            $removeReportField.attr("disabled", "disabled");
        }
        if(allSelected) {
            $("#selectAll").addClass("selected");
        }else {
            $("#selectAll").removeClass("selected");
        }
    }
    // 初始化url, 搜索排序，关联选项框是否能编辑
    function ObjectEditable() {
        $table.children("tbody").first().children("tr").each(function(index) {
            if (index > 1) {
                if ($(this).find('[name="show_type"]').first().val() === '1107' || $(this).find('[name="show_type"]').first().val() === '1111') {
                    $(this).find('[name="target_id"]').first().removeAttr('disabled');
                } else {
                    $(this).find('[name="target_id"]').first().attr('disabled', 'disabled');
                }
                if($(this).find('select[name="show_type"]').first().val() === '1104') {
                    $(this).find('[name="url"]').first().removeAttr("disabled");
                } else {
                    $(this).find('[name="url"]').first().attr("disabled", "disabled");
                }
                if($(this).find('[name="searchable"]').first().attr('checked') === 'checked'){
                    $(this).find('[name="search_sort"]').first().removeAttr("disabled");
                } else {
                    $(this).find('[name="search_sort"]').first().attr("disabled", "disabled");
                }
            }
        });
    }

    // 初始化内容为空的夸列数
    function initEmptyMessageColspan() {
        $("#empty_content td").first().attr('colspan', $table.children("thead").first().children("tr").first().children("th").length);
    }

    // 初始化函数
    function init() {
        initEmptyMessageColspan();
        showEmptyMessage();
        ObjectEditable();
        formValidator();
    }

    init();
});
