
exports.toCSS = function(selectors, props) {
  if (typeof selectors === 'function') return selectors(props);
  return '\n' +
    (Array.isArray(selectors) ? selectors.join(',\n') : selectors) + '{\n' +
      formatProps(props) + '\n' +
    '}\n';
}

function formatProps(props) {
  var parts = [];
  for (var k in props) {
    if (k === 'key') continue;
    parts.push('  ' + k + ': ' + props[k] + ';');
  }
  return parts.join('\n');
}

exports.$get = function(path, parent, fallback) {
  for (var i = 0; i < path.length; i++) {
    if (!parent) return undefined;
    parent = parent[path[i]];
  }
  return parent;
};
