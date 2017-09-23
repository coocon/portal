define(function(require, module, exports) {
    var Form = require('./Form');

    return require('createClass')(function(form, config) {
        var self = this;
        this._super(form, config); //调用父类构造

        $.each("url type dataType timeout beforeSend success error complete submit getData clear hideError showError".split(" "), function() {
            if (config[this] != null) self[this] = config[this];
        });

        this.btn = this.form.find('.btn-submit');
        this.form.submit(function() {
            return false;
        });

        this.init();
    }, Form, {
        init: function() {
            var self = this;
            this.btn.tap(function() { //点击注册按钮登录
                self.submit();
            });
            this.inputs.keypress(function(e) { //输入框按下enter键也触发登录
                if (e.keyCode === 13) {
                    self.submit();
                    $(this).blur();
                }
            });
            this.btn.on('webkitAnimationEnd animationend', function() {
                $(this).removeClass('form-error-shake');
            });
        },
        beforeSend: function() {
            if (this.loading) return false;
            this.loading = true;
            this.btn.addClass('btn-loading');
            this.hideError();
        },
        error: function() {
            this.showError('服务器错误，请稍后再试');
        },
        complete: function() {
            this.loading = false;
            this.btn.removeClass('btn-loading');
        },
        hideError: function() {
            this.errArea && this.errArea.hide();
        },
        showError: function(msg, validErr) {
            if (!validErr) {
                if (!this.errArea) {
                    this.errArea = $('<div class="form-err-tip"></div>').insertAfter(this.btn.parent());
                }
                if (msg == '用户不存在') {
                    msg += ' | <a href="/accounts?phone=' + this.inputs.filter('[name=phone]').val() + '">立即注册</a>';
                }
                this.errArea.html('错误：' + msg).show();
            }
            this.btn.addClass('form-error-shake');
        },
        clear: function(sel) {
            var filter;
            if (sel) {
                filter = $.map(sel.split(/\s*,\s*/), function(name) {
                    return '[name=\'' + name + '\']';
                }).join(', ');
                this.inputs.filter(filter).val('').blur();
            } else this.inputs.val('').blur();
        }
    });
});
