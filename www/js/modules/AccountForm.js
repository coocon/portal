define(function(require, exports, module) {
    var Form = require('./Form');

    /*!
     * @description 注册开户页面表单，继承自Form表单父类
     * @param {ELEMENT_NODE} elem
     * @param {Object} config
     */

    return require('createClass')(function(elem, config) {
        this._super(elem, config);

        this.btn = this.form.find('.submit');
        this.init();

    }, Form, {
        init: function() {
            var self = this;
            this.btn.tap(function() {
                self.submit();
            });
            this.btn.on('webkitAnimationEnd animationend', function() {
                $(this).removeClass('form-error-shake');
            });
        },
        showError: function(msg) {
            if (!this.errArea) {
                this.errArea = $('<div class="form-err-tip"></div>').insertAfter(this.btn.parent());
            }
            this.errArea.html('错误：' + msg).show();
            this.btn.addClass('form-error-shake');
        },
        hideError: function() {
            this.errArea && this.errArea.hide();
        },
        /* 重写获取表单数据的方法，这里要区分不同的输入组件，获取不同的数据 */
        getData: function() {
            var params = {};
            this.inputs.each(function() {
                var name = $(this).attr('name'),
                    value;
                if (this.dropbox) {
                    params[name] = this.dropbox.value;
                } else if ($(this).is('[type=checkbox]')) {
                    params[name] = params[name] || [];
                    if ($(this).is(':checked')) {
                        params[name].push(this.value);
                    }
                } else if ($(this).is('[type=radio]')) {
                    if ($(this).is(':checked')) {
                        params[name] = this.value;
                    }
                } else {
                    params[name] = this.value;
                }
            });
            return params;
        }
    });

});
