/**
 * Create a action block.
 * @param graph {Graph} the parent graph.
 * @param x {Number} x coordinate to create the action on the area.
 * @param y {Number} y coordinate to create the action on the area.
 * @param name {String} The name of the function which will be called.
 * @param inputs {Array<Object>} The list of the input parameters of the action.
 * @param outputs {Array<Object>} The list of the values returned by the action.
 * @param onMove {Function} Called when the action object is moved.
 */
Raphael.fn.action = function (graph, x, y, name, inputs, outputs, onMove) {
    var self = this;
    var obj = this.set();
    obj.name = name;
    obj.connections = [];
    obj.select = function () {
        for (var name in graph.actions) {
            if (graph.actions.hasOwnProperty(name)) {
                graph.actions[name].box.attr("stroke-width", 1);
            }
        }
        graph.currentAction = obj;
        obj.box.attr("stroke-width", 3);
    };
    obj.destroy = function () {
        for (var i = 0; i < obj.connections.length; ++i) {
            index = graph.connections.indexOf(obj.connections[i]);
            if (index !== -1) {
                graph.connections.splice(index, 1);
                obj.connections[i].remove();
            }
        }
        obj.remove();
    };
    obj.disabled = false;
    obj.box = this.rect(x, y, 150, 40 + Math.max(inputs.length, outputs.length) * 20, 5);
    obj.box.attr({
        "fill": "rgba(0, 0, 0, .4)",
        "stroke": "#ccc",
        "cursor": "move"
    });
    obj.push(obj.box);
    obj.label = this.text(x + obj.getBBox().width / 2, y + 10, name);
    obj.label.attr({
        "fill": "#ccc"
    });
    obj.push(obj.label);
    var i;
    obj.inputs = {};
    for (i = 0; i < inputs.length; ++i) {
        var inputLabel = this.text(x + 15 , y + 40 + i * 20, inputs[i].name).attr({
            "text-anchor": "start",
            "fill": "#888"
        });
        var inputPoint = this.point(graph, obj, x + 7, y + 40 + i * 20, 'input');
        obj.push(inputLabel);
        obj.push(inputPoint);
        obj.inputs[inputs[i].name] = inputPoint;
    }
    obj.outputs = {};
    for (i = 0; i < outputs.length; ++i) {
        var outputLabel = this.text(x + obj.getBBox().width - 15 , y + 40 + i * 20, outputs[i].name).attr({
            "text-anchor": "end",
            "fill": "#888"
        });
        var outputPoint = this.point(graph, obj, x + obj.getBBox().width - 7, y + 40 + i * 20, 'output');
        obj.push(outputLabel);
        obj.push(outputPoint);
        obj.outputs[outputs[i].name] = outputPoint;
    }
    obj.mousedown(function () {
        obj.select();
    });
    obj.draggable(function () {
        return onMove.call(obj);
    }, function () {
        obj.box.attr("fill", "rgba(0, 0, 0, .8)");
    }, function () {
        obj.box.attr("fill", "rgba(0, 0, 0, .4)");
    });
    return obj;
};