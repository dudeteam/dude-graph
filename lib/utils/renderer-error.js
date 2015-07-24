cg.RendererError = (function () {

    /**
     * Handle graph related errors.
     * @constructor
     */
    return pandora.class_("RendererError", function () {
        return pandora.Exception.apply(this, arguments);
    });

})();