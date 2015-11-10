(function () {
    /**
     * Generate a random bit of a UUID
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

    _.mixin({
        /**
         * Generate a random salted UUID
         * @returns {String}
         */
        uuid: function () {
            return salt + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
        }
    });
})();