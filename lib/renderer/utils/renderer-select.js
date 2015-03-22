/**
 * Update all collisions.
 * @private
 */
cg.Renderer.prototype._updateRendererCollisions = function () {
    var renderer = this;
    // Update entities positions.
    var entityPoints = [];
    this.getEntities().each(function (entity) {
        var bbox = this.getBBox();
        entityPoints.push({
            "point": new pandora.Vec2(entity.absolutePosition.x, entity.absolutePosition.y),
            "node": this
        });
        entityPoints.push({
            "point": new pandora.Vec2(entity.absolutePosition.x + bbox.width, entity.absolutePosition.y),
            "node": this
        });
        entityPoints.push({
            "point": new pandora.Vec2(entity.absolutePosition.x + bbox.width, entity.absolutePosition.y + bbox.height),
            "node": this
        });
        entityPoints.push({
            "point": new pandora.Vec2(entity.absolutePosition.x, entity.absolutePosition.y + + bbox.height),
            "node": this
        });
    });
    this._entitiesQuadTree = d3.geom.quadtree()
        .x(function (entityPoint) {
            return entityPoint.point.x;
        })
        .y(function (entityPoint) {
            return entityPoint.point.y;
        })
    (entityPoints);
    // Update points positions.
    var pointPoints = [];
    this.getPoints().each(function (point) {
        var position = renderer._getPointAbsolutePosition(point);
        pointPoints.push({
            "x": position.x,
            "y": position.y,
            "point": point
        });
    });
    this._pointsQuadTree = d3.geom.quadtree()
        .x(function (pointPoint) {
            return pointPoint.x;
        })
        .y(function (pointPoint) {
            return pointPoint.y;
        })
    (pointPoints);
};

/**
 * Return all entities contained in the box.
 * @param selectionBox {pandora.Box2}
 * @return {d3.selection}
 * @private
 */
cg.Renderer.prototype._getEntitiesInArea = function (selectionBox) {
    var potentials = [];
    (function (x0, y0, x3, y3) {
        this._entitiesQuadTree.visit(function (node, x1, y1, x2, y2) {
            var entityPoint = node.point;
            if (entityPoint) {
                if (selectionBox.collide(entityPoint.point)) {
                    potentials.push(entityPoint.node);
                }
            }
            return !(x1 < x3 && y1 < y3 && x2 > x0 && y2 > y0);
        });
    }.bind(this))(selectionBox.x, selectionBox.y, selectionBox.x + selectionBox.width, selectionBox.y + selectionBox.height);
    return d3.selectAll(potentials);
};

/**
 * Get the nearest point of the given box.
 * @param box {pandora.Box2}
 * @private
 */
cg.Renderer.prototype._getNearestPointInArea = function (box) {
    return this._pointsQuadTree.find(box.toArray()).point;
};