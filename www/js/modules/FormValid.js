define(function(require, exports, module) {
    var regs = require('./RegExp');

    /*!
     * @description 滚屏固定
     * @param {Array} config  验证配置 为了保证从上而下顺序验证，这里要求传入数组，并且顺序和表单中所需验证项的顺序一致
     *          [
                    {
                        name:'phone',
                        valid:{
                            noEmpty:'请填写您的手机号',
                            isPhone:'手机号格式错误',
                            server:true
                        }
                    },
                    {
                        name:'verify-code',
                        valid:{
                            noEmpty:'请填写验证码'
                        }
                    },
                    {
                        name:'password',
                        valid:{
                            noEmpty: '请输入密码'
                            minLength: [6, '密码长度必须大于或等于 6 位'],
                            maxLength: [24, '密码长度必须小于或等于 24 位'],
                        }
                    },
                    {
                        name:'password_confirm',
                        valid:{
                            noEmpty: '请再次输入密码',
                            minLength: [6, '密码长度必须大于或等于 6 位'],
                            maxLength: [24, '密码长度必须小于或等于 24 位'],
                            confirm: ['password','两次输入密码不一致']
                        }
                    }
                ];
     * @param {ELEMENT_NODE} form 表单节点
     */

    return require('createClass')(function(config, form) {
        this.form = $(form).length ? $(form) : $(document);
        this.config = $.makeArray(config);
        this.errors = {};
        this.exclude = {};
        this.init();
    }, {
        init: function() {
            var self = this,
                form = this.form;
            $.each(this.config, function() {
                var name = this.name,
                    ret = this.valid,
                    inputs = form.find('[name=\'' + name + '\']');
                inputs.change(function() {
                    self.check(inputs, ret);
                });

                inputs.focus(function() {
                    if (self.errors[name]) {
                        self.addError(inputs, self.errors[name]);
                    }
                });


            });
        },
        /*!
         * @description 检查所有项目
         * @return {Boolean} 返回验证结果
         */
        checkAll: function() {
            var self = this,
                valided = true;
            $.each(this.config, function() {
                var name = this.name,
                    ret = $.extend({}, this.valid),
                    inputs = self.form.find('[name=\'' + name + '\']');

                delete ret.server; //不验证服务器

                if (inputs.length) {
                    if (self.exclude[name]) {
                        self.hideError(inputs);
                    } else {
                        valided = (!this.valid.server || !self.errors[name]) && self.check(inputs, ret, !valided) && valided;
                    }
                }
            });

            return valided;
        },
        /*!
         * @description 检查单个项目
         * @param {jqObj} 需要验证的输入节点，经过jq包装
         * @param {Object} ret 所需验证项目配置
         * @param {Boolean} notip 是否显示错误信息
         *
         * @return {Boolean} 返回验证结果
         */
        check: function(inputs, ret, notip) {
            var self = this,
                name = inputs.attr('name'),
                error, text;

            $.each(ret, function(type, info) {
                if (self.valid(type, inputs, info)) {
                    self.hideError(inputs, notip);
                    delete self.errors[name];
                } else {
                    text = $.isArray(info) ? info[1] : info;
                    self.addError(inputs, text, notip);
                    error = true;
                    self.errors[name] = text;
                    return false;
                }
            });

            return !error;
        },
        valid: function(type, inputs, info) {
            var valid = true,
                value = inputs.val();
            switch (type) {
                case 'noEmpty':
                    var tagname = inputs[0].nodeName.toLowerCase(),
                        inputtype = inputs.attr('type') || 'text';
                    if (tagname == 'input' || tagname == 'textarea') {
                        if (inputtype == 'checkbox' || inputtype == 'radio') {
                            if (!inputs.filter(':checked').length) {
                                valid = false;
                            }
                        } else if (inputs[0].dropbox) {
                            if (inputs[0].dropbox.value == '') {
                                valid = false;
                            }
                        } else if (value == '') {
                            valid = false;
                        }
                    } else if (tagname == 'select') {
                        if (!inputs[0].options.length || inputs[0].options[0].value == inputs.val()) {
                            valid = false;
                        }
                    }
                    break;

                case 'confirm':
                    var prenode = this.form.find('[name=\'' + info[0] + '\']');
                    if (value != prenode.val()) {
                        valid = false;
                    }
                    break;

                case 'minLength':
                    if (value && value.length < parseInt(info[0])) {
                        valid = false;
                    }
                    break;

                case 'maxLength':
                    if (value && value.length > parseInt(info[0])) {
                        valid = false;
                    }
                    break;

                case 'isNumber':
                case 'isPhone':
                case 'isMobile':
                case 'isVersion':
                case 'isEmail':
                case 'isIdcard':
                case 'isUrl':
                case 'isQq':
                case 'isCn':
                case 'isPinyin':
                case 'isChinaName':
                    if (!regs[type](value)) {
                        valid = false;
                    }
                    break;

                case 'server':
                    valid = false;
            }

            return valid;
        },
        addError: function(input, text, notip) { //显示错误，全局只有一个错误提示
            if (!this.errLabel) {
                this.errLabel = $('<div class="form-error"><p></p><span class="arrow-tip-down"></span></div>');
            }

            if (!notip) {
                this.errLabel.find('>p').html(text);
                if (this.errLabel.parent()[0] != input.parent()[0]) {
                    this.errLabel.insertBefore(input);
                }
            }
            input.closest('.input-wrap').addClass('input-error');
        },
        hideError: function(input) { //隐藏错误
            if (this.errLabel && this.errLabel.closest('.input-wrap')[0] == input.closest('.input-wrap')[0]) {
                this.errLabel.remove();
            }
            input.closest('.input-wrap').removeClass('input-error');
        }
    });

});
