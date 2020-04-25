/**
 * 将form里面的内容序列化成json
 * 相同的checkbox用分号拼接起来
 * @param {dom} 指定的选择器
 * @param {obj} 需要拼接在后面的json对象
 * @method serializeJson
 * */
$.fn.serializeJson = function (otherString) {
    var serializeObj = {},
        array = this.serializeArray();
    $(array).each(function () {
        if (serializeObj[this.name]) {
            serializeObj[this.name] += ';' + this.value;
        } else {
            serializeObj[this.name] = this.value;
        }
    });

    if (otherString != undefined) {
        var otherArray = otherString.split(';');
        $(otherArray).each(function () {
            var otherSplitArray = this.split(':');
            serializeObj[otherSplitArray[0]] = otherSplitArray[1];
        });
    }
    return serializeObj;
};

/**
 * 将josn对象赋值给form
 * @param {dom} 指定的选择器
 * @param {obj} 需要给form赋值的json对象
 * @method serializeJson
 * */
$.fn.setForm = function (jsonValue) {
    var obj = this;
    $.each(jsonValue, function (name, ival) {
        var $oinput = obj.find("input[name=" + name + "]");
        if ($oinput.attr("type") == "checkbox") {
            if (ival !== null) {
                var checkboxObj = $("[name=" + name + "]");
                var checkArray = ival.split(";");
                for (var i = 0; i < checkboxObj.length; i++) {
                    for (var j = 0; j < checkArray.length; j++) {
                        if (checkboxObj[i].value == checkArray[j]) {
                            checkboxObj[i].click();
                        }
                    }
                }
            }
        }
        else if ($oinput.attr("type") == "radio") {
            $oinput.each(function () {
                var radioObj = $("[name=" + name + "]");
                for (var i = 0; i < radioObj.length; i++) {
                    if (radioObj[i].value == ival) {
                        radioObj[i].click();
                    }
                }
            });
        }
        else if ($oinput.attr("type") == "textarea") {
            obj.find("[name=" + name + "]").html(ival);
        }
        else {
            if (obj.find("[name=" + name + "]").attr("multiple") == "multiple") {               
                obj.find("[name=" + name + "]").val(ival.split(',')).trigger("change");
            }
            obj.find("[name=" + name + "]").val(ival);
        }
    })
}






//参数设置
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

//加密方法   
function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

//解密方法
function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c1 == -1);
        if (c1 == -1)
            break;
        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        }
        while (i < len && c2 == -1);
        if (c2 == -1)
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        }
        while (i < len && c3 == -1);
        if (c3 == -1)
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        }
        while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

//String扩展
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

//String扩展
String.format = function () {
    if (arguments.length == 0)
        return null;

    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}


function milliFormat(s) {//添加千位符并保留两位小数
    var v = parseFloat(s);
    var symbol = "";
    if (v < 0) symbol = "-";
    s = Math.abs(v).toString();
    if (/[^0-9\.]/.test(s)) return "invalid value";
    s = s.replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s)) {
        s = s.replace(re, "$1,$2");
    }
    s = s.replace(/,(\d\d)$/, ".$1");
    return symbol + s.replace(/^\./, "0.");
}

function fmoney(s, n) {
    /*
     * 参数说明：
     * s：要格式化的数字
     * n：保留几位小数
     * */
    var result = 0;
    if (n != 0) {
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
        t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        result = t.split("").reverse().join("") + "." + r;
        result = CheckFMoneyResult(result);
        return result;
    }
    else {

        s = Math.round(parseFloat(s + "")).toString();
        var l = s.split("").reverse();            
        t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        result = t.split("").reverse().join("");
        result= CheckFMoneyResult(result);
        return result;
    }
        
}

function CheckFMoneyResult(r) {
    var result = r;
    if (r.length > 0 && r.substring(0, 1) == ",") {
        result = r.substr(1, r.length);
    }
    if (r.length > 1 && r.substring(0, 1) == "-" && r.substring(1, 2) == ",") {
        result ="-"+ r.substr(2, r.length);
    }
    return result;
}


function number_format(number, decimals, dec_point, thousands_sep, roundtag) {
    /*
    * 参数说明：
    * number：要格式化的数字
    * decimals：保留几位小数
    * dec_point：小数点符号
    * thousands_sep：千分位符号
    * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
    * */
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    roundtag = roundtag || "ceil"; //"ceil","floor","round"
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {

            var k = Math.pow(10, prec);
            console.log();

            return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes();
    return currentdate;
}

//获取URL参数
function getQueryString(name) {
    var url = location.search; //获取url中含"?"符后的字串

    var theRequest = new Object();

    if (url.indexOf("?") != -1) {

        var str = url.substr(1);

        strs = str.split("&");

        for (var i = 0; i < strs.length; i++) {

            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);

        }

    }
    return theRequest[name];
}  



//---------------------------------------------------
// 日期格式化
// 格式 YYYY/yyyy/YY/yy 表示年份
// MM/M 月份
// W/w 星期
// dd/DD/d/D 日期
// hh/HH/h/H 时间
// mm/m 分钟
// ss/SS/s/S 秒
//---------------------------------------------------
Date.prototype.format = function (formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

    str = str.replace(/MM/, this.getMonth() > 9 ? this.getMonth().toString() : '0' + this.getMonth());
    str = str.replace(/M/g, this.getMonth());

    str = str.replace(/w|W/g, Week[this.getDay()]);

    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());

    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());

    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());

    return str;
}





function newGuid(split) {
    split = split || ""; 
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += split;
    }
    return guid;
}


function GetAjaxValue(command, parameter, successfn, errorfn, sync) {  
    if (sync != false) sync = true;
    var formdata = "BindCommand=" + command + "&" + parameter;
    $.ajax({
        type: "POST",
        async: sync,
        timeout: 0,
        url: "/InternalAPI/BindData/GetValue",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },
        data: formdata,
        success: function (response) {
            if (response.Status == "Success") {
                if (successfn != null) {
                    successfn(response.Data);
                }
            }
            else {
                if (errorfn != null) {
                    errorfn(response.Message);
                }
                else {
                    $.toast({
                        heading: 'Error',
                        text: response.Message,
                        showHideTransition: 'slide',
                        icon: 'error',
                        position: 'mid-center',
                        stack: true
                    });
                }

            }
        },
        failure: function (response) {
            errorfn(response);
            $.toast({
                heading: 'Error',
                text: response,
                showHideTransition: 'slide',
                icon: 'error',
                position: 'mid-center',
                stack: true
            });

        }
    });
}

function GetAjaxValueF(command, parameter, successfn, errorfn, sync) {
    if (sync != false) sync = true;
    var formdata = "BindCommand=" + command + "&" + parameter;
    $.ajax({
        type: "POST",
        async: sync,
        timeout: 0,
        url: "/InternalAPI/BindData/GetValueF",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },
        data: formdata,
        success: function (response) {
            if (response.Status == "Success") {
                if (successfn != null) {
                    successfn(response.Data);
                }
            }
            else {
                if (errorfn != null) {
                    errorfn(response.Message);
                }
                else {
                    $.toast({
                        heading: 'Error',
                        text: response.Message,
                        showHideTransition: 'slide',
                        icon: 'error',
                        position: 'mid-center',
                        stack: true
                    });
                }

            }
        },
        failure: function (response) {
            errorfn(response);
            $.toast({
                heading: 'Error',
                text: response,
                showHideTransition: 'slide',
                icon: 'error',
                position: 'mid-center',
                stack: true
            });

        }
    });
}

function ExecuteAjaxCommand(command, parameter, successfn, errorfn,sync) {

    if (sync!= false) sync = true;
    var elements = command.split('.');    
    if (elements.length < 2) throw new DOMException("Invalid Command");
    var formdata = "ModuleName=" + elements[0] + "&CommandName=" + elements[1] + "&" + parameter;
    $.ajax({
        type: "POST",
        async: sync,
        timeout:0,
        url: "/InternalAPI/General/Do",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },
        data: formdata,
        success: function (response) {
            if (response.Status == "Success") {
                if (successfn != null)
                    successfn(response.Data);

            }
            else {
                if (errorfn != null) {
                    errorfn(response.Message);
                }
                else {
                    CloseLoading();
                    $.toast({
                        heading: 'Error',
                        text: response.Message,
                        showHideTransition: 'slide',
                        icon: 'error',
                        position: 'mid-center',
                        stack: true
                    });
                }

            }
        },
        failure: function (response) {
            CloseLoading();
            errorfn(response);
            $.toast({
                heading: 'Error',
                text: response,
                showHideTransition: 'slide',
                icon: 'error',
                position: 'mid-center',
                stack: true
            });

        }
    });
}


function ExecuteAjaxCommandF(command, filterparameter, successfn, errorfn,sync) {

    if (sync!= false) sync = true;
    var elements = command.split('.');
    if (elements.length < 2) throw new DOMException("Invalid Command");
    var formdata = "ModuleName=" + elements[0] + "&CommandName=" + elements[1] + "&" + filterparameter;
    $.ajax({
        type: "POST",
        async: sync,
        timeout: 0,
        url: "/InternalAPI/General/DoF",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },
        data: formdata,
        success: function (response) {
            if (response.Status == "Success") {

                if (successfn != null) {
                    successfn(response.Data);
                }

            }
            else {
                if (errorfn != null) {
                    errorfn(response.Message);
                }
                else {
                    CloseLoading();
                    $.toast({
                        heading: 'Error',
                        text: response.Message,
                        showHideTransition: 'slide',
                        icon: 'error',
                        position: 'mid-center',
                        stack: true
                    });
                }

            }
        },
        failure: function (response) {
            CloseLoading();
            errorfn(response);
            $.toast({
                heading: 'Error',
                text: response,
                showHideTransition: 'slide',
                icon: 'error',
                position: 'mid-center',
                stack: true
            });

        }
    });
}


var Dictionary = function () {
    this.elements = new Array();
    //Length of Dictionary
    this.length = function () {
        return this.elements.length;
    };
    //Check whether the Dictionary is empty
    this.isEmpty = function () {
        return (this.length() < 1);
    };
    //remove all elements from the Dictionary
    this.removeAll = function () {
        this.elements = new Array();
    };
    //get specify element of the dictionary
    this.element = function (index) {
        var rlt = null;
        if (index >= 0 && index < this.elements.length) {
            rlt = this.elements[index];
        }
        return rlt;
    }
    //check whether the Dictionary contains this key
    this.Exists = function (key) {
        var rlt = false;
        try {
            for (var i = 0, iLen = this.length(); i < iLen; i++) {
                if (this.elements[i].key == key) {
                    rlt = true;
                    break;
                }
            }
        }
        catch (ex) {
        }
        return rlt;
    };
    //check whether the Dictionary contains this value
    this.containsValue = function (value) {
        var rlt = false;
        try {
            for (var i = 0, iLen = this.length(); i < iLen; i++) {
                if (this.elements[i].value == value) {
                    rlt = true;
                    break;
                }
            }
        }
        catch (ex) {
        }
        return rlt;
    };
    //remove this key from the Dictionary
    this.remove = function (key) {
        var rlt = false;
        try {
            for (var i = 0, iLen = this.length(); i < iLen; i++) {
                if (this.elements[i].key == key) {
                    this.elements.splice(i, 1);
                    rlt = true;
                    break;
                }
            }
        }
        catch (ex) {
        }
        return rlt;
    };
    //add this key/value to the Dictionary,if key is exists,replace the value
    this.add = function (key, value) {
        this.remove(key);
        this.elements.push({
            key: key,
            value: value
        });
    };
    //add this key/value to the Dictionary,if key is exists,append value
    this.set = function (key, value) {
        var arr = this.getItem(key);
        if (arr != null) {
            if (typeof (arr) == "object") {
                arr.unshift.apply(arr, value);
                value = arr;
            }
            else {
                var array = [];
                array.push(arr);
                array.unshift.apply(array, value);
                value = array;
            }
            this.remove(key);
        }
        this.elements.push({
            key: key,
            value: value
        });
    }
    //get value of the key
    this.getItem = function (key) {
        var rlt = null;
        try {
            for (var i = 0, iLen = this.length(); i < iLen; i++) {
                if (this.elements[i].key == key) {
                    rlt = this.elements[i].value;
                    break;
                }
            }
        }
        catch (ex) {
        }
        return rlt;
    };
    //get all keys of the dictionary
    this.keys = function () {
        var arr = [];
        for (var i = 0, iLen = this.length(); i < iLen; i++) {
            arr.push(this.elements[i].key);
        }
        return arr;
    }
    //get all values of the dictionary
    this.values = function () {
        var arr = [];
        for (var i = 0, iLen = this.length(); i < iLen; i++) {
            arr.push(this.elements[i].value);
        }
        return arr;
    }
}


function Sleep(d) {
    for (var t = Date.now(); Date.now() - t <= d;);
}




function Base64() {

    // private property  
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding  
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding  
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding  
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding  
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}


function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}
function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}