/**
 * Create a link between the 2 given objects.
 * @param obj1
 * @param obj2
 * @returns {Raphael.fn}
 */
Raphael.fn.connection = function (obj1, obj2) {
    var generatePath = function (box1, box2) {
        var x1 = box1.x + box1.width / 2,
            y1 = box1.y + box1.height / 2,
            x4 = box2.x + box2.width / 2,
            y4 = box2.y + box2.height / 2;
        return ["M", x1, y1, "C", x1 + 40, y1, x4 - 40, y4, x4, y4].join(",");
    };
    var obj = this.path(generatePath(obj1.getBBox(), obj2.getBBox()));
    obj.update = function () {
        obj.attr({path: generatePath(obj1.getBBox(), obj2.getBBox())});
    };
    return obj;
};