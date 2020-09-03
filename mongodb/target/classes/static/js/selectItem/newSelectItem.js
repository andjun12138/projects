/**
 * Created by lqs on 2017/8/21.
 * 新建表单
 */
var selectItemId = $("#selectItemId").val();
// 消息框位置控制
var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};

$(function(){
    // 获取各个操作dom
    var $save = $('#save'),
        $close = $("#close"),
        $reset = $('#reset'),
        $form = $("#newForm");

    // 如果存在父窗口，获取窗口索引
    if(typeof parent.layer !== 'undefined' && selectItemId !== null) {
        var index = parent.layer.getFrameIndex(window.name);
    }

    if (selectItemId !== ""){
        initPage();
    }

    // 关闭窗口
    $close.on("click", function (e) {
        e.stopPropagation();
        window.close();
    });

    // 重置
    $reset.on('click', function (e) {
        e.stopPropagation();
        $form.bootstrapValidator('resetForm', true);
        $form[0].reset();
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
        postData.pid=$('#pid').attr("data-id");
        // 如果存在id
        if(typeof selectItemId !== 'undefined' && selectItemId !== null && selectItemId !== '' ){
            postData['id'] = selectItemId;
            $.ajax({
                url: '/selectItem/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    layer.closeAll();
                    if(res.status == 200) {
                        new PNotify({
                            title: '修改表单信息成功！',
                            text: '请在表单详情中查看修改后的内容',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
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
            });
        } else {
            $.ajax({
                url: '/selectItem/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    layer.closeAll();
                    if(res.status === 200) {
                        parent.window.refreshAndShowMessage({
                            title: '新建表单成功！',
                            text: '请在表单设计列表中查看',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
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
    function formValidator() {
        // 表单验证
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
                    message: '表单名称无效',
                    validators: {
                        notEmpty: {/*非空提示*/
                            message: '表单名称不能为空'
                        }
                    }
                },
                collection: {
                    message:'数据库表名无效',
                    validators: {
                        notEmpty: {
                            message: '数据库表名不能为空'
                        }
                    }
                }
            }
        });
    }
    formValidator();
});

//返回的数据
function handleRelevance(data){
    console.log(data);
    $("#pid").val(data.data[0].title);
    $("#pid").attr("data-id",data.data[0].id);
}

function initPage(){
    var pid=JSON.parse($("#pid").attr("data-pid"));
    if(pid[0] != null){
        $("#pid").val(pid[0].title);
        $("#pid").attr("data-id",pid[0].id);
    }
}

function openPid(event){
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
            //得到iframe页的窗口对象
            // var iframeWin = window[layero.find('iframe')[0]['name']];
            // 执行iframe页的方法：
            // iframeWin.setRelevanceObj(id, name, fieldType, selector);
        }
    });
    layer.full(index);
}

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
function upLoading(selector){
    $(selector).click();
}
function getFullPath(obj){
    if (obj) {
        //ie
        /**if (window.navigator.userAgent.indexOf("MSIE")>=1) {
            alert(components);
            var path;
            //obj.select();
            //return document.selection.createRange().text;
            obj.select();
            path = document.selection.createRange().text;
            document.getElementById("imgPreview").innerHTML="";
           return "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='scale',src=\"" + path + "\")";
        }
         else if(window.navigator.userAgent.indexOf("Firefox")>=1){   */
        if (obj.files) {
            $("#logoInput").val(window.URL.createObjectURL(obj.files.item(0)));
            return window.URL.createObjectURL(obj.files.item(0));
        }
        $("#logoInput").val(obj.value);
        return obj.value;
    }
}
