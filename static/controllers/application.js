// Generated by CoffeeScript 1.6.3
var Application, User;

User = require('../models/User');

global.Window = require('../views/Window');

module.exports = Application = (function() {
  function Application() {}

  Application.init = function(o) {
    Logger.out('init');
    Application.current_user = new User(NviConfig.user);
    Application.mode = 'NORMAL';
    Application.command_line = '';
    Application.command_history = [];
    Application.command_history_position = 0;
    Window.init({
      file: o.args[0]
    });
    process.stdout.on('resize', Window.resize);
    process.stdin.on('keypress', Application.keypress);
    process.stdin.on('mousepress', Application.mousepress);
    return process.stdin.resume();
  };

  Application.keypress = function(ch, key) {
    var cmd, code, x;
    Logger.out("caught keypress: " + JSON.stringify(arguments));
    code = ch ? ch.charCodeAt(0) : -1;
    if (Application.mode === 'COMMAND') {
      if (code > 31 && code < 127) {
        Application.command_line += ch;
        Logger.out("type cmd len " + Application.command_line.length);
        Terminal.echo(ch).flush();
      } else if (key.name === 'escape') {
        Application.command_line = '';
        Application.command_history_position = 0;
        Application.set_mode('COMBO');
      } else if (key.name === 'backspace') {
        Logger.out("Terminal.cursor.x " + Terminal.cursor.x);
        if (Terminal.cursor.x > 1 && Application.command_line.length > 0) {
          x = Terminal.cursor.x - 1;
          cmd = Application.command_line.substr(0, x - 2);
          cmd += Application.command_line.substr(x - 1, Application.command_line.length - x + 1);
          Application.command_line = cmd;
          Logger.out("bksp cmd len " + Application.command_line.length + ", cmd " + Application.command_line);
          Window.status_bar.set_text(':' + cmd);
          Terminal.go(x, Terminal.screen.h).flush();
        }
      } else if (key.name === 'delete') {
        return;
      } else if (key.name === 'left') {
        if (Terminal.cursor.x > 2) {
          Terminal.move(-1).flush();
        }
      } else if (key.name === 'right') {
        if (Terminal.cursor.x < Application.command_line.length + 2) {
          Terminal.move(1).flush();
        }
      } else if (key.name === 'home') {
        Terminal.go(2, Terminal.screen.h).flush();
      } else if (key.name === 'end') {
        Terminal.go(Application.command_line.length + 2, Terminal.screen.h).flush();
      } else if (key.name === 'up') {
        1;
      } else if (key.name === 'down') {
        1;
      } else if (key.name === 'return') {
        Application.execute_cmd(Application.command_line);
        Application.command_line = '';
        Application.set_mode('COMBO');
      }
    }
    if (Application.mode === 'COMBO') {
      switch (ch) {
        case 'i':
          Application.set_mode('NORMAL');
          return;
        case ':':
          Application.mode = 'COMMAND';
          Window.status_bar.set_text(':', false);
          return;
      }
    }
    if (ch === "\u0003") {
      Window.status_bar.set_text('Type :quit<Enter> to exit Nvi');
      die('');
      return;
    }
    if ((Application.mode === 'NORMAL' || Application.mode === 'COMBO') && key) {
      switch (key.name) {
        case 'escape':
          Application.set_mode('COMBO');
          break;
        case 'left':
          Window.current_cursor().move(-1);
          break;
        case 'right':
          Window.current_cursor().move(1);
          break;
        case 'up':
          Window.current_cursor().move(0, -1);
          break;
        case 'down':
          Window.current_cursor().move(0, 1);
      }
    }
  };

  Application.mousepress = function(e) {
    Logger.out("caught mousepress: " + JSON.stringify(e));
  };

  Application.set_mode = function(mode) {
    Application.mode = mode;
    Window.status_bar.set_text(Terminal.xfg(NviConfig.window_mode_fg).fg('bold').echo("-- " + Application.mode + " MODE --").fg('unbold').xfg(NviConfig.window_status_bar_fg).get_clean());
  };

  Application.execute_cmd = function(cmd) {
    var ClientController, ServerController, args;
    Logger.out("would execute command: " + Application.command_line);
    Application.command_history.push(Application.command_line);
    args = cmd.split(' ');
    switch (args[0]) {
      case 'x':
      case 'wq':
        return die('');
      case 'q':
      case 'quit':
        return die('');
      case 'vsplit':
      case 'hsplit':
      case 'split':
        return Window.active_tab.split(args[0], args[1]);
      case 'listen':
        ServerController = require('./server');
        return ServerController.init(NviConfig.socket);
      case 'connect':
        ClientController = require('./client');
        return ClientController.init(NviConfig.socket);
    }
  };

  return Application;

})();