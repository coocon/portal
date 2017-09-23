define(function(require, module, exports) {

    var T = require('utils');

    // 正则的字符串
    var PATTERN = {
        url: "(?:https?://)?" +
            "(?:(?![\\-_])[\\\w\\-\u4e00-\u9fa5]{1,63}\\.)+" +
            "[A-Za-z0-9]{2,}" +
            "(?::[0-9]{1,4})?" +
            "(?:/[^\\\s]*)*",
        //支持中文域名邮箱
        email: "(?![\\-_.])[\\\w\\-.]+@(?:(?![\\-_])[\\\w\\-\u4e00-\u9fa5]{1,63}\\.)+[A-Za-z0-9]{2,}",

        phone: "\\+?[0-9]+-?[0-9]{3,18}",

        cn: "[\u4e00-\u9fa5]+",

        chinaName: "[\u4e00-\u9fa5]{2,7}(?:\u00B7[\u4e00-\u9fa5]{2,7}){0,2}",

        mobile: "(?:12593|12520|10193|17900|17911|17951|125930|125200|101930|179000|179110|179510|\\+?86)?" +
            "1" +
            "[34578]" +
            "[0-9]{9}",

        idcard: "[xX0-9]{15,18}",
        qq: "[0-9]{5,10}",
        number: "[0-9]+(?:\\.[0-9]+)?",
        version: "[0-9a-zA-Z]+(?:\\.[0-9a-zA-Z]+)*",
        pinyin: "[a-zA-Z]+"
    };

    var ret = {
        pattern: PATTERN
    };

    $.each(PATTERN, function(key, pattern) {
        ret[key] = new RegExp(pattern, 'g');
        ret[T.camelCase('is-' + key)] = function(str) {
            return new RegExp('^' + pattern + '$').test(str);
        };
    });

    return ret;
});
