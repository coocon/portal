define(function(require, exports, module) {
    var imageReady=require('imageReady');

    return require('createClass')(function(wrap) {
        this.wrap = $(wrap);

        this.loadimg = this.wrap.find('.captcha-loading');
        this.img = this.wrap.find('.captcha-img');

        this.init();
    }, {
        init: function() {
            var self = this;

            this.update();
            this.img.on('tap', function() {
                self.update();
            });
        },
        update: function() {
            var self = this;
            $.ajax({
                url: '/api/v1/captcha',
                type: 'get',
                beforeSend: function() {
                    if (self.loading) return false;
                    self.loading = true;
                    self.loadimg.show();
                },
                success: function(ret) {
                    if (ret.is_succ) {
                        imageReady(ret.data.url,null,function(){
                            self.loadimg.hide();
                            self.img.attr('src', ret.data.url);
                        },function(){
                            self.loadimg.hide();
                        });
                    }else{
                        self.loadimg.hide();
                    }
                },
                error:function(){
                    self.loadimg.hide();
                },
                complete: function() {
                    self.loading = false;
                }
            })
        }
    });

});
