
/**
 * 创建或者修改成果：/admin/result/create_update
 * 请求方式：post
 */


var $save = $('#save'),
    $close = $('#close'),
    $form = $("#newForm"),
    $reset = $('#reset');
$address=$("#addressBox");//省市区
var $pass = $('#pass');
var $storage = $('#storage');
$(function () {
    initPage();
    $address.on('blur','select',function(e){
        e.stopPropagation();
        getAddress();
    });
    getAddress();
    $pass.on('click', function (e) {
        e.stopPropagation();
        var ids=[];
        ids.push($('#enterpriseId').val());
        // postData.id.push($('#demandId').val());
        $.ajax({
            url: '/admin/enterprise/pass',
            data: JSON.stringify(ids),
            type: 'post',
            contentType: 'application/json;charset=utf-8',
            success: function (res) {
                if(res.status == 200) {
                    new PNotify({
                        title: '审核通过成功！',
                        text: '请在企业列表查看',
                        type: 'success',
                        delay: 3000,
                        addclass: "stack-bottomright",
                        stack: stack_bottomright
                    });
                }
            }
        })
    });
    $storage.on('click', function (e) {
        e.stopPropagation();
        var ids=[];
        ids.push($('#enterpriseId').val());
        // postData.id.push($('#demandId').val());
        $.ajax({
            url: '/admin/enterprise/enterpriseStaging',
            data: JSON.stringify(ids),
            type: 'post',
            contentType: 'application/json;charset=utf-8',
            success: function (res) {
                if(res.status == 200) {
                    new PNotify({
                        title: '暂存成功！',
                        type: 'success',
                        delay: 3000,
                        addclass: "stack-bottomright",
                        stack: stack_bottomright
                    });
                }
            }
        })
    })
    if (!!$('#enterpriseId').val()) {
        setCharacter();
        var file = $('#icon').data('file');
        var file_license = $('#license').data('file');
        if(file != null){
            if(file.length){
                var fileList=$(".file-list");
                for(var i=0;i<file.length;i++){
                    var filename=file[i].title+"."+file[i].prefix;
                    var suffix=file[i].prefix;
                    var iconSrc='';
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
                    fileList.append('<div class="file-item"><img class="file-icon pull-left" src="' + iconSrc + '"/><div class="file-name" title="' + filename + '" data-id="'+file[i].id+'">' + filename + '</div><i class="icon-remove-sign pull-right file-remove" title="删除"></i></div>');
                }
                $("#fileInput").val("已选择"+file.length+"个文件");
            }
        }
        if(file_license != null){
            if(file_license.length){
                var fileList=$(".file-list-license");
                for(var i=0;i<file_license.length;i++){
                    var filename=file_license[i].title+"."+file_license[i].prefix;
                    var suffix=file_license[i].prefix;
                    var iconSrc='';
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
                    fileList.append('<div class="file-item"><img class="file-icon pull-left" src="' + iconSrc + '"/><div class="file-name" title="' + filename + '" data-id="'+file_license[i].id+'">' + filename + '</div><i class="icon-remove-sign pull-right file-remove" title="删除"></i></div>');
                }
                $("#fileInputLicense").val("已选择"+file_license.length+"个文件");
            }
        }
        if(!!$('#front_user_id').data('publisher')) {
            var publisher = $('#front_user_id').data('publisher');
            $('#front_user_id').attr('data-publisher',publisher.id);
            $('#front_user_id').val(publisher.nickName);
        }
    }
});
function getAddress(){
    var province = $("#provinceName").find("option:selected").text();
    var city = $("#cityName").find("option:selected").text();
    var district = $("#districtName").find("option:selected").text();
    var address=""+province+city+district;
    $("#area").val(address+"");
}
//初始化
function initPage() {
    //关闭窗口
    $close.on('click',function (e) {
        e.stopPropagation();
        window.close();
    });
//    重置
    $reset.on('click',function (e) {
        e.stopPropagation();
        $form.bootstrapValidator('resetForm',true);
        $form[0].reset();
    })
    $('#fieldTab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    //保存
    $save.click(function() {
        $form.data('bootstrapValidator').validate();
        var isValid = $form.data('bootstrapValidator').isValid();
        if (!isValid) {
            layer.msg('请完整填写');
            return ;
        }
        var formLayer = layer.msg('表单提交中...', { // 提交加载动画
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
        postData = initDataInit(postData);
        var id = $('#enterpriseId').val();
        if(!!id){
            postData['id'] = id;
            $.ajax({
                url:'/admin/enterprise/create_update',
                data:JSON.stringify(postData),
                type:'post',
                contentType:'application/json;charset=utf-8',
                success: function (res) {
                    layer.close(formLayer);
                    if(res.status === 200) {
                        new PNotify({
                            title: '修改成功！',
                            text: '请在企业管理列表中查看',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                        var index = parent.layer.getFrameIndex(window.name)
                        parent.layer.close(index);
                    } else {
                        new PNotify({
                            title: '修改企业失败！',
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
                }
            });
        }else {
            $.ajax({
                url:'/admin/enterprise/create_update',
                data:JSON.stringify(postData),
                type:'post',
                contentType:'application/json;charset=utf-8',
                success:function (res) {
                    layer.close(formLayer);
                    if(res.status === 200) {
                        parent.window.refreshAndShowMessage({
                            title: '新建企业成功！',
                            text: '请在企业管理中查看',
                            type: 'success',
                            delay: 3000,
                            addclass: "stack-bottomright",
                            stack: stack_bottomright
                        });
                        var index = parent.layer.getFrameIndex(window.name)
                        parent.layer.close(index);
                    } else {
                        new PNotify({
                            title: '新建企业失败！',
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
                }
            })
        }
    });
    formValidator();
    //    附件上传
    $('#newForm').on("change",'input[id="icon"]',function (e) {
        e.stopPropagation();
        var fileList = $(this).get(0).files;
        if(fileList.length == 0)return ;
        var target=$(this).next().next().children(".file-list").first();
        var targetInput=$(this).next().children('input').first();
        var formData = new FormData();
        // for(var i = 0;fileList.length;i++)
        formData.append('files',fileList[0]);
        var xhr = getRequestObject();
        xhr.onload = function () {
            var data=JSON.parse(xhr.responseText);
            if(xhr.status===200){
                var list = data.data.data_list;
                var fileIds = targetInput.attr('data-id') || '';
                for(var i = 0; i < list.length; i++) {
                    if(fileIds === '') {
                        fileIds += list[i].id;
                    } else {
                        fileIds += ',' + list[i].id;
                    }
                    var suffix = (fileList[i].name).split('.')[1];
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
                    target.append('<div class="file-item"><img class="file-icon pull-left" src="' + iconSrc + '"/><div class="file-name" title="' + fileList[i].name + '" data-id="'+list[i].id+'">' + fileList[i].name + '</div><i class="icon-remove-sign pull-right file-remove" title="删除"></i></div>');
                }
                targetInput.attr('data-id', fileIds);
                targetInput.val("已选择"+target.children('.file-item').length+"个文件");
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
        //    上传加载
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
    }).on("click",".file-remove",function (e) {
        e.stopPropagation();
        var self=$(this);
        layer.confirm('你确定删除该文件',{
            btn:['确定','取消']
        },function(){
            var fileListDom=self.parent().parent();
            var inputDom=fileListDom.parent().prev().children('input[type="text"]');
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
                inputDom.val("已选择"+fileListDom.length+"个文件");
            }
            layer.closeAll();
        },function () {
            layer.closeAll();
        })
    }).on('click','.file-item .file-name',function (e) {

        e.stopPropagation();
        var id = $(this).data('id');
        var name = $(this).text();
        var suffix = name.split('.')[1];
        if(suffix === 'png' || suffix === 'jpeg' || suffix === 'jpg' || suffix === 'gif') {
            layer.open({
                type: 1,
                title: name,
                shadeClose: true,
                shade: 0.3,
                area: ['80%', '80%'],
                content: '<img src="'+'/adjuncts/file_download/'+id+'"/>'
            });
        } else {
            window.open("/adjuncts/file_download/"+id);
        }
    });
    //    附件上传
    $('#newForm').on("change",'input[id="license"]',function (e) {
        e.stopPropagation();
        var fileList = $(this).get(0).files;
        if(fileList.length == 0)return ;
        var target=$(this).next().next().children(".file-list-license").first();
        var targetInput=$(this).next().children('input').first();
        var formData = new FormData();
        // for(var i = 0;fileList.length;i++)
        formData.append('files',fileList[0]);
        var xhr = getRequestObject();
        xhr.onload = function () {
            var data=JSON.parse(xhr.responseText);
            if(xhr.status===200){
                var list = data.data.data_list;
                var fileIds = targetInput.attr('data-id') || '';
                for(var i = 0; i < list.length; i++) {
                    if(fileIds === '') {
                        fileIds += list[i].id;
                    } else {
                        fileIds += ',' + list[i].id;
                    }
                    var suffix = (fileList[i].name).split('.')[1];
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
                    target.append('<div class="file-item"><img class="file-icon pull-left" src="' + iconSrc + '"/><div class="file-name" title="' + fileList[i].name + '" data-id="'+list[i].id+'">' + fileList[i].name + '</div><i class="icon-remove-sign pull-right file-license-remove" title="删除"></i></div>');
                }
                targetInput.attr('data-id', fileIds);
                targetInput.val("已选择"+target.children('.file-item').length+"个文件");
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
        //    上传加载
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
    }).on("click",".file-license-remove",function (e) {
        e.stopPropagation();
        var self=$(this);
        layer.confirm('你确定删除该文件',{
            btn:['确定','取消']
        },function(){
            var fileListDom=self.parent().parent();
            var inputDom=fileListDom.parent().prev().children('input[type="text"]');
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
                inputDom.val("已选择"+fileListDom.length+"个文件");
            }
            layer.closeAll();
        },function () {
            layer.closeAll();
        })
    }).on('click','.file-item .file-name',function (e) {

        e.stopPropagation();
        var id = $(this).data('id');
        var name = $(this).text();
        var suffix = name.split('.')[1];
        if(suffix === 'png' || suffix === 'jpeg' || suffix === 'jpg' || suffix === 'gif') {
            layer.open({
                type: 1,
                title: name,
                shadeClose: true,
                shade: 0.3,
                area: ['80%', '80%'],
                content: '<img src="'+'/adjuncts/file_download/'+id+'"/>'
            });
        } else {
            window.open("/adjuncts/file_download/"+id);
        }
    });

    $(document).on('click','.add-leader',function (e) {
        var $ul = $('.leaders-list');
        $ul.append('<li class="leader-item" data-leader-id="">' +
            '<div class="avatar-info"><input type="file" class="avatar-file" style="display: none">' +
            '<img src="" alt="" class="leader-avatar" data-avatar="">' +
            '<p class="leader-name">姓名：<input type="text" class="name-input form-control" placeholder="请输入名字" value=""></p>' +
            '<p class="leader-station">岗位：<input type="text" class="station-input form-control" placeholder="请输入岗位" value=""></p></div>' +
            '<div class="leader-item-info">' +
            '<p class="leader-school"><span>学历情况：</span><input class="schooling-input form-control" placeholder="请输入学历" value=""></p>' +
            '<div class="leader-desc">个人描述：<textarea class="desc-input form-control" name="" id="" placeholder="请输入个人描述" rows="4"></textarea></div>' +
            '<div class="leader-work">工作情况：<textarea class="work-input form-control" name="" id="" placeholder="请输入工作情况" rows="4"></textarea>' +
            '</div></div><span class="remove-item"><i class="icon-remove"></i></span>' +
            '</li>')
    }).on('click','.add-expert',function (e) {
        var $ul = $('.experts-list');
        $ul.append('<li class="expert-item">' +
            '<div class="avatar-info"><input type="file" class="avatar-file" style="display: none">' +
            '<img src="" alt="" class="expert-avatar" data-avatar="">' +
            '<p class="expert-name">姓名：<input type="text" class="name-input form-control" placeholder="请输入名字" value=""></p>' +
            '<p class="expert-station">岗位：<input type="text" class="station-input form-control" placeholder="请输入岗位" value=""></p>' +
            '</div>' +
            '<div class="expert-item-info">' +
            '<p class="expert-school"><span>学历情况：</span><input class="schooling-input form-control" placeholder="请输入学历情况" value=""></p>' +
            '<div class="expert-desc">个人经历：<textarea class="desc-input form-control" placeholder="请填写描述"  name="" id="" rows="4"></textarea></div>' +
            '<div class="expert-search">研究方向：<textarea class="search-input form-control" name="" id="" placeholder="请填写研究方向" rows="4"></textarea>' +
            '</div></div>' +
            '<span class="remove-item"><i class="icon-remove"></i></span></li>')
    }).on('click','.avatar-info>img',function (e) {
        $(this).siblings('.avatar-file')[0].click();
    }).on('change','.avatar-file',function (e) {
        e.stopPropagation();
        var fileList = $(this).get(0).files;
        if(fileList.length == 0)return ;
        if (fileList[0].type.indexOf("image")<0) {
            layer.msg("请上传图片格式文件");
            return;
        }
        var target = $(this).siblings('img').eq(0);
        var formData = new FormData();
        formData.append('files',fileList[0]);
        var xhr = getRequestObject();
        xhr.onload = function () {
            var data=JSON.parse(xhr.responseText);
            if(xhr.status===200){
                var list = data.data.data_list;
                target.attr('data-avatar',list[0].id);
                target.attr('src',getAvatar(list[0].id))
            }else{
                new PNotify({
                    title: '图片上传失败！',
                    text: '稍后再试',
                    type: 'error',
                    delay: 3000,
                    addclass: "stack-bottomright",
                    stack: stack_bottomright
                });
            }
        }
        // 打开链接
        xhr.open('POST', '/adjuncts/file_upload', true);
        // 发送请求
        xhr.send(formData);
    }).on('click','.remove-item',function (e) {
        e.stopPropagation();
        var id = $(this).parent().attr('data-leader-id');
        var _this = $(this);
        if(!!id) {
            $.ajax({
                url: '/admin/enterpriseLeader/delete/'+id,
                type: 'post',
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (res) {
                    layer.msg('已经删除企业');
                    _this.parent().remove();
                },
                error: function (e) {
                    $.error(e);
                }
            })
            return ;
        }
        id = $(this).parent().attr('data-expert-id');
        var _this = $(this);
        if(!!id) {
            $.ajax({
                url: '/admin/enterpriseExpert/delete/'+id,
                type: 'post',
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (res) {
                    layer.msg('已经删除专家');
                    _this.parent().remove();
                },
                error: function (e) {
                    $.error(e);
                }
            })
            return ;
        } else {
            $(this).parent().remove();
        }
    })
    // js 判断
    var fieldValue= $("#fieldValue").val();
    $('#field option[value="'+fieldValue+'"]').attr("selected",true);
    var natureValue=$("#natureValue").val();
    $('#nature option[value="'+natureValue+'"]').attr("selected",true);

}
//初始化验证表单
function formValidator() {
    $form.bootstrapValidator({
        message: '这个值无效',
        feedbackIcons: {
            /*输入框不同状态，显示图片的样式*/
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        excluded: [':disabled', ':hidden', 'select']
    });
}
//postData 参数处理
function initDataInit(data) {
    var fileList = $(".file-list");
    var length = fileList.children().length;
    var id = "";
    for(var i=0;i<length;i++){
        id+=fileList.children().eq(i).children("div").data("id");
        if(i!=length-1){
            id+=",";
        }
    }
    data['icon'] = id;

    var fileListLicense = $(".file-list-license");
    var lengthL = fileListLicense.children().length;
    var idv = "";
    for(var i=0;i<lengthL;i++){
        idv+=fileListLicense.children().eq(i).children("div").data("id");
        if(i!=lengthL-1){
            idv+=",";
        }
    }
    data['license'] = idv;


    data['frontUserId'] = $('#front_user_id').attr('data-publisher');
    if(!!$('#enterpriseId').val()) {
        saveCharacter();
    }
    return data;
}
function setCharacter() {
    if(!!enterpriseLeaders) {
        var leaderUl = $('ul.leaders-list');
        for(var i = 0; i < enterpriseLeaders.length; i++) {
            var icon = '';
            var id = null;
            if(!!enterpriseLeaders[i].icon) {
                id = JSON.parse(enterpriseLeaders[i].icon)[0].id;
                icon = getAvatar(id);
            }
            leaderUl.append('<li class="leader-item" data-leader-id="'+enterpriseLeaders[i].id+'">' +
                '<div class="avatar-info"><input type="file" class="avatar-file" style="display: none">' +
                '<img src="'+icon+'" alt="" class="leader-avatar" data-avatar="'+id+'">' +
                '<p class="leader-name">姓名：<input type="text" class="name-input form-control" value="'+enterpriseLeaders[i].name+'"></p>' +
                '<p class="leader-station">岗位：<input type="text" class="station-input form-control" value="'+enterpriseLeaders[i].station+'"></p></div>' +
                '<div class="leader-item-info">' +
                '<p class="leader-school"><span>学历情况：</span><input class="schooling-input form-control" value="'+enterpriseLeaders[i].schooling+'"></p>' +
                '<div class="leader-desc">个人描述：<textarea class="desc-input form-control" name="" id="" rows="4">'+enterpriseLeaders[i].description+'</textarea></div>' +
                '<div class="leader-work">工作情况：<textarea class="work-input form-control" name="" id="" rows="4">'+enterpriseLeaders[i].work_situation+'</textarea>' +
                '</div></div><span class="remove-item"><i class="icon-remove"></i></span>' +
                '</li>')
        }
    }
    if(!!enterpriseExperts) {
        var expertUl = $('ul.experts-list');
        for(var i = 0; i < enterpriseExperts.length; i++) {
            var icon = '';
            var id = null;
            if(!!enterpriseExperts[i].icon) {
                id = JSON.parse(enterpriseExperts[i].icon)[0].id;
                icon = getAvatar(JSON.parse(enterpriseExperts[i].icon)[0].id)
            }
            expertUl.append('<li class="expert-item" data-expert-id="'+enterpriseExperts[i].id+'">' +
                '<div class="avatar-info"><input type="file" class="avatar-file" style="display: none">' +
                '<img src="'+icon+'" alt="" class="expert-avatar" data-avatar="'+id+'">' +
                '<p class="expert-name">姓名：<input type="text" class="name-input form-control" value="'+enterpriseExperts[i].name+'"></p>' +
                '<p class="expert-station">岗位：<input type="text" class="station-input form-control" value="'+enterpriseExperts[i].station+'"></p>' +
                '</div>' +
                '<div class="expert-item-info">' +
                '<p class="expert-school"><span>学历情况：</span><input class="schooling-input form-control" value="'+enterpriseExperts[i].schooling+'"></p>' +
                '<div class="expert-desc">个人经历：<textarea class="desc-input form-control" name="" id="" rows="4">'+enterpriseExperts[i].person_experience+'</textarea></div>' +
                '<div class="expert-search">研究方向：<textarea class="search-input form-control" name="" id="" rows="4">'+enterpriseExperts[i].search_direction+'</textarea></div></div>' +
                '<span class="remove-item"><i class="icon-remove"></i></span></li>')
        }
    }
}
// 获取文件路径
function getAvatar (id) {
    return '/adjuncts/file_download/' + id;
}


//打开关联选项框
function openPublisher(event){
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
        }
    });
    layer.full(index);
}

function handleRelevance(data) {
    var info = data.data;
    $('#front_user_id').val(info[0].nickname);
    $('#front_user_id').attr('data-publisher',info[0].id);
}
function saveCharacter() {
    var leader = $('.leaders-list li');
    var expert = $('.experts-list li');
    var enterpriseId = $('#enterpriseId').val();
    if(leader.length) {
        var leaderArray = [];
        for(var i = 0; i < leader.length; i++) {
            var name = leader.eq(i).find('.name-input').val();
            var leaderId = leader.eq(i).attr('data-leader-id');
            // if(!name) {layer.msg('请完整填写信息')}
            var station = leader.eq(i).find('.station-input').val();
            var schooling = leader.eq(i).find('.schooling-input').val();
            var description = leader.eq(i).find('.desc-input').val();
            var workSituation = leader.eq(i).find('.work-input').val();
            var icon = leader.eq(i).find('.leader-avatar').attr('data-avatar');
            var obj = {
                belongEnterprise: enterpriseId,
                name: name,
                schooling: schooling,
                station: station,
                description: description,
                workSituation: workSituation,
                icon: icon
            }
            if(!!leaderId) {
                obj['id'] = leaderId;
            }
            for(var tag in obj) {
                if(!obj[tag]){layer.msg('企业领导人保存失败，请完整填写企业领导人信息');return };
            }
            leaderArray.push(obj);
        }
        $.ajax({
            url: '/admin/enterpriseLeader/create_update',
            type: 'post',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(leaderArray),
            success:function (res) {
            },
            error: function(e){
                $.error(e);
            }
        })
    }
    if(expert.length) {
        var expertArray = [];
        for(var i = 0; i < expert.length; i++) {
            var name = expert.eq(i).find('.name-input').val();
            var expertId = expert.eq(i).attr('data-expert-id');
            var station = expert.eq(i).find('.station-input').val();
            var schooling = expert.eq(i).find('.schooling-input').val();
            var searchDirection = expert.eq(i).find('.search-input').val();
            var personExperience = expert.eq(i).find('.desc-input').val();
            var icon = expert.eq(i).find('.expert-avatar').attr('data-avatar');
            var obj = {
                belongEnterprise: enterpriseId,
                name: name,
                schooling: schooling,
                station: station,
                searchDirection: searchDirection,
                personExperience: personExperience,
                icon: icon
            }
            if(!!expertId) {
                obj['id'] = expertId
            }
            for(var tag in obj) {
                if(!obj[tag]){layer.msg('企业专家保存失败，请完整填写企业领导人信息');return }
            }
            expertArray.push(obj);
        }
        $.ajax({
            url: '/admin/enterpriseExpert/create_update',
            type: 'post',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(expertArray),
            success:function (res) {
            },
            error: function(e){
                $.error(e);
            }
        })
    }
}
/*
    name: 修改企业专家
    url: /admin/enterpriseExpert/create_update  POST
    contentType:application/json
    参数：{
        belongEnterprise  企业id
        name        姓名
        schooling   学历
        station     岗位
        searchDirection 研究方向
        personExperience    个人经历
        icon    头像
    }

*/

/*
     name: 修改企业领导人
     url: /admin/enterpriseLeader/create_update  POST
     contentType:application/json
     参数：{
         belongEnterprise  企业id
         name        姓名
         schooling   学历
         station     岗位
         description 个人描述
         workSituation    工作情况
         icon    头像
    }

 */
