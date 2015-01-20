/**
 * Module dependencies
 */

var renderCSS = require('./to-css').renderCSS;

module.exports = function(source) {
  this.cacheable && this.cacheable();
  var q = this.resourceQuery || '';
  if (~q.indexOf('dynamic')) return loadDynamic.call(this, source);
  if (~q.indexOf('raw')) return loadRaw.call(this, source);
  return loadStatic.call(this, source);
};

function loadDynamic(source) {
  return source + '\n' +
    'import {toCSS} from ' + resolve('./to-css') + '\n' +
    'export default require("onus-style")(exports, toCSS);';
}

function loadRaw(source) {
  return source + '\n' +
    'import {renderCSS} from ' + resolve('./to-css') + '\n' +
    'export default renderCSS(exports);\n';
}

function loadStatic(source) {
  var req = 'require = require(' + resolve('enhanced-require') + ')(module, ' + JSON.stringify({
    recursive: true,
    resolve: this.options.resolve
  }) + ');\n'
  var mod = this.exec(req + source, this.resource);
  return renderCSS(mod)();
}

function resolve(path) {
  return JSON.stringify(require.resolve(path));
}
