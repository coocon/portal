define(function(require, exports, module) {
    var Holder = require('./Holder');
    var FormValid = require('./FormValid');
    var supportHolder = 'placeholder' in document.createElement('input');

    /*!
     * @description 表单组件基类
     * @param {ELEMENT_NODE} elem 表单节点
     * @param {Object} 配置 ｛method: 'post', action: '', valid: {}｝
     */

    return require('createClass')(function(elem, config) {
        this.form = $(elem);
        if (this.form.length) {
            this.setup(config);
        }
    }, {
        setup: function(config) {
            this.config = $.extend({
                method: this.form.attr('method') || 'post',
                action: this.form.attr('action') || ''
            }, config);

            this.inputs = this.form.find('.input-text,.input-checkbox,.input-radio'); //获取表单需要提交的输入项

            this.action = this.form.attr('action') || '';
            this.Valid = new FormValid(this.config.valid, this.form); //绑定验证
            !supportHolder && this.setTips(); //不支持placeholder的浏览器启用模拟holder
        },
        setTips: function() { //设置提示
            this.inputs.each(function() {
                var holder = $(this).attr('placeholder');
                if (holder) {
                    this.holder = new Holder(this); //将holder对象绑定到节点上以方便其它调用
                }
            });
        },
        url: '',
        type: 'POST',
        dataType: 'json',
        timeout: 10000,
        getData: function() {
            return this.form.serialize();
        },
        submit: function() {
            if (!this.Valid || this.Valid.checkAll()) {
                var setting = {
                    url: this.url,
                    data: this.getData(),
                    type: this.type,
                    context: this,
                    global: false,
                    dataType: 'json',
                    beforeSend: this.beforeSend,
                    error: this.error,
                    success: this.success,
                    complete: this.complete,
                    timeout: this.timeout
                }
                $.ajax(setting);
            } else {
                var keys = _.keys(this.Valid.errors);
                this.showError(this.Valid.errors[keys[0]], true);
            }
        },
        showError: function(msg, validErr) {
            alert(msg);
        },
        clear:function(){
            this.inputs.val('');
        }
    });

});
