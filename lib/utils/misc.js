/**
 * Return the camelized string ("load models" => "loadModels")
 * @param {String} str
 * @returns {String}
 */
cg.camelize = function(str) {
    return str
        .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
};

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

/**
 * Cross-platform mouse wheel event
 * @param {Element} el
 * @param {Function} callback
 */
// http://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
cg.mouseWheel = function (el, callback) {
    var handleScroll = function (e) {
        if (!e) {
            e = event;
        }
        var direction = (e.detail < 0 || e.wheelDelta > 0) ? 1 : -1;
        callback(direction);
    };
    el.addEventListener('DOMMouseScroll', handleScroll, false); // for Firefox
    el.addEventListener('mousewheel', handleScroll, false); // for everyone else
};

/**
 * Return whether the firstBox collides with the secondBox.
 * @param firstBox
 * @param secondBox
 * @returns {boolean}
 */
cg.boxesCollide = function (firstBox, secondBox) {
    return (
        firstBox.x < secondBox.x + secondBox.width &&
        firstBox.x + firstBox.width > secondBox.x &&
        firstBox.y < secondBox.y + secondBox.height &&
        firstBox.height + firstBox.y > secondBox.y
    );
};