cg.GraphError = (function () {

    /**
     * @returns {Error}
     * @constructor
     */
    function GraphError() {
        return new Error(cg.formatString.apply(null, arguments));
    }

    return GraphError;

})();