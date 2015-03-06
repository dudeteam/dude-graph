/**
 * Convert the given input string to camelcase. Example: my-class-name -> MyClassName.
 * @param str {String} The string to convert.
 * @param sep {String?} The separator to use for the non-camelcase version of the string ("-" by default).
 * @returns {String}
 */
cg.camelcase = function (str, sep) {
    sep = sep || "-";
    return str[0].toUpperCase() + str.replace(new RegExp("(" + sep + "[a-z])", "g"), function (m) {
            return m.toUpperCase().replace(sep,'');
    }).substr(1);
};

/**
 * Convert the given input string to camelcase. Example: my-class-name -> MyClassName.
 * @param str {String} The string to convert.
 * @param sep {String?} The separator to use for the non-camelcase version of the string ("-" by default).
 * @returns {String}
 */
cg.uncamelcase = function (str, sep) {
    return str.replace(/([A-Z])/g, function (m) {
        return sep + m.toLowerCase();
    }).substr(1);
};

/**
 * Merge the source object into the destination.
 * @param destination {Object}
 * @param source {Object}
 */
cg.mergeObjects = function (destination, source) {
    for (var k in source) {
        if (source.hasOwnProperty(k)) {
            destination[k] = source[k];
        }
    }
};

/**
 * Return the function name.
 * @param fn {Function}
 * @returns {String}
 */
cg.functionName = function (fn) {
    return fn.name || fn.toString().match(/function ([^\(]+)/)[1];
};

/**
 * Simulation OOP like inheritance, `cls` will be inherited from `base.
 * @param cls {Function}
 * @param base {Function}
 */
cg.inherit = function (cls, base) {
    for (var property in base.prototype) {
        //noinspection JSUnfilteredForInLoop
        var safePropery = property;
        var getter = base.prototype.__lookupGetter__(safePropery);
        var setter = base.prototype.__lookupGetter__(safePropery);

        if (getter) {
            cls.prototype.__defineGetter__(safePropery, getter);
        } else if (setter) {
            cls.prototype.__defineSetter__(safePropery, getter);
        } else {
            cls.prototype[safePropery] = base.prototype[safePropery];
        }
    }
    cls.prototype.constructor = cls;
};

/**
 * Default function to prevent events.
 */
cg.preventCallback = function (x, y, e) {
    if (x.preventDefault !== undefined &&
        x.stopPropagation !== undefined &&
        x.stopImmediatePropagation !== undefined) {
        e = x;
    }
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