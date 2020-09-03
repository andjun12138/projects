/**
 * Created by mu-HUN on 2018/9/14.
 */
var type = '日';
var table=[];
var $table = $('#table')
$(function () {
    initPage();
})
// 初始化页面
function initPage() {
    $("#startTime").datetimepicker({
        locale: moment.locale('zh-cn'),
        format: "YYYY-MM-DD",
        minDate: new Date("2018-08-01")
    });
    $("#endTime").datetimepicker({
        locale: moment.locale('zh-cn'),
        format: "YYYY-MM-DD",
        maxDate: new Date()
    })
    setTimeFrame(3,'#startTime','#endTime');
    getAnalysisData();
    $(document).on('click', '.type-list li span', function (e) {
        e.stopPropagation();
        $(this).parent().siblings().removeClass('type-active');
        $(this).parent().addClass('type-active');
        type = $(this).data('value');
        getAnalysisData();
    }).on('click','.time-list li span',function (e) {
        e.stopPropagation();
        $(this).parent().siblings().removeClass('time-active');
        $(this).parent().addClass('time-active');
        var timeLength = $(this).data('time');
        setTimeFrame(timeLength,"#startTime","#endTime");//设置时间范围输入框的值
        getAnalysisData();
    }).on('click','#toSearch',function (e) {
        e.stopPropagation();
        getAnalysisData();
    });
    $table.bootstrapTable({
        height: getHeight(),
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
    $table.on('expand-row.bs.table', function (e, index, row, $detail) {
        var html = [];
        $.each(row, function (key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return $detail.html(html);
    });
}
//获取数据
function getAnalysisData() {
    //判断时间输入范围
    if(!judgeTimeInput('#startTime', '#endTime')) {
        return ;
    }
    var json = {
        type: type,
        startTime: $('#startTime').val(),
        endTime: $('#endTime').val()
    }
    $.ajax({
        url: '/admin/activeUserStatistical/sortQuery',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(json),
        success: function (res) {
            setDataTable(res.data.data_object)
        },
        error: function (e) {
            console.log(e);
        }
    })
}
//设置表格
function setDataTable (data) {
    // var NewCount = 0;
    var OldCount = data.total;
    var newUsers = data.newUsers;//当天新用户数
    var newUsersIndex = 0;
    var oldActiveUsers = data.oldActiveUsers;//老用户活跃数
    var oldActiveUsersIndex = 0;//老用户活跃数索引
    table = [];
    if (type === '周') {
        while(!(newUsersIndex === newUsers.length && oldActiveUsersIndex === oldActiveUsers.length)) {
            var obj = {
                time: '',
                userCount: 0,
                newUserCount: 0,
                oldUserCount: 0,
                oldActiveCount: 0,
                oldRate: 0,
                allRate: 0
            }
            if (newUsersIndex === newUsers.length && oldActiveUsersIndex !== oldActiveUsers.length) {//如果newUsers遍历完
                //新用户索引结束
                obj.time = oldActiveUsers[oldActiveUsersIndex].weeks.replace('-','第') + type;
                obj.userCount = OldCount;
                obj.newUserCount = 0;
                obj.oldUserCount = OldCount;
                obj.oldActiveCount = oldActiveUsers[oldActiveUsersIndex].counts;
                obj.oldRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.oldUserCount) * 100).toFixed(2);
                obj.allRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                table.push(obj);
                oldActiveUsersIndex++;
            } else if (newUsersIndex !== newUsers.length && oldActiveUsersIndex === oldActiveUsers.length) {//如果oldActiveUsers遍历完
                //老用户索引结束
                obj.time = newUsers[newUsersIndex].weeks.replace('-','第') + type;
                obj.userCount = OldCount + newUsers[newUsersIndex].counts;
                obj.newUserCount = newUsers[newUsersIndex].counts;
                obj.oldUserCount = OldCount;
                OldCount = OldCount + newUsers[newUsersIndex].counts;//统计出总数
                obj.oldRate = 0;
                obj.oldActiveCount = 0;
                obj.allRate = ((newUsers[newUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                table.push(obj);
                newUsersIndex++;
            } else {
                var compare = compareTime(newUsers[newUsersIndex].weeks, oldActiveUsers[oldActiveUsersIndex].weeks)
                if (compare == -1) {
                    //如果为-1 则表示 新'时间比老'时间早
                    obj.time = newUsers[newUsersIndex].weeks.replace('-','第') + type;
                    obj.userCount = OldCount + newUsers[newUsersIndex].counts;
                    obj.newUserCount = newUsers[newUsersIndex].counts;
                    obj.oldUserCount = OldCount;
                    obj.oldActiveCount = 0;
                    obj.oldRate = 0;
                    OldCount = OldCount + newUsers[newUsersIndex].counts;//统计出总数
                    obj.allRate = ((newUsers[newUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                    table.push(obj);
                    newUsersIndex++;
                } else if (compare == 0) {
                    obj.time = newUsers[newUsersIndex].weeks.replace('-','第') + type;
                    obj.userCount = OldCount + newUsers[newUsersIndex].counts;
                    obj.newUserCount = newUsers[newUsersIndex].counts;
                    obj.oldUserCount = OldCount;
                    obj.oldActiveCount = oldActiveUsers[oldActiveUsersIndex].counts;
                    obj.oldRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.oldUserCount) * 100).toFixed(2);
                    obj.allRate = (((oldActiveUsers[oldActiveUsersIndex].counts + newUsers[newUsersIndex].counts) / obj.userCount) * 100).toFixed(2);
                    table.push(obj);
                    newUsersIndex++;
                    oldActiveUsersIndex++;
                } else {
                    obj.time = oldActiveUsers[oldActiveUsersIndex].weeks.replace('-','第') + type;
                    obj.userCount = OldCount + 0;
                    obj.newUserCount = 0;
                    obj.oldUserCount = OldCount;
                    obj.oldActiveCount = oldActiveUsers[oldActiveUsersIndex].counts;
                    obj.oldRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.oldUserCount) * 100).toFixed(2);
                    obj.allRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                    table.push(obj);
                    oldActiveUsersIndex++;
                }
            }
        }
        table[0].userCount = table[0].newUserCount + data.total
    }else if(type === '日') {
        while (!(newUsersIndex === newUsers.length && oldActiveUsersIndex === oldActiveUsers.length)) {
            var obj = {
                time: '',
                userCount: 0,
                newUserCount: 0,
                oldUserCount: 0,
                oldActiveCount: 0,
                oldRate: 0,
                allRate: 0
            }
            if (newUsersIndex === newUsers.length && oldActiveUsersIndex !== oldActiveUsers.length) {//如果newUsers遍历完
                //新用户索引结束
                obj.time = oldActiveUsers[oldActiveUsersIndex].days;
                obj.userCount = OldCount;
                obj.newUserCount = 0;
                obj.oldUserCount = OldCount;
                obj.oldActiveCount = oldActiveUsers[oldActiveUsersIndex].counts;
                obj.oldRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.oldUserCount) * 100).toFixed(2);
                obj.allRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                table.push(obj);
                oldActiveUsersIndex++;
            } else if (newUsersIndex !== newUsers.length && oldActiveUsersIndex === oldActiveUsers.length) {//如果oldActiveUsers遍历完
                //老用户索引结束
                obj.time = newUsers[newUsersIndex].days;
                obj.userCount = OldCount + newUsers[newUsersIndex].counts;
                obj.newUserCount = newUsers[newUsersIndex].counts;
                obj.oldUserCount = OldCount;
                OldCount = OldCount + newUsers[newUsersIndex].counts;//统计出总数
                obj.oldRate = 0;
                obj.oldActiveCount = 0;
                obj.allRate = ((newUsers[newUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                table.push(obj);
                newUsersIndex++;
            } else {
                var compare = compareDays(newUsers[newUsersIndex].days, oldActiveUsers[oldActiveUsersIndex].days)
                if (compare == -1) {
                    //如果为-1 则表示 新'时间比老'时间早
                    obj.time = newUsers[newUsersIndex].days;
                    obj.userCount = OldCount + newUsers[newUsersIndex].counts;
                    obj.newUserCount = newUsers[newUsersIndex].counts;
                    obj.oldUserCount = OldCount;
                    obj.oldActiveCount = 0;
                    obj.oldRate = 0;
                    OldCount = OldCount + newUsers[newUsersIndex].counts;//统计出总数
                    obj.allRate = ((newUsers[newUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                    table.push(obj);
                    newUsersIndex++;
                } else if (compare == 0) {
                    obj.time = newUsers[newUsersIndex].days;
                    obj.userCount = OldCount + newUsers[newUsersIndex].counts;
                    obj.newUserCount = newUsers[newUsersIndex].counts;
                    obj.oldUserCount = OldCount;
                    obj.oldActiveCount = oldActiveUsers[oldActiveUsersIndex].counts;
                    obj.oldRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.oldUserCount) * 100).toFixed(2);
                    OldCount = OldCount + newUsers[newUsersIndex].counts;//统计出总数
                    obj.allRate = ((oldActiveUsers[oldActiveUsersIndex].counts + newUsers[newUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                    table.push(obj);
                    newUsersIndex++;
                    oldActiveUsersIndex++;
                } else {
                    obj.time = oldActiveUsers[oldActiveUsersIndex].days;
                    obj.userCount = OldCount + 0;
                    obj.newUserCount = 0;
                    obj.oldUserCount = OldCount;
                    obj.oldActiveCount = oldActiveUsers[oldActiveUsersIndex].counts;
                    obj.oldRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.oldUserCount) * 100).toFixed(2);
                    obj.allRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                    table.push(obj);
                    oldActiveUsersIndex++;
                }
            }
        }
    } else if (type === '月') {
        while(!(newUsersIndex === newUsers.length && oldActiveUsersIndex === oldActiveUsers.length)) {
            var obj = {
                time: '',
                userCount: 0,
                newUserCount: 0,
                oldUserCount: 0,
                oldActiveCount: 0,
                oldRate: 0,
                allRate: 0
            }
            if (newUsersIndex === newUsers.length && oldActiveUsersIndex !== oldActiveUsers.length) {//如果newUsers遍历完
                //新用户索引结束
                obj.time = oldActiveUsers[oldActiveUsersIndex].months.replace('-','第') + type;
                obj.userCount = OldCount;
                obj.newUserCount = 0;
                obj.oldUserCount = OldCount;
                obj.oldActiveCount = oldActiveUsers[oldActiveUsersIndex].counts;
                obj.oldRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.oldUserCount) * 100).toFixed(2);
                obj.allRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                table.push(obj);
                oldActiveUsersIndex++;
            } else if (newUsersIndex !== newUsers.length && oldActiveUsersIndex === oldActiveUsers.length) {//如果oldActiveUsers遍历完
                //老用户索引结束
                obj.time = newUsers[newUsersIndex].months.replace('-','第') + type;
                obj.userCount = OldCount + newUsers[newUsersIndex].counts;
                obj.oldUserCount = 0;
                obj.newUserCount = newUsers[newUsersIndex].counts;
                OldCount = OldCount + newUsers[newUsersIndex].counts;//统计出总数
                obj.oldRate = 0;
                obj.oldActiveCount = 0;
                obj.allRate = ((newUsers[newUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                newUsersIndex++;
            } else {
                var compare = compareTime(newUsers[newUsersIndex].months, oldActiveUsers[oldActiveUsersIndex].months)
                if (compare === -1) {
                    obj.time = newUsers[newUsersIndex].months.replace('-','第') + type;
                    obj.userCount = OldCount + newUsers[newUsersIndex].counts;
                    obj.newUserCount = newUsers[newUsersIndex].counts;
                    obj.oldUserCount = OldCount;
                    obj.oldActiveCount = 0;
                    obj.oldRate = 0;
                    OldCount = OldCount + newUsers[newUsersIndex].counts;//统计出总数
                    obj.allRate = ((newUsers[newUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                    table.push(obj);
                    newUsersIndex++;
                } else if (compare === 0) {
                    obj.time = newUsers[newUsersIndex].months.replace('-','第') + type;
                    obj.userCount = OldCount + newUsers[newUsersIndex].counts;
                    obj.newUserCount = newUsers[newUsersIndex].counts;
                    obj.oldUserCount = OldCount;
                    obj.oldActiveCount = oldActiveUsers[oldActiveUsersIndex].counts;
                    obj.oldRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.oldUserCount) * 100).toFixed(2);
                    OldCount = OldCount + newUsers[newUsersIndex].counts;//统计出总数
                    obj.allRate = ((oldActiveUsers[oldActiveUsersIndex].counts + newUsers[newUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                    table.push(obj);
                    newUsersIndex++;
                    oldActiveUsersIndex++;
                } else {
                    obj.time = oldActiveUsers[oldActiveUsersIndex].months.replace('-','第') + type;
                    obj.userCount = OldCount + 0;
                    obj.newUserCount = 0;
                    obj.oldUserCount = OldCount;
                    obj.oldActiveCount = oldActiveUsers[oldActiveUsersIndex].counts;
                    obj.oldRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.oldUserCount) * 100).toFixed(2);
                    obj.allRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                    table.push(obj);
                    oldActiveUsersIndex++;
                }
            }
        }
    } else {
        if (!newUsers.length && oldActiveUsers.length) {
            while(!(oldActiveUsersIndex === oldActiveUsers.length)) {
                var obj = {
                    time: '',
                    userCount: 0,
                    newUserCount: 0,
                    oldUserCount: 0,
                    oldActiveCount: 0,
                    oldRate: 0,
                    allRate: 0
                }
                obj.time = oldActiveUsers[oldActiveUsersIndex].years + type;
                obj.userCount = OldCount;
                obj.newUserCount = 0;
                obj.oldUserCount = OldCount;
                obj.oldActiveCount = oldActiveUsers[oldActiveUsersIndex].counts;
                obj.oldRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.oldUserCount) * 100).toFixed(2);
                obj.allRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                table.push(obj);
                oldActiveUsersIndex++;
            }
        } else if (newUsers.length && !oldActiveUsers.length) {
            while(!(newUsersIndex !== newUsers.length)) {
                var obj = {
                    time: '',
                    userCount: 0,
                    newUserCount: 0,
                    oldUserCount: 0,
                    oldActiveCount: 0,
                    oldRate: 0,
                    allRate: 0
                }
                obj.time = newUsers[newUsersIndex].years + type;
                obj.userCount = OldCount + newUsers[newUsersIndex].counts;
                obj.newUserCount = newUsers[newUsersIndex].counts;
                obj.oldUserCount = OldCount;
                OldCount = OldCount + newUsers[newUsersIndex].counts;//统计出总数
                obj.oldRate = 0;
                obj.oldActiveCount = 0;
                obj.allRate = ((newUsers[newUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                table.push(obj);
                newUsersIndex++;
            }
        } else {
            while (!(newUsersIndex === newUsers.length && oldActiveUsersIndex === oldActiveUsers.length)) {
                if (newUsersIndex === newUsers.length && oldActiveUsersIndex !== oldActiveUsers.length) {
                    //新用户索引结束
                    obj.time = oldActiveUsers[oldActiveUsersIndex].years + type;
                    obj.userCount = OldCount;
                    obj.newUserCount = 0;
                    obj.oldUserCount = OldCount;
                    obj.oldActiveCount = oldActiveUsers[oldActiveUsersIndex].counts;
                    obj.oldRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.oldUserCount) * 100).toFixed(2);
                    obj.allRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                    table.push(obj);
                    oldActiveUsersIndex++;
                } else if (newUsersIndex !== newUsers.length && oldActiveUsersIndex === oldActiveUsers.length) {
                    //老用户索引结束
                    obj.time = newUsers[newUsersIndex].years + type;
                    obj.userCount = OldCount + newUsers[newUsersIndex].counts;
                    obj.newUserCount = newUsers[newUsersIndex].counts;
                    obj.oldUserCount = OldCount;
                    OldCount = OldCount + newUsers[newUsersIndex].counts;//统计出总数
                    obj.oldRate = 0;
                    obj.oldActiveCount = 0;
                    obj.allRate = ((newUsers[newUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                    table.push(obj);
                    newUsersIndex++;
                } else {
                    var y1 = parseInt(newUsers[newUsersIndex].years)
                    var y2 = parseInt(oldActiveUsers[oldActiveUsersIndex].years)
                    var compare = 0;
                    if(y1 < y2) {
                        compare = -1
                    } else if (y1 > y2) {
                        compare = 1
                    }
                    if (compare === -1) {
                        //如果为-1 则表示 新'时间比老'时间早
                        obj.time = newUsers[newUsersIndex].years + type;
                        obj.userCount = OldCount + newUsers[newUsersIndex].counts;
                        obj.newUserCount = newUsers[newUsersIndex].counts;
                        obj.oldUserCount = OldCount;
                        obj.oldActiveCount = 0;
                        obj.oldRate = 0;
                        OldCount = OldCount + newUsers[newUsersIndex].counts;//统计出总数
                        obj.allRate = ((newUsers[newUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                        table.push(obj);
                        newUsersIndex++;
                    } else if (compare === 0) {
                        obj.time = newUsers[newUsersIndex].years + type;
                        obj.userCount = OldCount + newUsers[newUsersIndex].counts;
                        obj.newUserCount = newUsers[newUsersIndex].counts;
                        obj.oldUserCount = OldCount;
                        obj.oldActiveCount = oldActiveUsers[oldActiveUsersIndex].counts;
                        obj.oldRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.oldUserCount) * 100).toFixed(2);
                        OldCount = OldCount + newUsers[newUsersIndex].counts;//统计出总数
                        obj.allRate = ((oldActiveUsers[oldActiveUsersIndex].counts + newUsers[newUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                        table.push(obj);
                        newUsersIndex++;
                        oldActiveUsersIndex++;
                    } else {
                        obj.time = oldActiveUsers[oldActiveUsersIndex].years + type;
                        obj.userCount = OldCount + 0;
                        obj.newUserCount = 0;
                        obj.oldUserCount = OldCount;
                        obj.oldActiveCount = oldActiveUsers[oldActiveUsersIndex].counts;
                        obj.oldRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.oldUserCount) * 100).toFixed(2);
                        obj.allRate = ((oldActiveUsers[oldActiveUsersIndex].counts / obj.userCount) * 100).toFixed(2);
                        table.push(obj);
                        oldActiveUsersIndex++;
                    }
                }
            }
        }
    }
    setTableView(table);
}
//比较日期
function compareDays (time, otherTime) {
    if(type == '日') {
        var t1 = new Date(time);
        var t2 = new Date(otherTime);
        if(t1 < t2) {
            return -1
        } else if (t1 == t2) {
            return 0
        } else {
            return 1
        }
    }
}
//比较月和周
function compareTime(time, otherTime) {
    var y1 = parseInt(time.split('-')[0]);
    var y2 = parseInt(otherTime.split('-')[0]);
    if(y1 < y2) {
        //前面的年小于后面的年
        return -1
    } else if (y1 > y2) {
        return 1
    } else {
        var t1 = parseInt(time.split('-')[1]);
        var t2 = parseInt(otherTime.split('-')[1]);
        if(t1 < t2) {
            //前面的年小于后面的年
            return -1
        } else if (t1 > t2) {
            return 1
        } else {
            return 0
        }
    }
}
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
//设置table
function setTableView(table) {
    $table.bootstrapTable('load', table);
}

