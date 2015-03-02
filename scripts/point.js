Raphael.fn.point = function (graph, action, x, y, pointType, valueType) {
    var self = this;
    var obj = this.circle(x, y, 3).attr({
        "fill": TYPES[valueType],
        "stroke": "none"
    });
    obj.action = action;
    obj.pointType = pointType;
    obj.valueType = valueType;
    obj.mousedown(function (e) {
        action.disabled = true;
        graph.targetPoint = obj;
        graph.newPoint = self.circle(e.x, e.y, 3).attr({
            "fill": TYPES[valueType],
            "stroke": "none"
        });
        graph.newPoint.pointType = obj.pointType === 'input' ? 'output' : 'input';
        graph.newConnection = self.connection(obj, graph.newPoint, pointType === 'input' ? -40 : 40);
        graph.newConnection.attr({stroke: TYPES[valueType], "stroke-width": 2, fill: "none"});
    });
    return obj;
};