var centerIntroId = $("#centerIntroId").val();
// 消息框位置控制
var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};

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

var fileName = null;
var width = 562;
var height = 340;
//图片裁剪相关方法=================================start=======================
//1.初始化裁剪插件
var initCropper = function (img, input){
    var $image = img;
    var options = {
        aspectRatio: width / height,
        dragMode: 'move',
        viewMode: 1,
        cropBoxResizable: true,
        preview: '.img-preview'
    };
    $image.cropper(options);
    var $inputImage = input;
    var uploadedImageURL;
    if (URL) {
        $inputImage.change(function () {  // 给input添加监听
            //业务逻辑
            //判断文件大小
            if(fileLength==1){
                layer.msg('只能上传一张图片');
                var fileList = $(this).get(0).files;
                fileList.length=fileList.length-1;
                return ;
            }
            var uploadfile = $inputImage.val();
            fileName= getFileName(uploadfile);
            // $("#form").hide();

            var files = this.files;
            var file;
            if (!$image.data('cropper')) {
                return;
            }
            if (files && files.length) {
                file = files[0];
                if (/^image\/\w+$/.test(file.type)) {   // 判断是否是图像文件
                    $("#cropperBox").slideDown();
                    if (uploadedImageURL) {   // 如果URL已存在就先释放
                        URL.revokeObjectURL(uploadedImageURL);
                    }
                    uploadedImageURL = URL.createObjectURL(file);
                    // 销毁cropper后更改src属性再重新创建cropper
                    $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
                    $inputImage.val('');
                } else {
                    layer.msg('请选择一个图像文件！');
                    return;
                }
            }
        });
    } else {
        $inputImage.prop('disabled', true).addClass('disabled');
    }
};

var crop = function(){
    var $image = $('#photo');
    var $target = $('#selectImg');
    $image.cropper('getCroppedCanvas',{
        width:750,
        height:300
    }).toBlob(function(blob){
        // $("#form").show();
        var target = $('#pictureFileList');
        var targetInput = $('#fileInput');
        var fileIds = targetInput.attr('data-id') || '';

        $("#cropperBox").slideUp();
        $("#selectImg").show();
        $target.attr('src', URL.createObjectURL(blob));    // 将裁剪后的图片放到指定标签
        var formData = new FormData();      // 将裁剪后的图片上传到服务器
        formData.append('files', blob, fileName);
        $.ajax('/adjuncts/file_upload', {
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log('sssssssssssssssssssssssssss',res)
                //处理返回结果
                if(res.status === 200){
                    var list = res.data.data_list;
                    var fileIds = targetInput.attr('data-id') || '';
                    for(var i = 0; i < list.length; i++) {
                        if(fileIds === '') {
                            fileIds += list[i].id;
                        } else {
                            fileIds += ',' + list[i].id;
                        }
                        var suffix = list[i].prefix;
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
                        target.append('<div class="file-item"><img class="file-icon pull-left" src="' + iconSrc + '"/><div class="file-name" title="' + list[i].title+'.'+list[i].prefix + '" data-id="'+list[i].id+'">' + list[i].title+'.'+list[i].prefix + '</div><i class="icon-remove-sign pull-right file-remove" title="删除"></i></div>');
                    }
                    fileLength++;
                    targetInput.attr('data-id', fileIds);
                    targetInput.val("已选择"+fileLength+"个文件");
                }

            }
        });
    });
};
//图片裁剪相关方法=================================end==============================


$(function(){
    // 获取各个操作dom
    var $save = $('#save'),
        $close = $("#close"),
        $reset = $('#reset'),
        $form = $("#newForm");

    //初始化时间组件
    $('#buildTime').datetimepicker({
        format: 'yyyy-mm-dd', //显示格式
        language: 'zh-CN',
        todayHighlight: 1,
        minView: 2,
        todayBtn: true,
        autoclose: true
    });

    initCropper($('#photo'),$('#logo'));

    // 如果存在父窗口，获取窗口索引
    if(typeof parent.layer !== 'undefined' && centerIntroId !== null) {
        var index = parent.layer.getFrameIndex(window.name);
    }
    if (centerIntroId !== ""){
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
        $seoform[0].reset();
        $seoform.bootstrapValidator('resetForm', true);
    });
    // tab事件控制
    $('#fieldTab a').click(function (e) {
        e.preventDefault();
        var url = $(this).attr('data-url');
        var target = $(this).attr('href');
        if($(target).children("iframe").length === 0) {
            $(target).append('<iframe class="tab_iframe" src="'+url+'" frameborder="0" width="100%" scrolling="auto" onload="changeFrameHeight(this)"></iframe>');
        }
        $(this).tab('show')
    });
    // 保存
    $save.click(function () {
        if(fileLength==0){
            layer.msg('请至少上传一张图片');
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
        if (!!$('.file-name').data('id')) {
            postData['pictureCover'] = $('.file-name').data('id');
        } else {
            layer.msg('请上传至少一张图片',function(){});
            return ;
        }
        // postData=postDataInit(postData);

        // console.log(centerIntroId)

        // 如果存在id
        if(typeof centerIntroId !== 'undefined' && centerIntroId !== null && centerIntroId !== '' ){
            postData['id'] = centerIntroId;
            postData['published'] = true;
            console.log(postData);
            $.ajax({
                url: '/centerIntro/create_update',
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
                url: '/centerIntro/create_update',
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
                floorArea: {
                    message:'请填写有效面积（保留两位小数）',
                    validators: {
                        regexp:{
                            regexp:/^(([0-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/,
                            message:'只能输入数额,且保留两位小数'
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
    // 成立时间
    var oDeadlineNode = $('#buildTime');
    var deadlineStr = null;
    deadlineStr = oDeadlineNode.val();
    if(!!deadlineStr){
        oDeadlineNode.val(formatTime(new Date(deadlineStr), false, 'YYYY-MM-DD'));
    }
    var logo = $('#logo').data('pic');
    console.log('qqqqqqqqqqqqqqqqqqqqqq',logo);
    if(logo.length > 0 && !!logo[0] ){
        var picList = $('.file-list:eq(0)');
        var filename=logo[0].title+"."+logo[0].prefix;
        var iconSrc='/static/assets/photo.png';
        picList.append('<div class="file-item"><img class="file-icon pull-left" src="' + iconSrc + '"/><div class="file-name" title="' + filename + '" data-id="'+logo[0].id+'">' + filename + '</div><i class="icon-remove-sign pull-right file-remove" title="删除"></i></div>');
        $("#logoInput").val("已选择1张图片");
        fileLength=1;
    }
}
/*function postDataInit(data){
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
}*/
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
