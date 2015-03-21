/**
 * Enable drag and drop of blocks and groups.
 * @private
 */
cg.Renderer.prototype._renderDrag = function () {
    var renderer = this;
    return d3.behavior.drag()
        .origin(function(entity) {
            return entity.absolutePosition;
        })
        .on("dragstart", function () {
            pandora.preventCallback(d3.event.sourceEvent);
            var entity = d3.select(this).datum();
            if (entity.parent != renderer._graph) {
                renderer._graph.moveEntity(entity, renderer._graph);
            }
        })
        .on("drag", function () {
            var entity = d3.select(this).datum();
            entity.position = renderer._getSvgPosition(d3.event.x, d3.event.y).clone();
            entity.emit("move");
            if (entity instanceof cg.Group) {
                entity.forEachChild(function (childEntity) {
                    childEntity.emit("move");
                });
            }
        })
        .on("dragend", function () {

        });
};