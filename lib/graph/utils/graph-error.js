cg.GraphError = (function () {

    /**
     * Handle graph related errors.
     * @constructor
     */
    return pandora.class_("GraphError", function () {
        return pandora.Exception.apply(this, arguments);
    });

})();