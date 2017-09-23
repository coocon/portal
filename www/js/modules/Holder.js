define(function(require, exports, module) {
    var timer;
    var getRandom = require('./getRandom');

    /*!
     * @description 模拟placeholder
     * @param {ELEMENT_NODE} 需要处理的输入框节点
     */

    return require('createClass')(function(input) {
        this.input = $(input);

        this.init();
    }, {
        init: function() {
            var self = this,
                input = this.input,
                holder_text = input.attr('placeholder'),
                id = input.attr('id') || 'input-id-' + getRandom();


            input.removeAttr('placeholder');
            input.attr('id', id);
            this.label = $('<label class="placeholder" for="' + id + '">' + holder_text + '</label>').insertBefore(input);

            input.on({
                focus: function() {
                    clearInterval(timer);
                    timer = setInterval(function() {
                        self.check();
                    }, 50);
                },
                blur: function() {
                    clearInterval(timer);
                    if (input.val() == '') {
                        self.check();
                    }
                }
            });

            this.check();
        },
        check: function() {
            if (this.input.val() == '') {
                this.label.show();
            } else {
                this.label.hide();
            }
        }
    });

});
