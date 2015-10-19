dudeGraph.Math = (function () {

    /**
     * Math utilities
     * @type {Object}
     */
    var Math = {};

    /**
     * Clamps a value between a minimum number and maximum number value.
     * @param value {Number}
     * @param min {Number}
     * @param max {Number}
     * @return {Number}
     */
    Math.clamp = function (value, min, max) {
        return Math.min(Math.max(value, min), max);
    };

    return Math;

})();