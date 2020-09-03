/**
 * Created by mujun on 2019/7/24.
 */
$(function(){
    // 获取ajax模块
    var _ajax = new NewAjax();
    var oListPage = new PluginPagination('base-station-page');
    var bCanLift = true;
    var nNowPageNumber = 1;
    var nPageSize = 12;
    var nMaxPageNumber = 0;
    var nTotal = 0;
    var typeId = window.location.search.slice(8);

    //跳转到相应的tab
    function initPage(){
        $('.nav-item').each(function(){
            if($(this).attr('data-id') === typeId){
                $(this).addClass('active');
            }else{
                $(this).removeClass('active');
            }
        });
    }

    //tab点击事件, 切换分类
    function clickOfNavItem(){
        $('.nav-item').click(function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            typeId = $(this).attr('data-id');
            getBaseStationData();
        });
    }

    function getBaseStationData(){
        var params = {
            "type": typeId,
            "pager":{
                //当前页数
                current: nNowPageNumber,
                //每页条数
                size: nPageSize
            },
            sortPointer: {
                //排序字段
                filed: 'created_at',
                //排序规则
                order: 'DESC'
            }
        };
        _ajax.post('default',{
            url:'/infrastructure/query',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data:JSON.stringify(params),
            success: function (res) {
                if (res.status === 200) {
                    nTotal = res.data.total;
                    if (nTotal > nPageSize) {
                        nMaxPageNumber = Math.ceil(nTotal / nPageSize);
                        oListPage.showPage(true)
                            .setMaxPageNumber(nMaxPageNumber)
                            .setNowPageNumber(nNowPageNumber)
                            .createPage();
                    } else {
                        oListPage.showPage(false);
                    }
                    renderDataList(res.data.data_list);
                }
            },
            error: function (err) {
                console.log('initDataList err:', err);
            }
        });

    }

    function renderDataList(list){
        if(list){
            var html = '';
            for(var i=0;i<list.length;i++){
                var picture = (list[i].pictures) ? JSON.parse(list[i].pictures) : null;
                html += '<li class="base-station-item">' +
                    ' <div class="img-div">'+'<img class="base-station-img" src="' + _ajax.getDomain('file') + '/adjuncts/file_download/' + picture.id + '" alt="'+picture.title+'">'+'</div>'+'<div class="title">'+list[i].title+'</div>'+'</li>';
            }
            $('.base-station-list').html(html);
        }
    }

    /* 分页组件 */
    function initPlusPage() {
        // 测试分页
        oListPage.openFirstEndModel(false)
            .openLift(true) // 打开跳转
            .setGetInputNodeCallback(function (number) {
                if (number !== null) {
                    nNowPageNumber = number;
                    bCanLift = true;
                } else {
                    bCanLift = false;
                }
            })
            // 创建分页
            .createPage()
            // 点击回调
            .setClickCallback(function (node, oldPageNumber) {
                var _this = this;
                var labelType = node.get(0).tagName.toLowerCase();
                var newNumber = 0;
                if (labelType === 'li') {
                    // 页码按钮
                    if (node.data('status') !== undefined) {
                        newNumber = parseInt(node.data('mark'));
                        if (node.data('status') !== 'active' && newNumber !== oldPageNumber) {
                            nNowPageNumber = newNumber;
                            _this.setNowPageNumber(nNowPageNumber)
                                .createPage();
                        }
                    } else {// 我是上下页
                        if (node.data('mark') === 'prev') {
                            newNumber = oldPageNumber - 1;
                            if (newNumber > 0) {
                                nNowPageNumber = newNumber;
                                _this.setNowPageNumber(nNowPageNumber)
                                    .createPage();
                            }
                        } else if (node.data('mark') === 'next') {
                            newNumber = oldPageNumber + 1;
                            if (newNumber < nMaxPageNumber + 1) {
                                nNowPageNumber = newNumber;
                                _this.setNowPageNumber(nNowPageNumber)
                                    .createPage();
                            }
                        }
                    }
                    getBaseStationData();
                } else if (labelType === 'button') {
                    // 按钮
                    if (bCanLift) {
                        _this.setNowPageNumber(nNowPageNumber)
                            .createPage();
                    }
                    getBaseStationData();
                }
            });
    }

    function enlargeImg(name, url) {
        // 最大显示宽度2/3页面，高度自适应
        var halfBodyWidth = $(window).width() / 3 * 2;
        $("#display-img").attr("src", url);
        var height = $("#display-img").height();
        var width = $("#display-img").width();
        var showWidth = width;
        var showHeight = height;
        if (width > halfBodyWidth) {
            showWidth = halfBodyWidth;
            showHeight = height * halfBodyWidth / width
        }
        layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: [showWidth + 'px', showHeight + 'px'], //宽高
            content: "<img alt=" + name + " title=" + name + " src=" + url + " />"
        });
    }

    function eventOfImgClick() {
        $(document).on('click', '.base-station-list li.base-station-item .img-div', function () {
            var img = $(this).find('img.base-station-img');
            var name = img.attr('alt');
            var url = img.attr('src');
            if (url !== null && url !== undefined) {
                enlargeImg(name, url);
            }
        })
    }

    initPage();
    getBaseStationData();
    initPlusPage();
    clickOfNavItem();
    eventOfImgClick();
});

