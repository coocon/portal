define(function(require, exports, module) {

    return function() {
        return String(+new Date).split('').sort(function() {
            return Math.random() - .5;
        }).join('');
    }

});
