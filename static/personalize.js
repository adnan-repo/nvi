// Generated by CoffeeScript 1.6.3
/* TODO:
* arrow keys cursor movement
* lclick to place cursor
* lclick+drag to highlight
* double-lclick to highlight word
* triple-lclick to highlight line
*/

var Cursor, HydraBuffer, Tab, User, View, Window, fs;

fs = require('fs');

User = (function() {
  function User(o) {
    this.id = o.id;
    this.name = o.name;
    this.email = o.email;
    this.color = o.color;
  }

  return User;

})();

Window = (function() {
  function Window() {}

  Window.init = function(o) {
    Window.current_user = o.current_user;
    Window.tabs = [new Tab];
    Window.h = null;
    return Window.resize();
  };

  Window.resize = function() {
    var tab, _i, _len, _ref;
    logger.out("window caught resize " + process.stdout.columns + ", " + process.stdout.rows);
    terminal.screen.w = process.stdout.columns;
    terminal.screen.h = process.stdout.rows;
    Window.h = process.stdout.rows;
    _ref = Window.tabs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tab = _ref[_i];
      tab.resize();
    }
    return Window.draw();
  };

  Window.keypress = function(ch, key) {
    logger.out("caught keypress: " + JSON.stringify(arguments));
    if (key && key.ctrl && key.name === 'c') {
      die('');
    }
    switch (key.name) {
      case 'left':
        return terminal.move(-1);
      case 'right':
        return terminal.move(1);
      case 'up':
        return terminal.move(0, -1);
      case 'down':
        return terminal.move(0, 1);
    }
  };

  Window.mousepress = function(e) {
    return logger.out("caught mousepress: " + JSON.stringify(e));
  };

  Window.draw = function() {
    var tab, _i, _len, _ref, _results;
    terminal.xbg(NviConfig.gutter_bg).clear_screen();
    _ref = this.tabs;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tab = _ref[_i];
      _results.push(tab.draw());
    }
    return _results;
  };

  return Window;

})();

Tab = (function() {
  function Tab(o) {
    this.name = (o != null ? o.name : void 0) || 'untitled';
    this.views = [
      new View({
        tab: this
      })
    ];
  }

  Tab.prototype.resize = function() {
    var view, _i, _len, _ref;
    _ref = this.views;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      view.resize();
    }
    return this.draw();
  };

  Tab.prototype.draw = function() {
    var view, _i, _len, _ref, _results;
    _ref = this.views;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view = _ref[_i];
      _results.push(view.draw());
    }
    return _results;
  };

  return Tab;

})();

View = (function() {
  function View(o) {
    this.tab = o.tab;
    this.hydrabuffer = HydraBuffer;
    this.user = User;
    this.w = null;
    this.h = null;
    this.offset = null;
  }

  View.prototype.resize = function() {
    return this.draw();
  };

  View.prototype.draw = function() {
    var y, _i, _ref, _ref1;
    terminal.xbg(NviConfig.gutter_bg).xfg(NviConfig.gutter_fg).go(1, 1).echo('  1 ');
    terminal.xbg(NviConfig.text_bg).xfg(NviConfig.text_fg).echo("how is this?").clear_eol();
    terminal.xbg(NviConfig.gutter_bg).xfg(NviConfig.gutter_fg).echo('  2 ');
    terminal.xbg(NviConfig.text_bg).xfg(NviConfig.text_fg).echo("hehe").clear_eol();
    for (y = _i = _ref = terminal.cursor.y, _ref1 = terminal.screen.h; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; y = _ref <= _ref1 ? ++_i : --_i) {
      terminal.xbg(NviConfig.gutter_bg).xfg(NviConfig.gutter_fg).go(1, y).fg('bold').echo('~').fg('unbold');
    }
    return terminal.go(8, 2).xfg(255);
  };

  return View;

})();

HydraBuffer = (function() {
  function HydraBuffer() {
    this.view = View;
    this.buffer = Buffer;
    this.cursors = [];
  }

  HydraBuffer.from_file = function(filename) {
    return fs.open(filename, 'r', function(err, fd) {
      var buffer;
      buffer = new Buffer(100);
      return fs.read(fd, buffer, 0, buffer.length, 0, function(err, bytesRead, buffer) {
        return b.toString('utf8');
      });
    });
  };

  return HydraBuffer;

})();

Cursor = (function() {
  function Cursor() {
    this.user = new User;
    this.view = View;
    this.x = null;
    this.y = null;
    this.w = 1;
    this.h = 1;
  }

  return Cursor;

})();

logger.out('init');

Window.init({
  current_user: new User(NviConfig.user)
});

process.stdout.on('resize', Window.resize);

process.stdin.on('keypress', Window.keypress);

process.stdin.on('mousepress', Window.mousepress);
