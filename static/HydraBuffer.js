// Generated by CoffeeScript 1.6.3
var HydraBuffer, fs, path;

fs = require('fs');

path = require('path');

module.exports = HydraBuffer = (function() {
  HydraBuffer.buffers = {};

  function HydraBuffer(o) {
    var buffer;
    if (o.file !== void 0) {
      buffer = {
        type: 'file',
        id: path.resolve(o.file),
        alias: path.basename(o.file)
      };
    } else {
      buffer = {
        type: 'memory',
        id: null,
        alias: 'untitled'
      };
    }
    if (buffer.id === null || HydraBuffer.buffers[buffer.id] === void 0) {
      buffer.views = [];
      HydraBuffer.buffers[buffer.id] = buffer;
    }
    buffer = HydraBuffer.buffers[buffer.id];
    buffer.views.push(o.view);
    switch (buffer.type) {
      case 'file':
        buffer.data = fs.readFileSync(buffer.id, {
          encoding: 'utf8'
        });
        break;
      case 'memory':
        buffer.data = '';
    }
    return buffer;
  }

  return HydraBuffer;

})();
