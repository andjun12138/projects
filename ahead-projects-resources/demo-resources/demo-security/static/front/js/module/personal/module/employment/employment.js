$(function () {
    var personalMainObj = window._personal_main_;
    var FuncOfModelCommon = personalMainObj._model_common_;
    // 定义模块函数
    function PersonalEmployment() {
        var _this = this;
        // 初始化ajax
        var _ajax = new NewAjax();

        // 主体模块
        var oMainModel = $('#employment');

        /* 数据表格 */
        // 表格插件
        var oTable = null;
        // 父节点
        var oTableParent = oMainModel.find('#employment-table');
        // 表格数据
        var oTableData = null;

        /* 分页 */
        // 分页插件
        var oPage = null;
        // 父节点
        var oPageParent = oMainModel.find('#employment-page');
        // 存储每页的条数
        var nPageSize = 10;
        // 打开go按钮功能
        var canLift = true;
        // 当前页码
        var nNowPageNumber = 1;
        // 最大页码
        var nMaxPageNumber = null;

        _this.init = function () {
            initTable();
            getTableData();
        };

        // 获取列表数据
        function getTableData() {
            var config = {
                "pager":{
                    "current": nNowPageNumber,    //第几页
                    "size": nPageSize        //每页多少条数据
                },
                "sortPointer":{
                    "filed":"refresh_time",   //排序字段
                    "order":"DESC"          //排序规则
                }
            };
            _ajax.post('default', {
                url: '/employment/query',
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                data: JSON.stringify(config),
                success: function (res) {
                    console.log(res);
                },
                error: function (err) {
                    console.log(err);
                }
            })
        }

        // 修改
        function modifyData() {

        }

        // 删除
        function deleteData() {

        }

        /* 初始化表格 */
        /* 初始化表格 */
        function initTable() {
            oTableData = [];
            // 表格插件是否存在
            if (oTable) {
                // 需要重复调用
                oTable.setBaseStyle(oTableStyleConfig[sNowFuncModelName])
                    .setColOrder(oTableOrderConfig[sNowFuncModelName])
                    .setStartIndex((nNowPageNumber - 1) * nPageSize + 1)
                    .setTableData(oTableData);
            } else {
                oTable = new Table('assign-user-table');
            }
        }
    }
    // 函数继承
    PersonalEmployment.prototype = new FuncOfModelCommon();
    // 引用释放
    FuncOfModelCommon = null;
    // 调用主模块的模块注册方法
    personalMainObj.setMethodObj('employment', new PersonalEmployment());
});
