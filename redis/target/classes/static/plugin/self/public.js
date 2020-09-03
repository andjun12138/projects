var __public = {};

function formatNumber (n) {
    var str = n.toString();
    return str[1] ? str : '0' + str;
}

// forEach 简单兼容
if (Array.prototype.forEach === undefined) {
    if (Object.defineProperty !== undefined) {
        Object.defineProperty(Array.prototype, 'forEach', {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function (callback) {
                if (callback === undefined || typeof callback !== 'function') {
                    return 0
                }
                var _self = this;
                for (var index in _self) {
                    if (_self.hasOwnProperty(index) && !isNaN(index)) {
                        callback(_self[index], index);
                    }
                }
            }
        });
    } else {
        Array.prototype.forEach = function (callback) {
            if (callback === undefined || typeof callback !== 'function') {
                return 0
            }
            var _self = this;
            for(var index in _self) {
                if (!isNaN(index)) {
                    callback(_self[index], index);
                }
            }
        }
    }
}

// Object.keys简单兼容
if (Object.keys === undefined) {
    if (Object.defineProperty !== undefined) {
        Object.defineProperty(Object, 'keys', {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function(obj) {
                if (obj !== Object(obj))
                    throw new TypeError('Object.keys called on a non-object');
                var keyArr = [],attrName;
                for (attrName in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, attrName)){
                        keyArr.push(attrName);
                    }
                }
                return keyArr;
            }
        });
    } else {
        Object.keys = (function () {
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function (obj) {
                if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

                var result = [];

                for (var prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) result.push(prop);
                }

                if (hasDontEnumBug) {
                    for (var i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
                    }
                }
                return result;
            }
        })();
    }
}

// object.assign 简单兼容
if (Object.assign === undefined) {
    if (Object.defineProperty !== undefined) {
        Object.defineProperty(Object, 'assign', {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function(target) {
                if (getVariableType(target) !== 'object') {
                    throw new TypeError('Object.assign called on a non-object');
                }
                var result = target;
                var index = 1;
                var stSave = null;
                while (index++ < arguments.length) {
                    stSave = arguments[index];
                    if (getVariableType(stSave) === 'object') {
                        Object.keys(stSave).forEach(function (key) {
                            if (stSave.hasOwnProperty(key)) {
                                result[key] = stSave[key];
                            }
                        });
                    }
                }
                return result;
            }
        });
    } else {
        Object.assign = function(target) {
            if (getVariableType(target) !== 'object') {
                throw new TypeError('Object.assign called on a non-object');
            }
            var result = target;
            var index = 1;
            var stSave = null;
            while (index++ < arguments.length) {
                stSave = arguments[index];
                if (getVariableType(stSave) === 'object') {
                    Object.keys(stSave).forEach(function (key) {
                        if (stSave.hasOwnProperty(key)) {
                            result[key] = stSave[key];
                        }
                    });
                }
            }
            return result;
        }
    }
}

// 用于返回对象数组中每个子对象中特定属性的合并字符串
if (Array.prototype.getAttrString === undefined) {
    if (Object.defineProperty !== undefined) {
        Object.defineProperty(Array.prototype, 'getAttrString', {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function (attrName) {
                var result = '';
                this.forEach(function (item) {
                    if (result.length === 0) {
                        result += item[attrName];
                    } else {
                        result += ',' + item[attrName];
                    }
                });
                return result;
            }
        });
    } else {
        Array.prototype.getAttrString = function (attrName) {
            var result = '';
            this.forEach(function (item) {
                if (result.length === 0) {
                    result += item[attrName];
                } else {
                    result += ',' + item[attrName];
                }
            });
            return result;
        };
    }
}

// 根据特定字段查找数组中的对应项，可返回对应项
if (Array.prototype.searchArrayObj === undefined) {
    if (Object.defineProperty !== undefined) {
        Object.defineProperty(Array.prototype, 'searchArrayObj', {
            enumerable: false,
            writable: false,
            configurable: false,
            value: function (str, attrName, isReturnItem) {
                var arr = this;
                var result = -1;
                if (isReturnItem === undefined) {
                    isReturnItem = false;
                }
                for (var index in arr) {
                    if (!isNaN(index)) {
                        var shortTimeSave = (attrName !== undefined) ? arr[index][attrName] : arr[index];
                        if (shortTimeSave == str) {
                            if (isReturnItem) {
                                result = arr[index];
                            } else {
                                result = index;
                            }
                            break
                        }
                    }
                }
                return result;
            }
        })
    } else {
        // 查询数组对象
        Array.prototype.searchArrayObj = function (str, attrName, isReturnItem) {
            var arr = this;
            var result = -1;
            var index;
            if (isReturnItem === undefined) {
                isReturnItem = false;
            }
            for (index in arr) {
                if (!isNaN(index)) {
                    var shortTimeSave = (attrName !== undefined) ? arr[index][attrName] : arr[index];
                    if (shortTimeSave === str) {
                        if (isReturnItem) {
                            result = arr[index];
                        } else {
                            result = index;
                        }
                        break
                    }
                }
            }
            return result;
        };
    }
}

// 数值过滤
function valueFilter(value, defaultValue) {
    return (value !== undefined && value !== null) ? value : (defaultValue !== undefined) ? defaultValue : '';
}

// 简略的二次分装ajax
function NewAjax() {
    this.init();
}

NewAjax.prototype.init = function (callback) {
    var self = this;
    // 获取版本号input
    var oVersionInputNode = $('#project-env').eq(0);
    // 获取版本号
    var sVersion = oVersionInputNode.val();
    if (sVersion.indexOf('${') > -1) {
        sVersion = null;
    }
    // 用于防止new实例时重复调用
    self.domainConfig = self.__proto__.domainConfig;
    if (!(!!self.domainConfig)){
        $.ajax({
            url: '/static/assets/json/config.json',
            type: 'GET',
            async: false,
            contentType: 'application/json',
            dataType: 'json',
            success: function (res) {
                if (sVersion) {
                    res.model = sVersion;
                }
                // 记录到原型上
                self.__proto__.domainConfig = self.domainConfig = res;
                if (callback) {
                    callback();
                }
            },
            error: function (err) {
                console.log('ajax error:', err);
            }
        });
    } else if (callback) {
        callback();
    }
};
NewAjax.prototype.sendRequest = function () {
    var self = this;
    var option = self.options;
    var url = option.url;
    // 域名类型
    var domainType = self.domainType;
    // 域名配置数据
    var domainConfig = self.domainConfig;
    option.url = '//' + domainConfig.children[domainType] + '.' + domainConfig.main[domainConfig.model] + url;
    // 统一添加xhr参数
    if (!option.xhrFields) {
        option.xhrFields = {
            withCredentials: true
        };
    }
    // 处理页面重定向
    if (typeof option.success === "function") {
        var stSave = option.success;
        option.success = function (res) {
            if (res.status === 403) {
                window.location.href = '/f/login.html?pc=true';
            } else if (res.status === 408) {
                __layer.msg('用户访问权限不足，请联系技术人员进行处理!');
            } else {
                stSave(res);
            }
        }
    }
    $.ajax(option);
};
NewAjax.prototype.get = function (domainType, options) {
    if ((domainType !== '' && domainType !== 0 && !domainType) && (options !== '' && options !== 0 && !options)) {
        console.error('get error:', '传入参数不能为空');
        return 0;
    }
    options.type = 'GET';
    this.domainType = domainType;
    this.options = options;
    this.request();
};
NewAjax.prototype.post = function (domainType, options) {
    if ((domainType !== '' && domainType !== 0 && !domainType) && (options !== '' && options !== 0 && !options)) {
        console.error('get error:', '传入参数不能为空');
        return 0;
    }
    options.type = 'POST';
    this.domainType = domainType;
    this.options = options;
    this.request();
};
NewAjax.prototype.request = function () {
    this.init(this.sendRequest.bind(this));
};
NewAjax.prototype.getDomain = function (domainType) {
    var config = null;
    if(domainType === undefined) {
        domainType = 'default';
    }
    if (getVariableType(domainType) !== 'string') {
        console.error('getDomain: 参数需为string类型');
        return 0;
    }
    config = this.domainConfig;
    return '//' + config.children[domainType] + '.' + config.main[config.model];
};

// 存储用户信息
function SaveUserInfo(data) {
    this.data = data;
}
SaveUserInfo.prototype.getData = function () {
    return this.data;
};

// session检测
function windowOpenStatus(callback) {
    if (window.sessionStorage === undefined) {
        console.error('当前浏览器版本不支持sessionStorage');
        return 0;
    }
    if (callback === undefined || typeof callback !== 'function') {
        return 0;
    }
    var session = window.sessionStorage;
    if (session.getItem('open')) {
        // 刷新页面
        callback(false);
    } else {
        // 新开页面
        callback(true);
        session.setItem('open', 'true');
    }
}

// 页面关闭前监听
function windowBeforeUnload(callback) {
    window.onbeforeunload = function (event) {
        event = event || window.event;
        if (callback) {
            callback(event);
        }
    };
}

// 页面关闭监听
function windowUnload(callback) {
    window.onunload = function (event) {
        if (callback) {
            callback();
        }
        return true;
    };
}

/* storage */
__public.storage = {};
// 存储工厂函数
__public.storage.createStorageSaveHandler = function (type) {
    return function (attrName, data) {
        if (window[type] === undefined) {
            console.error('当前浏览器版本不支持' + type);
            return 0;
        }
        var storage = window[type];
        if (data !== undefined) {
            if (data !== null) {
                storage.setItem(attrName, (typeof data === "object") ? JSON.stringify(data) : String(data));
            } else {
                storage.removeItem(attrName);
            }
        }
    };
};
// 读取工厂函数
__public.storage.createStorageGetHandler = function (type) {
    return function (attrName) {
        if (window[type] === undefined) {
            console.error('当前浏览器版本不支持' + type);
            return null;
        } else if (typeof attrName !== "string") {
            console.error('参数attrName的类型需为string');
            return null;
        }
        var storage = window[type];
        return JSON.parse(storage.getItem(attrName));
    };
};
// 存储localStorage
__public.storage.saveToLocalStorage = __public.storage.createStorageSaveHandler('localStorage');
// 存储sessionStorage
__public.storage.saveToSessionStorage = __public.storage.createStorageSaveHandler('sessionStorage');
// 读取LocalStorage
__public.storage.getLocalStorage = __public.storage.createStorageGetHandler('localStorage');
// 读取session
__public.storage.getSessionStorage = __public.storage.createStorageGetHandler('sessionStorage');

// 存储缓存localStorage
function saveToLocalStorage(attrName, data) {
    if (window.localStorage === undefined) {
        console.error('当前浏览器版本不支持localStorage');
        return 0;
    }
    var localSave = window.localStorage;
    if (data !== undefined) {
        if (data !== null) {
            localSave.setItem(attrName, (typeof data === "object") ? JSON.stringify(data) : String(data));
        } else {
            localSave.removeItem(attrName);
        }
    }
}

// 获取localStorage
function getLocalStorage(attrName) {
    if (window.localStorage === undefined) {
        console.error('当前浏览器版本不支持localStorage');
        return null;
    } else if (typeof attrName !== "string") {
        console.error('参数attrName的类型需为string');
        return null;
    }
    var localSave = window.localStorage;
    return JSON.parse(localSave.getItem(attrName));
}

// localStorage计数
function saveNewWindowNumber(isOpen) {
    if (window.localStorage === undefined) {
        console.error('当前浏览器版本不支持localStorage');
        return 0
    }
    if (isOpen === undefined) {
        isOpen = true;
    }
    var local = window.localStorage;
    var number = null;
    if (local.getItem('windowIndex') !== null) {
        number = (isOpen) ? parseInt(local.getItem('windowIndex')) + 1 : parseInt(local.getItem('windowIndex')) - 1;
    } else {
        number = (isOpen) ? 1 : 0;
    }
    local.setItem('windowIndex', String(number));
}

// webSocket
function SOCKET(userId) {
    var headURl ='wss://websocket.hnesp.com?';
    //var headURl ='ws://10.0.20.3:8288/?';

    //宇昂的
    //var headURl = 'ws://10.0.20.37:9188?';
    //线上测试环境
    // var headURl ='ws://120.79.131.65:9188?';
    //线上生产环境
    // var headURl ='ws://120.79.131.65:8188?';
    // 存储this
    var _this = this;
    // 定义socket
    var socket = null;
    // 是否正在链接
    var bIsOnLine = false;
    // 定义是否正常断开链接
    var isNormalOperation = false;
    // 存储open监听方法
    var openCallbackArr = [];
    // 存储message监听方法
    var messageCallbackArr = [];
    // 存储error监听方法
    var errorCallbackArr = [];
    // 存储close监听方法E
    var closeCallbackArr = [];
    // 记录socket链接
    var socketUrl = null;
    // 存储重设置连接
    var reconnectUrl = null;
    // 记录重连数
    var reconnectNumber = 0;

    // 存储请求链接
    socketUrl = createUrl(userId);
    // 获取WebSocket
    socket = _this.init(socketUrl);
    // 初始化socket监听
    initSocketEvent();

    /*=== 内部功能函数 ===*/

    // 生成链接
    function createUrl(id) {
        if (id !== undefined && id !== '') {
            id = 'commonUser:' + id + '&'
        } else {
            id = '';
        }
        // 记录时间戳
        var timestamp = new Date().getTime();
        // 记录随机数
        var random = Math.round(Math.random() * Math.pow(10, 6));
        // 最终index
        var finalIndex = random.toString(16) + timestamp;
        // 返回链接
        return headURl + id + 'index:' + finalIndex;
    }

    // 连接重连
    function socketReconnect() {
        // 清除旧socket 数据与方法
        socket = null;
        // 重新连接
        socket = _this.init(socketUrl);
        // 初始化socket监听
        initSocketEvent();
    }

    // socket 监听初始化
    function initSocketEvent() {
        // socket开启时监听
        socket.onopen = function (event) {
            // 表示链接成功
            bIsOnLine = true;
            // 连上时归零
            reconnectNumber = 0;
            openCallbackArr.forEach(function (item) {
                if (item.type === 'all') {
                    item.method(event);
                } else {
                    item.method(event[item.type]);
                }
            })
        };
        // socket接受命令时监听
        socket.onmessage = function (event) {
            messageCallbackArr.forEach(function (item) {
                if (item.type === 'all') {
                    item.method(event);
                } else {
                    item.method(event[item.type]);
                }
            })
        };
        // socket报错时监听
        socket.onerror = function (event) {
            bIsOnLine = false;
            errorCallbackArr.forEach(function (item) {
                item.method(event);
            })
        };
        // socket 链接关闭监听
        socket.onclose = function () {
            var time = null;
            // 正常关闭
            if (isNormalOperation) {
                // 断开链接
                bIsOnLine = false;
                closeCallbackArr.forEach(function (item) {
                    item.method(socket.readyState);
                });
                socket = null;
                isNormalOperation = false;
            } else {
                if (reconnectNumber < 10) { // 非正常关闭
                    time = setTimeout(function () {
                        // 记录重连数
                        reconnectNumber += 1;
                        // 重连接
                        socketReconnect();
                        // 清除定时器
                        clearTimeout(time);
                        time = null;
                    }, 1000);
                } else {// 重连超过10次
                    // 断开链接
                    bIsOnLine = false;
                    socket = null;
                }
            }
        };
    }

    /*=== 外部方法 ===*/
    // send 方法
    _this.socketSend = function (message) {
        socket.send(message);
    };
    // close 方法
    _this.socketClose = function () {
        // 当链接时才执行断开
        if (bIsOnLine) {
            isNormalOperation = true;
            socket.close();
        }
    };
    // 收集 open 监听回调
    _this.setSocketOpenCallback = function (callback, attrName) {
        try {
            if (callback === undefined || typeof callback !== "function") {
                throw new Error('参数callback需为函数（function）');
            } else if (attrName !== undefined && typeof attrName !== "number" && typeof attrName !== 'string') {
                throw new Error('参数attrName需为数值或字符串');
            }
            var obj = {};
            obj.type = valueFilter(attrName, 'all');
            obj.method = callback;
            openCallbackArr.push(obj);
        } catch (err) {
            console.error('setSocketOpenCallback方法错误，error:' + err);
        }
    };
    // 收集 message 监听回调
    // attrName 用来分配推送消息里各类信息对应的回调函数
    _this.setSocketMessageCallback = function (callback, attrName) {
        try {
            if (callback === undefined || typeof callback !== "function") {
                throw new Error('参数callback需为函数（function）');
            } else if (attrName !== undefined && typeof attrName !== "number" && typeof attrName !== 'string') {
                throw new Error('参数attrName需为数值或字符串');
            }
            var obj = {};
            obj.type = valueFilter(attrName, 'all');
            obj.method = callback;
            messageCallbackArr.push(obj);
        } catch (err) {
            console.error('setSocketMessageCallback方法错误，error:' + err);
        }
    };
    // 收集 error 监听回调
    _this.setSocketErrorCallback = function (callback) {
        try {
            if (callback === undefined || typeof callback !== "function") {
                throw new Error('参数callback需为函数（function）');
            }
            var obj = {};
            obj.method = callback;
            errorCallbackArr.push(obj);
        } catch (err) {
            console.error('setSocketErrorCallback方法错误，error:' + err);
        }
    };
    // 收集 close 监听回调
    _this.setSocketCloseCallback = function (callback) {
        try {
            if (callback === undefined || typeof callback !== "function") {
                throw new Error('参数callback需为函数（function）');
            }
            var obj = {};
            obj.method = callback;
            closeCallbackArr.push(obj);
        } catch (err) {
            console.error('setSocketCloseCallback方法错误，error:' + err);
        }
    };
    // set 新socket 连接
    _this.setSocketNewUrl = function (str, isUrl) {
        try {
            if (str === undefined) {
                throw new Error('参数str不能为undefined');
            } else if (typeof str !== "number" && typeof str !== "string") {
                throw new Error('参数str需为数值或字符串');
            } else if (isUrl !== undefined && typeof isUrl !== "boolean") {
                throw new Error('参数isUrl需为Boolean类型');
            }
            if (isUrl === undefined) {
                isUrl = false;
            }
            reconnectUrl = (isUrl) ? str : createUrl(str);
        } catch (err) {
            console.error('setSocketNewUrl方法错误，error:' + err);
        }
    };
    // 重启连接
    _this.restartSocket = function () {
        // 若新设置的链接与上一个链接不同
        if (reconnectUrl !== null && reconnectUrl !== socketUrl) {
            // 修改链接
            socketUrl = reconnectUrl;
        }
        if (socket) {
            // 关闭socket
            _this.socketClose();
        }
        // 重启socket
        socketReconnect();
    }
}
// new socket
SOCKET.prototype.init = function (url) {
    // 兼容谷歌、火狐
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    return new WebSocket(url);
};

// localStorage监听
function storageEvent(callback) {
    var storage = window.localStorage;
    window.addEventListener('storage', function () {
        if (callback) {
            //storage.getItem('user')
            callback(event.key, storage);
        }
    });
}

// 上传文件
function uploadFile (files, callback) {
    if (files.length == 0) return; //如果文件为空
    var formData = new FormData();
    for (var i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }
    new NewAjax({
        type: "POST",
        url: "/adjuncts/file_upload",
        data: formData,
        async: true,
        processData: false,
        contentType: false,
        success: function (res) {
            if (res.status === 200 && callback){
                callback(res.data.data_list);
            }
        },
        error: function (err) {
            console.error("上传文件:" + err);
        }
    });
}

// 检测浏览器版本
function BrowserType() {
    var userAgent = window.navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") < 0; //判断是否Safari浏览器
    var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Edge") < 0; //判断Chrome浏览器
    if (isIE) {
        var reIE = /MSIE\s\d+\.\d+/;
        if (reIE.test(userAgent)) {
            var str = userAgent.match(reIE)[0];
            var fIEVersion = Math.floor(Number(str.split(' ')[1]));
            if(fIEVersion === 7) {
                return "IE7";
            } else if(fIEVersion === 8) {
                return "IE8";
            } else if(fIEVersion === 9) {
                return "IE9";
            } else if(fIEVersion === 10) {
                return "IE10";
            } else if(fIEVersion === 11) {
                return "IE11";
            } else {
                return "0";
            }//IE版本过低
        } else {
            return null;
        }
    }//isIE end

    if (isFF) {
        return "FF";
    }
    if (isOpera) {
        return "Opera";
    }
    if (isSafari) {
        return "Safari";
    }
    if (isChrome) {
        return "Chrome";
    }
    if (isEdge) {
        return "Edge";
    }
    if (isIE11) {
        return "IE11"
    }
}

// 获取图片
function getAvatar (id) {
    return '/adjuncts/file_download/' + id;
}

// 时间规范
function formatTime(date, isOldMethods, model) {
    if (typeof date !== 'string' && typeof date !== "number" && !(date instanceof Date)) {
        return 0;
    }
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    model = model || 'YYYY-MM-DD';
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    var result = '';
    if (isOldMethods === undefined) {
        isOldMethods = true;
    }
    if (isOldMethods) {
        var t1 = [year, month, day].map(formatNumber).join('-');
        var t2 = [hour, minute, second].map(formatNumber).join(':');
        result = t1 + ' ' + t2;
    } else {
        result = model.replace(/[^\u4e00-\u9fa5\/: -]{2,4}/g, function (timeStr) {
            if (/y/i.test(timeStr)) {
                // 年
                return String(year).slice(String(year).length - timeStr.length);
            } else if (/M/.test(timeStr)) {
                // 月，一定大写
                if (month > 9) {
                    return String(month).slice(String(month).length - timeStr.length);
                } else {
                    var monthStr = '0' + month;
                    return monthStr.slice(monthStr.length - timeStr.length);
                }
            } else if (/d/i.test(timeStr)) {
                // 日
                if (day > 9) {
                    return String(day).slice(String(day).length - timeStr.length);
                } else {
                    var dayStr = '0' + day;
                    return dayStr.slice(dayStr.length - timeStr.length);
                }
            } else if (/h/i.test(timeStr)) {
                // 时
                if (hour > 9) {
                    return String(hour).slice(String(hour).length - timeStr.length);
                } else {
                    var hourStr = '0' + hour;
                    return hourStr.slice(hourStr.length - timeStr.length);
                }
            } else if (/m/.test(timeStr)) {
                // 分
                if (minute > 9) {
                    return String(minute).slice(String(minute).length - timeStr.length);
                } else {
                    var minuteStr = '0' + minute;
                    return minuteStr.slice(minuteStr.length - timeStr.length);
                }
            } else if (/s/.test(timeStr)) {
                // 秒
                if (second > 9) {
                    return String(second).slice(String(second).length - timeStr.length);
                } else {
                    var secondStr = '0' + second;
                    return secondStr.slice(secondStr.length - timeStr.length);
                }
            }
        })
    }
    return result;
}


// 添加jquery的公共方法，需在jquery后引入
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
                callback();
            }
        });
    },
    // 规范时间
    formatTime: function (date, isOldMethods, model) {
        model = model || 'YYYY-MM-DD';
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        var result = '';
        if (isOldMethods === undefined) {
            isOldMethods = true;
        }
        if (isOldMethods) {
            var t1 = [year, month, day].map(formatNumber).join('-');
            var t2 = [hour, minute, second].map(formatNumber).join(':');
            result = t1 + ' ' + t2;
        } else {
            result = model.replace(/[^\/: -]{2,4}/g, function (timeStr) {
                if (/y/i.test(timeStr)) {
                    // 年
                    return String(year).slice(String(year).length - timeStr.length);
                } else if (/M/.test(timeStr)) {
                    // 月，一定大写
                    if (month > 9) {
                        return String(month).slice(String(month).length - timeStr.length);
                    } else {
                        var monthStr = '0' + month;
                        return monthStr.slice(monthStr.length - timeStr.length);
                    }
                } else if (/d/i.test(timeStr)) {
                    // 日
                    if (day > 9) {
                        return String(day).slice(String(day).length - timeStr.length);
                    } else {
                        var dayStr = '0' + day;
                        return dayStr.slice(dayStr.length - timeStr.length);
                    }
                } else if (/h/i.test(timeStr)) {
                    // 时
                    if (hour > 9) {
                        return String(hour).slice(String(hour).length - timeStr.length);
                    } else {
                        var hourStr = '0' + hour;
                        return hourStr.slice(hourStr.length - timeStr.length);
                    }
                } else if (/m/.test(timeStr)) {
                    // 分
                    if (minute > 9) {
                        return String(minute).slice(String(minute).length - timeStr.length);
                    } else {
                        var minuteStr = '0' + minute;
                        return minuteStr.slice(minuteStr.length - timeStr.length);
                    }
                } else if (/s/.test(timeStr)) {
                    // 秒
                    if (second > 9) {
                        return String(second).slice(String(second).length - timeStr.length);
                    } else {
                        var secondStr = '0' + second;
                        return secondStr.slice(secondStr.length - timeStr.length);
                    }
                }
            })
        }
        return result;
    },
    // 获取图片
    getAvatar: function (id) {
        return '/adjuncts/file_download/' + id;
    }
});

// 获取当前url参数
$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
};

var windowGlobalTxt = [];

function filterSensitiveWord (content) {
    var reg = null;
    for (var i = 0; i < windowGlobalTxt.length; i++) {
        reg = new RegExp(windowGlobalTxt[i], 'g');
        if (content.indexOf(windowGlobalTxt[i]) !== -1) {
            return content.replace(reg, '***');
         }
    }
    return content
}

// 用来判断是否存在敏感词，而不是替换
function filterSensitiveWordIsTrue(content) {
    var reg = null;
    for (var i = 0; i < windowGlobalTxt.length; i++) {
        reg = new RegExp(windowGlobalTxt[i], 'g');
        if (content.indexOf(windowGlobalTxt[i]) !== -1) {
            return true
        }
    }
    return false;
}

function getStyle (obj, name) {
    if (obj.currentStyle) {
        return obj.currentStyle[name];
    } else {
        return window.getComputedStyle(obj)[name];
    }
}

function startMove (obj, json, fnEnd) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var bStop = true;	// 假设:所有的值都已经到了
        for (var attr in json) {
            var curAttr = 0;
            if (attr === 'opacity') {
                curAttr = Math.round(parseFloat(getStyle(obj, attr)) * 100);
            } else if (attr.toLowerCase().indexOf('color') !== -1) {
                curAttr = json[attr];
            } else {
                curAttr = parseInt(getStyle(obj, attr));
            }
            var speed = (json[attr] - curAttr) / 6;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            if (curAttr !== json[attr]) {
                bStop = false;
            }
            if (attr === 'opacity') {
                obj.style.filter = 'alpha(opacity: ' + (curAttr + speed) + ')';
                obj.style.opacity = (curAttr + speed) / 100;
            } else if (attr.toLowerCase().indexOf('color') !== -1) {
                obj.style[attr] = json[attr];
            } else {
                obj.style[attr] = curAttr + speed + 'px';
            }
        }
        if (bStop) {
            clearInterval(obj.timer);
            obj.timer = null;

            if (fnEnd) fnEnd();
        }
    }, 30);
}

function resetIconAndStyleOfIndustry (oListNode) {
    var oChildrenNode = oListNode.children(),
        oNowChildNode = null,
        oNowImageNode = null,
        id = null,
        defaultHeight = Math.floor(100 / oChildrenNode.length),
        iconData = {
            '202151': '/static/assets/highLevel.png',
            '202053': '/static/assets/newTechnology.png',
            '202152': '/static/assets/newMaterial.png',
            '202153': '/static/assets/lifeDrug.png',
            '202214': '/static/assets/newEnergy.png',
            '202213': '/static/assets/newEnergyCar.png',
            '202215': '/static/assets/greenCarbon.png',
            '202156': '/static/assets/numberCreative.png',
            '202211': '/static/assets/aboutProducts.png'
        };
    oChildrenNode.each(function (index, node) {
        oNowChildNode = $(node);
        oNowImageNode = oNowChildNode.find('img').eq(0);
        id = oNowChildNode.data('id');
        oNowChildNode.css({
            height: defaultHeight + '%'
        });
        oNowImageNode.attr({
            src: iconData[id],
            alt: oNowChildNode.find('span').eq(0).text()
        });

    })
}

// 设置重要操作变量
function setMarkOfImportantOperation() {
    // 存在defineProperty
    if (Object.defineProperty !== undefined) {
        Object.defineProperty(window, 'importantOperation', {
            get: function () {
                return this.IMPORTANTOPERATION;
            },
            set: function (newVal) {
                if (this.bCanRecord) {
                    this.IMPORTANTOPERATION = newVal;
                    this.bCanRecord = false;
                }
            }
        })
    } else {
        window.importantOperation = false;
    }
}

// 用于设置 historyHref 属性
function historyHrefSetGetMethod(callback) {
    var obj = null;
    if (Object.defineProperty !== undefined) {
        Object.defineProperty(window, 'historyHref',{
            set: function (newVal) {
                this.__historyHref = newVal;
                if (callback) {
                    callback(newVal);
                } else {
                    window.location.href = newVal;
                }
            },
            get: function () {
                return this.__historyHref;
            }
        })
    } else {
        obj = {
            value: null,
            get href() {
                return this.value;
            },
            set href(newVal) {
                this.value = newVal;
                if (callback) {
                    callback(newVal);
                } else {
                    window.location.href = newVal;
                }
            }
        };
        window.historyHref = obj;
    }
}

// 设置重要操作的标记
function set_IMPORTANTOPERATION (bHasOperation) {
    window.bCanRecord = true;
    window.importantOperation = bHasOperation;
}

// 转换文件路径
function getObjectURL(file) {
    var url = null;
    if (!!window.createObjectURL) {
        url = window.createObjectURL(file);
    } else if (!!window.URL && !!window.URL.createObjectURL) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (!!window.webkitURL && window.webkitURL.createObjectURL) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

// 获取变量类型
function getVariableType(variable) {
    return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
}

// 判断用户是否在线
function isUserOnline(callback) {
    new NewAjax({
        url: '/f/judge_login',
        type: 'GET',
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        success: function (res) {
            if (callback) {
                callback(res);
            }
        },
        error: function (err) {
            console.error(err);
        }
    })
}

// 获取用户信息
function getUserInfo() {
    var storage = window.localStorage;
    return (storage.getItem('user') !== null) ? JSON.parse(storage.getItem('user')) : null;
}

function getCurrentUrlParams(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return '';
}

function getUrlParams(url,variable) {
    var query = url.split("?")[1];
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return '';
}

/**
 * 字符串替换方法，主要用于插入dom节点操作
 * @param str
 * @returns {string}
 */
function sprintf(str) {
    var args = arguments,
        rule = /%\w+%?/g,
        warpRule = /\s+/g,
        flag = true,
        i = 0,
        oData = {},
        aData = [];
    while (++i < args.length) {
        if (getVariableType(args[i]) === 'object') {
            oData = Object.assign(oData, args[i])
        } else if (getVariableType(args[i]) === 'array') {
            aData = aData.concat(args[i]);
        } else if (args[i] !== undefined) {
            aData.push(args[i]);
        }
    }
    str = str.replace(rule, function (replaceStr) {
        var stSave = (replaceStr.slice(-1) === '%') ? replaceStr.slice(1, -1) : replaceStr.slice(1);
        stSave = stSave.replace(warpRule, '');
        if (oData[stSave] !== undefined) {
            return oData[stSave]
        } else if (aData.length > 0){
            return aData.splice(0, 1)[0];
        } else {
            flag = false;
            return '';
        }
    });
    return flag ? str : '';
}

// 检测样式是否兼容
var isHaveCss = (function () {
    var div = document.createElement('div'),
        vendors = 'Ms O Moz Webkit'.split(' '),
        len = vendors.length;
    return function (prop) {
        // 若存在直接返回true
        if (prop in div.style) return true;
        prop = prop.replace(/^[a-z]/, function (val) {
            return val.toUpperCase();
        });
        while (len--) {
            if ((vendors[len] + prop) in div.style) {
                return true;
            }
        }
        return false;
    };
})();

/* cookie */
__public.cookie = {};
__public.cookie.get = function (cookieName) {
    var rule = new RegExp('(^| )' + cookieName + '=[^;]*(;|$)');
    var cookie = document.cookie;
    var result = cookie.match(rule);
    return (!!result && result.length > 0) ? result[0] : '';
};
__public.cookie.set = function (cookieName, value, timeAge) {
    var date = null;
    var expires = null;
    if (!(!!timeAge) && getVariableType(timeAge) !== 'number') {
        timeAge = 60 * 60 * 1000;
    }
    // 设置过期
    if (timeAge < 0) {
        date = new Date(1);
    } else { // 正常设置
        date = new Date().getTime() + timeAge;
        date = new Date(date);
    }
    expires = date.toUTCString();
    document.cookie = cookieName + '=' + value + ';expires=' + date + ';';
};
