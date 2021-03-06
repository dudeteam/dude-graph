/**
 * Clamps a value between a minimum number and a maximum number.
 * @param value {Number}
 * @param min {Number}
 * @param max {Number}
 * @return {Number}
 */
dudeGraph.clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};
