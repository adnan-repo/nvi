// Generated by CoffeeScript 1.6.3
var Bar, BufferView, BufferViewCursor, HydraBuffer;

Bar = require('./Bar');

HydraBuffer = require('../models/HydraBuffer');

BufferViewCursor = require('./BufferViewCursor');

module.exports = BufferView = (function() {
  function BufferView(o) {
    this.tab = o.tab;
    if (o.active) {
      this.tab.active_view = this;
    }
    this.buffer = HydraBuffer({
      view: this,
      file: o.file
    });
    this.lines = this.buffer.data.split("\n");
    this.lines.pop();
    if (!(this.lines.length >= 1)) {
      this.lines = [''];
    }
    this.gutter = repeat(Math.max(4, this.lines.length.toString().length + 2), ' ');
    this.resize({
      x: o.x,
      y: o.y,
      w: o.w,
      h: o.h
    });
    this.status_bar = new Bar({
      x: this.x,
      y: this.y + this.ih,
      w: this.w,
      h: 1,
      bg: NviConfig.view_status_bar_active_bg,
      fg: NviConfig.view_status_bar_active_fg,
      text: Terminal.xbg(NviConfig.view_status_bar_active_l1_bg).xfg(NviConfig.view_status_bar_active_l1_fg).echo(this.buffer.path).fg('bold').xfg(NviConfig.view_status_bar_active_l1_fg_bold).echo(this.buffer.base + ' ').fg('unbold').xbg(NviConfig.view_status_bar_active_bg).xfg(NviConfig.view_status_bar_active_fg).get_clean()
    });
    this.cursors = [
      new BufferViewCursor({
        user: Application.current_user,
        view: this,
        x: this.x,
        y: this.y,
        possessed: true
      })
    ];
    return;
  }

  BufferView.prototype.destroy = function() {
    this.cell.destroy();
  };

  BufferView.prototype.resize = function(o) {
    if (o.x) {
      this.x = o.x;
    }
    if (this.x < 1) {
      die("BufferView.x may not be less than 1!");
    }
    if (o.y) {
      this.y = o.y;
    }
    if (this.y < 1) {
      die("BufferView.y may not be less than 1!");
    }
    this.w = o.w;
    if (this.w < 1) {
      die("BufferView.w may not be less than 1!");
    }
    this.h = o.h;
    if (this.h < 2) {
      die("BufferView.h may not be less than 2!");
    }
    this.iw = o.w;
    this.ih = o.h - 1;
    this.draw();
    if (this.status_bar) {
      this.status_bar.resize({
        x: this.x,
        y: this.y + this.ih,
        w: this.w
      });
    }
  };

  BufferView.prototype.draw = function() {
    var cursor, i, line, ln, visible_line_h, y, _i, _j, _k, _len, _ref, _ref1;
    visible_line_h = Math.min(this.lines.length, this.ih);
    for (ln = _i = 0; 0 <= visible_line_h ? _i < visible_line_h : _i > visible_line_h; ln = 0 <= visible_line_h ? ++_i : --_i) {
      line = this.lines[ln];
      if (line.length > this.iw) {
        line = line.substr(0, this.iw - 1) + '>';
      }
      Terminal.xbg(NviConfig.view_gutter_bg).xfg(NviConfig.view_gutter_fg).go(this.x, this.y + ln).echo((this.gutter + (ln + 1)).substr(-1 * (this.gutter.length - 1)) + ' ');
      Terminal.xbg(NviConfig.view_text_bg).xfg(NviConfig.view_text_fg).echo(line).clear_n(this.iw - this.gutter.length - line.length).flush();
    }
    if (visible_line_h < this.ih) {
      for (y = _j = visible_line_h, _ref = this.ih; visible_line_h <= _ref ? _j < _ref : _j > _ref; y = visible_line_h <= _ref ? ++_j : --_j) {
        Terminal.xbg(NviConfig.view_gutter_bg).xfg(NviConfig.view_gutter_fg).go(this.x, this.y + y).fg('bold').echo('~').fg('unbold').clear_n(this.iw - 1).flush();
      }
    }
    if (this.cursors) {
      _ref1 = this.cursors;
      for (i = _k = 0, _len = _ref1.length; _k < _len; i = ++_k) {
        cursor = _ref1[i];
        if (i !== 0) {
          cursor.draw();
        }
      }
    }
  };

  return BufferView;

})();