// Browser preview only (ZESTY_WEB=1): stands in for @expo/ui's SwiftUI and
// Compose modules, which have no web build. Every export is a component that
// renders its children, and also works when called as a modifier.
const REAL = new Set([
  "$$typeof", "prototype", "defaultProps", "contextTypes", "contextType", "childContextTypes",
  "getDerivedStateFromProps", "displayName", "name", "length", "render", "propTypes", "then",
  "__esModule", "compare", "type", "apply", "call", "bind", "toString",
]);

function make() {
  function Stub(props) {
    const children = props && typeof props === "object" ? props.children : null;
    return children === undefined ? null : children;
  }
  return new Proxy(Stub, {
    get(target, key) {
      if (typeof key === "symbol" || REAL.has(key)) return target[key];
      return make();
    },
  });
}

module.exports = make();
