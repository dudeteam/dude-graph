/**
 * Polymorphic render
 * @param entity {cg.Graph|cg.Container|cg.Entity|cg.Point|cg.Connection}
 * @private
 */
cg.Renderer.prototype._render = function(entity) {
    console.log(entity)
    return pandora.polymorphicMethod(this, "render", entity);
};