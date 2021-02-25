$(function () {

    refreshLinkTitle();


    function refreshLinkTitle(){

        var type = '';
        if(typeObj.id=='85f233a1-54b6-4ce0-90a7-4b30b8852d8f'){
            type = 'park';
        }else if(typeObj.id=='51768fc1-d488-41f3-9b60-4d169400f5a7'){
            type = 'notice';
        }else if(typeObj.id=='127dfb05-028c-4f0e-bd59-1a5c97eee8e3'){
            type = 'industry';
        }
        if(typeObj){
            $('.path-item-link').attr('href','/informationNews.html?type='+type).text(typeObj.title)

        }
    }
});