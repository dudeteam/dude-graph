/**
 * Update all collisions.
 * @private
 */
cg.Renderer.prototype._updateRendererCollisions = function() {
    var renderer = this;
    // Update entities positions.
    var entityPoints = [];
    this.getEntities().each(function(entity) {
        var bbox = renderer._getBBox(this);
        entityPoints.push({
            "box": new pandora.Box2(entity.absolutePosition.x, entity.absolutePosition.y, bbox.width, bbox.height),
            "node": this
        });
    });
    this._entitiesQuadTree = d3.geom.quadtree()
        .x(function(entityPoint) {
            return entityPoint.box.x;
        })
        .y(function(entityPoint) {
            return entityPoint.box.y;
        })
    (entityPoints);
    // Update points positions.
    var pointPoints = [];
    this.getPoints().each(function(point) {
        var position = renderer._getPointAbsolutePosition(point);
        pointPoints.push({
            "x": position.x,
            "y": position.y,
            "point": point
        });
    });
    this._pointsQuadTree = d3.geom.quadtree()
        .x(function(pointPoint) {
            return pointPoint.x;
        })
        .y(function(pointPoint) {
            return pointPoint.y;
        })
    (pointPoints);
};

/**
 * Return all entities contained in the box.
 * @param selectionBox {pandora.Box2}
 * @returns {d3.selection}
 * @private
 */
cg.Renderer.prototype._getEntitiesInArea = function(selectionBox) {
    var potentials = [];
    this._entitiesQuadTree.visit(function(node, x1, y1, x2, y2) {
        var entityPoint = node.point;
        if (entityPoint) {
            if (selectionBox.collide(entityPoint.box)) {
                potentials.push(entityPoint.node);
            }
        }
        return false; // TODO: Optimize this.
    });
    return d3.selectAll(potentials);
};

/**
 * Get the nearest point of the given box.
 * @param box {pandora.Box2}
 * @private
 */
cg.Renderer.prototype._getNearestPointInArea = function(box) {
    var point = this._pointsQuadTree.find([box.x + box.width / 2, box.y + box.height / 2]).point;
    return box.collide(this._getPointAbsolutePosition(point)) ? point : null;
};