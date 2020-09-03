/**
 * Created by lqs on 2017/8/21.
 * 新建表单
 */
var employmentId = $("#employmentId").val();
// 消息框位置控制
var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};
//相关材料数量
var attachmentCount = 0;
//结项材料数量
/*var materialCount = 0;*/
var type=-1;//上传文件类型

var disrictLength = 1;
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
//结项材料
/*var post_material = false;*/
$(function(){
    // 获取各个操作dom
    var $save = $('#save'),
        $close = $("#close"),
        $reset = $('#reset'),
        $form = $("#newForm"),
        $address=$("#addressBox");//省市区
    // 如果存在父窗口，获取窗口索引
    if(typeof parent.layer !== 'undefined' && employmentId !== null) {
        var index = parent.layer.getFrameIndex(window.name);
    }
    console.log(employmentId);
    if (employmentId !== ""){
        initPage();
    } else {
        $('#addressBox').distpicker("destroy");
        $('#addressBox').distpicker({
            province: '广东省',
            city: '惠州市',
            district: '惠城区'
        });
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
        e.preventDefault();
        var url = $(this).attr('data-url');
        var target = $(this).attr('href');
        if($(target).children("iframe").length === 0) {
            $(target).append('<iframe class="tab_iframe" src="'+url+'" frameborder="0" width="100%" scrolling="auto" onload="changeFrameHeight(this)"></iframe>');
        }
        $(this).tab('show')
    });

    disrictLength = $('#areaName option').length;

    $('#provinceName').change(function () {
        disrictLength = $('#areaName option').length;
        // console.log($('#areaName option').length);
    })

    $('#cityName').change(function () {
        disrictLength = $('#areaName option').length;
        // console.log($('#areaName option').length);
    })

    // 保存
    $save.click(function () {
        var enterpriseId=$("#enterpriseId").val();
        if(enterpriseId===""){
            layer.msg('请选择所属企业');
            return ;
        }
        $form.data('bootstrapValidator').validate();//表单验证
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
                    if (!![postData[this.name]]) {
                        postData[this.name] = [postData[this.name]];
                    }
                }
                if (!!this.value) {
                    postData[this.name].push(this.value);
                }
            } else {
                if (!!this.value) {
                    postData[this.name] = this.value;
                }
            }
        });
        if (disrictLength > 1) {
            if(postData['provinceName'] == null || postData['cityName'] == null || postData['areaName'] == null){
                layer.msg('请完整填写省市区');
                return ;
            }
        } else {
            if(postData['provinceName'] == null || postData['cityName'] == null){
                layer.msg('请完整填写省市区');
                return ;
            }
        }
        // 如果存在id
        if(typeof employmentId !== 'undefined' && employmentId !== null && employmentId !== '' ){
            postData['id'] = employmentId;
            postData=postDataInit(postData);
            console.log(postData);
            $.ajax({
                url: '/admin/employment/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    layer.closeAll();
                    if(res.status == 200) {
                        new PNotify({
                            title: '修改表单信息成功！',
                            text: '请在管理列表中查看修改后的内容',
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
            console.log("---2---");
            postData=postDataInit(postData);
            console.log(postData);
            $.ajax({
                url: '/admin/employment/create_update',
                data: JSON.stringify(postData),
                type: 'post',
                contentType:'application/json;charset=utf-8',
                success: function(res) {
                    layer.closeAll();
                    if(res.status === 200) {
                        parent.window.refreshAndShowMessage({
                            title: '新建成功！',
                            text: '请在管理列表中查看',
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

            }
        });
    }
    formValidator();
    /*    $('#deadline').datetimepicker({
            locale: moment.locale('zh-cn'),
            format: "YYYY-MM-DD",
            minDate: new Date()
        });*/
    $('#addressBox').distpicker();
    $('#newForm').on("change",'input[type="file"]',function(e){
        e.stopPropagation();
        /*        if($(this).attr('id') == "material") {
                    if(materialCount == 1) {
                        layer.msg('已经有结项材料');
                        return ;
                    }
                }*/
        var $self=$(this);
        $self.attr("id");
        if($self.attr("id")=="attachment"){
            type=0;
        }/*else if($self.attr("id")=="material"){
            if(materialCount == 1){
                layer.msg('仅能上传一个结项材料');
                var fileList = $(this).get(0).files;
                fileList.length=fileList.length-1;
                return ;
            }
            type=1;
        }*/
        var fileList = $(this).get(0).files;
        if(fileList.length==0)return; //如果文件为空
        var formData=new FormData();
        var target=$(this).next().next().children(".file-list").first();
        var targetInput=$(this).next().children('input').first();
        for(var i=0;i<fileList.length;i++){
            formData.append('files',fileList[i]);
        }
        var xhr = getRequestObject();
        //  成功回调
        xhr.onload = function(){
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
                if (type == 0){
                    attachmentCount++;
                    targetInput.attr('data-id', fileIds);
                    targetInput.val("已选择"+ attachmentCount +"个文件");
                    console.log("2222222222")
                    console.log(attachmentCount);
                }/*else {
                    materialCount = 1;
                    targetInput.attr('data-id', fileIds);
                    targetInput.val("已选择"+ materialCount +"个文件");
                }*/
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
            if (type == 1){
                /*                materialCount = 0;*/
            }else {
                attachmentCount --;
            }
            if(fileListDom.children('.file-item').length === 0) {
                inputDom.val("");
            } else {
                /*                inputDom.val("已选择"+fileListDom.length+"个文件");*/
                inputDom.val("已选择"+attachmentCount+"个文件");
                console.log("11111111111111");
                console.log(attachmentCount);
            }
            /*            if(inputDom.attr("id") == "materialInput") {post_material = false}*/
            layer.closeAll();
        },function () {
            layer.closeAll();
        });
    }).on('click','.file-item .file-name',function(e){
        e.stopPropagation();
        var id = $(this).attr('data-id');
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
                //    图片url接口
            });
        } else {
            window.open("/adjuncts/file_download/"+id);
            //
        }
    });

    $address.on('blur','select',function(e){
        e.stopPropagation();
        getAddress();
    });
    getAddress();
});
function getAddress(){
    var province = $("#provinceName").find("option:selected").val();
    var city = $("#cityName").find("option:selected").val();
    var district = $("#areaName").find("option:selected").val();
    if (!!province) {
        var address=""+province;
    }
    console.log(city);
    if (!!city) {
        var address=""+province+city;
    }
    console.log(district);
    if (!!district) {
        var address=""+province+city+district;
    }
    console.log(address);
    $("#address").val(address+"");
}
//postData参数处理
function postDataInit(data){
    data.address=$("#address").val();
    var fileList=$("#attachment").siblings(".file-content").children(".file-list");
    var length=fileList.children().length;
    var id="";
    for(var i=0;i<length;i++){
        id+=fileList.children().eq(i).children("div").attr("data-id");
        if(i!=length-1){
            id+=",";
        }
    }
    /*    var mList=$("#material").siblings(".file-content").children(".file-list");
        var mid="";
        if(mList.children().length==0){
            data['postMaterial']=mid;
        }else{
            data['postMaterial']=mList.children().eq(0).children("div").attr("data-id");
        }*/
    data.enterpriseId=null;
    data.enterpriseId=$("#enterpriseId").attr("data-id");
    data.attachment=id;
    console.log(data);
    return data;
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
function getFileName(o){
    var pos=o.lastIndexOf("\\");
    return o.substring(pos+1);
}
function getFullPath(obj){

    if (obj) {
        if (obj.files) {
            $.ajax({
                type:'post',
                url:'adjuncts/file_upload',
                contentType:'application/json',
                data:JSON.stringify(obj.files[0]),
                success:function(data){
                    console.log(data);
                },
                error:function(error){
                    console.log("上传失败");
                }
            })/*window.URL.createObjectURL(*/
            $("#fileInput").val(obj.files.item(0).name);
            return window.URL.createObjectURL(obj.files.item(0));
        }
        $("#fileInput").val(obj.value+".jpg");
        return obj.value;
    }
}
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
            //得到iframe页的窗口对象
            // var iframeWin = window[layero.find('iframe')[0]['name']];
            // 执行iframe页的方法：
            // iframeWin.setRelevanceObj(id, name, fieldType, selector);
        }
    });
    layer.full(index);
}
function handleRelevance(data){
    console.log('hhhhhhhhhh',data);
    $("#enterpriseId").val(data.data[0].nameStr);
    $("#enterpriseId").attr("data-id",data.data[0].id);
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

    if (!!$("#provinceName").attr("data-province")) {
        $("#provinceName").val($("#provinceName").attr("data-province"));
    }else {
        $("#provinceName").val('');
    }

    if (!!$("#cityName").attr("data-city")) {
        $("#cityName").val($("#cityName").attr("data-city"));
    }else {
        $("#cityName").val('');
    }

    if (!!$("#areaName").attr("data-district")) {
        $("#areaName").val($("#areaName").attr("data-district"));
    } else {
        $("#areaName").val('');
    }

    if (!!$("#enterpriseId").attr("data-enterprise")) {
        var enterpriseId = JSON.parse($("#enterpriseId").attr("data-enterprise"));
        if (!!enterpriseId[0]) {
            $("#enterpriseId").val(enterpriseId[0].name);
            $("#enterpriseId").attr("data-id", enterpriseId[0].id);
        }
    }
    if(StringNoEmpty($("#attachment").attr("data-attachment"))) {
        var attachment=JSON.parse($("#attachment").attr("data-attachment"));
        var fileList=$(".file-list").eq(0);
        for(var i=0;i<attachment.length;i++){
            var filename=attachment[i].title+"."+attachment[i].prefix;
            var suffix=attachment[i].prefix;
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
                case 'JPEG':
                case 'gif':
                    iconSrc = '/static/assets/photo.png';
                    break;
                default:
                    iconSrc = '/static/assets/file.png';
            }
            fileList.append('<div class="file-item"><img class="file-icon pull-left" src="' + iconSrc + '"/><div class="file-name" title="' + filename + '" data-id="'+attachment[i].id+'">' + filename + '</div><i class="icon-remove-sign pull-right file-remove" title="删除"></i></div>');
        }
        $("#fileInput").val("已选择"+attachment.length+"个文件");
        attachmentCount = attachment.length;
    }

    var education = $("#education").data("education").id;
    $('#education option[value="'+education+'"]').attr("selected",true);

    var industry = $("#industry").data("industry").id;
    $('#industry option[value="'+industry+'"]').attr("selected",true);
}
function StringNoEmpty(str){
    if(str!=null&&str!=""&&str!=undefined){
        return true;
    }else return false;
}