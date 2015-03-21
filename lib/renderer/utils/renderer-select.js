/**
 * Update all collisions.
 * @private
 */
cg.Renderer.prototype._updateRendererCollisions = function() {
    var entityPoints = [];
    var quadTreePoints = this.getEntities();
    quadTreePoints.each(function (entity, i) {
        entityPoints[i] = entity.absolutePosition.toArray();
        entityPoints[i].node = this;
        entityPoints[i].entity = entity;
    });
    this._entitiesQuadTree = d3.geom.quadtree()(entityPoints);
};

/**
 * Return all entities contained in the box.
 * @param selectionBox {pandora.Box2}
 * @return {d3.selection}
 * @private
 */
cg.Renderer.prototype._getEntitiesByBox = function (selectionBox) {
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