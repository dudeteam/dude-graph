cg.Graph = function () {
    this._actions = [];
};

cg.Graph.prototype.addAction = function (action) {
    this._actions.push(action);
};

cg.Graph.prototype.addConnection = function (firstPoint, secondPoint) {
    // TODO
};