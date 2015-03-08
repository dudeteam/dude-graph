cg.RendererError = (function () {

    /**
     *
     * @param error
     * @returns {Error}
     * @constructor
     */
    function RendererError(error) {
        console.log.apply(console, arguments);
        return new Error(error);
    }

    return RendererError;

})();