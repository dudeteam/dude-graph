/**
 * Create a link between the 2 given objects.
 * @param obj1
 * @param obj2
 * @param step Value of the curve anchor points.
 * @returns {Raphael.fn}
 */
Raphael.fn.connection = function (obj1, obj2, step) {
    step = step || 40;
    var generatePath = function (obj1, obj2) {
        var box1 = obj1.getBBox(),
            box2 = obj2.getBBox(),
            x1 = box1.x + box1.width / 2,
            y1 = box1.y + box1.height / 2,
            x4 = box2.x + box2.width / 2,
            y4 = box2.y + box2.height / 2;
        return ["M", x1, y1, "C", x1 + step, y1, x4 - step, y4, x4, y4].join(",");
    };
    var obj = this.path(generatePath(obj1, obj2));
    obj.update = function () {
        obj.attr({path: generatePath(obj1, obj2)});
    };
    obj.destroy = function () {
        obj.remove();
    };
    return obj;
};