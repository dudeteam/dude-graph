/**
 * Enable drag and drop of blocks and groups.
 * @private
 */
cg.Renderer.prototype._renderDrag = function () {
    return d3.behavior.drag()
        .on("dragstart", function () {
            var entity = d3.select(this).datum();
            entity.emit("reorder");
            if (entity instanceof cg.Group) {
                entity.forEachChild(function (childEntity) {
                    if (childEntity instanceof cg.Group) {
                        childEntity.emit("reorder");
                    }
                });
            }
            pandora.preventCallback(d3.event.sourceEvent);
        })
        .on("drag", function () {
            var entity = d3.select(this).datum();
            entity.position.x += d3.event.dx;
            entity.position.y += d3.event.dy;
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