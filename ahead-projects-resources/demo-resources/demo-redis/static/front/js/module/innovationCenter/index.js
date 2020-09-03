$(function () {
    // 获取ajax模块
    var _ajax = new NewAjax();

    // 介绍封面节点
    var oIntroCover = $('.innovation-center-item .item1-left-part img').eq(0);

    // 发展历程节点
    var oProgressListNode = $('.innovation-center-item .progress-list').eq(0);

    // 荣誉列表节点
    var oHornorListNode = $('.innovation-center-item .item4-content').eq(0);

    // 领导关怀节点-大图片
    var oLeadershipBig = $('.innovation-center-item .item3-content .item3-left-part').eq(0);

    // 领导关怀节点-小图片列表
    var oLeadershipSmall = $('.innovation-center-item .item3-content .item3-right-part').eq(0);


    // 首页区域
    console.log(centerIntro);
    console.log(developmentPathList);
    console.log(leadershipCareList);
    console.log(honorList);

    // 显示科创中心封面图
    showCover(centerIntro);
    function showCover(centerIntro) {
        if (centerIntro.pictureCover) {
            var coverId = JSON.parse(centerIntro.pictureCover).id;
            oIntroCover.attr('src', _ajax.getDomain('file') + '/adjuncts/file_download/' + coverId)
        }
    }

    // 显示发展历程列表
    renderDevelopmentList(developmentPathList);
    function renderDevelopmentList(developmentPathList) {
        console.log(oProgressListNode);
        var html = '', date = '', content = '';
        var list = timeSequence(developmentPathList);
        list.forEach(function (item) {
            date = item.time;
            content = item.content;
            html += sprintf('<li class="progress-item">\n' +
            '                    <div class="progress-date">%s</div>\n' +
            '                    <div class="progress-icon">\n' +
            '                        <div class="progress-icon-inner"></div>\n' +
            '                    </div>\n' +
            '                    <div class="progress-event">%s</div>\n' +
            '                </li>', date, content)
        });
        oProgressListNode.html(html);
    }

    // 显示领导关怀图片列表
    renderLeadershipCareList(leadershipCareList);
    function renderLeadershipCareList(leadershipCareList) {
        var len = leadershipCareList.length;
        var list1 = [], list2 = [], html1 = '', html2 = '';
        if (len > 0) {
            list1 = leadershipCareList[0];
            html1 = sprintf('<img src="%s" alt="">', getPicPath(list1.pictures));
            oLeadershipBig.html(html1);
        }
        if (len > 1) {
            list2 = leadershipCareList.slice(1, len);
            list2.forEach(function (item) {
                html2 += sprintf('<img src="%s" alt="">', getPicPath(item.pictures));
            });
            oLeadershipSmall.html(html2);
        }
    }

    // 显示中心荣誉图片列表
    renderHonorList(honorList);
    function renderHonorList(honorList) {
        var html = '';
        honorList.forEach(function (item) {
            html += sprintf('<img src="%s" alt="">', getPicPath(item.pictures));
        });
        oHornorListNode.html(html);
    }

    function timeSequence(list) {
        return list.sort(function (a, b) {
            return new Date(b.time).getTime() - new Date(a.time).getTime();
        });
    }

    function getPicPath(picId) {
        return _ajax.getDomain('file') + '/adjuncts/file_download/' + picId
    }
});
