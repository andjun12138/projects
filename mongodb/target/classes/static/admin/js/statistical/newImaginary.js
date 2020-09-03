/**
 * Created by mu-HUN on 2018/10/31.
 */
$(function() {
    var itemArray = ['intelligentEnterprisesNum','intelligentProductNum','intelligentCompleteMoney','incubationEnterprisesNum','incubationTeamNum','incubationAchievements','scienceLiteratureNum','scienceResourceDownload','crowdsourcedDemandNum','crowdsourcedClinchMoney', 'crowdsourcedProviderNum', 'crowdsourcedCaseNum', 'crowdsourcedExpertNum', 'exhibitionsNum'];
    var itemName = ['智能通关企业数','智能通关产品数','智能通关完成金额','创业孵化企业数','创业孵化团队数','创业孵化技术成果数','科技资源文献数','科技资源下载数','技术众包需求数','技术众包项目成交数','技术众包交易额','技术众包服务商数', '技术众包案例数', '技术众包专家数', '展会数量'];
    var dataId = imaginaryData.id
    var type = imaginaryData.type
    initPage();
    function initPage () {
        var table = $('#imaginaryTable');
        for (var i = 0; i < itemArray.length;i++) {
            var show = 0
            var item = itemArray[i]
            var imaginaryDataItem = imaginaryData[item] || 0
            var realDataItem = realData[item]
            var showDataItem = imaginaryDataItem + realDataItem
            var imaginary = 0;
            table.append('<div class="imaginary-data-item" id="'+itemArray[i]+'">' +
                '<div class="item-name">'+itemName[i]+'</div>' +
                '<div class="show-count">'+showDataItem+'</div>' +
                '<div class="actual-count">'+realDataItem+'</div>' +
                '<div class="imaginary-count">' +
                    '<input type="text" class="form-control imaginary-input" value="'+imaginaryDataItem+'"></div></div>')
        }
        $(document).on('change','.imaginary-input',function (e) {
            e.stopPropagation();
            var value
            if(!!$(this).val()) {
                value = parseInt($(this).val());
            } else {
                $(this).val(0)
                value = 0
            }
            var actual = parseInt($(this).parent().siblings('.actual-count').text());
            var show = $(this).parent().siblings('.show-count');
            show.text(value + actual);
            return
        }).on('input','.imaginary-input',function (e) {
            e.stopPropagation();
            var value
            if(!!$(this).val()) {
                value = parseInt($(this).val());
            } else {
                value = 0
            }
            var actual = parseInt($(this).parent().siblings('.actual-count').text());
            var show = $(this).parent().siblings('.show-count');
            show.text(value + actual);
            return
        }).on('click','#save',function (e) {
            e.stopPropagation();
            var postData = {}
            for (var j = 0; j < itemArray.length; j++) {
                var item = itemArray[j];
                postData[item] = $('#' + item + ' .imaginary-input').val()
            }
            if (dataId) {
                postData.id = dataId
            }
            var messageTitle = dataId ? '修改成功' : '新增成功';
            $.ajax({
                url: '/imaginaryManage/create_update',
                type: 'post',
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(postData),
                success: function (res) {
                    parent.window.refreshAndShowMessage({
                        title: messageTitle,
                        text: '',
                        type: 'success',
                        delay: 3000,
                        addclass: "stack-bottomright",
                        stack: stack_bottomright
                    });
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                }
            })
        })
    }
})
