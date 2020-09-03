// 获取ajax模块
var _ajax = new NewAjax();

// 搜索关键词
var keyWord = '';

// 搜索列表节点
var oSearchListNode = $('.search-container .search-list').eq(0);

// 搜索结果数
var oSearchNumber = $('.search-container .highlight-number').eq(0);

// 搜索输入框
var oSearchInputNode = $('.search-page-input-area').eq(0);

// 获取搜索按钮
var oSearchBtn = oSearchInputNode.find('.search-btn').eq(0);
// 获取搜索输入框
var oSearchInput = oSearchInputNode.find('.header-search').eq(0);

/* 分页组件 */
// 存储每页的条数
var nPageSize = 15;
var oListPage = new PluginPagination('search-page-pagination');
var bCanLift = true;
var nNowPageNumber = 1;
var nMaxPageNumber = 0;
var nTotal = 0;

initPlusPage();

$(function () {
    oSearchInputNode.show();
    keyWord = decodeURI(getUrlParam('keyWord'));
    oSearchInputNode.find('.header-search').eq(0).val(keyWord);
    search();

    // 点击搜索按钮跳转事件
    oSearchBtn.on('click', function (e) {
        refreshSearch();
    });

    // 搜索输入框回车搜索事件
    oSearchInput.on('keydown', function (e) {
        e.stopPropagation();
        if (e.keyCode === 13) {
            refreshSearch();
        }
    });
});

function refreshSearch() {
    keyWord = oSearchInput.val();
    nPageSize = 15;
    nNowPageNumber = 1;
    search();
}

function search() {
    var postData = {
        types: [
            "c_business_information_news",
            "c_business_clearance_news",
            "c_incubator_article"
        ],
        fields: [
            //搜索字段，多个。但是fields和values必须满足其中一个是单值。
            {
                fields: [
                    "title",
                    "detail"
                ],
                values: [
                    keyWord
                ],
                searchType: "stringQuery"
            }
        ],
        highlightBuilder: {
            fields: [
                {
                    name: keyWord
                }
            ],
            preTags: [
                "<tag>"
            ],
            postTags: [
                "</tag>"
            ]
        },
        page: nNowPageNumber,
        size: nPageSize,
        sort: "DESC",
        sortFields: [
            "publish_date"
        ]
    };

    _ajax.post('default', {
        url: '/es/search',
        contentType: 'application/json',
        data: JSON.stringify(postData),
        success: function (res) {
            var data = null;
            var list = null;
            if (res.status === 200) {
                data = res.data;
                nTotal = data.totalRecord;
                oSearchNumber.text(nTotal);
                if (nTotal > nPageSize) {
                    nMaxPageNumber = Math.ceil(nTotal / nPageSize);
                    oListPage.showPage(true)
                        .setMaxPageNumber(nMaxPageNumber)
                        .setNowPageNumber(nNowPageNumber)
                        .createPage();
                } else {
                    oListPage.showPage(false);
                }
                list = data.data;
                showList(list);
            }
        },
        error: function (err) {
            oSearchNumber.text(nTotal);
            console.error('getSearchData:', err);
        }
    });
}

function showList(list) {
    console.log(list);
    var resultHtml = '';
    var publishTime = '';
    var itemDom = '';
    var author = '';
    var clickNumber = '';
    $.each(list, function (i, item) {
        publishTime = formatTime(new Date(item.publish_date), false, 'YYYY-MM-DD');
        author = item.author || '管理员';
        clickNumber = item.click_rate || 0;
        itemDom = '<li class="search-item">\n';
        itemDom += createTypeDom(item.indexType, item.data_id, item.title);
        itemDom += sprintf('<div class="info-line">\n' +
                '               <p class="publish-time">%s</p>\n' +
                '               <p class="click-number">点击量：%s</p>\n' +
                '               <p class="publisher">发布者：%s</p>\n' +
                '            </div>\n' +
                '        </li>', publishTime, clickNumber, author);
        resultHtml += itemDom
    });
    oSearchListNode.html(resultHtml)
}

// 资讯类型
function createTypeDom(indexType, id, title) {
    var typeDom = '';
    switch (indexType) {
        case 'c_business_information_news':
            typeDom = sprintf('<div class="title-line">\n' +
                    '              <span class="type-tag type-1">平台资讯</span>\n' +
                    '              <a class="search-title" target="_blank" href="/informationNews/detail/%s.html">%s</a>\n' +
                    '           </div>\n', id, title);
            break;
        case 'c_business_clearance_news':
            typeDom = sprintf('<div class="title-line">\n' +
                    '              <span class="type-tag type-2">通关资讯</span>\n' +
                    '              <a class="search-title" target="_blank" href="/clearanceNews/detail/%s.html">%s</a>\n' +
                    '           </div>\n', id, title);
            break;
        case 'c_incubator_article':
            typeDom = sprintf('<div class="title-line">\n' +
                    '              <span class="type-tag type-3">孵化资讯</span>\n' +
                    '              <a class="search-title" target="_blank" href="/incubatorArticle/detail/%s.html">%s</a>\n' +
                    '           </div>\n', id, title);
            break;
        default:
            typeDom = '';
            break;
    }
    return typeDom;
}

// 获取地址栏上的参数
function getUrlParam(paramName) {
    var reg = new RegExp("(^|&)"+ paramName +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
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
                search();
            } else if (labelType === 'button') {
                // 按钮
                if (bCanLift) {
                    _this.setNowPageNumber(nNowPageNumber)
                        .createPage();
                }
                search();
            }
        });
}
