/**
 * Return SVG offset origin.
 * @returns {pandora.Vec2}
 * @private
 */
cg.Renderer.prototype._getSVGOrigin = function () {
    var svgBoundingRect = this._svg.node().getBoundingClientRect();
    return new pandora.Vec2(svgBoundingRect.left, svgBoundingRect.top);
};

/**
 * Return an event point in zoomed SVG coordinates.
 * @param x {Number}
 * @param y {Number}
 * @param ignoreOrigin {Boolean?} Ignore the SVG offset
 * @returns {pandora.Vec2}
 * @private
 */
cg.Renderer.prototype._getZoomedSVGPosition = function (x, y, ignoreOrigin) {
    if (!ignoreOrigin) {
        var svgOrigin = this._getSVGOrigin();
        this._svgPoint.x = x - svgOrigin.x;
        this._svgPoint.y = y - svgOrigin.y;
    } else {
        this._svgPoint.x = x;
        this._svgPoint.y = y;
    }
    var position = this._svgPoint.matrixTransform(this._rootGroup.node().getCTM().inverse());
    return new pandora.Vec2(position);
};

/**
 * Get zoomed touch position (mouse for desktop or first touch for mobile.)
 * @param e {Event}
 * @private
 */
cg.Renderer.prototype._getZoomedTouchPosition = function (e) {
    if (e.clientX && e.clientY) {
        return this._getZoomedSVGPosition(e.clientX, e.clientY);
    } else if (e.touches[0]) {
        return this._getZoomedSVGPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
};

/**
 * Return the zoomed viewport.
 * @returns {pandora.Box2}
 * @private
 */
cg.Renderer.prototype._getSVGViewport = function () {
    var svgBoundingRect = this._svg.node().getBoundingClientRect();
    var topLeft = this._getZoomedSVGPosition(svgBoundingRect.left, svgBoundingRect.top, true);
    var bottomRight = this._getZoomedSVGPosition(svgBoundingRect.right, svgBoundingRect.bottom, true);
    return new pandora.Box2(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
};

/**
 * Return the bounding box of the element
 * @param element {d3.selection|element}
 * @returns {{x: Number, y: Number, width: Number, height: Number}}
 * @private
 */
// TODO: Workaround for Polymer Webcomponents getBBox bug on IE11.
cg.Renderer.prototype._getBBox = function (element) {
    var unwrap_wrapper = unwrap || function (el) {
            return el;
        };
    return pandora.polymorphic(element, {
        "Array": function () {
            return unwrap_wrapper(element.node()).getBBox();
        },
        "Object": function () {
            return unwrap_wrapper(element).getBBox();
        }
    });
};

/**
 * Return the bbox of the d3 selection in zoomed SVG coordinates.
 * @param d3selection {d3.selection}
 * @returns {pandora.Box2|null}
 * @private
 */
//TODO: Fix this method, it's broken.
cg.Renderer.prototype._getSelectionZoomedSVGBox = function (d3selection) {
    var renderer = this;
    var boundingConverter = new pandora.Box2();
    var bbox = null;
    d3selection.each(function () {
        var elementBBox = boundingConverter.assign(this.getBoundingClientRect());
        var zoomedPosition = renderer._getZoomedSVGPosition(elementBBox.x, elementBBox.y);
        var zoomedSize = renderer._getZoomedSVGPosition(elementBBox.x + elementBBox.width, elementBBox.y + elementBBox.height);
        var box = {"left": zoomedPosition.x, "top": zoomedPosition.y, "right": zoomedSize.x, "bottom": zoomedSize.y};
        if (!bbox) {
            bbox = pandora.mergeObjects({}, box);
        } else {
            bbox.left = Math.min(bbox.left, box.left);
            bbox.top = Math.min(bbox.top, box.top);
            bbox.right = Math.max(bbox.right, box.right);
            bbox.bottom = Math.max(bbox.bottom, box.bottom);
        }
    });
    if (bbox) {
        return boundingConverter.assign(bbox);
    }
    return null;
};