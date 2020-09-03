/**
 * Created by caimb on 2017/7/1.
 */

function getElements(formId) {
    var form = document.getElementById(formId);
    var elements = new Array();
    var tagElements = form.getElementsByTagName('input');
    for (var j = 0; j < tagElements.length; j++){
        elements.push(tagElements[j]);

    }
    return elements;
}

//获取单个input中的【name,value】数组
function inputSelector(element) {
    if (element.checked)
        return [element.name, element.value];
}

function input(element) {
    switch (element.type.toLowerCase()) {
        case 'submit':
        case 'hidden':
        case 'password':
        case 'text':
            return [element.name, element.value];
        case 'checkbox':
        case 'radio':
            return inputSelector(element);
    }
    return false;
}
//组合URL
function serializeElement(element) {
    var method = element.tagName.toLowerCase();
    var parameter = input(element);

    if (parameter) {
        var key = encodeURIComponent(parameter[0]);
        if (key.length == 0) return;

        if (parameter[1].constructor != Array)
            parameter[1] = [parameter[1]];

        var values = parameter[1];
        var results = [];
        for (var i=0; i<values.length; i++) {
            results.push(key + '=' + encodeURIComponent(values[i]));
        }
        return results.join('&');
    }
}
//组合JSON
function serializeElementJSON(element,map) {
    var method = element.tagName.toLowerCase();
    var parameter = input(element);
    if (parameter) {
        var key = encodeURIComponent(parameter[0]);
        if (key.length == 0) return;

        if (parameter[1].constructor != Array)
            parameter[1] = [parameter[1]].join(",");

        var values = parameter[1];
        map.put(key,values);
        return map;
    }
}

//调用方法
function serializeForm(formId) {
    var elements = getElements(formId);
    var queryComponents = new Array();

    for (var i = 0; i < elements.length; i++) {
        var queryComponent = serializeElement(elements[i]);
        if (queryComponent)
            queryComponents.push(queryComponent);
    }

    return queryComponents.join('&');
}
//调用方法
function serializeFormJSON(formId) {
    var elements = getElements(formId);
    var queryComponents = new Array();

    var form = new Map();
    for (var i = 0; i < elements.length; i++) {
        serializeElementJSON(elements[i],form);
    }

    return form;
}

function Map() {
    this.obj = {};
    this.count = 0;
}
Map.prototype.put = function (key, value) {
    var oldValue = this.obj[key];
    if (oldValue == undefined) {
        this.count++;
    }
    this.obj[key] = value;
}
Map.prototype.get = function (key) {
    return this.obj[key];
}
Map.prototype.remove = function (key) {
    var oldValue = this.obj[key];
    if (oldValue != undefined) {
        this.count--;
        delete this.obj[key];
    }
}
Map.prototype.size = function () {
    return this.count;
}
Map.prototype.stringify = function () {
    return JSON.stringify(this.obj);
}
Map.prototype.getObj = function () {
    return this.obj;
}

function getPrefixPath() {
    var path = window.location.pathname;
    var paths = path.split("/");
    if(paths[0].length >0) {
        return paths[0];
    }else{
        return paths[1];
    }
}
function getSearchParams() {
    var params = window.location.search.replace("?","");
    if(params.indexOf("ivringApp") >=0) {
        var paramList = params.split("&");
        for(var i=0,size= paramList.length; i < size; ++i) {
            if(paramList[i].indexOf("ivringApp")>=0) {
                return paramList[i];
            }
        }
    }
}
function checkContainsPrefix(url,prefix) {
    var uris = url.split("/");
    if (uris[0] == (prefix)) {
        return true;
    }
    else if (uris[1] == (prefix)) {
        return true;
    }
    return false;
}