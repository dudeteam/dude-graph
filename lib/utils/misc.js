/**
 * Merge the source object into the destination.
 * @param destination
 * @param source
 * @returns {*}
 */
cg.mergeObjects = function (destination, source) {
    for (var k in source) {
        if (source.hasOwnProperty(k)) {
            destination[k] = source[k];
        }
    }
    return destination;
};

/**
 * Default function to prevent events.
 */
cg.preventCallback = function (x, y, e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
};

/**
 * Empty callback for default event behavior.
 */
cg.defaultCallback = function () {

};