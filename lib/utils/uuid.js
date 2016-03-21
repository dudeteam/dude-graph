/**
 * Returns a salted UUID generator
 * @type {Function}
 */
dudeGraph.uuid = (function () {
    /**
     * Generates a random bit of an UUID
     * @returns {String}
     */
    var s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    /**
     * The UUID's salt
     * @type {String}
     */
    var salt = s4();

    /**
     * Generates a salted UUID
     * @returns {string}
     */
    return function () {
        return salt + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    };
});