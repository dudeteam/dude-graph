/**
 * Update all collisions.
 * @private
 */
cg.Renderer.prototype._updateRendererCollisions = function () {
    this._entitiesQuadTree = d3.geom.quadtree()
        .x(function (entity) {
           return entity.absolutePosition.x;
        })
        .y(function (entity) {
            return entity.absolutePosition.y;
        })
    (this.getEntities().data());
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
            var entity = node.point;
            if (entity) {
                if (selectionBox.collide(entity.absolutePosition)) {
                    potentials.push(entity);
                }
            }
            return !(x1 < x3 && y1 < y3 && x2 > x0 && y2 > y0);
        });
    }.bind(this))(selectionBox.x, selectionBox.y, selectionBox.x + selectionBox.width, selectionBox.y + selectionBox.height);
    return this.getEntities().filter(function (entity) {
        return potentials.indexOf(entity) !== -1;
    });
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