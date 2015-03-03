cg.Graph = (function () {

    function Graph() {

        /**
         * TODO
         * @type {cg.Container<cg.Action>}
         * @private
         */
        this._actions = new cg.Container();

        /**
         * TODO
         * @type {cg.Container<cg.Connection>}
         * @private
         */
        this._connections = new cg.Container();
    }

    /**
     * TODO
     * @param {cg.Action} action
     */
    Graph.prototype.addAction = function (action) {
        this._actions.push(action);
    };

    /**
     * TODO
     * @param {cg.Point} firstPoint
     * @param {cg.Point} secondPoint
     */
    Graph.prototype.addConnection = function (firstPoint, secondPoint) {
        this._connections.push(new cg.Connection(firstPoint, secondPoint));
    };

    return Graph;

})();