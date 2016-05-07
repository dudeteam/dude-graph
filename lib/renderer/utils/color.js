/**
 * Returns the Polymer style text color for the given background color
 * @param {String} color
 * @returns {String}
 */
dudeGraph.Renderer.prototype.contrastTextColor = function (color) {
    var hex = "#";
    var r, g, b;
    if (color.indexOf(hex) > -1) {
        r = parseInt(color.substr(1, 2), 16);
        g = parseInt(color.substr(3, 2), 16);
        b = parseInt(color.substr(5, 2), 16);
    } else {
        //noinspection JSValidateTypes
        color = color.match(/\d+/g);
        r = color[0];
        g = color[1];
        b = color[2];
    }
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq < 128) ? "white" : "black";
};