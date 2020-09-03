$(function () {
    var thirdPlatformInfo = getLocalStorage('thirdPlatformInfo');
    var ggdzhzbToken = '';
    var incubatorToken = '';
    if(thirdPlatformInfo){
        ggdzhzbToken = thirdPlatformInfo.ggdzhzbToken || '';
        incubatorToken = thirdPlatformInfo.incubatorToken || '';
    }

    // 获取ajax模块
    var _ajax = new NewAjax();
    // 首页区域
    var oHomeArea = $('.home').eq(0);
    // 空格正则
    var oWarpRule = />\s+<?|>?\s+</g;
    /* 轮播图 */
    // 轮播图数据
    var aSliderData = [];
    // 轮播图模块
    var oSliderNode = oHomeArea.find('.home-slider-model').eq(0);
    // 轮播图列表
    var oSliderListNode = oSliderNode.find('.slider-list').eq(0);
    // point列表节点
    var oSliderPointListNode = oSliderNode.find('.slider-points-list').eq(0);
    //左右滑动按钮
    var oLeftSliderNode = oSliderNode.find('.left-btn').eq(0);
    var oRightSliderNode = oSliderNode.find('.right-btn').eq(0);
    // 展会列表节点
    var exhibitionNode = oHomeArea.find('.home-show-info-list').eq(0);
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

    /* 三类型新闻 */
    // 新闻数据
    var aThreeNews = [];
    // 新闻模块
    var oThreeNewsModel = oHomeArea.find('.slider-news-model').eq(0);
    // nav列表
    var oThreeNewsNavListNode = oThreeNewsModel.find('.news-nav-list').eq(0);
    // 新闻列表对象
    var oThreeNewsListNode = oThreeNewsModel.find('.news-content-list').eq(0);
    // 新闻子项html
    var sThreeNewsItemHtml = '<li class="news-content-item">\n' +
        '                        <a class="news-content-link" href="" target="_blank">\n' +
        '                            <span class="news-content-title"></span>\n' +
        '                            <span class="news-content-time"></span>\n' +
        '                        </a>\n' +
        '                    </li>';
    // link正则
    var oThreeNewsLinkRule = /<a class="news-content-link[^>]+>/;
    // title正则
    var oThreeNewsTitleRule = /<span class="news-content-title[^>]+><\/span>/;
    // time正则
    var oThreeNewsTimeRule = /<span class="news-content-time[^>]+><\/span>/;

    /* 智能资讯 */
    var aIntelligentNews = [];
    // 智能通关模块
    var oIntelligentPassModel = oHomeArea.find('.intelligent-news-model').eq(0);
    // 智能资讯列表
    var oIntelligentNewsListNode = oIntelligentPassModel.find('.news-list').eq(0);
    // 智能资讯子项html
    var sIntelligentNewItemHtml = '<li class="news-item">\n' +
        '                        <a class="news-link" href="" target="_blank">\n' +
        '                            <span class="news-item-title"></span>\n' +
        '                            <span class="news-item-time"></span> \n' +
        '                        </a>\n' +
        '                    </li>';
    // link 正则
    var oIntelligentLinkRule = /<a class="news-link[^>]+>/;
    // title正则
    var oIntelligentTitleRule = /<span class="news-item-title[^>]+><\/span>/;
    // time正则
    var oIntelligentTimeRule = /<span class="news-item-time[^>]+><\/span>/;
    // echart-select
    var echartTimeSelect = $('#echart-time-select')

    // 获取当前的年份和月份，并设置标题
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    $('#title').text('截止'+ year + '年' + month + '月，孵化中心共孵化企业');

    // 获取并写入季度选择项
    var fourQuarters = getFourQuarters(year, month);
    var quartersHtml = ''
    for(var i=0;i<fourQuarters.length;i++){
        quartersHtml = quartersHtml + "<option value='" + i + "'>"+fourQuarters[i]+"</option>";
    }
    echartTimeSelect.html(quartersHtml);


    //获取前四个季度
    function getFourQuarters(year, month) {
        var quarter = null;
        var quarters = [];
        if(month>=1 && month<=3){
            quarter = 1;
        }else if(month>=4 && month<=6){
            quarter = 2;
        }else if(month>=7 && month<=9){
            quarter = 3;
        }else if(month>=10 && month<=12){
            quarter = 4;
        }
        for(var i=0;i<4;i++){
            quarter--;
            if(quarter>=1){
                quarters.push(year+'Q'+quarter);
            }else{
                year--;
                quarter = 4;
                quarters.push(year+'Q'+quarter);
            }
        }
        return quarters;
    }


    /* 孵化器 */
    // 功能icon列表
    var aIncubationFuncIcons = ['icon-config-round', 'icon-money-round', 'icon-file-round', 'icon-share-round', 'icon-report-round', 'icon-form-round', 'icon-folder-round'];
    // 孵化器功能列表
    var aIncubationFuncs = [];
    // 孵化器环境列表
    var aIncubationEnvironments = [];
    // 孵化器功能列表
    var oIncubationFuncListNode = oHomeArea.find('.incubation-func-list').eq(0);
    // 孵化器环境列表
    var oIncubationEnvironmentListNode = oHomeArea.find('.incubation-environment-list').eq(0);
    // 功能子项html
    var sIncubationFuncItemHtml = '<li class="incubation-func-item" name="property">\n' +
        '                    <a class="incubation-func-link" href="" target="_blank">\n' +
        '                        <i class="incubation-func-icon"></i>\n' +
        '                        <p class="incubation-func-title"></p>\n' +
        '                    </a>\n' +
        '                </li>';
    // 环境子项html
    var sIncubationEnvironmentItemHtml = '<li class="incubation-environment-item">\n' +
        '                    <div class="incubation-environment-image-div">\n' +
        '                        <img class="incubation-environment-image" src="" alt="">\n' +
        '                    </div>\n' +
        '                    <p class="incubation-environment-title"></p>\n' +
        '                </li>';
    // 功能子项link正则
    var oIncubationFuncLinkRule = /<a class="incubation-func-link[^>]+>/;
    // 功能子项icon正则
    var oIncubationFuncIconRule = /<i class="incubation-func-icon[^>]+>/;
    // 功能子项title正则
    var oIncubationFuncTitleRule = /<p class="incubation-func-title[^>]+><\/p>/;
    // 环境子项image正则
    var sIncubationEnvironmentImageRule = /<img class="incubation-environment-image[^>]+>/;
    // 环境子项title正则
    var sIncubationEnvironmentTitleRule = /<p class="incubation-environment-title[^>]+><\/p>/;

    /* 科技资源 */
    // 科技资源模块
    var oResourceModel = oHomeArea.find('.home-resource-model').eq(0);
    // 资源nav列表
    var oGoodsNavListNode = oResourceModel.find('.resource-goods-nav-list').eq(0);
    // 产品goods列表
    var oGoodsListNode = oResourceModel.find('.resource-goods-list').eq(0);
    // 列表父节点宽度
    var nGoodsListParentWidth = oGoodsListNode.parent().width();
    // 获取产品列表承载框节点
    var oGoodsListDivNode = oResourceModel.find('.resource-goods-list-div').eq(0);
    // 获取goods子项宽度
    var nGoodsItemWidth = Math.ceil(nGoodsListParentWidth / 6);
    // 产品页码
    var oResourceGoodsPageNumber = 1;
    // 产品页数量
    var oResourceGoodsPageSize = 5;
    // 获取loading节点
    var oGoodsLoadingNode = oResourceModel.find('.resource-goods-list-load-div').eq(0);
    // 获取左箭头
    var oGoodsLeftArrowNode = oResourceModel.find('.goods-arrow-icon-div[type="left"]').eq(0);
    // 获取右箭头
    var oGoodsRightArrowNode = oResourceModel.find('.goods-arrow-icon-div[type="right"]').eq(0);
    // 资源类别
    var sResourceGoodsType = null;
    // 类别数据
    var oResourceTypes = {
        intelligentDevice: '5312a808-089f-4929-802a-8a9da210a72e',
        MobileWeb: 'd2c04903-181c-4c83-ac66-0aa48a708ab6',
        iPad: 'd3ee3206-98d8-4cdd-99b5-6c73612fa3ee'
    };
    // 存储产品数据
    var aResourceGoods = null;
    // 产品子项html
    var sResourceGoodItemHtml = '<li class="resource-goods-item">\n' +
        '                                <a class="resource-goods-link" href="" target="_blank">\n' +
        '                                    <div class="resource-goods-image-div">\n' +
        '                                        <img class="resource-goods-image" src="" alt="">\n' +
        '                                    </div>\n' +
        '                                    <p class="good-title"></p>\n' +
        '                                </a>\n' +
        '                            </li>';
    // 产品link正则
    var oGoodLinkRule = /<a class="resource-goods-link[^>]+>/;
    // 产品image正则
    var oGoodImageRule = /<img class="resource-goods-image[^>]+>/;
    // 产品title正则
    var oGoodTitleRule = /<p class="good-title[^>]+><\/p>/;

    /* 友情列表 */
    // 存储友情链接数组
    var aPartnerLink = [];
    // 获取友情链接模块
    var oPartnerLinkModel = oHomeArea.find('.home-partner-model').eq(0);
    // 获取列表节点
    var oPartnerLinkListNode = oPartnerLinkModel.find('.home-partner-list').eq(0);
    // 友情链接子项html
    var sPartnerLinkItemHtml = '<li class="home-partner-item">\n' +
        '                    <a class="partner-link" href="" target="_blank"></a>\n' +
        '                </li>';
    // li正则
    var oPartnerLinkLiRule = /<li class="home-partner-item[^>]+>/;
    // link正则
    var oPartnerLinkLinkRule = /<a class="partner-link[^>]+><\/a>/;
    // 一列子项的个数
    var nLineItemSize = 5;

    /* 轮播图 */
    // 轮播图事件
    sliderEvent();
    // 初始获取轮播图（pc）
    initSlider();

    /* 孵化器 */
    initIncubation();
    eventOfIncubationFuncListClick();

    /* 三类型新闻 */
    initThreeNews();
    // 点击事件
    eventOfThreeNewsNavClick();

    /* 智能通关资讯 */
    initIntelligentNews();

    /* 科技资源 */
    initResourceGoods();
    eventOfGoodsNavClick();
    eventOfGoodsArrowClick();

    // 展会点击事件
    // exhibitionListClick();

    /*科技众包 */
    var crowdProjectObj = $('.outsourcing-goods-list').eq(0);
    var crowdProjectObjLeft = $('.outsourcing-goods-arrow-icon-div[type="left"]').eq(0);
    var crowdProjectObjRight = $('.outsourcing-goods-arrow-icon-div[type="right"]').eq(0);
    eventOfCrowdProjectArrowClick();

    /* 友情链接 */
    // 初始化
    initPartnerLink();

    /* 科技资源 */
    // 初始化
    initResources();

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
        var oDeviceType = ['70b5f499-13d4-4901-b53d-b8690571cd1a', '7ceb2c24-a5ee-481b-bdf7-a4d679e5146f'];
        _ajax.get('default', {
            url: '/shufflingFigure/get_by_type/' + oDeviceType[mode],
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
        eventOfSliderBtnClick();
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
    //左右按钮的点击事件
    function eventOfSliderBtnClick(){
        oLeftSliderNode.click(function() {
            if(nSliderShowIndex === 0){
                nSliderShowIndex = aSliderData.length-2;
            }else{
                nSliderShowIndex--;
            }
            console.log(nSliderShowIndex);
            // 触发执行动画
            handleOfSliderAnimation();
        });
        oRightSliderNode.click(function(){
            if(nSliderShowIndex === aSliderData.length-2){
                nSliderShowIndex = 0;
            }else{
                nSliderShowIndex++;
            }
            console.log(nSliderShowIndex);
            // 触发执行动画
            handleOfSliderAnimation();
        });
    }

    /* 轮播图右侧新闻列表 */
    // 初始化
    function initThreeNews() {
        // 初始获取新闻
        getDataOfThreeNewsList();
    }
    // nav点击函数
    function eventOfThreeNewsNavClick() {
        var oNowNode = null;
        // 获取选中类型
        var sNewType = null;
        oThreeNewsNavListNode.on('click', 'li.news-nav-item', function () {
            oNowNode = $(this);
            if (oNowNode.hasClass('active')) {
                return 0;
            }
            // 清除其他选中状态
            oNowNode.siblings().each(function () {
                var stSave = $(this);
                if (stSave.hasClass('active')) {
                    stSave.removeClass('active');
                    return false;
                }
            });
            // 标记选中
            oNowNode.addClass('active');
            sNewType = oNowNode.data('type');
            getDataOfThreeNewsList(sNewType);
        });
    }
    // 获取动态，公告，资讯列表
    function getDataOfThreeNewsList(newType) {
        if (newType === undefined) {
            newType = 'industry';
        }
        if (getVariableType(newType) !== 'string') {
            console.error('getDataOfThreeNewsList的参数不能不传或类型需为string');
            return 0;
        }
        // 类别
        var oTypeData = {
            park: '85f233a1-54b6-4ce0-90a7-4b30b8852d8f',
            notice: '51768fc1-d488-41f3-9b60-4d169400f5a7',
            industry: '127dfb05-028c-4f0e-bd59-1a5c97eee8e3'
        };
        // 提交参数
        var config = {
            type: oTypeData[newType],
            pager: {
                //当前页数
                current: 1,
                //每页条数
                size: 7
            },
            sortPointer: {
                //排序字段
                filed: 'publish_date',
                //排序规则
                order: 'DESC'
            }
        };
        _ajax.post('default', {
            url: '/informationNews/query',
            contentType: 'application/json',
            data: JSON.stringify(config),
            success: function (res) {
                var data = null;
                if (res.status === 200) {
                    data = res.data;
                    extractDataOfThreeNews(data.data_list);
                    importDataOfThreeNews();
                }
            },
            error: function (err) {
                console.error('getDataOfThreeNewsList:', err);
            }
        });
    }
    // 提取数据
    function extractDataOfThreeNews(data) {
        aThreeNews = [];
        data.forEach(function (item) {
            aThreeNews.push({
                title: item.title,
                link: '/informationNews/detail/' + item.id + '.html',
                time: (item.publishDate) ? formatTime(new Date(item.publishDate), false, 'YYYY-MM-DD') : null
            })
        })
    }
    // 写入数据
    function importDataOfThreeNews() {
        var result = '';
        aThreeNews.forEach(function (item) {
            result += sThreeNewsItemHtml.replace(oWarpRule, function (warpStr) {
                return warpStr.replace(/\s+/g, '');
            }).replace(oThreeNewsLinkRule, function (linkStr) {
                return linkStr.replace('href=""', 'href="' + item.link + '"');
            }).replace(oThreeNewsTitleRule, function (titleStr) {
                return titleStr.slice(0, -7) + item.title + '</span>';
            }).replace(oThreeNewsTimeRule, function (timeStr) {
                return timeStr.slice(0, -7) + item.time + '</span>';
            })
        });
        oThreeNewsListNode.html(result);
    }


    /* 智能资讯列表 */
    // 初始化
    function initIntelligentNews() {
        getDataOfIntelligentNews();
    }
    // 获取智能资讯列表
    function getDataOfIntelligentNews() {
        var config = {
            pager: {
                //当前页数
                current: 1,
                //每页条数
                size: 7
            },
            sortPointer: {
                //排序字段
                filed: "publish_date",
                //排序规则
                order: "DESC"
            }
        };
        _ajax.post('default', {
            url: '/clearanceNews/query',
            contentType: 'application/json',
            data: JSON.stringify(config),
            success: function (res) {
                var data = null;
                if (res.status === 200) {
                    data = res.data;
                    extractDataOfIntelligent(data.data_list);
                    importDataOfIntelligent();
                }
            },
            error: function (err) {
                console.error('getDataOfIntelligentNews:', err);
            }
        });
    }
    // 提取智能数据
    function extractDataOfIntelligent(data) {
        aIntelligentNews = [];
        data.forEach(function (item) {
            aIntelligentNews.push({
                title: item.title,
                link: '/clearanceNews/detail/'+item.id+'.html',
                time: (item.publishDate) ? formatTime(new Date(item.publishDate), false, 'YYYY-MM-DD') : null
            })
        })
    }
    // 写入智能资讯
    function importDataOfIntelligent() {
        var result = '';
        aIntelligentNews.forEach(function (item) {
            result += sIntelligentNewItemHtml.replace(oWarpRule, function (warpStr) {
                return warpStr.replace(/\s+/g, '');
            }).replace(oIntelligentLinkRule, function (linkStr) {
                return linkStr.replace('href=""', 'href="' + item.link + '"');
            }).replace(oIntelligentTitleRule, function (titleStr) {
                return titleStr.slice(0, -7) + item.title + '</span>';
            }).replace(oIntelligentTimeRule, function (timeStr) {
                return timeStr.slice(0, -7) + item.time + '</span>';
            })
        });
        oIntelligentNewsListNode.html(result);
    }

    /* 孵化器 */
    // 初始化
    function initIncubation() {
        getDataOfIncubationFunc();
        getDataOfIncubationEnvironment();
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
                    extractDataOfIncubationFunc(data.data_list);
                    importDataOfIncubationFunc();
                }
            },
            error: function (err) {
                console.error('getDataOfIncubationFunc:', err);
            }
        });
    }
    // 提取功能列表数据
    function extractDataOfIncubationFunc(data) {
        aIncubationFuncs = [];
        data.forEach(function (item) {
            aIncubationFuncs.push({
                link: item.url,
                title: item.title,
                icon:item.icon,
                whetherLogin:item.whetherLogin
            })
        });
    }
    // 写入功能列表
    function importDataOfIncubationFunc() {
        // 替换链接和名称
        var oNowNode = null;
        oIncubationFuncListNode.children().each(function (index) {
            oNowNode = $(this);
            if (index < aIncubationFuncs.length) {
                var url = aIncubationFuncs[index].link;
                if(aIncubationFuncs[index].whetherLogin){
                    url = aIncubationFuncs[index].link + '?token='+ incubatorToken;
                }
                oNowNode.find('a.incubation-func-link').eq(0).attr({
                    href: url,
                    token:incubatorToken,
                    isNeedLogin:aIncubationFuncs[index].whetherLogin
                });
                oNowNode.find('.incubation-func-title').eq(0).text(aIncubationFuncs[index].title);
                oNowNode.find('.incubation-func-icon').eq(0).addClass(aIncubationFuncs[index].icon);
            } else {
                return false;
            }
        })
    }
    // 孵化器功能列表点击事件
    function eventOfIncubationFuncListClick() {
        var oNowNode = null;
        var sNowLink = null;
        var layui = null;
        var token;
        var isNeedLogin;
        oIncubationFuncListNode.on('click', 'a.incubation-func-link', function () {
            oNowNode = $(this);
            isNeedLogin = oNowNode.attr('isneedlogin');
            if (!window.userInfo && isNeedLogin == 'true') {
                if (layui) {
                    __layer.close(layui);
                    layui = null;
                }
                layui = __layer.msg('请先登录');
                setTimeout(function () {
                    window.location.href = '/login.html';
                }, 1000);
                return false;
            }

            sNowLink = oNowNode.attr('href').replace(/\s+/g, '');
            token = oNowNode.attr('token');

            if (sNowLink.indexOf('javaScript:void') > -1) {
                event.preventDefault();
                if (layui) {
                    __layer.close(layui);
                    layui = null;
                }
                layui = __layer.msg('功能未开放，请稍后重试');
                return false;
            }
            if(isNeedLogin=='true' &&(token==null || token=='')){
                if (layui) {
                    __layer.close(layui);
                    layui = null;
                }
                layui = __layer.msg('暂时没有权限访问该系统！');
                return false;
            }

        })
    }


    // 请求环境列表数据
    function getDataOfIncubationEnvironment() {
        var config = {
            pager: {
                //当前页数incubation-func-list
                current: 1,
                //每页条数
                size: 4
            },
            sortPointer: {
                //排序字段
                filed: "created_at",
                //排序规则
                order: "DESC"
            }
        };
        _ajax.post('default', {
            url: '/officeEnvironment/query',
            contentType: 'application/json',
            data: JSON.stringify(config),
            dataType: 'json',
            success: function (res) {
                var data = null;
                if (res.status === 200) {
                    data = res.data;
                    extractDataOfIncubationEnvironment(data.data_list);
                    importDataOfIncubationEnvironment();
                }
            },
            error: function (err) {
                console.error('getDataOfIntelligentNews:', err);
            }
        });
    }
    // 提取环境列表数据
    function extractDataOfIncubationEnvironment(data) {
        aIncubationEnvironments = [];
        data.forEach(function (item) {
            var img = JSON.parse(item.picture);
            aIncubationEnvironments.push({
                image: _ajax.getDomain('file')+'/adjuncts/file_download/'+img.id,
                title: item.title
            })
        })
    }
    // 写入环境列表
    function importDataOfIncubationEnvironment() {
        // 获取环境列表
        var oIncubationEnvironmentNode = $('.incubation-environment-list').eq(0);
        var oNowNode = null;
        oIncubationEnvironmentNode.children().each(function (index) {
            oNowNode = $(this);
            if (index < aIncubationEnvironments.length) {
                oNowNode.find('img.incubation-environment-image').eq(0).attr({
                    src: aIncubationEnvironments[index].image,
                    alt: aIncubationEnvironments[index].title,
                    title: aIncubationEnvironments[index].title
                });
                oNowNode.find('p.incubation-environment-title').eq(0).text(aIncubationEnvironments[index].title);
            } else {
                return false;
            }
        })
    }

    /* 科技资源 */
    // 初始化
    function initResourceGoods() {
        getDataOfResourceGoods(arrowFreezeTest);
    }
    // 产品列表初始化
    function initGoodsList() {
        oGoodsListNode.removeAttr('style')
            .html('');
    }
    // 请求产品数据
    function getDataOfResourceGoods(callback) {
        sResourceGoodsType = sResourceGoodsType || 'znzb';
        setGoodsLoadShow(oGoodsLoadingNode,true);
        _ajax.get('default',{
            url: '/thirdPlatform/cnki/journal?type='+sResourceGoodsType,
            contentType: 'application/json',
            dataType: 'json',
            success: function (res) {
                var data = null;
                if (!!res) {
                    data = typeof(res) === 'string' ? JSON.parse(res) : res;
                    extractDataOfResourceGoods(data.links);
                    importDataOfResourceGoods();
                    if (callback) {
                        callback(oGoodsListNode,oGoodsLeftArrowNode,oGoodsRightArrowNode);
                    }
                    setGoodsLoadShow(oGoodsLoadingNode,false);
                }
            },
            error: function (err) {
                console.error('getDataOfIntelligentNews:', err);
                setGoodsLoadShow(oGoodsLoadingNode,false);
            }
        });

    }
    // 提取产品数据
    function extractDataOfResourceGoods(data) {
        aResourceGoods = [];
        data.forEach(function (item) {
            var obj = {};
            obj.title = item.name;
            obj.link = _ajax.getDomain('kjzy')+item.url;
            obj.image = item.cover;
            aResourceGoods.push(obj);
        })
    }
    // 写入产品数据
    function importDataOfResourceGoods() {
        var result = '';
        var listWidth = oGoodsListNode.width();
        var listHtml = oGoodsListNode.html();
        aResourceGoods.forEach(function (item) {
            result += sResourceGoodItemHtml.replace(oWarpRule, function (warpStr) {
                return warpStr.replace(/\s+/g, '');
            }).replace(oGoodLinkRule, function (linkStr) {
                return linkStr.replace('href=""', 'href="' + item.link + '"');
            }).replace(oGoodImageRule, function (imageStr) {
                return imageStr.replace('src=""', 'src="' + item.image + '"')
                    .replace('alt=""', 'alt="' + item.title + '"')
                    .replace('title=""', 'title="' + item.title + '"');
            }).replace(oGoodTitleRule, function (titleStr) {
                return titleStr.slice(0, -4) + item.title + '</p>';
            })
        });
        oGoodsListNode.css({
            // width: listWidth + aResourceGoods.length * nGoodsItemWidth + 'px'
            width:  aResourceGoods.length * nGoodsItemWidth + 'px'
        }).html(listHtml + result);
    }
    // 产品nav事件
    function eventOfGoodsNavClick() {
        var oNowNode = null;
        oGoodsNavListNode.on('click', 'li.resource-goods-nav-item', function () {
            oNowNode = $(this);
            if (oNowNode.hasClass('active')) {
                return 0;
            }
            oNowNode.siblings().each(function () {
                var stSave = $(this);
                if (stSave.hasClass('active')) {
                    stSave.removeClass('active');
                    return false;
                }
            });
            oNowNode.addClass('active');
            sResourceGoodsType = oNowNode.attr('type');
            initGoodsList();
            getDataOfResourceGoods(function () {
                arrowFreezeTest(oGoodsListNode,oGoodsLeftArrowNode,oGoodsRightArrowNode);
            });
        })
    }
    // 设置loading展示
    function setGoodsLoadShow(obj,isShow) {
        if (isShow === undefined) {
            isShow = true;
        }
        if (getVariableType(isShow) !== 'boolean') {
            console.error('setGoodsLoadShow 参数类型需为boolean');
            return 0;
        }
        // 展示
        if (isShow) {
            if (obj.is(':hidden')) {
                obj.show();
            }
        } else { // 隐藏
            if (oGoodsNavListNode.is(':visible')) {
                obj.hide();
            }
        }
    }
    // 科技资源列表左右箭头点击事件
    function eventOfGoodsArrowClick() {
        var oNowNode = null;
        var sNowType = null;
        oGoodsListDivNode.on('click', 'div.goods-arrow-icon-div', function () {
            oNowNode = $(this);
            if (oNowNode.hasClass('freeze')) {
                return 0;
            }
            sNowType = (oNowNode.attr('type') === 'left') ? 'R' : 'L';
            handleOfGoodsListMove(sNowType,oGoodsListNode,oGoodsLeftArrowNode,oGoodsRightArrowNode);
        })
    }
    // 科技众包列表左右箭头点击事件
    function eventOfCrowdProjectArrowClick() {
        var oNowNode = null;
        var sNowType = null;
        $('.outsourcing-goods-list-div').eq(0).on('click', 'div.outsourcing-goods-arrow-icon-div', function () {
            oNowNode = $(this);
            if (oNowNode.hasClass('freeze')) {
                return 0;
            }
            sNowType = (oNowNode.attr('type') === 'left') ? 'R' : 'L';
            handleOfGoodsListMove(sNowType,crowdProjectObj,crowdProjectObjLeft,crowdProjectObjRight);
        })
    }

    // 展会列表点击事件
    // function exhibitionListClick() {
    //     exhibitionNode.on('click', 'li.home-show-info-item', function () {
    //         __layer.msg('抱歉，功能暂未开放！');
    //     })
    // }
    // 列表移动执行函数
    /**
     *
     * @param LorR
     * @param obj   子节点
     * @param oGoodsLeftArrowNode   左箭头
     * @param oGoodsRightArrowNode  右箭头
     * @returns {number}
     */
    function handleOfGoodsListMove(LorR,obj,oGoodsLeftArrowNode,oGoodsRightArrowNode) {
        //列表left
        var nListLeft = Math.abs(parseInt(obj.css('left')));
        //列表宽度
        var nlistWidth = obj.width();
        //父容器宽度
        var nGoodsListParentWidth = obj.parent().width();
        // 最终left
        var nFinalLeft = null;
        if (LorR === undefined) {
            console.error('handleOfGoodsListMove 参数不能不传');
            return 0;
        } else if (getVariableType(LorR) !== 'string') {
            console.error('handleOfGoodsListMove 参数类型需为string');
            return 0;
        }
        // 向右
        if (LorR === 'L') {
            // oResourceGoodsPageNumber += 1;
            if (nListLeft + nGoodsListParentWidth < nlistWidth - nGoodsListParentWidth) {
                nFinalLeft = nListLeft + nGoodsListParentWidth;
            } else {
                nFinalLeft = nlistWidth - nGoodsListParentWidth;
            }
        } else {
            // oResourceGoodsPageNumber -= 1;
            if (nListLeft < nGoodsListParentWidth) {
                nFinalLeft = 0;
            } else {
                nFinalLeft = nListLeft - nGoodsListParentWidth;
            }
        }
        goodsListAnimation(obj,oGoodsLeftArrowNode,oGoodsRightArrowNode,nFinalLeft);
    }
    // 货物列表动画
    function goodsListAnimation(obj,oGoodsLeftArrowNode,oGoodsRightArrowNode,moveLength) {
        obj.animate({
            left: -1 * moveLength
        }, function () {
            obj.css({
                left: -1 * moveLength
            });
            arrowFreezeTest(obj,oGoodsLeftArrowNode,oGoodsRightArrowNode);
        })
    }

    /**
     *  左右箭头冻结检测
     * @param obj   子节点（上层必须为父节点)
     * @param oGoodsLeftArrowNode   左箭头
     * @param oGoodsRightArrowNode  右箭头
     */
    function arrowFreezeTest(obj,oGoodsLeftArrowNode,oGoodsRightArrowNode) {
        var listLeft = Math.abs(parseInt(obj.css('left')));
        var listWidth = obj.width();
        var parentWidth = obj.parent().width();
        /* 左箭头 */
        if (listLeft === 0) {
            if (!oGoodsLeftArrowNode.hasClass('freeze')) {
                oGoodsLeftArrowNode.addClass('freeze');
            }
        } else if (listLeft > 0){
            if (oGoodsLeftArrowNode.hasClass('freeze')) {
                oGoodsLeftArrowNode.removeClass('freeze');
            }
        }
        /* 右箭头 */
        if (parentWidth + listLeft < listWidth) {
            if (oGoodsRightArrowNode.hasClass('freeze')) {
                oGoodsRightArrowNode.removeClass('freeze');
            }
        } else {
            if (!oGoodsRightArrowNode.hasClass('freeze')) {
                oGoodsRightArrowNode.addClass('freeze');
            }
        }

    }

    /* 友情列表 */
    // 初始化
    function initPartnerLink() {
        getDataOfPartnerLink();
    }
    // 获取友情链接数据
    function getDataOfPartnerLink() {
        var config = {
            pager: {
                //当前页数
                current: 1,
                //每页条数
                size: 15
            },
            sortPointer: {
                //排序字段
                filed: "created_at",
                //排序规则
                order: "DESC"
            }
        };
        _ajax.post('default', {
            url: '/friendshipLinks/query',
            contentType: 'application/json',
            data: JSON.stringify(config),
            success: function (res) {
                var data = null;
                if (res.status === 200) {
                    data = res.data;
                    extractDataOfPartnerLink(data.data_list);
                    importDataOfPartnerLink();
                }
            },
            error: function (err) {
                console.error('getDataOfPartnerLink:', err);
            }
        });
    }
    // 提取数据
    function extractDataOfPartnerLink(data) {
        aPartnerLink = [];
        data.forEach(function (item) {
            aPartnerLink.push({
                title: item.title,
                link: item.url
            })
        })
    }
    // 写入友情链接
    function importDataOfPartnerLink() {
        var result = '';
        aPartnerLink.forEach(function (item) {
            result += sPartnerLinkItemHtml.replace(oWarpRule, function (warpStr) {
                return warpStr.replace(/\s+/g, '');
            }).replace(oPartnerLinkLiRule, function (liStr) {
                return liStr.replace('style=""', 'style="width:' + Math.floor(100 / nLineItemSize) + '%');
            }).replace(oPartnerLinkLinkRule, function (linkStr) {
                return linkStr.replace('href=""', 'href="' + item.link + '"').slice(0, -4) + item.title + '</a>';
            })
        });
        oPartnerLinkListNode.html(result);
    }


    /* 资源类型 */
    // 初始化
    function initResources() {
        getDataOfResources();
    }
    // 获取科技资源类型
    function getDataOfResources() {
        var config = {
            pager: {
                //当前页数
                current: 1,
                //每页条数
                size: 15
            },
            sortPointer: {
                //排序字段
                filed: "created_at",
                //排序规则
                order: "DESC"
            }
        };
        _ajax.get('default', {
            url: '/enumSelectItem/get_by_pid/a67fdeaa-5b4c-4fc5-97aa-1d85d786d645',
            contentType: 'application/json',
            success: function (res) {
                var data = null;
                if (res.status === 200) {
                    data = res.data;
                    var resourceList = extractDataOfResources(data.data_list);
                    importDataOfResources(resourceList);
                }
            },
            error: function (err) {
                console.error('getDataOfPartnerLink:', err);
            }
        });
    }
    // 提取数据
    function extractDataOfResources(data) {
        var resourceList = [];
        data.forEach(function (item) {
            resourceList.push({
                title: item.title,
                link: item.url
            })
        })
        return resourceList;
    }
    // 写入科技资源类型
    function importDataOfResources(resourceList) {
        // 获取环境列表
        var oResourcesNode = $('.resource-type-list').eq(0);
        var oNowNode = null;
        oResourcesNode.children().each(function (index) {
            oNowNode = $(this);
            if (index < resourceList.length) {
                oNowNode.find('a.resource-type-link').eq(0).attr({
                    href: resourceList[index].url,
                }).text(resourceList[index].title)

            } else {
                return false;
            }
        })
    }


    refreshCrowdLinkToken();
    /**
     * 刷新众包接口的token
     */
    function refreshCrowdLinkToken(){
        $('.outsourcing-goods-statistics-list .outsourcing-goods-statistics-item').find('a').each(function () {
            $(this).attr('href',$(this).attr('href')+'?token='+ggdzhzbToken);
        })
    }

    var chartData = [
        {
            time: '2019Q1',
            importNumber: 350,
            exportNumber: 250,
            clearanceNumber: 800
        },
        {
            time: '2018Q4',
            importNumber: 250,
            exportNumber: 350,
            clearanceNumber: 700
        },
        {
            time: '2018Q3',
            importNumber: 450,
            exportNumber: 150,
            clearanceNumber: 750
        },
        {
            time: '2019Q2',
            importNumber: 150,
            exportNumber: 550,
            clearanceNumber: 650
        },
    ]

    initChart(chartData[0]);

    function changeChartData(index) {
        initChart(chartData[index])
    }

    // 临时代码，通关统计图表
    echartTimeSelect.on('change', function () {
        var selectedIndex = Number($(this).find('option:selected').val());
        changeChartData(selectedIndex)
    })

    function initChart(dataObj){
        var myChart = echarts.init(document.getElementById('home-flow-eCharts'));
        var options={
            //定义一个标题
            title:{
                text:'数据展示',
                textStyle:{
                    fontSize:12,
                    color:'#8d8d8d'
                }
            },
            tooltip : {
                trigger: 'axis'
            },
            //X轴设置
            xAxis:{
                type : 'category',
                data:['进口量','出口量','报关量'],
                splitLine: {
                    show: true, //网格线
                },
                axisTick:{       //刻度线
                    show:false
                },
                axisLabel:{
                    margin:15,
                    textStyle:{
                        fontWeight:'bold'
                    }
                }
            },
            grid:{
                left:'15%'
            },
            yAxis:[
                {
                    type : 'value',
                    splitLine: {
                        show: true,//网格线
                    },
                    axisTick:{       //刻度线
                        show:false
                    },
                    axisLabel: {
                        formatter: function(value,index){
                            var value;
                            if (value >=1000) {
                                value = value/1000+'k';
                            }else if(value <1000){
                                value = value;
                            }
                            return value
                        }
                    }
                }
            ],
            //name=legend.data的时候才能显示图例
            series:[
                {
                    name:'',
                    type:'bar',
                    data:[450,550,1000],
                    barWidth:16,
                    itemStyle:{
                        normal:{
                            color:'#4288F9',
                            barBorderRadius: [30,30,0,0]
                        }
                    }
                }
            ]
        };
        options.series[0].data[0] = dataObj.importNumber;
        options.series[0].data[1] = dataObj.exportNumber;
        options.series[0].data[2] = dataObj.clearanceNumber;
        myChart.setOption(options);
    }

});
