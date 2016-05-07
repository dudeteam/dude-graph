//noinspection JSUnusedLocalSymbols
/**
 * @namespace dudeGraph
 * @type {Object}
 */
var dudeGraph = (function() {
    var namespace = {};
    if (typeof exports !== "undefined") {
        if (typeof module !== "undefined" && module.exports) {
            //noinspection JSUnresolvedVariable
            exports = module.exports = namespace;
        }
        exports.dudeGraph = namespace;
    } else {
        window.dudeGraph = namespace;
    }
    return namespace;
})();