var clearanceNewsId = $("#clearanceNewsId").val();
// 消息框位置控制
var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};
var $_isRecommend = $('#recommended');
var $_recommendedIndex = $('#recommendedIndex');
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
var fileLength=0;
$(function(){
    // 获取各个操作dom
    var $save = $('#save'),
        $close = $("#close"),
        $reset = $('#reset'),
        $form = $("#newForm"),
        $seoform = $("#newSeoForm");
    if (!!$('#type').attr('data-type')) {
        var typeSelect = JSON.parse($('#type').attr('data-type')).id;
    } else {
        var typeSelect = null;
    }
    //初始化富文本插件
    var Resultcontent = CKEDITOR.replace('detail',{
        filebrowserImageUploadUrl:"/adjuncts/ckeditor/file_upload",/*文件上传路径*/
        resize_enabled : false,
        autoUpdateElement : true,
        height:200
    });
    $('#publishDate').datetimepicker({
        format: 'yyyy-mm-dd hh:mm:ss', //显示格式
        language: 'zh-CN',
        todayHighlight: 1,
        minView: 2,
        todayBtn: true,
        autoclose: true
    });
    // 初始化选择类型
    for (var i = 0; i < typeArr.length; i++) {
        if (typeArr[i].pid == 202094) {
            var option = $('<option value="'+typeArr[i].id+'" label="'+typeArr[i].title+'">'+typeArr[i].title+'</option>');
            $('#type').append(option);
        }
    }

    console.log(typeSelect);
    // 初始化子类型
    for (var i = 0; i < typeArr.length; i++) {
        if (!!clearanceNewsId) {
            if (typeArr[i].pid == typeSelect) {
                var option = $('<option value="'+typeArr[i].id+'" label="'+typeArr[i].title+'">' + typeArr[i].title + '</option>');
                console.log(typeArr[i].title);
                $('#subcategory').append(option);
            }
        } else {
            if (typeArr[i].pid == 202095) {
                var option = $('<option value="'+typeArr[i].id+'" label="'+typeArr[i].title+'">' + typeArr[i].title + '</option>');
                // console.log(typeArr[i].title);
                $('#subcategory').append(option);
            }
        }
    }


    $(document).on('change','#type',function () {
        console.log($('#type').select()[0].value);
        var typeSelectData = $('#type').select()[0].value;
        $('#subcategory option').remove();
        for (var i = 0; i < typeArr.length; i++) {
            if (typeArr[i].pid == typeSelectData) {
                var option = $('<option value="'+typeArr[i].id+'" label="'+typeArr[i].title+'">' + typeArr[i].title + '</option>');
                $('#subcategory').append(option);
            }
        }
    })
    // 初始化选择子类型
    // $('#publisherTime').val(getMyDate(new Date().getTime()));
    // 如果存在父窗口，获取窗口索引
    if(typeof parent.layer !== 'undefined' && clearanceNewsId !== null) {
        var index = parent.layer.getFrameIndex(window.name);
    }
    if (clearanceNewsId !== ""){
        initPage();
    }else {
        $_recommendedIndex.eq(0).val(0);
        $_recommendedIndex.eq(0).attr('disabled', true);
    }

    // 是否推荐改变
    $_isRecommend.on('change',function () {
        var recommend = $(this).val();
        if (recommend == 'true') {
            $_recommendedIndex.val($_recommendedIndex.attr('data-recommendedIndex'));
            $_recommendedIndex.attr('disabled', false);
        } else {
            $_recommendedIndex.val(0);
            $_recommendedIndex.attr('disabled', true);
        }
    })

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
        $seoform[0].reset();
        $seoform.bootstrapValidator('resetForm', true);
    });
    // 保存
    $save.click(function () {
        /*        if(fileLength==0){
                    layer.msg('请至少上传一张图片');
                    return ;
                }*/
        /*        var ckeData=editor.getData();*/
        /*        $("#detail").val(ckeData);*/
        // $form.data('bootstrapValidator').validate();
        // var isValid = $form.data('bootstrapValidator').isValid();
        // $seoform.data('bootstrapValidator').validate();
        // if (typeof serviceProvidersId !== 'undefined' && serviceProvidersId !== null && serviceProvidersId !== '') {
        //     $seoform.data('bootstrapValidator').validate();
        //     var isValid1 = $seoform.data('bootstrapValidator').isValid();
        //     if(!isValid || !isValid1) {
        //         return;
        //     }
        // } else {
        //     if(!isValid) {
        //         return;
        //     }
        // }

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
        postData=postDataInit(postData);

        var postData1 = {};
        var array1 = $seoform.serializeArray();

        $.each(array1, function () {
            if(postData1[this.name]) {
                if(!postData1[this.name].push) {
                    postData1[this.name] = [postData1[this.name]];
                }
                postData1[this.name].push(this.value || null);
            } else {
                postData1[this.name] = this.value || null;
            }
        })

        console.log(clearanceNewsId)

        // 如果存在id
        if(typeof clearanceNewsId !== 'undefined' && clearanceNewsId !== null && clearanceNewsId !== '' ){
            // if (!!industryInformationThirdPageSeo) {
            //     postData1['id'] = industryInformationThirdPageSeo.id;
            // }
            //
            // postData1['informationId'] = clearanceNewsId;

            // $.ajax({
            //     url: '/admin/industryInformationSeo/third_page/create_update',
            //     data: JSON.stringify(postData1),
            //     type: 'post',
            //     contentType: 'application/json',
            //     success: function (res) {
            //         console.log(res);
            //     }
            // })

            postData['id'] = clearanceNewsId;
            postData['published'] = true;
            console.log(postData);
            $.ajax({
                url: '/clearanceNews/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    layer.closeAll();
                    if(res.status == 200) {
                        new PNotify({
                            title: '修改资讯成功！',
                            text: '请在数据管理中查看修改后的内容',
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
                url: '/clearanceNews/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    layer.closeAll();
                    if(res.status === 200) {
                        parent.window.refreshAndShowMessage({
                            title: '新建通关资讯成功！',
                            text: '请在数据管理中查看',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                        parent.layer.close(index);
                        console.log(res);
                        postData1['informationId'] = res.data.data_object.id;
                        $.ajax({
                            url: '/admin/industryInformationSeo/third_page/create_update',
                            data: JSON.stringify(postData1),
                            type: 'post',
                            contentType: 'application/json',
                            success: function (res) {
                                console.log(res);
                            }
                        })
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

        $seoform.bootstrapValidator({
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
function upLoading(selector){
    $(selector).click();
}
//xmlhttprequest初始化
function getRequestObject(){
    var xhr=null;
    if(window.XMLHttpRequest){
        try{
            xhr = new XMLHttpRequest();
        }catch(e){
            xhr=null;
        }
    }else if(window.ActiveXObject){
        try{
            xhr=new ActiveXObject('Microsoft.XMLHTTP');
        }catch(e){
            try{
                xhr=new ActiveXObject('Msxml2.XMLHTTP');
            }catch(e){
                xhr=null;
            }
        }
    }
    return xhr;
}
function initPage(){
    // 作者发布时间
    var oDeadlineNode = $('#publishDate');
    var deadlineStr = null;
    deadlineStr = oDeadlineNode.val();
    if(!!deadlineStr){
        oDeadlineNode.val(formatTime(new Date(deadlineStr), false, 'YYYY-MM-DD hh:mm:ss'));
    }

    if (!!$_isRecommend.attr('data-isRecommend')) {
        if ($_isRecommend.attr('data-isRecommend') == 'true') {
            $_recommendedIndex.val($_recommendedIndex.attr('data-recommendedIndex'));
            $_recommendedIndex.eq(0).attr('disabled', false);
        } else {
            $_recommendedIndex.eq(0).val(0);
            $_recommendedIndex.eq(0).attr('disabled', true);
        }
    }

    // $("#publishDate").val($('#publishDate').data('time'));
    $("#introduction").text($("#introduction").attr("value"));
    if (!!$('#clearanceNewsId').val()) {
        var professionField =$('#type').data('type');
        $('#type').val(professionField.id)
        if (!!$('#subcategory').data('subcategory')) {
            var subcategory = $('#subcategory').data('subcategory').id;
        } else {
            var subcategory = null;
        }
        $('#subcategory').val(subcategory)
    }
}
function postDataInit(data){
    console.log('data',data);
    if(!!data.publishDate){
        var dateTime = new Date(data.publishDate);
        data.publishDate = dateTime;
    }
    var fileList=$(".file-list");
    var id="";
    id+=fileList.children().eq(0).children("div").attr("data-id");
    // data['coverPicture']=parseInt(id);
    return data;
}
//时间戳转日期
function getMyDate(str,isToSeccond){
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth()+1,
        oDay = oDate.getDate();
    var oTime = oYear +'-'+ getzf(oMonth) +'-'+ getzf(oDay);
    //是否精确到秒
    if(isToSeccond){
        var oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds();
        oTime = oTime +' '+ getzf(oHour) +':'+ getzf(oMin) +':'+getzf(oSen);//最后拼接时间
    }
    return oTime;
}
//补0操作
function getzf(num){
    if(parseInt(num) < 10){
        num = '0'+num;
    }
    return num;
}
function StringNoEmpty(str){
    if(str!=null&&str!=""&&str!=undefined){
        return true;
    }else return false;
}
