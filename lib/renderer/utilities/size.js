/**
 * Returns the text bounding box, prediction can be done accurately while using a monospace font
 * Always use a monospace font for fast prediction of the text size, unless you'd like to deal with FOUT and getBBox...
 * @param {String|d3.selection} text
 */
dudeGraph.Renderer.prototype.textBoundingBox = function (text) {
    if (text instanceof d3.selection) {
        // Use this for perfect text bounding box
        var boundingBox = text.node().getBBox();
        return [boundingBox.width, boundingBox.height];
        // text = text.text();
    }
    return [text.length * 8, 17];
};