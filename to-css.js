
exports.renderCSS = function(mod) {
  return function(props) {
    var out = mod.render(toCSS, $get, props);
    return Array.isArray(out) ? out.join('') : out;
  };
};

exports.toCSS = toCSS;

function toCSS(selectors, props) {
  if (typeof selectors === 'function') return selectors(props);
  return '\n' +
    (Array.isArray(selectors) ? selectors.join(',\n') : selectors) + '{\n' +
      formatProps(props) + '\n' +
    '}\n';
};

function formatProps(props) {
  var parts = [];
  for (var k in props) {
    if (k === 'key') continue;
    parts.push('  ' + k + ': ' + props[k] + ';');
  }
  return parts.join('\n');
}

 function $get(path, parent, fallback) {
  for (var i = 0; i < path.length; i++) {
    if (!parent) return undefined;
    parent = parent[path[i]];
  }
  return parent;
};
