// Generated by CoffeeScript 1.6.3
var Cursor, HydraBuffer, View;

HydraBuffer = require('./HydraBuffer');

Cursor = require('./Cursor');

module.exports = View = (function() {
  function View(o) {
    this.tab = o.tab;
    if (o.active) {
      this.tab.active_view = this;
    }
    this.x = o.x;
    this.y = o.y;
    this.w = o.w;
    this.h = o.h;
    this.cursors = [
      new Cursor({
        user: Window.current_user,
        view: this,
        x: 0,
        y: 0
      })
    ];
    this.buffer = HydraBuffer({
      view: this,
      file: o.file
    });
    this.lines = this.buffer.data.split("\n");
    this.lines.pop();
    this.gutter = repeat(Math.max(3, this.lines.length.toString().length + 2), ' ');
    this.draw();
    Window.set_status("\"" + this.buffer.alias + "\", " + this.lines.length + "L, " + this.buffer.data.length + "C");
  }

  View.prototype.resize = function(_arg) {
    this.w = _arg.w, this.h = _arg.h;
    Logger.out("View.resize(" + this.w + ", " + this.h + ")");
    return this.draw();
  };

  View.prototype.draw = function() {
    var clipped, line, ln, y, yy, _i, _j, _ref;
    Logger.out('View.draw() was called.');
    yy = Math.min(this.lines.length, this.h);
    Logger.out("@lines.length is " + this.lines.length + ", yy is " + yy);
    ln = 1;
    if (ln < this.lines.length) {
      for (ln = _i = 1; 1 <= yy ? _i <= yy : _i >= yy; ln = 1 <= yy ? ++_i : --_i) {
        line = this.lines[ln - 1];
        Terminal.xbg(NviConfig.gutter_bg).xfg(NviConfig.gutter_fg).go(this.x + 1, this.y + ln).echo((this.gutter + ln).substr((this.gutter.length - 1) * -1) + ' ');
        clipped = line.length > this.w;
        if (clipped) {
          line = line.substr(0, this.w - 1) + '>';
        }
        Terminal.xbg(NviConfig.text_bg).xfg(NviConfig.text_fg).echo(line).clear_eol();
      }
      Logger.out("now ln " + ln + ", @h " + this.h);
    }
    if (this.lines.length < this.h) {
      for (y = _j = ln, _ref = this.h; ln <= _ref ? _j <= _ref : _j >= _ref; y = ln <= _ref ? ++_j : --_j) {
        Terminal.xbg(NviConfig.gutter_bg).xfg(NviConfig.gutter_fg).go(this.x + 1, this.y + y).fg('bold').echo('~').fg('unbold');
      }
    }
    return Terminal.go(this.x + this.gutter.length + 1, this.y + 0).xfg(255);
  };

  return View;

})();
