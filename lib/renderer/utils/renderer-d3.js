/**
 * Utility to send a d3 selection to front.
 * @returns {d3.selection}
 */
d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};

/**
 * Return the bounding box of the selection.
 * @return {pandora.Box2}
 */
d3.selection.prototype.getBBox = function () {
    var box = new pandora.Box2();
    var bbox = {"left": 0, "right": 0, "top": 0, "bottom": 0};
    this.each(function () {
        box = this.getBoundingClientRect();
        if (!bbox) {
            bbox = box;
        }
        bbox.left = Math.min(bbox.left, box.left);
        bbox.top = Math.min(bbox.top, box.top);
    });
    return new pandora.Box2(bbox);
};