/**
 * Create a DOMElement within SVG.
 * @param dom The string which represent the html content to add.
 * @param x
 * @param y
 * @param width
 * @param height
 * @param element
 */
cg.createElement = function (dom, x, y, width, height, element) {
    var input = Snap.format(
        '<foreignObject x="{x}" y="{y}" width="{width}" height="{height}">' +
        dom +
        '</foreignObject>', {"x": x, "y": y, "width": width, "height": height}
    );
    var group = element.g();
    group.mousedown(function (e) {
        e.stopPropagation();
    });
    group.addClass("dom-element");
    group.append(Snap.parse(input));
    return group;
};