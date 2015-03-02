/**
 * Create a point to attach a connection to an action.
 * @param graph {Graph} the current graph.
 * @param action {Action} the action on which the point will be attached.
 * @param x {Number} The x coordinate on the screen.
 * @param y {Number} The y coordinate on the screen.
 * @param pointType {String} "input" or "output".
 * @param data {Object} The name and type of the point.
 * @returns {Object} The point's instance.
 */
Raphael.fn.point = function (graph, action, x, y, pointType, data) {
    var self = this;
    var obj = this.circle(x, y, 3).attr({
        "fill": TYPES[data.type],
        "stroke": "none"
    });
    obj.action = action;
    obj.name = data.name;
    obj.pointType = pointType;
    obj.valueType = data.type;
    obj.mousedown(function (e) {
        action.disabled = true;
        graph.targetPoint = obj;
        graph.newPoint = self.circle(e.x, e.y, 3).attr({
            "fill": TYPES[data.type],
            "stroke": "none"
        });
        graph.newPoint.pointType = obj.pointType === 'input' ? 'output' : 'input';
        graph.newConnection = self.connection(obj, graph.newPoint, pointType === 'input' ? -40 : 40);
        graph.newConnection.attr({stroke: TYPES[data.type], "stroke-width": 2, fill: "none"});
    });
    return obj;
};