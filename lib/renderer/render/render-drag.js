/**
 * Enable edit on double click.
 * @private
 */
cg.Renderer.prototype._doubleClick = function () {
    var renderer = this;
    return function () {
        this.on("dblclick", function (entity) {
            renderer.emit("entity.edit", entity);
            pandora.preventCallback(d3.event);
        });
    };
};

/**
 * Enable drag and drop of blocks and groups.
 * @private
 */
cg.Renderer.prototype._renderDrag = function () {
    var renderer = this;
    return d3.behavior.drag()
        .on("dragstart", function () {
            var node = d3.select(this);
            renderer._addEntitiesToSelection(node, !d3.event.sourceEvent.shiftKey);
            var selected = renderer.getSelectedEntities();
            selected.each(function (entity) {
                if (entity.parent !== renderer._graph) {
                    renderer._graph.moveEntity(entity, renderer._graph);
                }
                entity.emit("reorder");
                if (entity instanceof cg.Group) {
                    entity.forEachChild(function (childEntity) {
                        if (childEntity instanceof cg.Group) {
                            childEntity.emit("reorder");
                        }
                    });
                }
            });
            pandora.preventCallback(d3.event.sourceEvent);
        })
        .on("drag", function () {
            var selected = renderer.getSelectedEntities();
            selected.each(function (entity) {
                entity.position.x += d3.event.dx;
                entity.position.y += d3.event.dy;
                entity.emit("move");
                if (entity instanceof cg.Group) {
                    entity.forEachChild(function (childEntity) {
                        childEntity.emit("move");
                    });
                }
            });
        })
        .on("dragend", function () {
            renderer._updateRendererCollisions();
            var selected = renderer.getSelectedEntities();
            selected.each(function (entity) {
                var dropBox = new pandora.Box2(entity.absolutePosition.x, entity.absolutePosition.y, renderer._getBBox(this).width, renderer._getBBox(this).height);
                var possible = renderer._getEntitiesInArea(dropBox);
                possible.each(function (possibleEntity) {
                    //noinspection JSPotentiallyInvalidUsageOfThis
                    var possibleDropBox = new pandora.Box2(possibleEntity.absolutePosition.x, possibleEntity.absolutePosition.y, renderer._getBBox(this).width, renderer._getBBox(this).height);
                    if (possibleEntity instanceof cg.Group && possibleEntity !== entity && possibleDropBox.contain(dropBox)) {
                        renderer._graph.moveEntity(entity, possibleEntity);
                    }
                });
            });
        });
};