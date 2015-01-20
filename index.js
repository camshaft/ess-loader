/**
 * Module dependencies
 */

var renderCSS = require('./to-css').renderCSS;

exports = module.exports = function(source) {
  this.cacheable && this.cacheable();
  var q = this.resourceQuery || '';
  if (~q.indexOf('dynamic')) return source + compileDynamic();
  if (~q.indexOf('raw')) return source + compileRaw();
  return compileStatic.call(this, source);
};

exports.pitch = function(remainingRequest) {
  this.cacheable && this.cacheable();
  var req = remainingRequest.split('!');
  var q = this.resourceQuery || '';
  if (~q.indexOf('dynamic')) return pitchDynamic.call(this, req);
  if (~q.indexOf('raw')) return pitchRaw.call(this, req);
};

function pitchDynamic(req) {
  return '' +
    'exports = module.exports = require(' + JSON.stringify('!!' + req.join('!')) + ');\n' +
    compileDynamic();
}

function pitchRaw(req) {
  return '' +
    'exports = module.exports = require(' + JSON.stringify('!!' + req.join('!')) + ');\n' +
    compileRaw();
}

function compileDynamic() {
  return '\n' +
    'var toCSS = require(' + resolve('./to-css') + ')["toCSS"];\n' +
    'exports["default"] = require("onus-style")(exports, toCSS);';
}

function compileRaw() {
  return '\n' +
    'var renderCSS = require(' + resolve('./to-css') + ')["renderCSS"];\n' +
    'exports["default"] = renderCSS(exports);';
}

function compileStatic(source) {
  var opts = this.options;

  var loaders = opts.module ? opts.module.loaders : opts.resolve.loaders;

  var er = 'require = require(' + resolve('enhanced-require') + ')(module, require(' + resolve('./json2regexp') + ')(' + JSON.stringify({
    recursive: true,
    resolve: {
      loaders: loaders,
      extensions: opts.resolve.extensions,
      modulesDirectories: opts.resolve.modulesDirectories
    }
  }, toString) + '));\n'

  var mod = this.exec(er + source, this.resource);

  var out = renderCSS(mod)();

  return out;
}

function resolve(path) {
  return JSON.stringify(require.resolve(path));
}

function toString(key, value) {
  if (!(value instanceof RegExp)) return value;
  return value.toString();
}
