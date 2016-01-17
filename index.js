/**
 * Module dependencies
 */

var utils = require('loader-utils');

exports = module.exports = function(source) {};
exports.pitch = function(remainingRequest) {
  this.cacheable && this.cacheable();
  var req = JSON.stringify('!!' + remainingRequest);
  var q = this.resourceQuery || '';
  var opts = utils.parseQuery(this.query);
  if (~q.indexOf('dynamic')) return pitchDynamic.call(this, req, opts);
  if (~q.indexOf('raw')) return pitchRaw.call(this, req, opts);
  return pitchStatic.call(this, req, opts);
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

function pitchStatic(req, opts) {
  return [
    'var content = require(' + req + ');',
    'var css = require(' + resolve('ess-compiler/render') + ')(content)();',
    'module.exports = [[module.id, ' + process('css', opts) + ', ""]];'
  ].join('\n');
}

function process(input, opts) {
  var plugins = opts.postcss && (Array.isArray(opts.postcss) ? opts.postcss : opts.postcss.split(','));
  if (!plugins || !plugins.length) return input;

  var plugins = plugins.map(function(p) {
    return 'require(' + resolve(p) + ')';
  }).join(', ');

  return '"" + require(' + resolve('postcss') + ')([' + plugins + ']).process(' + input + ').css';
}

function resolve(path) {
  return JSON.stringify(require.resolve(path));
}
