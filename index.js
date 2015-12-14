/**
 * Module dependencies
 */

exports = module.exports = function(source) {};
exports.pitch = function(remainingRequest) {
  this.cacheable && this.cacheable();
  var req = JSON.stringify('!!' + remainingRequest);
  var q = this.resourceQuery || '';
  if (~q.indexOf('dynamic')) return pitchDynamic.call(this, req);
  if (~q.indexOf('raw')) return pitchRaw.call(this, req);
  return pitchStatic.call(this, req);
};

function pitchDynamic(req) {
  return '' +
    'exports = module.exports = require(' + req + ');\n' +
    'exports["default"] = require("onus-style")(exports, require(' + resolve('ess-compiler/dom') + '));';
}

function pitchRaw(req) {
  return '' +
    'exports = module.exports = require(' + req + ');\n' +
    'exports["default"] = require(' + resolve('ess-compiler/render') + ')(exports);';
}

function pitchStatic(req) {
  return '' +
    'var content = require(' + req + ');\n' +
    'module.exports = [[module.id, require(' + resolve('ess-compiler/render') + ')(content)(), ""]];';
}

function resolve(path) {
  return JSON.stringify(require.resolve(path));
}
