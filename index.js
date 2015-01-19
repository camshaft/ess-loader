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
    'import {toCSS} from ' + JSON.stringify(require.resolve('./to-css')) + '\n' +
    'export default require("onus-style")(exports, toCSS);';
}

function loadRaw(source) {
  return source + '\n' +
    'import {renderCSS} from ' + JSON.stringify(require.resolve('./to-css')) + '\n' +
    'export default renderCSS(exports);\n';
}

function loadStatic(source) {
  var mod = this.exec(source);
  return renderCSS(mod)();
}
