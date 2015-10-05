cg.ArrayMerger = (function () {

    /**
     * Merges arrays by combining them instead of replacing
     * @param {Object|Array} a
     * @param {Object|Array} b
     * @returns {Array|undefined}
     */
    return function (a, b) {
        if (_.isArray(a)) {
            return (b || []).concat(a);
        }
    };

})();