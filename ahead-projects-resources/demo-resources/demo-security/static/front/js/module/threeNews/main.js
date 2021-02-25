$(function () {
    var _ajax = new NewAjax();
    /* 新闻资讯 */
    var mainModel = $('#three-news-list');
    // 获取nav导航
    var oNavListNode = mainModel.find('.nav-list').eq(0);
    // 获取news列表
    var oNewsListNode = mainModel.find('.news-list').eq(0);
    // 存储提取的数据
    var aThreeNews = null;
    // 类别
    var oTypeData = {
        park: '85f233a1-54b6-4ce0-90a7-4b30b8852d8f',
        notice: '51768fc1-d488-41f3-9b60-4d169400f5a7',
        industry: '127dfb05-028c-4f0e-bd59-1a5c97eee8e3'
    };
    // 新闻子项html
    var sNewsItemHtml = '<li class="new-item">\n' +
        '                        <a class="new-link" href="">\n' +
        '                            <span class="new-title"></span>\n' +
        '                            <span class="new-time"></span>\n' +
        '                        </a>\n' +
        '                    </li>';
    // 空格正则
    var oWarpRule = />\s+<?|>?\s+</g;
    // link正则
    var oLinkRule = /<a class="new-link[^>]+>/;
    // title正则
    var oTitleRule = /<span class="new-title[^>]+><\/span>/;
    // time正则
    var oTimeRule = /<span class="new-time[^>]+><\/span>/;
    // 获取loading节点
    var oLoadNode = mainModel.find('.resource-goods-list-load-div').eq(0);
    // 路径导航节点
    var oPathNavNode = mainModel.find('.now-path').eq(0);

    /* 分页组件 */
    // 存储每页的条数
    var nPageSize = 12;
    var oListPage = new PluginPagination('three-news-page');
    var bCanLift = true;
    var nNowPageNumber = 1;
    var nMaxPageNumber = 0;
    var nTotal = 0;


    initPlusPage();
    initThreeNews();
    eventOfThreeNewsNavClick();

    /* 新闻资讯 */
    // 初始化
    var currentType='';
    function initThreeNews() {
        currentType = getCurrentUrlParams('type');
        // 初始获取新闻
        getDataOfThreeNewsList(currentType);
        refreshNavTitle(currentType);
    }
    // nav点击函数
    function eventOfThreeNewsNavClick() {
        var oNowNode = null;
        // 获取选中类型
        var sNowType = null;
        // 获取类型名称
        var sNowTitle = null;
        oNavListNode.on('click', 'li.nav-item', function () {
            //每次切换导航初始化 当前页码
            nNowPageNumber = 1;
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
            sNowType = oNowNode.attr('type');
            sNowTitle = oNowNode.text();
            oPathNavNode.text(sNowTitle);
            console.log(sNowType);
            currentType = sNowType;
            getDataOfThreeNewsList(sNowType);
        });
    }
    function refreshItemLinkTitle(newType){
        var text;
        if(newType=='park'){
            text = '园区动态';
        }else if(newType=='notice'){
            text = '通知公告';
        }else if(newType=='industry'){
            text = '行业资讯';
        }
        $('.path-item-link').text(text)
    }
    function refreshNavTitle(type){
        if(type!=null && type!=''){
            oNavListNode.find('li.nav-item').each(function () {
                var stSave = $(this);
                if (stSave.hasClass('active')) {
                    stSave.removeClass('active');
                    return false;
                }
            });
            oNavListNode.find('li.nav-item[type='+type+']').addClass('active');
        }
    }
    // 获取动态，公告，资讯列表
    function getDataOfThreeNewsList(newType) {
        if (newType === undefined || newType=='') {
            newType = 'park';
        }
        if (getVariableType(newType) !== 'string') {
            console.error('getDataOfThreeNewsList的参数不能不传或类型需为string');
            return 0;
        }
        refreshItemLinkTitle(newType);
        // 提交参数
        var config = {
            type: oTypeData[newType],
            pager: {
                //当前页数
                current: nNowPageNumber,
                //每页条数
                size: nPageSize
            },
            sortPointer: {
                //排序字段
                filed: 'publish_date',
                //排序规则
                order: 'DESC'
            }
        };
        setLoadShow(true);
        _ajax.post('default', {
            url: '/informationNews/query',
            contentType: 'application/json',
            data: JSON.stringify(config),
            success: function (res) {
                var data = null;
                if (res.status === 200) {
                    data = res.data;
                    nTotal = data.total;
                    if (nTotal > nPageSize) {
                        nMaxPageNumber = Math.ceil(nTotal / nPageSize);
                        oListPage.showPage(true)
                            .setMaxPageNumber(nMaxPageNumber)
                            .setNowPageNumber(nNowPageNumber)
                            .createPage();
                    } else {
                        oListPage.showPage(false);
                    }
                    extractDataOfThreeNews(data.data_list);
                    importDataOfThreeNews();
                }
                setLoadShow(false);
            },
            error: function (err) {
                console.error('getDataOfThreeNewsList:', err);
                setLoadShow(false);
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
            result += sNewsItemHtml.replace(oWarpRule, function (warpStr) {
                return warpStr.replace(/\s+/g, '');
            }).replace(oLinkRule, function (linkStr) {
                return linkStr.replace('href=""', 'href="' + item.link + '"');
            }).replace(oTitleRule, function (titleStr) {
                return titleStr.slice(0, -7) + item.title + '</span>';
            }).replace(oTimeRule, function (timeStr) {
                return timeStr.slice(0, -7) + item.time + '</span>';
            })
        });
        oNewsListNode.html(result);
    }

    // 设置loading
    function setLoadShow(isShow) {
        if (isShow === undefined) {
            isShow = true;
        }
        if (getVariableType(isShow) !== 'boolean') {
            console.error('setLoadShow 传入参数需为boolean类型');
            return 0;
        }
        if (isShow) {
            if (oLoadNode.is(':hidden')) {
                oLoadNode.show();
            }
        } else {
            if (oLoadNode.is(':visible')) {
                oLoadNode.hide();
            }
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
                    getDataOfThreeNewsList(currentType);
                } else if (labelType === 'button') {
                    // 按钮
                    if (bCanLift) {
                        _this.setNowPageNumber(nNowPageNumber)
                            .createPage();
                        getDataOfThreeNewsList(currentType);
                    }
                }
            });
    }
});