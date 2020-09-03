$(function () {
    // 获取ajax模块
    var _ajax = new NewAjax();
    // 首页区域
    var oHomeArea = $('.intelligent-pass').eq(0);
    // 空格正则
    var oWarpRule = />\s+<?|>?\s+</g;
    /* 轮播图 */
    // 轮播图数据
    var aSliderData = [];
    // 轮播图模块
    var oSliderNode = oHomeArea.find('.industry-slider-model').eq(0);
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


    // 云通关网站参数
    var oCloudPassConfig = {
        iCustoms: "93df4eb6-b614-463f-ba1d-42126bb20f31"
    };
    // 获取云通关功能链接数据
    var aCloudPassFuncLinks = null;
    // 获取功能列表节点
    var oFuncListNode = oHomeArea.find('.func-list').eq(0);
    // 服务平台全局数据
    var serviceDataList;

    /* 综合服务平台 */
    // 平台模块
    var oServicePlatformArea = oHomeArea.find('.func-list-model').eq(0);
    // 报关link节点
    var oJoinLinkNode = oServicePlatformArea.find('.join-link').eq(0);

    initNews();
    initPlatformService();
    initPlatformAdvantage();
    eventOfCloudPassFuncClick();
    servicePlatformEvent();
    initCloudPassLink();


    /* 轮播图 */
    // 轮播图事件
    sliderEvent();
    // 初始获取轮播图（pc）
    initSlider();

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
            url: '/clearanceNews/query',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(params),
            success: function (res) {
                if (res.status === 200) {
                    console.log(res);
                    renderNews(res.data.data_list);
                }
            },
            error: function (err) {
                console.log('initNews:', err);
            }
        });
    }

    function renderNews(list) {
        if (list) {
            var $newList = $('.news-content-list')[0];
            var html = '';
            list.forEach(function (item) {
                var publishDate = (item.publishDate) ? formatTime(new Date(item.publishDate), false, 'YYYY-MM-DD') : null;
                // html += '<li class="info-item">' +
                //     '<a href="/clearanceNews/detail/'+item.id+'.html" class="info-link" target="_blank">' +
                //     '<span class="info-title">' + item.title +'</span>' +
                //     '<span class="info-time">' +publishDate+'</span>' +
                //     '</a>' +
                //     '</li>';
                html += '<li class="news-content-item">' +
                    '<a class="news-content-link" href="/clearanceNews/detail/' + item.id + '.html" target="_blank">' +
                    '<span class="news-content-title">' + item.title + '</span>' +
                    '<span class="news-content-time">' + publishDate + '</span>' +
                    '</a>' +
                    '</li>';
            });
            $($newList).html(html);
        }
    }

    /**
     *平台服务
     */
    function initPlatformService() {
        var params = {
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
            url: '/platformService/query',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(params),
            success: function (res) {
                if (res.status === 200) {
                    console.log(res);
                    if (res.data.data_list) {
                        serviceDataList = res.data.data_list;
                        renderPlatformServiceTitle(serviceDataList, serviceDataList[0].id);
                        renderPlatformService(serviceDataList, serviceDataList[0].id);
                    }

                }
            },
            error: function (err) {
                console.log('initPlatformAdvantage:', err);
            }
        });
    }

    function renderPlatformServiceTitle(list, id) {
        if (list) {
            var html = '';
            list.forEach(function (item) {
                var active = '';
                if (item.id == id) {
                    active = 'active';
                }
                html += '<li data-id="' + item.id + '" class="nav-item ' + active + '">' +
                    '<p class="nav-title-cn">' + item.title + '</p>' +
                    '<p class="nav-title-en">' + item.englishTitle + '</p>' +
                    '</li>';
            });
            $($('.service-nav-list')[0]).html(html);
        }
    }

    function renderPlatformService(list, id) {
        if (list) {
            var $ul = $('.content-list')[0];
            var html = '';
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == id) {
                    var picId = '';
                    if (list[i].picture) {
                        picId = JSON.parse(list[i].picture).id;
                    }
                    $('.content-image-div').html('<img src="' + _ajax.getDomain('file') + '/adjuncts/file_download/' + picId + '"  class="content-image">');
                    html = list[i].detail;
                    break;
                }
            }
            $($ul).html(html);
        }
    }


    $('.service-nav-list').eq(0).on('click', 'li.nav-item', function () {
        var oNowNode = $(this);
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
        var id = oNowNode.attr('data-id');
        renderPlatformService(serviceDataList, id);
    });

    /* 综合服务平台 */
    function servicePlatformEvent() {
        serviceListEvent();
    }

    // 列表事件
    function serviceListEvent() {
        // 当前节点
        var oNowNode = null;
        oFuncListNode.on('mouseenter', 'li.func-item', function () {
            oNowNode = $(this);
            if (oNowNode.hasClass('active')) {
                return false;
            }
            oNowNode.siblings().each(function () {
                var stSave = $(this);
                if (stSave.hasClass('active')) {
                    stSave.removeClass('active');
                    return false;
                }
            });
            oNowNode.addClass('active');
        });
    }

    function initCloudPassLink() {
        var thirdPlatformInfo = getLocalStorage('thirdPlatformInfo');
        if (thirdPlatformInfo && thirdPlatformInfo.customsUrl) {
            oJoinLinkNode.attr('href', thirdPlatformInfo.customsUrl);
        }
    }

    // 云通关功能列表事件
    function eventOfCloudPassFuncClick() {
        // 当前节点
        var oNowNode = null;
        // 当前链接
        var sNowLink = null;
        var layui = null;
        // 获取当前
        oJoinLinkNode.on('click', function (event) {
            if (!window.userInfo) {
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
            oNowNode = $(this);
            sNowLink = oNowNode.attr('href').replace(/\s+/g, '');
            if (sNowLink.indexOf('javaScript:void(0)') > -1) {
                if (layui) {
                    __layer.close(layui);
                    layui = null;
                }
                layui = __layer.msg('暂时没有权限访问该系统！');
                return false;
            }
        })
    }

    /**
     *平台优势
     */
    function initPlatformAdvantage() {
        var params = {
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
            url: '/platformAdvantage/query',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(params),
            success: function (res) {
                if (res.status === 200) {
                    console.log(res);
                    renderPlatformAdvantage(res.data.data_list);
                }
            },
            error: function (err) {
                console.log('initPlatformAdvantage:', err);
            }
        });
    }

    function renderPlatformAdvantage(list) {
        if (list) {
            var $ul = $('.advantage-list')[0];
            var html = '';
            list.forEach(function (item) {
                html += ' <li class="advantage-list-item">' +
                    '<p class="number" >' + item.numValues + '</p>' +
                    '<p>—</p>' +
                    '<p class="tip">' + item.title + '</p>' +
                    '</li>';
            });
            $($ul).html(html);
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
        var oDeviceType = ['70b5f499-13d4-4901-b53d-b8690571cd1a', '7ceb2c24-a5ee-481b-bdf7-a4d679e5146f'];
        _ajax.get('default', {
            url: '/clearanceShufflingFigure/query/',
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

    // 毫秒值转yyyy-MM
    function transformTime(s) {
        var date = new Date(s);
        var year = date.getFullYear() + '-';
        var month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        return year + month
    }

    initLineChart();

    //获取前四个月份
    function getFourMonths(year, month){
        var arr = [];
        for(var i=0; i<4; i++){
            month--;
            if(month>=1){
                arr.push(year + '-' + month);
            }else{
                year--;
                month = 12;
                arr.push(year + '-' + month);
            }
        }
        return arr.reverse();
    }

    function initLineChart() {
        var myChart1 = echarts.init(document.getElementById('line-chart'));
        var myChart2 = echarts.init(document.getElementById('sector-chart'));
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var months = getFourMonths(year, month);
        var option1 = {
            title: {
                text: '近四个月数据统计'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['报关量', '出口量', '进口量']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: months
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '报关量',
                    type: 'line',
                    stack: '总量',
                    data: [120, 132, 101, 134]
                },
                {
                    name: '出口量',
                    type: 'line',
                    stack: '总量',
                    data: [220, 182, 191, 234]
                },
                {
                    name: '进口量',
                    type: 'line',
                    stack: '总量',
                    data: [150, 232, 201, 154]
                }
            ]
        };
        var idx = 1;
        var option2 = {
            timeline: {
                data: months,
                label: {
                    formatter: function (s) {
                        return transformTime(s);
                    }
                }
            },
            options: [
                {
                    title: {
                        text: '近四个月通关产品分类统计'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    // legend: {
                    //     data:['机电产品','数码产品','其他','服装','手机']
                    // },
                    toolbox: {
                        show: false,
                        feature: {
                            mark: {show: false},
                            dataView: {show: false, readOnly: false},
                            magicType: {
                                show: false,
                                type: ['pie', 'funnel'],
                                option: {
                                    funnel: {
                                        x: '25%',
                                        width: '50%',
                                        funnelAlign: 'left',
                                        max: 1700
                                    }
                                }
                            },
                            restore: {show: false},
                            saveAsImage: {show: false}
                        }
                    },
                    series: [
                        {
                            name: '2019年1月分类统计',
                            type: 'pie',
                            center: ['50%', '45%'],
                            radius: '50%',
                            data: [
                                {value: idx * 128 + 80, name: '机电产品'},
                                {value: idx * 64 + 160, name: '数码产品'},
                                {value: idx * 32 + 320, name: '其他'},
                                {value: idx * 16 + 640, name: '服装'},
                                {value: idx++ * 8 + 1280, name: '手机'}
                            ]
                        }
                    ]
                },
                {
                    series: [
                        {
                            name: '2019年2月分类统计',
                            type: 'pie',
                            data: [
                                {value: idx * 128 + 80, name: '机电产品'},
                                {value: idx * 64 + 160, name: '数码产品'},
                                {value: idx * 32 + 320, name: '其他'},
                                {value: idx * 16 + 640, name: '服装'},
                                {value: idx++ * 8 + 1280, name: '手机'}
                            ]
                        }
                    ]
                },
                {
                    series: [
                        {
                            name: '2019年3月分类统计',
                            type: 'pie',
                            data: [
                                {value: idx * 128 + 80, name: '机电产品'},
                                {value: idx * 64 + 160, name: '数码产品'},
                                {value: idx * 32 + 320, name: '其他'},
                                {value: idx * 16 + 640, name: '服装'},
                                {value: idx++ * 8 + 1280, name: '手机'}
                            ]
                        }
                    ]
                },
                {
                    series: [
                        {
                            name: '2019年4月分类统计',
                            type: 'pie',
                            data: [
                                {value: idx * 128 + 80, name: '机电产品'},
                                {value: idx * 64 + 160, name: '数码产品'},
                                {value: idx * 32 + 320, name: '其他'},
                                {value: idx * 16 + 640, name: '服装'},
                                {value: idx++ * 8 + 1280, name: '手机'}
                            ]
                        }
                    ]
                }
            ]
        };
        myChart1.setOption(option1);
        myChart2.setOption(option2);
    }
});
