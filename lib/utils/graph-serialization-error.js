cg.GraphSerializationError = (function () {

    /**
     * Handle graph serialization related errors.
     * @constructor
     */
    return pandora.class_("GraphSerializationError", function () {
        return pandora.Exception.apply(this, arguments);
    });

})();