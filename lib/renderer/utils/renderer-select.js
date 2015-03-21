/**
 * Update all collisions.
 * @private
 */
cg.Renderer.prototype._updateRendererCollisions = function () {
    var renderer = this;
    // Entities
    var entityPoints = [];
    this.getEntities()
        .each(function (entity, i) {
            entityPoints[i] = entity.absolutePosition.toArray();
            entityPoints[i].node = this;
            entityPoints[i].entity = entity;
        });
    this._entitiesQuadTree = d3.geom.quadtree()(entityPoints);
    // Points
    var pointPoints = [];
    this.getPoints()
        .each(function (point, i) {
            pointPoints[i] = renderer._getPointAbsolutePosition(point).toArray();
            pointPoints[i].point = point;
        });
    this._pointsQuadTree = d3.geom.quadtree()(pointPoints);
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
            var point = node.point;
            if (point) {
                var box = new pandora.Box2(point.node.getBBox());
                box.x += point.entity.absolutePosition.x;
                box.y += point.entity.absolutePosition.y;
                if (selectionBox.collide(box)) {
                    potentials.push(point.node);
                }
            }
            return !(x1 < x3 && y1 < y3 && x2 > x0 && y2 > y0);
        });
    }.bind(this))(selectionBox.x, selectionBox.y, selectionBox.x + selectionBox.width, selectionBox.y + selectionBox.height);
    return d3.selectAll(potentials);
};

/**
 *
 * @param box {pandora.Box2}
 * @private
 */
cg.Renderer.prototype._getNearestPointInArea = function (box) {
    // TODO: Check box width & height.
    return this._pointsQuadTree.find([box.x, box.y]).point;
};