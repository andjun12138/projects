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
    nPageSize = 1;
    nNowPageNumber = 1;
    search();
}

function search() {
    var postData = {
        "types": [
            "c_business_employment"
        ],
        "fields": [
            // {
            //     "fields": [
            //         "city_name"
            //     ],
            //     "values": [
            //         "惠州"        //根据城市名搜索，前端动态改变
            //     ],
            //     "searchType": "term"
            // }
            // {
            //     "fields": [
            //         "industry_id"
            //     ],
            //     "values": [
            //         "9057c522-a832-456c-9201-33fdfea06755"        //根据所属行业搜索，前端动态改变
            //     ],
            //     "searchType": "term"
            // }
        ],
        "page": nNowPageNumber,
        "size": nPageSize,
        "sort": "DESC",         //排序规则
        "sortFields": [
            "refresh_time"      //排序字段
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
    var publishTime = '';
    var education = '本科';
    var companyName = '1';
    var industry = '1';
    var itemDom = '';
    $.each(list, function (i, item) {
        publishTime = formatTime(new Date(item.refresh_time), false, 'YYYY-MM-DD');
        console.log(publishTime);
        // console.log(item.education)
        // console.log(JSON.parse(item.education));
        // if (item.education) {
        //     education = JSON.parse(item.education).title;
        // }
        // if (item.enterprise_id) {
        //     companyName = JSON.parse(item.enterprise_id).name;
        // }
        // if (item.industry) {
        //     industry = JSON.parse(item.industry).title;
        // }
        var domStr = '<li class="search-item">\n' +
'                    <div class="item-left">\n' +
'                        <a href="/employment/detail/%s.html" class="job-title">%s</a>\n' +
'                        <p class="job-salary">¥&nbsp;%s-%s K</p>\n' +
'                        <ul class="job-info-list">\n' +
'                            <li class="job-info-item">%s</li>\n' +
'                            <li class="job-info-item">%s</li>\n' +
'                            <li class="job-info-item">发布时间：%s</li>\n' +
'                        </ul>\n' +
'                    </div>\n' +
'                    <div class="item-right">\n' +
'                        <div class="img-container">\n' +
'                            <img src="/static/assets/word.png" alt="" class="company-logo">\n' +
'                        </div>\n' +
'                        <div class="company-info">\n' +
'                            <div class="company-name-div">\n' +
'                                <span class="company-name">%s</span>\n' +
'                                <span class="company-address">【 %s - %s 】</span>\n' +
'                            </div>\n' +
'                            <ul class="company-tag-list">\n' +
'                                <li class="company-tag-item">%s</li>\n' +
'                            </ul>\n' +
'                        </div>\n' +
'                    </div>\n' +
'                </li>';
        itemDom += sprintf(domStr, item.data_id, item.title, item.wage_start, item.wage_end, education, item.work_experience, publishTime, companyName, item.province_name, item.city_name, industry);
    });
    oSearchListNode.html(itemDom)
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
