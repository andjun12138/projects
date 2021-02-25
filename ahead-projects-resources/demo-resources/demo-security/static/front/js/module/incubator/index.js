$(function () {
    // 获取ajax模块
    var _ajax = new NewAjax();
    // 首页区域
    var oHomeArea = $('.incubator').eq(0);
    // 空格正则
    var oWarpRule = />\s+<?|>?\s+</g;
    // 获取storage存储的数据
    var thirdPlatformInfo = getLocalStorage('thirdPlatformInfo');
    // 存储服务器token
    var incubatorToken = '';
    // 获取token
    if (thirdPlatformInfo) {
        incubatorToken = thirdPlatformInfo.incubatorToken || '';
    }

    /* 轮播图 */
    // 轮播图数据
    var aSliderData = [];
    // 轮播图模块
    var oSliderNode = oHomeArea.find('.incubator-slider-model').eq(0);
    // 轮播图列表
    var oSliderListNode = oSliderNode.find('.slider-list').eq(0);
    // point列表节点
    var oSliderPointListNode = oSliderNode.find('.slider-points-list').eq(0);
    // point子项节点
    var aSliderPoints = null;
    // 获取title节点
    var oSliderTitleNode = oSliderNode.find('.slider-title').eq(0);
    // 轮播图子项Html
    var sSliderItemHtml = '<li class="slider-item">\n' +
        '                        <a class="slider-item-link" href="" target="_blank">\n' +
        '                            <img class="slider-item-image" src="" alt="">\n' +
        '                        </a>\n' +
        '                    </li>';
    // 轮播pointHtml
    var sSliderPointItemHtml = '<li class="slider-point-item" data-index=""></li>';
    // link正则
    var oSliderLinkRule = /<a class="slider-item-link[^>]+>/;
    // image正则
    var oSliderImageRule = /<img class="slider-item-image[^>]+>/;
    // 获取子项宽度
    var nSliderItemWidth = oSliderListNode.parent().width();
    // 当前下标
    var nSliderShowIndex = 0;
    // 是否暂停
    var bIsTimeOut = false;
    // 是否正在动画
    var bIsInAnimation = false;
    // 轮播图timer
    var oSliderTimer = null;

    /* 行业资讯 */
    // 行业资讯列表
    var oNewListNode = oHomeArea.find('.news-content-list').eq(0);
    // 行业资讯自行html
    var sNewItemHtml = '<li class="news-content-item">' +
        '<a class="news-content-link" href="%link%" target="_blank">' +
        '<span class="news-content-title">%title%</span>' +
        '<span class="news-content-time">%date%</span>' +
        '</a>' +
        '</li>';


    /* 入孵申请 */
    // 入孵申请模块
    var oApplicationModel = oHomeArea.find('.incubator-application-div');
    // 获取申请链接
    var oApplicationLinkNode = oApplicationModel.find('a.application-link').eq(0);
    // 申请入孵数据
    var oApplicationData = null;


    /* 明星企业 */
    var oStarCompanyList = oHomeArea.find('#excellent-company-list');
    // 获取列表子项
    var aStarCompanyItems = oStarCompanyList.children();
    // 轮回数值
    var nCycleNumber = 6;
    // 获取transitionEnd事件名称
    var sTransitionEndName = null;
    // 获取事件名称
    var sAnimateEndEventName = null;
    // 是否暂停
    var bIsStarCompanyStop = false;
    // 是否完成动画
    var bIsRunAnimation = false;
    var timer = null;

    /* 孵化平台 */
    // 孵化列表区域
    var oPlatformListArea = oHomeArea.find('.platform-list-div').eq(0);
    // 孵化列表
    var oPlatformListNode = oPlatformListArea.find('.list').eq(0);
    // 列表子项html
    var sPlatformItemHtml = '<li class="item">' +
        '<a href="%link%" target="_blank" rel="nofollow">' +
        '<div class="platform-image-div">' +
        '<img src="%src%" alt="%title%" class="platform-image">' +
        '</div>' +
        '<div class="platform-title-div">' +
        '<span class="platform-title">%title%</span>' +
        '</div>' +
        '</a>' +
        '</li>';

    /* 基础设施 */
    // 基础设备区域
    var oInfrastructureArea = oHomeArea.find('.base-station-div').eq(0);
    // 子项html
    var sInfrastructureItemHtml = '<li class="item">' +
        '<img src="%src%" title="%title%" alt="%title%" class="base-station-image">' +
        '</li>';


    /* 轮播图 */
    // 轮播图事件
    sliderEvent();
    // 初始获取轮播图（pc）
    initSlider();

    /* 行业资讯 */
    initNews();

    /* 入孵申请 */
    initApplication();
    applicationEvent();

    /* 明星企业 */
    starCompanyEvent();
    getStarCompanyData();

    /* 孵化平台 */
    initIncubationPlatform();

    /* 基础设施 */
    initInfrastructure();

    /* 服务机构 */
    initServiceOrg();

    /**
     *行业资讯
     */
    function initNews() {
        var params = {
            pager: {
                //当前页数
                current: 1,
                //每页条数
                size: 9
            },
            sortPointer: {
                //排序字段
                filed: "publish_date",
                //排序规则
                order: "DESC"
            }
        };
        _ajax.post('default', {
            url: '/incubatorArticle/query',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(params),
            success: function (res) {
                var data = null;
                if (res.status === 200) {
                    data = extractNewsData(res.data.data_list);
                    renderNews(data);
                }
            },
            error: function (err) {
                console.log('initNews:', err);
            }
        });
    }

    // 提取行业资讯数据
    function extractNewsData(data) {
        var result = [];
        data.forEach(function (item, index) {
            var obj = {};
            obj.id = item.id;
            obj.link = '/incubatorArticle/detail/' + item.id + '.html';
            obj.title = item.title;
            obj.date = (item.publishDate) ? formatTime(new Date(item.publishDate), false, 'YYYY-MM-DD') : null;
            result.push(obj);
        });
        return result;
    }

    // 写入行业资讯
    function renderNews(list) {
        if (list) {
            var html = '';
            list.forEach(function (item) {
                html += sprintf(sNewItemHtml, item);
            });
            oNewListNode.html(html);
        }
    }

    /* 入孵申请 */
    // 初始化入孵申请
    function initApplication() {
        getDataOfIncubationFunc();
    }

    // 请求功能列表数据
    function getDataOfIncubationFunc() {
        var config = {
            pager: {
                //当前页数
                current: 1,
                //每页条数
                size: 8
            },
            sortPointer: {
                //排序字段
                filed: "weight_value",
                //排序规则
                order: "DESC"
            }
        };
        _ajax.post('default', {
            url: '/incubatorLinkManage/query',
            contentType: 'application/json',
            data: JSON.stringify(config),
            success: function (res) {
                var data = null;
                if (res.status === 200) {
                    data = res.data;
                    extractApplicationData(data.data_list);
                    importApplicationLink();
                }
            },
            error: function (err) {
                console.error('getDataOfIncubationFunc:', err);
            }
        });
    }

    // 提取功能列表数据
    function extractApplicationData(data) {
        oApplicationData = {};
        $.each(data, function (index, item) {
            if (item.id === '92164e98-c721-468f-9acf-f357f39547f1') {
                oApplicationData.url = item.url;
                return false;
            }
        });
    }

    // 写入功能列表
    function importApplicationLink() {
        if (window.userInfo && incubatorToken) {
            oApplicationLinkNode.attr({
                href: oApplicationData.url + '?token=' + incubatorToken
            });

        }
    }

    // 入孵申请链接
    function applicationEvent() {
        oApplicationLinkNode.on('click', function () {
            if (!window.userInfo) {
                __layer.closeAll();
                __layer.msg('请先登录');
                setTimeout(function () {
                    window.location.href = '/login.html';
                }, 1000);
                return false;
            }
            if (!(!!incubatorToken)) {
                __layer.closeAll();
                __layer.msg('您并未获得入孵申请的权限');
                return false;
            }
        })
    }

    /**
     * 明星项目
     */
    // initStarProjects();
    function initStarProjects() {
        var params = {
            pager: {
                //当前页数
                current: 1,
                //每页条数
                size: 2
            },
            sortPointer: {
                //排序字段
                filed: "created_at",
                //排序规则
                order: "DESC"
            }
        };
        $.ajax({
            url: '/starProjects/query',
            type: 'post',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(params),
            success: function (res) {
                if (res.status === 200) {
                    renderStarProjects(res.data.data_list);
                }
            },
            error: function (err) {
                console.log('initStarProjects:', err);
            }
        });
    }

    function renderStarProjects(list) {
        if (list) {
            var $newList = $('.excellent-project-content .list')[0];
            var html = '';
            var imgArr = ['idea.jpg', 'factory.jpg', 'rocket.jpg', 'government.jpg', 'tool.jpg', 'ai.jpg'];
            var topDiv = '';
            var bottomDiv = '';
            if (list[0]) {
                topDiv = '<div class="project-show-div" type="top">' +
                    '<div class="project-image-div">' +
                    '<img class="project-image" src="' + _ajax.getDomain('file') + '/adjuncts/file_download/' + list[0].pictureCover + '" alt="">' +
                    '</div>' +
                    '<div class="project-text-div">' +
                    '<p class="title">' + list[0].title + '</p>' +
                    '<p class="description">' + list[0].introduction + '</p>' +
                    '</div>' +
                    '</div>';
            }
            if (list[1]) {
                bottomDiv = '<div class="project-show-div" type="bottom">' +
                    '<div class="project-image-div">' +
                    '<img class="project-image" src="' + _ajax.getDomain('file') + '/adjuncts/file_download/' + list[0].pictureCover + '" alt="">' +
                    '</div>' +
                    '<div class="project-text-div">' +
                    '<p class="title">' + list[0].title + '</p>' +
                    '<p class="description">' + list[0].introduction + '</p>' +
                    '</div>' +
                    '</div>';
            }
            html = '<li class="item">' + topDiv + bottomDiv + '</li>';
            $($newList).html(html);
        }
    }

    /**
     * 孵化平台
     */
    function initIncubationPlatform() {
        var params = {
            pager: {
                //当前页数
                current: 1,
                //每页条数
                size: 6
            },
            sortPointer: {
                //排序字段
                filed: "weight_value",
                //排序规则
                order: "DESC"
            }
        };
        _ajax.post('default', {
            url: '/incubaPlatform/query',
            type: 'post',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(params),
            success: function (res) {
                var data = null;
                if (res.status === 200) {
                    data = extractPlatformListData(res.data.data_list);
                    renderIncubationPlatform(data);
                }
            },
            error: function (err) {
                console.log('initIncubaPlatform:', err);
            }
        });
    }

    // 提取列表数据
    function extractPlatformListData(data) {
        var result = [];
        var imgArr = ['idea.jpg', 'factory.jpg', 'rocket.jpg', 'government.jpg', 'tool.jpg', 'ai.jpg'];
        data.forEach(function (item, index) {
            var obj = {};
            obj.id = item.id;
            obj.link = item.url;
            obj.title = item.title;
            if (item.logo) {
                obj.src = _ajax.getDomain('file') + '/adjuncts/file_download/' + JSON.parse(item.logo).id;
            } else {
                obj.src = '/static/front/assets/image/module/incubator/' + imgArr[index];
            }
            result.push(obj);
        });
        return result;
    }

    // 写入孵化平台
    function renderIncubationPlatform(data) {
        if (data) {
            var $newList = $('.platform-list-div .list')[0];
            var html = '';
            var newObj = {};
            data.forEach(function (item) {
                newObj = item;
                if (item.link === null || item.link === undefined) {
                    newObj.link = '/incubaPlatform/detail/' + item.id + '.html';
                }
                html += sprintf(sPlatformItemHtml, newObj);
            });
            $($newList).html(html);
        }
    }

    /**
     *基础设施
     */
    function initInfrastructure() {
        getOfficeBuilding();
        getServiceHall();
        eventOfImgClick();
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
        $(document).on('click', '.base-station-list li.item', function () {
            var img = $(this).find('img.base-station-image');
            var name = img.attr('title');
            var url = img.attr('src');
            if (url !== null && url !== undefined) {
                enlargeImg(name, url);
            }
        })
    }

    // 获取办公大楼基础设施
    function getOfficeBuilding() {
        getDataOfInfrastructure('04cb729c-9d92-4e9a-8aa0-c873274a0191', function (data) {
            var list = extractInfrastructureData(data.data_list);
            // 当前列表
            var oNowList = oInfrastructureArea.find('.base-station-item[type="left"] .base-station-list').eq(0);
            importInfrastructureData(oNowList, list, '更多');
        });
    }

    // 获取服务大厅基础设施
    function getServiceHall() {
        getDataOfInfrastructure('ced5860b-bf96-44ae-a2ae-287ad11672c4', function (data) {
            var list = extractInfrastructureData(data.data_list);
            // 当前列表
            var oNowList = oInfrastructureArea.find('.base-station-item[type="right"] .base-station-list').eq(0);
            importInfrastructureData(oNowList, list, '更多');
        });
    }

    // 获取设备数据
    function getDataOfInfrastructure(type, callback) {
        var params = {
            type: type,
            pager: {
                //当前页数
                current: 1,
                //每页条数
                size: 3
            },
            sortPointer: {
                //排序字段
                filed: "created_at",
                //排序规则
                order: "DESC"
            }
        };
        _ajax.post('default', {
            url: '/infrastructure/query',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(params),
            success: function (res) {
                if (res.status === 200) {
                    if (callback) {
                        callback(res.data);
                    }
                }
            },
            error: function (err) {
                console.log('getDataOfInfrastructure:', err);
            }
        });
    }

    // 提取数据
    function extractInfrastructureData(data) {
        var result = [];
        var index = 0;
        while (index < 3) {
            var item = data[index];
            var obj = {};
            obj.id = (item) ? item.id : null;
            obj.title = (item) ? item.title : null;
            if (item && item.pictures) {
                obj.src = _ajax.getDomain('file') + '/adjuncts/file_download/' + JSON.parse(item.pictures).id;
            } else {
                obj.src = '/static/front/assets/image/common/no-picture.jpg';
            }
            obj.typeId = (item.type) ? JSON.parse(item.type).id : null;
            result.push(obj);
            index++;
        }
        return result;
    }

    // 写入设施
    function importInfrastructureData(listNode, data, title) {
        // 获取子项
        var html = '';
        var type = null;
        data.forEach(function (item) {
            html += sprintf(sInfrastructureItemHtml, item);
            type = item.typeId;
        });
        html += '<li class="item"><a href="/infrastructure/baseStation.html?typeId=' + type + '">' + title + '</a></li>';
        listNode.html(html);
    }

    /**
     *服务机构
     */
    function initServiceOrg() {
        var params = {
            pager: {
                //当前页数
                current: 1,
                //每页条数
                size: 12
            },
            sortPointer: {
                //排序字段
                filed: "created_at",
                //排序规则
                order: "DESC"
            }
        };
        $.ajax({
            url: '/serviceOrg/query',
            type: 'post',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(params),
            success: function (res) {
                if (res.status === 200) {
                    renderServiceOrg(res.data.data_list);
                }
            },
            error: function (err) {
                console.log('initServiceOrg:', err);
            }
        });
    }

    // 写入服务机构
    function renderServiceOrg(list) {
        if (list) {
            var $newList = $('.service-station-list')[0];
            var html = '';
            list.forEach(function (item) {
                var logoId;
                if (item.logo) {
                    logoId = JSON.parse(item.logo).id;
                }

                var publishDate = (item.publishDate) ? formatTime(new Date(item.publishDate), false, 'YYYY-MM-DD') : null;
                html += '<li class="item">' +
                    '<a href="' + item.url + '" class="service-station-link" target="_blank" rel="nofollow">' +
                    '<img src="' + _ajax.getDomain('file') + '/adjuncts/file_download/' + logoId + '" alt="" class="service-station-image">' +
                    '</a>' +
                    '</li>';
            });
            $($newList).html(html);
        }
    }


    /* 轮播图 */

    // 初始化
    function initSlider() {
        getDataOfSlider();
    }

    // 获取轮播图
    function getDataOfSlider(mode) {
        if (mode === undefined) {
            mode = 0;
        }
        // 请求设备类型 0:pc; 1:手机
        // var oDeviceType = ['70b5f499-13d4-4901-b53d-b8690571cd1a', '7ceb2c24-a5ee-481b-bdf7-a4d679e5146f'];
        _ajax.get('default', {
            url: '/incubatorShufflingFigure/query',
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json',
            success: function (res) {
                var data = null;
                if (res.status === 200) {
                    data = res.data;
                    // 提取数据
                    extractDataOfSlider(data.data_list);
                    // 写入数据
                    importDataOfSlider();
                    // 写入标题
                    handleOfSliderTitleChange();
                    // 数据 > 1 才执行动画
                    if (aSliderData.length > 1) {
                        sliderAnimation();
                    }
                }
            },
            error: function (err) {
                console.error("获取轮播图:" + err);
            }
        });
    }

    // 提取轮播图数据
    function extractDataOfSlider(data) {
        data.forEach(function (item) {
            aSliderData.push({
                image: _ajax.getDomain('file') + '/adjuncts/file_download/' + item.PICTURE,
                link: item.URL,
                title: item.TITLE
            })
        });
        // 首尾相接处理
        if (data.length > 1) {
            aSliderData.push(JSON.parse(JSON.stringify(aSliderData[0])));
        }
    }

    // 写入轮播图数据
    function importDataOfSlider() {
        // 内容html
        var result = '';
        // pointHtml
        var pointHtml = '';
        oSliderListNode.css({
            width: nSliderItemWidth * aSliderData.length + 'px'
        });
        aSliderData.forEach(function (item, index) {
            result += sSliderItemHtml.replace(oWarpRule, function (warpStr) {
                return warpStr.replace(/\s+/g, '');
            }).replace(oSliderLinkRule, function (linkStr) {
                if (/(http(s)?|ftp|rtsp|mms):/.test(item.link)) {
                    return linkStr.replace('href=""', 'href="' + item.link + '"');
                } else {
                    return linkStr.replace('href=""', 'href="//' + item.link + '"');
                }
            }).replace(oSliderImageRule, function (imageStr) {
                return imageStr.replace('src=""', 'src="' + item.image + '"')
                    .replace('alt=""', 'alt="' + item.title + '"')
                    .replace('title=""', 'title="' + item.title + '"');
            });
            if (index < aSliderData.length - 1) {
                if (index === 0) {
                    pointHtml += '<li class="slider-point-item active" data-index="0"></li>'
                } else {
                    pointHtml += sSliderPointItemHtml.replace('data-index=""', 'data-index="' + index + '"');
                }
            }
        });
        oSliderListNode.html(result);
        oSliderPointListNode.html(pointHtml);
        // 重新获取point子项节点
        aSliderPoints = oSliderPointListNode.children('.slider-point-item');
    }

    // 轮播图事件
    function sliderEvent() {
        eventOfSliderMouseEnter();
        eventOfSliderMouseLeave();
        eventOfSliderPointClick();
    }

    // 鼠标移进事件
    function eventOfSliderMouseEnter() {
        // 获取轮播图父框
        var oSliderParentNode = oSliderListNode.parent();
        oSliderParentNode.on('mouseenter', function () {
            bIsTimeOut = true;
        })
    }

    // 鼠标移出事件
    function eventOfSliderMouseLeave() {
        // 获取轮播图父框
        var oSliderParentNode = oSliderListNode.parent();
        oSliderParentNode.on('mouseleave', function () {
            bIsTimeOut = false;
        })
    }

    // 轮播图动画
    function sliderAnimation() {
        // 测试数据
        var total = aSliderData.length || 6;
        oSliderTimer = setInterval(function () {
            // 非暂停时执行
            if (!bIsTimeOut && !bIsInAnimation) {
                nSliderShowIndex = (nSliderShowIndex + 1) % total;
                handleOfSliderAnimation();
            }
        }, 3000);
    }

    // 动画事件执行函数
    function handleOfSliderAnimation() {
        // 测试数据
        var total = aSliderData.length || 6;
        handleOfSliderPointChange();
        handleOfSliderTitleChange();
        bIsInAnimation = true;
        oSliderListNode.animate({
            left: -1 * nSliderShowIndex * nSliderItemWidth
        }, 1000, function () {
            bIsInAnimation = false;
            if (nSliderShowIndex === total - 1) {
                oSliderListNode.css({
                    left: 0
                });
                nSliderShowIndex = 0;
            }
        });
    }

    // point执行函数
    function handleOfSliderPointChange() {
        // 测试数据
        var total = aSliderData.length || 6;
        // 当前节点
        var oNowNode = null;
        // 展示下标
        var showIndex = (nSliderShowIndex === total - 1) ? 0 : nSliderShowIndex;
        aSliderPoints.each(function (index) {
            oNowNode = $(this);
            if (oNowNode.hasClass('active')) {
                oNowNode.removeClass('active');
            }
            if (index === showIndex) {
                oNowNode.addClass('active');
            }
        })
    }

    // title执行函数
    function handleOfSliderTitleChange() {
        var content = (aSliderData.length > 0 && nSliderShowIndex < aSliderData.length) ? aSliderData[nSliderShowIndex].title : '';
        oSliderTitleNode.text(content);
    }

    // point点击事件
    function eventOfSliderPointClick() {
        // 获取当前节点
        var oNowNode = null;
        oSliderPointListNode.on('click', 'li.slider-point-item', function () {
            if (bIsInAnimation) {
                console.warn('动画未执行完毕');
                return 0;
            }
            oNowNode = $(this);
            if (oNowNode.hasClass('active')) {
                return 0;
            }
            nSliderShowIndex = oNowNode.data('index');
            // 触发执行动画
            handleOfSliderAnimation();
        })
    }

    /* 明星企业 */
    // 明星企业
    function starCompanyEvent() {
        sTransitionEndName = getTransitionEndName();
        sAnimateEndEventName = getAnimationEndName();
        StarCompanyListEvent();
        eventOfStarCompanyItemTransitionEnd();
        setStarCompanyListWidth();
        starCompanyListScrollAnimate();
    }

    // 获取明星企业
    function getStarCompanyData() {
        var config = {
            pager: {
                //当前页数
                current: 1,
                //每页条数
                size: 5
            },
            sortPointer: {
                //排序字段
                filed: "created_at",
                //排序规则
                order: "DESC"
            }
        };
        _ajax.post('default', {
            url: '/starEnterprise/query',
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json',
            data: JSON.stringify(config),
            success: function (res) {
                var data = null;
                var starCompanyData = null;
                if (res.status === 200) {
                    data = res.data;
                    starCompanyData = extractStarCompany(data.data_list);
                    importStarCompany(starCompanyData);
                }
            },
            error: function (err) {
                console.error("获取轮播图:" + err);
            }
        });
    }

    // 提取数据
    function extractStarCompany(data) {
        var result = [];
        data.forEach(function (item) {
            var obj = {};
            obj.id = item.id;
            obj.title = item.title;
            if (item.pictureCover) {
                obj.src = _ajax.getDomain('file') + '/adjuncts/file_download/' + JSON.parse(item.pictureCover).id
            }
            result.push(obj);
        });
        result.push(JSON.parse(JSON.stringify(result[0])));
        return result;
    }

    // 写入明星企业
    function importStarCompany(data) {
        data.forEach(function (item, index) {
            aStarCompanyItems.eq(index).find('div.company-image-div').eq(0).attr({
                title: item.title
            }).find('img.company-image').eq(0).attr({
                src: item.src
            });
            aStarCompanyItems.eq(index).find('a.company-detail-link').attr({
                href: '/starEnterprise/detail/' + item.id + '.html'
            })
        });
    }

    // 计算列表的宽度
    function setStarCompanyListWidth() {
        var aItems = oStarCompanyList.children();
        var childWidth = aItems.get(0).offsetWidth;
        oStarCompanyList.css({
            width: (childWidth * aItems.length) + 'px'
        })
    }

    // 获取Transition监听事件名
    function getTransitionEndName() {
        var result = null;
        var attr = null;
        var oListNode = oStarCompanyList.get(0);
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };

        for (attr in transitions) {
            if (oListNode.style[attr] !== undefined) {
                result = transitions[attr];
                break;
            }
        }

        return result;
    }

    // 获取animation监听事件名
    function getAnimationEndName() {
        var result = null;
        var attr = null;
        var oListNode = oStarCompanyList.get(0);
        var animations = {
            'animation': 'animationend',
            'OAnimation': 'oAnimationEnd',
            'MsAnimation': 'MSAnimationEnd',
            'MozAnimation': 'mozAnimationEnd',
            'WebkitAnimation': 'webkitAnimationEnd'
        };

        for (attr in animations) {
            if (oListNode.style[attr] !== undefined) {
                result = animations[attr];
                break;
            }
        }

        return result;
    }

    // 列表滚动动画
    function starCompanyListScrollAnimate() {
        var oNowNode = null;
        var nNowLevel = null;
        timer = setInterval(function () {
            if (!bIsStarCompanyStop) {
                if (bIsRunAnimation) {
                    return false;
                }
                bIsRunAnimation = true;
                aStarCompanyItems = oStarCompanyList.children();
                aStarCompanyItems.each(function () {
                    oNowNode = $(this);
                    nNowLevel = parseInt(oNowNode.attr('level'));
                    // 此步骤确保页面收起后再打开时动画不会混乱
                    if (nNowLevel < 0) {
                        aStarCompanyItems.each(function (index) {
                            $(this).attr({
                                level: index + 1
                            });
                        });
                        aStarCompanyItems.eq(0).attr({
                            level: 0
                        });
                    } else {
                        oNowNode.attr({
                            level: nNowLevel - 1
                        });
                    }
                });
                oStarCompanyList.addClass('left-move');
            }
        }, 3000);
    }

    // 列表事件
    function StarCompanyListEvent() {
        eventOfStarCompanyListMouseEnter();
        eventOfStarCompanyListMouseLeave();
        eventOfStarCompanyListAnimateEnd();
        eventsOfClickSlider();
    }

    // 列表mouseenter
    function eventOfStarCompanyListMouseEnter() {
        oStarCompanyList.on('mouseenter', function () {
            bIsStarCompanyStop = true;
        });
    }

    // 列表mouseLeave
    function eventOfStarCompanyListMouseLeave() {
        oStarCompanyList.on('mouseleave', function () {
            bIsStarCompanyStop = false;
        })
    }

    // 列表动画结束监听
    function eventOfStarCompanyListAnimateEnd() {
        oStarCompanyList.get(0).addEventListener(sAnimateEndEventName, function () {
            bIsRunAnimation = false;
            oStarCompanyList.removeClass('left-move');
            dealWithItemAfterScroll();
        });
    }

    // 列表子项渐变结束监听
    function eventOfStarCompanyItemTransitionEnd() {
        oStarCompanyList.children().each(function () {
            (function (oNowNode) {
                var copyImageNode = null;
                var copyImageParent = null;
                oNowNode.get(0).addEventListener(sTransitionEndName, function () {
                    var nNowLevel = parseInt(oNowNode.attr('level'));
                    if (nNowLevel < 0) {
                        copyImageNode = aStarCompanyItems.eq(1).find('.company-image').eq(0);
                        copyImageParent = copyImageNode.parent();
                        oNowNode.attr({
                            level: nCycleNumber + nNowLevel
                        });
                        oNowNode.find('.company-image').eq(0).attr({
                            src: copyImageNode.attr('src')
                        }).parent().attr({
                            title: copyImageParent.attr('title')
                        });
                    }
                })
            })($(this));
        })
    }

    // 调换子节点
    function dealWithItemAfterScroll() {
        var stSave = aStarCompanyItems.eq(0).remove();
        oStarCompanyList.append(stSave);
    }

    //点击明星企业左右滑动按钮事件
    function eventsOfClickSlider() {
        $('.left-btn').click(function () {
            clearInterval(timer);
            $('#excellent-company-list .item').eq(-1).remove();
            var atSave = $('#excellent-company-list .item').eq(-1).prop('outerHTML');
            $('#excellent-company-list').prepend(atSave);
            $('.item').each(function (index) {
                $(this).attr({
                    level: index
                })
            });
        });
        $('.right-btn').click(function () {
            clearInterval(timer);
            $('.item').eq(0).remove();
            var atSave = $('.item').eq(0).prop('outerHTML');
            $('#excellent-company-list').append(atSave);
            $('.item').each(function (index) {
                $(this).attr({
                    level: index
                })
            });
        });
    }
});
