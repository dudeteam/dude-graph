/**
 * Returns the text bounding box, prediction can be done accurately while using a monospace font
 * Always use a monospace font for fast prediction of the text size, unless you'd like to deal with FOUT and getBBox...
 * @param {String|SVGTextElement} text
 */
dudeGraph.Renderer.prototype.textBoundingBox = function (text) {
    if (text instanceof SVGTextElement) {
        text = text.textContent;
    }
    return [text.length * 8, 17];
};