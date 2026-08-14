// Node half of dsh-plugin-msg-nav: a pure browser-surface plugin.
// The empty apply exists so the row appears in the host Loader; the browser
// half ships via exports["./client"], discovered through the package.json
// `dsh.client` declaration.
/** Host plugin body — no host-side behavior for this surface plugin. */
function apply() {}
export { apply };
