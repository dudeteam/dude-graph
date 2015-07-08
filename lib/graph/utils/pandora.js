/**
 * This file gathers some stub that could be moved to pandora
 */

/**
 *
 * @param object
 * @returns {{name: {String}, value: {Object}}}
 */
pandora.decomposeObject = function (object) {
    var objectName = null;
    var objectValue = null;
    pandora.forEach(object, function (_objectValue, _objectName) {
        objectName = _objectName;
        objectValue = _objectValue;
        return true;
    });
    return {
        "name": objectName,
        "value": objectValue
    };
};