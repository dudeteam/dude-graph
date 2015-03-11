cg.RendererError = (function () {

    /**
     * Handle Renderer related errors.
     * @param {...}
     * @constructor
     */
    return pandora.class_("RendererError", pandora.Exception, function () {
        pandora.Error.apply(this, arguments);
    });

})();