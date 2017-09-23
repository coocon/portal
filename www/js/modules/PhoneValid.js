define(function(require, module, exports) {
    var regs = require('./RegExp');
    var Panel = require('./Panel');
    var getRandom = require('./getRandom');
    var EasyForm = require('./EasyForm');
    var Captcha = require('./Captcha');

    return require('createClass')(function(form, verify_type) {
        this.form = form;

        this.btns = this.form.form.find('.verify-by-phone,.verify-by-voice');
        this.phoneInput = this.form.form.find('[name=phone]');
        this.verify_type = verify_type;

        this.init();
    }, {
        init: function() {
            var self = this,
                validTimer, delay;

            this.phoneInput.change(function() {
                if (!self.form.Valid.errors.phone) {
                    validTimer = setTimeout(function() {
                        self.checkPhone();
                    }, 500); //延迟触发,避免和点击按钮后的检查重复
                }
            });

            this.btns.tap(function() {
                var btn = $(this),
                    mobileNo = self.phoneInput.val(),
                    isVoice = btn.hasClass('verify-by-voice');
                if (delay || self.form.Valid.errors.phone) {
                    return;
                }
                delay = true;
                btn.addClass('btn-loading').focus();
                clearTimeout(validTimer); //清楚change触发的检查
                self.checkPhone(function() {
                    var panel = new Panel(),
                        err_count=0,
                        form,captcha;
                    delay = false;
                    btn.removeClass('btn-loading');
                    panel.setContent('<div class="captcha-form"><h3>请输入图片验证码</h3><div class="form-item clear"><div class="input-wrap captcha-input"><input class="input-text" name="code" placeholder="请输入右侧验证码" /></div><div class="captcha-box"><img class="captcha-img" /><img class="captcha-loading" src="/static/images/loading/loading-2.gif" /></div></div>\
                                     <div class="form-item"><button class="btn btn-yellow btn-submit"><span class="loading"></span>确 定</button></div><div class="form-meta">*如果图片验证码识别困难，点击即可刷新显示。</div></div>');
                    captcha=new Captcha(panel.panel.find('.captcha-box'));
                    form = new EasyForm(panel.panel, {
                        url: "/api/v1/phone",
                        type: "get",
                        getData: function() {
                            return {
                                phone: mobileNo,
                                process: self.verify_type || 'account',
                                type: isVoice ? 'voice' : null,
                                code: this.form.find('[name=code]').val()
                            }
                        },
                        success: function(ret) {
                            if (ret.is_succ) {
                                delay = true;
                                panel.remove();
                                self.verifBtnCountDown(btn, function() {
                                    delay = false;
                                    btn.html('<span class="loading"></span>重新发送');
                                    if (!isVoice) {
                                        self.btns.filter('.verify-by-voice').closest('.form-item').removeClass('none');
                                    }
                                });
                            } else {
                                this.showError(ret.error_msg || '验证码发送失败，请稍后重试');
                                if (++err_count > 4) {
                                    captcha.update();
                                    form.clear('code');
                                    err_count=0;
                                }
                            }
                        },
                        valid: [{
                            name: 'code',
                            valid: {
                                noEmpty: '请填写右侧验证码'
                            }
                        }]
                    });
                    panel.show();
                }, function() {
                    delay = false;
                    btn.removeClass('btn-loading');
                });
            });
        },
        checkPhone: function(succCall, errCall) {
            var self = this;
            if (regs.isMobile(this.phoneInput.val())) { //正则验证通过
                this.serverValid('phone', this.phoneInput.val(), function(isright, errmsg) {
                    if (isright) {
                        self.form.Valid.hideError(self.phoneInput);
                        delete self.form.Valid.errors.phone;
                        succCall && succCall();
                    } else {
                        self.form.Valid.addError(self.phoneInput, errmsg);
                        self.form.Valid.errors.phone = errmsg;
                        errCall && errCall();
                    }
                });
            } else {
                this.form.Valid.addError(this.phoneInput, this.form.Valid.errors.phone = '请填写正确的手机号');
                errCall && errCall();
            }
        },
        verifBtnCountDown: function(btn, callback) {
            var time = 60;

            setTime();

            function setTime() {
                if (--time) {
                    btn.text(time + '秒');
                    setTimeout(setTime, 1000);
                } else {
                    callback();
                }
            }
        },
        serverValid: function(type, value, callback) {
            $.ajax({
                url: "/api/v1/check",
                type: 'get',
                data: {
                    type: type,
                    value: value
                },
                success: function(ret) {
                    callback(ret.is_succ, ret.error_msg);
                },
                error: function() { //验证借口出问题则当作以验证
                    callback(true);
                }
            });
        }
    });
});
