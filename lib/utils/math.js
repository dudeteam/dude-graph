dudeGraph.MathUtility = (function () {

    /**
     * Math utilities
     * @type {Object}
     */
    var MathUtility = {};

    /**
     * Clamps a value between a minimum number and maximum number value.
     * @param value {Number}
     * @param min {Number}
     * @param max {Number}
     * @return {Number}
     */
    MathUtility.clamp = function (value, min, max) {
        return Math.min(Math.max(value, min), max);
    };

    return MathUtility;

})();