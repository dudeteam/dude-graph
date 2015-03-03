cg.Graph = (function () {

    function Graph() {
        this._actions = [];
    }

    Graph.prototype.addAction = function (action) {
        this._actions.push(action);
    };

    Graph.prototype.addConnection = function (firstPoint, secondPoint) {
        // TODO
    };

    return Graph;

})();