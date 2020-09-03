$(function () {
    var oListPage = new PluginPagination('three-news-page');
    var bCanLift = true;
    var nNowPageNumber = 1;
    var nPageSize = 12;
    var nMaxPageNumber = 0;
    var nTotal = 0;

    initDataList();
    initPlusPage();
    function initDataList(){
        var params = {
            "pager":{
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
        }
        $.ajax({
            url:'/clearanceNews/query',
            type: 'post',
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            data:JSON.stringify(params),
            success: function (res) {
                console.log(res);
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
                var publishDate = (list[i].publishDate) ? formatTime(new Date(list[i].publishDate), false, 'YYYY-MM-DD') : null
                html += '<li class="new-item">' +
                    '<a class="new-link" href="clearanceNews/detail/'+list[i].id+'.html">' +
                    '<span class="new-title">'+list[i].title+'</span>' +
                    '<span class="new-time">'+publishDate+'</span>' +
                    '</a>' +
                    '</li>';
            }
            $('.news-list').html(html);
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
                    initDataList();
                } else if (labelType === 'button') {
                    // 按钮
                    if (bCanLift) {
                        _this.setNowPageNumber(nNowPageNumber)
                            .createPage();
                    }
                    initDataList();
                }

            });
    }
});