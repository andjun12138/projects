/**
 * Created by wupeng on 2017/9/30.
 */

var $userName = $('#user-name');
var $userAccount = $('#user-account');
var $userPassword = $('#user-password');
var $saveBtn = $('#save-btn');
var $cancelBtn = $('#cancel-btn');
var formId = 38;
var userId;
$(function () {
    userId = id;
    $saveBtn.bind('click', saveUser);
    $cancelBtn.bind('click', cancelSave);
})

// 新增或修改用户
function saveUser() {
    // 如果有userId，即为修改用户信息
    var formKey = 0;
    if (userId) {
        formKey = userId;
    }
    var postData = {
        name: $userName.val(),
        account: $userAccount.val(),
        password: passwordEncrypt($userPassword.val())
    }
    $.ajax({
        type:'post',
        url:'/system/create_update_user/'+ formId + '/' + formKey,
        contentType:'application/json;charset=utf-8',
        dataType:'json',
        data: JSON.stringify(postData),
        success:function(res){
            console.log(res);
            var title = '添加用户成功';
            if (userId) {
                title = '修改用户成功';
            }
            if(res.status=="200"){
                parent.window.layer.closeAll()
                window.parent.refreshAndShowMessage({
                    title: title,
                    text: '请在列表查看',
                    type: 'success',
                    delay: 3000,
                    addclass: "stack-bottomright"
                })
            }else{
                new PNotify({
                    title: '添加用户失败',
                    text: res.message,
                    type: 'error',
                    delay: 3000,
                    addclass: "stack-bottomright"
                });
            }
        },error:function(XMLHttpRequest, textStatus, errorThrown){
            var title = '添加用户失败';
            if (userId) {
                title = '修改用户失败';
            }
            new PNotify({
                title: title,
                text: '请稍后再试',
                type: 'error',
                delay: 3000,
                addclass: "stack-bottomright"
            });
        }
    });
}

// 取消保存
function cancelSave() {
    window.parent.layer.closeAll();
}

// 密码加密
function passwordEncrypt(password) {
    return encrypt(password);
}
