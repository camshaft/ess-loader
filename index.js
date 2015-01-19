/**
 * Module dependencies
 */

var utils = require('./to-css');

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
    'import {toCSS, $get} from ' + JSON.stringify(require.resolve('./to-css')) + '\n' +
    'export default function(props) {\n' +
    '  return exports.render(toCSS, $get, props);\n' +
    '}';
}

function loadStatic(source) {
  var mod = this.exec(source);
  return mod.render(utils.toCSS, utils.$get);
}
