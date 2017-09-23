define(function (require, exports, module) {
  var utils = require('utils');
  var css3 = utils.supports.transition;

  return require('createClass')(function () {
    var self = this;

    this.frames = $('<div class="Mask"></div><div class="Panel"><div class="content"></div><a href="javascript:;" class="close">X</a></div>').appendTo('body');
    this.panel = this.frames.filter('.Panel');
    this.mask = this.frames.filter('.Mask');

    this.maskOpacity = this.mask.css('opacity') || .8;

    this.hide(); //默认隐藏
    if (css3) {
      this.frames.css(utils.transition, '500ms ease').css(utils.isCSS('transition-property'), 'opacity, ' + utils.fixCSS('transform'));
      this.panel.on(utils.transitionend, function (ev) {
        if (ev.originalEvent.propertyName == 'opacity') {
          self.cb && self.cb();
        }
      });
    }
    this.panel.find('.close').tap(function () {
      self.remove();
    });
  }, {
    show: function (cb) {
      var self = this;
      if (css3) {
        this.cb = null;
        this.frames.show();
        setTimeout(function () {
          self.mask.css('opacity', self.maskOpacity);
          self.panel.css('opacity', 1).css(utils.transform, 'translateY(0) scale(1)');
        }, 0);
      } else {
        this.frames.fadeIn(500);
      }
      this.resize();
      cb && cb();
    },
    hide: function (cb) {
      var self = this;
      if (css3) {
        this.cb = function () {
          self.frames.hide();
          cb && cb();
        }
        this.frames.css('opacity', 0);
        this.panel.css(utils.transform, 'translateY(-100%) scale(0)');
      } else {
        this.frames.fadeOut(500, cb);
      }
    },
    remove: function () {
      var self = this;
      this.hide(function () {
        self.frames.remove();
      });
    },
    resize: function () {
      var panel = this.panel;
      panel.css({
        marginTop: -panel.height() / 2,
        marginLeft: -panel.width() / 2
      });
    },
    setContent: function (str) {
      this.panel.find('.content').html(str);
    }
  });

});
