define(function(require) {
    var utils = require('utils');
    var LazyLoad = require('LazyLoad');
    var createFrames = require('JS2CSSKeyframes');
    var Share = require('share');

    /*
    Share.init().share({
        title: '老虎金服',
        desc: '不去美国如何炒美股？注册立得100元！',
        img: utils.getAbsUrl('./images/wxshare.jpg'),
        url: utils.getAbsUrl('./')
    });
    */
    
    var index = '.lazy, .page-team, .page-invest, .page-honor, .page-brief, .page-mission, ';
    var aniSelect = ['.first', '.second', '.third', '.forth','.fifth'];
    var finalSel = index + aniSelect.join(',');
    LazyLoad($(finalSel), 0, function() {
        var aninodes = $(this).addClass('animated').find('[data-animate]');
        aninodes.each(function() {
            $(this).addClass($(this).attr('data-animate'))
                    .addClass('show');
        });
    });
    //移动端菜单折叠
    +function() { //菜单
        var menu = $('#menus'),
            fold = true;
        $('.menu_toggle').tap(function() {
            if (fold) {
                $(this).addClass('menu_open');
                menu.finish().slideDown(400);
            } else {
                $(this).removeClass('menu_open');
                menu.finish().slideUp(400);
            }
            fold = !fold;
            return false;
        });
        $(document).tap(function() {
            if (!fold) {
                $('.menu_toggle').trigger('tap');
            }
        });

        menu.tap(function(e) {
            e.stopPropagation();
        });

        var url = location.pathname;
        menu.children().each(function() {
            if ($(this).attr('href').replace(/\?.*/, '').replace('/', '') == url.replace('/', '')) {
                $(this).addClass('active');
                return false;
            }
        });
    }(); 

});
