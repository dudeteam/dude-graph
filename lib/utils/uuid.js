cg.UUID = (function () {

    /**
     * Generate a random bit of a UUID
     * @returns {String}
     */
    var s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    /**
     * Random salted UUID generator
     * @type {Object}
     */
    var UUID = {
        "salt": s4()
    };

    /**
     * Generate a random salted UUID
     * @returns {String}
     */
    UUID.generate = function () {
        return UUID.salt + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    };

    return UUID;

})();