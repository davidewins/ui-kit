// Browser preview only (ZESTY_WEB=1): stands in for @expo/ui's SwiftUI and
// Compose modules, which have no web build. Every export is a component that
// renders its children, and also works when called as a modifier or chained
// (EnterTransition.expandVertically().plus(...)). Menu contents (anything
// under an `Items` or `Preview` slot) are not drawn, since on a device they
// only appear when the menu is open.
const REAL = new Set([
  "$$typeof", "prototype", "defaultProps", "contextTypes", "contextType", "childContextTypes",
  "getDerivedStateFromProps", "displayName", "name", "length", "render", "propTypes", "then",
  "__esModule", "compare", "type", "apply", "call", "bind", "toString",
]);
const HIDDEN = new Set(["Items", "Preview"]);

function make(hidden) {
  function Stub(props) {
    // Called as a function with no props object: a modifier or a builder.
    if (props === null || typeof props !== "object" || Array.isArray(props)) return make(false);
    if (hidden) return null;
    return props.children === undefined ? null : props.children;
  }
  return new Proxy(Stub, {
    get(target, key) {
      if (typeof key === "symbol" || REAL.has(key)) return target[key];
      return make(HIDDEN.has(key));
    },
  });
}

module.exports = make(false);
