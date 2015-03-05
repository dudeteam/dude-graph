cg.GraphError = (function () {

    /**
     *
     * @param error
     * @returns {Error}
     * @constructor
     */
    function GraphError(error) {
        console.log.apply(console, arguments);
        return new Error(error);
    }

    return GraphError;

})();