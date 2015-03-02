Raphael.fn.point = function (graph, action, x, y, type) {
    var self = this;
    var obj = this.circle(x, y, 3).attr({
        "fill": "#ccc",
        "stroke": "none"
    });
    obj.action = action;
    obj.pointType = type;
    obj.mousedown(function (e) {
        action.disabled = true;
        graph.targetPoint = obj;
        graph.newPoint = self.circle(e.x, e.y, 3).attr({
            "fill": "#ccc",
            "stroke": "none"
        });
        graph.newPoint.pointType = obj.pointType === 'input' ? 'output' : 'input';
        graph.newConnection = self.connection(obj, graph.newPoint, type === 'input' ? -40 : 40);
        graph.newConnection.attr({stroke: "#ccc", "stroke-width": 2, fill: "none"});
    });
    return obj;
};