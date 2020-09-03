/**
 * Created by mu-HUN on 2018/9/19.
 */
// var $menuTree = $('#menu-tree');
var $pandectTree = $('#pandect-tree');
var $trendTree = $('#trend-tree');
var $contrastTree = $('#contrast-tree');
var $proportionTree = $('#proportion-tree');
var zNodes = [];
var $pandectTable = $('#pandectTable');
var $trendTable = $('#trendTable');
var $contrastTable = $('#contrastTable');
var $proportionTable = $('#proportionTable');
var pandectId = 0;
var panelIndex = 0;
var trendType = '日';
var trendId = 0;
var $trendMap;
var $contrastMap;
var $proportionMap;
var contrastType = '日'
var ids = [];
var proportionType = '周日'
var proportionId = 0;
$(function(){
    initPage();
});
//初始化页面
function initPage() {
    $(".time").datetimepicker({
        locale: moment.locale('zh-cn'),
        format: "YYYY-MM-DD"
    });
    setTimeFrame(3,'#trendStart','#trendEnd');
    setTimeFrame(3,'#contrastStart','#contrastEnd');
    var obj = {
        id: 0,
        pid: -1,
        name: 'root',
        title: 'root',
        deleted: false,
        open: true
    };
    menus.unshift(obj);
    showTreeTable(menus);
    $trendMap = echarts.init(document.getElementById('trendMap'));
    $contrastMap = echarts.init(document.getElementById('contrastMap'));
    $proportionMap = echarts.init(document.getElementById('proportionMap'));
    initTable();
    $(document).on('click', '#searchPandect', function (e) {
        e.stopPropagation();
        var key = $('#searchPandectText').val();
        if (key != null) {
            var ztree = $.fn.zTree.getZTreeObj("pandect-tree")
            var hidenode = ztree.transformToArray(ztree.getNodes());
            ztree.hideNodes(hidenode);//隐藏所有节点
            var nodeList = ztree.getNodesByParamFuzzy("name", key, null);//模糊查询
            if (nodeList && nodeList.length > 0) {
                for ( var i = 0; i < nodeList.length; i++) {
                    nodeList[i].highlight = true;//设置高亮
                    findParent(ztree, nodeList[i]);
                    ztree.updateNode(nodeList[i]);
                    ztree.expandNode(nodeList[i], true, true, false);//展开节点
                }
            }
        }else{
            alert("请输入搜索条件");
        }
    }).on('click','#fieldTab a',function (e) {
        //tab栏切换
        var href = $(this).attr('href')
        if(href === '#pandect') {
            panelIndex = 0;
        } else if (href === '#trend'){
            panelIndex = 1;
            getTrendAnalysis();
        } else if (href === '#contrast'){
            panelIndex = 2;
            getContrastData();
        } else {
            panelIndex = 3;
            setProTime();
            getProportionData();
        }
        e.stopPropagation();
        $(this).tab('show');
    }).on('click','.type-list li span',function (e) {
        e.stopPropagation();
        $(this).parent().siblings().removeClass('type-active');
        $(this).parent().addClass('type-active');
        if(panelIndex === 1) {
            trendType = $(this).data('value');
            /*if(trendType === '月'){
                $.fn.datepicker.defaults.format = 'yyyy-mm'
            }*/
            getTrendAnalysis();
        }
        if(panelIndex === 2) {
            contrastType = $(this).data('value');
            if(contrastType === '月'){
                $.fn.datepicker.defaults.format = 'yyyy-mm'
            }
            getContrastData();
        }
        if(panelIndex === 3) {
            proportionType = $(this).data('value');
            var $first = $('.time-first');
            var $sec = $('.time-sec');
            if(proportionType === '周日') {
                $first.empty();
                var children = $('<li class="time-active"><span data-time="0">本周</span></li><li><span data-time="1">上周</span></li>')
                $first.append(children);
                $sec.empty();
                var secChildren = $('<li class="time-active"><span data-time="2">上一周</span></li><li><span data-time="3">上两周</span></li>')
                $sec.append(secChildren);
            } else if(proportionType === '月日') {
                $first.empty();
                var children = $('<li class="time-active"><span data-time="0">本月</span></li><li><span data-time="1">上月</span></li>')
                $first.append(children);
                $sec.empty();
                var secChildren = $('<li class="time-active"><span data-time="2">上一月</span></li><li><span data-time="3">上两月</span></li>')
                $sec.append(secChildren);
            } else if(proportionType === '年月') {
                $first.empty();
                var children = $('<li class="time-active"><span data-time="0">本年</span></li><li><span data-time="1">上年</span></li>')
                $first.append(children);
                $sec.empty();
                var secChildren = $('<li class="time-active"><span data-time="2">上一年</span></li><li><span data-time="3">上两年</span></li>')
                $sec.append(secChildren);
            }
            setProTime();
            getProportionData();
        }
    }).on('click','.time-list li span',function (e) {
        e.stopPropagation();
        $(this).parent().siblings().removeClass('time-active');
        $(this).parent().addClass('time-active');
        var length = $(this).data('time');
        if (panelIndex === 1) {
            setTimeFrame(parseInt(length), '#trendStart', '#trendEnd');
            getTrendAnalysis();
        }
        if (panelIndex === 2) {
            setTimeFrame(parseInt(length), '#contrastStart', '#contrastEnd');
            getContrastData();
        }
    }).on('click','#ids-list>li>.icon-remove',function (e) {
        e.stopPropagation();
        var id = $(this).data('id');
        var index = ids.indexOf(id);
        ids.splice(index, 1);
        $(this).parent().remove();
        getContrastData();
    }).on('click', '.time-first li span,.time-sec li span',function (e) {
        e.stopPropagation();
        $(this).parent().siblings().removeClass('time-active');
        $(this).parent().addClass('time-active');
        setProTime();
        getProportionData();
    }).on('click','#proportionToSearch',function (e) {
        e.stopPropagation();
        getProportionData();
    }).on('click','#contrastToSearch',function (e) {
        e.stopPropagation();
        getContrastData();
    }).on('click','#trendToSearch',function (e) {
        e.stopPropagation();
        getTrendAnalysis();
    });
}
//初始化Table
function initTable() {
    $pandectTable.bootstrapTable({
        height: getHeight(),
        toolbar: "#toolbar",
        ajax: getPandectTable,
        striped: true,
        showRefresh: true,
        showColumns: true,
        showToggle: true,
        minimumCountColumns: 2,
        pagination: true,
        pageList: "[15, 20, 25, 50, 100]",
        pageNumber: 1,
        pageSize: 15,
        showFooter: false,
        sidePagination: "server",
        clickToSelect:true
    });
    setTimeout(function () {
        $pandectTable.bootstrapTable('resetView');
    }, 200);
    /*$pandectTable.on('expand-row.bs.table', function (e, index, row, $detail) {
        var html = [];
        $.each(row, function (key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return $detail.html(html);
    });*/
    $trendTable.bootstrapTable({
        height: '500',
        data: [],
        striped: true,
        showRefresh: true,
        showColumns: true,
        showToggle: true,
        minimumCountColumns: 2,
        pagination: true,
        pageList: "[15, 20, 25, 50, 100]",
        pageNumber: 1,
        pageSize: 15,
        showFooter: false,
        sortOrder: 'asc',
        sidePagination: "client",
        clickToSelect:true
    });
    $contrastTable.bootstrapTable({
        height: '700',
        data: [],
        striped: true,
        showRefresh: true,
        showColumns: true,
        showToggle: true,
        minimumCountColumns: 2,
        pagination: true,
        pageList: "[25, 30, 50, 100]",
        pageNumber: 1,
        pageSize: 30,
        showFooter: false,
        sortOrder: 'asc',
        sidePagination: "client",
        clickToSelect:true
    });
    $proportionTable.bootstrapTable({
        height: '700',
        data: [],
        striped: true,
        showRefresh: true,
        showColumns: true,
        showToggle: true,
        minimumCountColumns: 2,
        pagination: true,
        pageList: "[15, 20, 25, 50, 100]",
        pageNumber: 1,
        pageSize: 15,
        showFooter: false,
        sortOrder: 'asc',
        sidePagination: "client",
        clickToSelect:true
    });
}
//显示数据源的树状结构
function showTreeTable(menuList) {
    for(var i = 0, iLen = menuList.length; i < iLen; i++) {
        var obj = {
            id: menuList[i].id,
            pId: menuList[i].pid || 0,
            name: menuList[i].name,
            deleted: menuList[i].deleted,
            open: true,
            data: menuList[i]
        };
        zNodes.push(obj);
    }
    setTreeViewContent(zNodes);
}
//树的结构配置
function setTreeViewContent(zNodes) {
    var setting = {
        data: {
            simpleData: {
                enable: true
            }
        },
        view: {
            addHoverDom: null,
            removeHoverDom: null,
            selectedMulti: false
        },
        edit: {
            enable: true,
            editNameSelectAll: true,
            showRemoveBtn: false,
            showRenameBtn: false
        },
        callback: {
            onClick: onClick
        }
    };
    $.fn.zTree.init($pandectTree, setting, zNodes);
    $.fn.zTree.init($trendTree, setting, zNodes);
    $.fn.zTree.init($proportionTree, setting, zNodes);
    /*var checkSetting = {
        view: {
            selectedMulti: false
        },
        check: {
            enable: true
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeCheck: beforeCheck,
            onCheck: onCheck
        }
    };*/
    $.fn.zTree.init($contrastTree, setting, zNodes);
}
//树的点击事件
function onClick(event, treeId, treeNode) {
    if(panelIndex === 0) {
        pandectId = treeNode.id;
        $pandectTable.bootstrapTable('refresh');
    }
    if(panelIndex === 1) {
        trendId = treeNode.id;
        getTrendAnalysis();
    }
    if (panelIndex === 2) {
        for (var i = 0; i < ids.length; i++) {
            if(ids[i] === treeNode.id) {
                ids.splice(i, 1);
                return ;
            }
        }
        ids.push(treeNode.id);
        getContrastData();
    }
    if(panelIndex === 3) {
        proportionId = treeNode.id
        getProportionData();
        // getTrendAnalysis();
    }
}
//找到其父亲节点
function findParent(ztree, node) {
    ztree.expandNode(node, true, false, true);//展开节点
    ztree.showNode(node);//显示该节点
    var pNode = node.getParentNode();
    if (pNode != null) {
        findParent(ztree, pNode);
    }
}
//设置字体颜色
function setFontCss(treeId, treeNode) {
    if (treeNode.id == 1) {//根节点
        return {
            color : "black"
        };
    }
    if (treeNode.highlight) {//如果符合模糊查询条件则高亮显示
        return {
            color : "red"
        };
    }else{
        return {
            color : "black"
        };
    }
}
//重置
$("#reset").on("click",function(){
    treeNode.highlight=false;//所有节点取消高亮
    $("#searchTreeText").val('');//搜索框重置
    $.windowbox.treeInit();//树初始化
    ztree.expandNode(treeNode,true,true,true);
    ztree.refresh();
});
//总览表格数据请求
function getPandectTable(params) {
    var pager = {};
    pager.current = params.data.offset/params.data.limit + 1;
    pager.size = params.data.limit ;
    var sortPointer = {};
    sortPointer.order = 'DESC';
    var postData = {
        pager: pager,
        sortPointer:sortPointer
    };
    $.ajax({
        url: '/admin/menuClick/'+ pandectId + '/getStatistical',
        type: 'post',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify(postData),
        success: function (res) {
            var data = res.data.data_object;
            var table = initPandectTable(data);
            var total = table.length;
            params.success({
                total: total,
                rows: table
            })
        }
    })
}
//初始化总览数据
function initPandectTable(data) {
    var treeObj = $.fn.zTree.getZTreeObj("pandect-tree");
    var nodes =  treeObj.transformToArray(treeObj.getNodeByParam("id", pandectId, null));
    var table = []
    for(var i = 0;i < nodes.length; i++) {
        if (nodes[i].data.name === 'root') continue;
        var obj = {
            id: nodes[i].data.id,
            name: nodes[i].data.name,
            today: 0,
            yesterday: 0,
            thisWeek: 0,
            lastWeek: 0,
            thisMonth: 0,
            lastMonth: 0,
            thisYear: 0,
            lastYear: 0
        }
        for(var tag in data) {
            for (var j = 0; j < data[tag].length; j++) {
                if(data[tag][j].menu_id === obj.id) {
                    obj[tag] = data[tag][j].click_num
                }
            }
        }
        table.push(obj);
    }
    return table;
}
//获取趋势分析数据
function getTrendAnalysis() {
    if(!judgeTimeInput('#trendStart', '#trendEnd')) {
        return ;
    }
    var start = $('#trendStart').val();
    var end = $('#trendEnd').val()
    if (trendType === '月') {
        start = start.slice(0, 8) + '01';
        end = end.slice(0, 8) + '01';
    } else if(trendType === '年') {
        start = start.slice(0, 5) + '01-01';
        end = end.slice(0, 5) + '01-01';
    }
    var json = {
        type: trendType,
        startTime: start,
        endTime: end,
        id: trendId + ''
    }
    $.ajax({
        url: '/admin/menuClick/trendAnalysis',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(json),
        success: function (res) {
            setTrendView(res.data.data_object)
        },
        error: function (e) {
            console.log(e);
        }
    })
}
//回显趋势分析的数据
function setTrendView(data) {
    var statisticsTable = $('#trend-statistics tbody');
    statisticsTable.empty();
    var count = 0
    var min = 0;
    var minTime = 0;
    var max = 0;
    var maxTime = 0;
    var timeTag = 'nowTime';
    if(trendType === '周'){
        timeTag = 'weeks'
    } else if (trendType === '月') {
        timeTag = 'months'
    } else if (trendType === '年') {
        timeTag = 'years'
    }
    if(data.length) {
        min = data[0].click_num;
        max = data[0].click_num;
        minTime = data[0][timeTag];
        maxTime = data[0][timeTag];
    }
    for(var i = 0; i < data.length; i++) {
        data[i].time = data[i][timeTag];
        count = count + data[i].click_num;
        if (data[i].click_num < min) {
            min = data[i].click_num;
            minTime = data[i][timeTag];
        }
        if (data[i].click_num > max) {
            max = data[i].click_num;
            maxTime = data[i][timeTag];
        }
    }
    var aver = data.length ? parseInt(count / data.length) : 0;
    var bodyStr = '<tr><td>'+ count +'</td>' +
        '<td>'+ aver +'</td>' +
        '<td>'+ max +'</td>' +
        '<td>'+ maxTime +'</td>' +
        '<td>'+ min +'</td>' +
        '<td>'+ minTime +'</td></tr>';
    statisticsTable.html(bodyStr);
    $trendTable.bootstrapTable('load', data);
    $trendMap.showLoading({text: '拼命加载中...'});
    setECharts(data);
    $trendMap.hideLoading();
}
//获取对比分析数据
function getContrastData() {
    if(!judgeTimeInput('#contrastStart', '#contrastEnd')) {
        return ;
    }
    if(!ids.length) {
        layer.msg('请选择对比的区域');
        return;
    }
    setContrastTag(ids)
    var start = $('#contrastStart').val();
    var end = $('#contrastEnd').val()
    if (contrastType === '月') {
        start = start.slice(0, 8) + '01';
        end = end.slice(0, 8) + '01';
    } else if(contrastType === '年') {
        start = start.slice(0, 5) + '01-01';
        end = end.slice(0, 5) + '01-01';
    }
    var json = {
        type: contrastType,
        firstTime: start,
        secTime: end,
        ids:ids.join(',')
    }
    $.ajax({
        url: '/admin/menuClick/contrastAnalysis',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(json),
        success: function (res) {
            $contrastMap.clear();
            setContrastView(res.data.data_object)
            // setTrendView(res.data.data_object)
        },
        error: function (e) {
            console.log(e);
        }
    })
}
//对比标签
function setContrastTag(ids) {
    var $ul = $('#ids-list');
    var zTreeObj = $.fn.zTree.getZTreeObj('contrast-tree');
    $ul.empty();
    for (var i = 0; i < ids.length; i++) {
        var node = zTreeObj.getNodeByParam('id', ids[i], null);
        var li = $('<li><span class="id-name">' + node.name + '</span><i class="icon-remove" data-id="' + ids[i] + '"></i></li>')
        $ul.append(li);
    }
}
//回显对比分析数据
function setContrastView(data) {
    var is_empty = true;//判空
    for (var tag in data) {
        if(data[tag].length){is_empty = false}
    }
    if(is_empty) {
        layer.msg('暂无更多数据');
        return ;
    }
    var zTreeObj = $.fn.zTree.getZTreeObj('contrast-tree')
    var table = []
    var type = 'nowTime'
    if (contrastType === '周') {
       type = 'weeks'
    } else if (contrastType === '月') {
        type = 'months'
    } else if (contrastType === '年'){
        type = 'years'
    }
    var nameList = []
    for(var tag in data) {
        var node = zTreeObj.getNodeByParam('id', parseInt(tag), null)
        nameList.push(node.name)
        var count = 0
        for (var i = 0; i < data[tag].length; i++ ) {
            data[tag][i].area = node.name;
            count = count + data[tag][i].click_num;
            data[tag][i].count = count;
            data[tag][i].time = data[tag][i][type]
            table.push(data[tag][i]);
        }
    }
    initContrastMap(data,nameList);
    $contrastTable.bootstrapTable('load', table);
}
//获取同比数据
function getProportionData() {
    if(!judgeTimeInput('#contrastStart', '#contrastEnd')) {
        return ;
    }
    var start = $('#firstTime').val();
    var end = $('#secTime').val();
    var json = {
        type: proportionType,
        firstTime: start,
        secTime: end,
        id: proportionId + ''
    }
    $.ajax({
        url: '/admin/menuClick/compareAnalysis',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(json),
        success: function (res) {
            setProportionView(res.data.data_object)
        },
        error: function (e) {
            console.log(e);
        }
    })
}
//回显同比数据
function setProportionView(data) {
    // var $tr = $('#proportionTable thead tr');
    /*$tr.empty();*/
    if(!data.first.length && !data.sec.length) {
        layer.msg('没有更多数据，请从新选择');
        return
    }
    var table = [];
    var first = $('#firstTime').val();
    var sec = $('#secTime').val();
    if(proportionType === '月日') {
        first = first.slice(0,7)
        sec = sec.slice(0,7)
    } else if (proportionType === '年月') {
        first = first.slice(0,4)
        sec = sec.slice(0,4)
    }
    /*$tr.html('<th data-title="时间" data-field="time" data-align="center"></th>' +
        '<th data-title="'+first+'" data-field="first_click" data-align="center"></th>' +
        '<th data-title="'+sec+'" data-field="sec_click" data-align="center"></th>' +
        '<th data-title="差值" data-field="d_value" data-align="center"></th>' +
        '<th data-title="差比" data-field="d_rate" data-align="center"></th>');*/
    //$proportionTable.bootstrapTable('showLoading');
    var firstIndex = 0;
    var secIndex = 0;
    while (firstIndex < data.first.length && secIndex < data.sec.length) {
        var obj = {
            time: '',
            first_click: 0,
            sec_click: 0,
            d_value: 0,
            d_rate: 0
        }
        if (firstIndex === data.first.length && secIndex < data.sec.length) {
            obj.time = data.sec[secIndex].nowTime
            obj.sec_click = data.sec[secIndex].click_num
            obj.d_value = -obj.sec_click;
            obj.d_rate = '-∞'
            secIndex++
        } else if (firstIndex < data.first.length && secIndex === data.sec.length) {
            obj.time = data.first[firstIndex].nowTime;
            obj.first_click = data.first[firstIndex].click_num;
            obj.d_value = obj.first_click;
            obj.d_rate = '∞';
            firstIndex++
        } else {
            var flag = compTime(data.first[firstIndex].nowTime, data.sec[secIndex].nowTime)
            if(flag === 1) {
                obj.time = data.sec[secIndex].nowTime;
                obj.sec_click = data.sec[secIndex].click_num;
                obj.d_value = -obj.sec_click;
                obj.d_rate = '-∞';
                secIndex++
            } else if(flag === -1) {
                obj.time = data.first[firstIndex].nowTime;
                obj.first_click = data.first[firstIndex].click_num;
                obj.d_value = obj.first_click;
                obj.d_rate = '∞';
                firstIndex++
            } else {
                obj.time = data.first[firstIndex].nowTime;
                obj.first_click = data.first[firstIndex].click_num;
                obj.sec_click = data.sec[secIndex].click_num;
                obj.d_value = obj.first_click - obj.sec_click;
                obj.d_rate = (obj.d_value / obj.first_click * 100).toFixed(0) + '%'
                firstIndex++;
                secIndex++;
            }
        }
        table.push(obj);
    }
    $proportionTable.bootstrapTable('load',table);
    var xAxis = [];
    var series = [];
    $proportionMap.showLoading({text: '拼命加载中...'});
    var options = {
        title: {
            show: true,
            text: '对比分析图',
            textStyle: {
                align: 'right'
            }
        },
        legend: {
            data: [first,sec]
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    show: false
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {
                    show: false
                },
                saveAsImage: {
                    show: false
                }
            },
            right: 0
        }
    }
    var firstArray = [];
    var secArray = []
    for (var i = 0;i < table.length;i++) {
        xAxis.push(table[i].time);
        firstArray.push(table[i].first_click);
        secArray.push(table[i].sec_click);
    }
    options.xAxis.data = xAxis;
    options.series = [{
        name:first,
        type: 'bar',
        data: firstArray},{
        name:sec,
        type: 'bar',
        data: secArray
    }];
    $proportionMap.setOption(options);
    $proportionMap.hideLoading();
}
//设置时间范围
function setTimeFrame(timeLength,startTime,endTime) {
    var endT = $(endTime).val();
    if (!!endT) {
        //    如果结尾时间有值
        var end = setTimeFormat(new Date(endT));
        var start = setTimeFormat(new Date(endT), timeLength);
        $(startTime).val(start);
        $(endTime).val(end);
    } else {
        var end = setTimeFormat(new Date());
        var start = setTimeFormat(new Date(), timeLength);
        $(startTime).val(start);
        $(endTime).val(end);
    }
}
//设置时间格式
function setTimeFormat(date, timeLength){
    if(!!timeLength) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1 - timeLength;
        if(month <= 0) {
            month = 12 - Math.abs(month);
            year = year - 1;
        }
        month = month < 10 ? '0' + month : month;
        var day = date.getDate();
        day = day < 10 ? ('0' + day) : day;
        return year + '-' + month + '-' + day;
    } else {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        var day = date.getDate();
        day = day < 10 ? ('0' + day) : day;
        return year + '-' + month + '-' + day;
    }
}
// 判断时间输入
function judgeTimeInput(startTime,endTime) {
    var reg =  /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/;
    var start = $(startTime).val();
    var end = $(endTime).val();
    var sflag = start.match(reg);
    var eflag = end.match(reg);
    if (!sflag || !eflag) {
        layer.msg('请选择正确的时间格式');
        return false;
    } else {
        return true;
    }
}
//初始化eCharts
function setECharts(data) {
    var xAxis = [];
    var series = [];
    // var title='';
    var options = {};
    if(panelIndex === 1) {
        var type = 'days';
        if(trendType === '周') {
            type = 'weeks';
        } else if (trendType === '月') {
            type = 'months'
        } else if (trendType === '年') {
            type = 'years'
        }
        for(var i = 0; i < data.length; i++) {
            xAxis.push(data[i].time);
            series.push(data[i].click_num);
        }
    }
    options = {
        title: {
            show: true,
            text: '趋势分析图',
            textStyle: {
                align: 'right'
            }
        },
        xAxis: {
            type: 'category',
            data: xAxis
        },
        yAxis: {
            type: 'value'
        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    show: false
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {
                    show: false
                },
                saveAsImage: {
                    show: false
                }
            },
            right: 0
        },
        series: []
    }
    if(panelIndex === 1) {
        var data = {
            data: series,
            type: 'bar'
        }
        options.series.push(data);
        $trendMap.setOption(options);
    }
}
//初始化对比eCharts
function initContrastMap(data,nameList) {
    var xAxis = [];
    var series = [];
    $contrastMap.showLoading({text: '拼命加载中...'});
    var options = {
        title: {
            show: true,
            text: '趋势分析图',
            textStyle: {
                align: 'right'
            }
        },
        legend: {
            data: nameList
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    show: false
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {
                    show: false
                },
                saveAsImage: {
                    show: false
                }
            },
            right: 0
        }
    }
    var index = 0;
    var maxLength = 0;
    var maxIndex = '';
    for(var i in data) {
        if(data[i].length > maxLength) {
            maxLength = data[i].length;
            maxIndex = i
        }
        var array = []
        for(var j = 0; j < data[i].length; j++) {
            array.push(data[i][j].click_num);
        }
        var obj = {
            name: nameList[index],
            type: 'bar',
            data: array
        }
        index++;
        series.push(obj);
    }
    var type = 'nowTime'
    if (contrastType === '周') {
        type = 'weeks'
    } else if (contrastType === '月') {
        type = 'months'
    } else if (contrastType === '年'){
        type = 'years'
    }
    var timeList = data[maxIndex];
    for(var k = 0; k < timeList.length; k++) {
        xAxis.push(timeList[k][type]);
    }
    options.xAxis.data = xAxis;
    options.series = series;
    $contrastMap.setOption(options);
    $contrastMap.hideLoading();
}
//同比时间设定
function setProTime() {
    var firstTime = $('#firstTime');
    var secTime = $('#secTime');
    var first = $('.time-first li.time-active span').data('time');
    var sec = $('.time-sec li.time-active span').data('time');
    if (proportionType === '周日') {
        var weeks = new Date();
        firstTime.val(setTimeFormat(new Date(weeks - weeks.getDay()*1000*24*3600-6*1000*24*3600*$('.time-first li.time-active span').data('time'))));
        secTime.val(setTimeFormat(new Date(new Date(firstTime.val()).getTime()-6*1000*24*3600*$('.time-sec li.time-active span').data('time'))))
    } else if(proportionType === '月日') {
        var months = new Date();
        var str = setTimeFormat(new Date(months.setMonth(months.getMonth()-$('.time-first li.time-active span').data('time'))));
        firstTime.val(str.slice(0,8)+ '01');
        str = setTimeFormat(new Date(months.setMonth(months.getMonth()-$('.time-sec li.time-active span').data('time') + 1)))
        secTime.val(str.slice(0,8)+ '01');
    } else if(proportionType === '年月') {
        var years = new Date();
        var str1 = setTimeFormat(new Date(years.setFullYear(years.getFullYear()-$('.time-first li.time-active span').data('time'))));
        firstTime.val(str1.slice(0,5)+ '01-01');
        str1 = setTimeFormat(new Date(years.setFullYear(years.getFullYear()-$('.time-sec li.time-active span').data('time'))))
        secTime.val(str1.slice(0,5)+ '01-01');
    }
}
//比较时间
function compTime(first,sec) {
    var t1 = new Date(first).getTime();
    var t2 = new Date(sec).getTime();
    if(t1 > t2) {
        return 1
    } else if (t1 === t2) {
        return 0
    } else {
        return -1
    }
}