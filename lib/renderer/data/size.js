/**
 * Returns the text bounding box
 * @param {String|SVGTextElement} text
 */
dudeGraph.Renderer.prototype.textBoundingBox = function (text) {
    if (text instanceof SVGTextElement) {
        text = text.textContent;
    }
    return [text.length * 5, 24];
};