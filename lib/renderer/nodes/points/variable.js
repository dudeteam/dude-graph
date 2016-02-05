/**
 *
 * @param {dudeGraph.Renderer} renderer
 * @param {dudeGraph.RenderBlock} renderBlock
 * @param {dudeGraph.RenderPoint} point
 * @class
 * @extends {dudeGraph.RenderPoint}
 */
dudeGraph.RenderPointVariable = function (renderer, renderBlock, point) {
    dudeGraph.RenderPoint.call(this, renderer, renderBlock, point);
};

dudeGraph.RenderPointVariable.prototype = _.create(dudeGraph.RenderPoint.prototype, {
    "constructor": dudeGraph.RenderPointVariable
});

