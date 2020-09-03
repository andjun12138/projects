/**
 * Created by mujun on 2019/7/12.
 */
$(function () {

    var files = null;
    var _ajax = new NewAjax();

    if(!!helpCenter.adjunctId){
        files = JSON.parse(helpCenter.adjunctId)
    }
    console.log(files);

    //左侧导航栏的点击事件
    tagClick();
    setData();
    function tagClick() {
        $('.tag-item').click(function () {
            for (var i = 0; i < $('.tag-item').length; i++) {
                $('.tag-item').eq(i).removeClass('active');
            }
            $(this).addClass('active');
            var index = $(this).index();
            $('.right-part>div').eq(index).siblings().removeClass('selected');
            $('.right-part>div').eq(index).addClass('selected');
        });
    }

    function setData(){
        var strHtml = '';
        for(var i=0; i<files.length;i++){
            strHtml+='<li><a style="color:#0091ff" href="'+_ajax.getDomain('file')+'/adjuncts/file_download/'+files[i].id+'" download="'+files[i].title+'.'+files[i].prefix+'">'+files[i].title+'.'+files[i].prefix+'</a></li>';
        }
        $('.file-list').html(strHtml);
    }
});
